import { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { registerAuthRoutes } from "./authRoutes";
import { insertJobSchema, insertApplicationSchema, updateApplicationSchema } from "@shared/schema";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";

// DevLogin audit logging
interface DevLoginAudit {
  timestamp: Date;
  userId: string;
  role: string;
  ipAddress: string;
  userAgent: string;
}

const devLoginAudits: DevLoginAudit[] = [];

export async function registerRoutes(app: Express): Promise<Server> {
  const { createServer } = await import("http");
  
  // Configuration des sessions (nécessaire pour l'authentification)
  const { getSession } = await import("./replitAuth");
  app.use(getSession());
  
  // Enregistrer les routes d'authentification email/password
  registerAuthRoutes(app);

  // Middleware d'authentification simplifié
  const requireAuth = (req: any, res: any, next: any) => {
    const sessionUser = (req.session as any)?.user;
    if (!sessionUser) {
      return res.status(401).json({ message: "Non connecté" });
    }
    req.user = sessionUser;
    next();
  };

  // Enhanced RBAC Middleware
  const requireAdminRole = async (req: any, res: any, next: any) => {
    const user = req.user;
    if (!user?.role || !["admin", "hr", "recruiter", "manager"].includes(user.role)) {
      return res.status(403).json({ message: "Accès refusé. Permissions administrateur requises." });
    }
    next();
  };

  // Permission-based middleware factory
  const requirePermissions = (permissions: string[]) => {
    return async (req: any, res: any, next: any) => {
      const user = req.user;
      if (!user?.role) {
        return res.status(401).json({ message: "Authentification requise" });
      }

      const AuthService = (await import("./auth")).AuthService;
      const userPermissions = AuthService.getRolePermissions(user.role);
      
      // Check if user has all required permissions or has wildcard access
      const hasPermission = userPermissions.includes("*") || 
                           permissions.every(perm => userPermissions.includes(perm));
      
      if (!hasPermission) {
        return res.status(403).json({ 
          message: `Accès refusé. Permissions requises: ${permissions.join(", ")}` 
        });
      }
      next();
    };
  };

  // === DEVLOGIN SÉCURISÉ ===
  
  // Configuration DevLogin
  const isDevLoginEnabled = () => {
    return process.env.NODE_ENV === "development" && 
           process.env.DEV_LOGIN_ENABLED !== "false";
  };

  // Route DevLogin avec audit et sécurité
  app.post("/api/auth/dev-login", async (req, res) => {
    if (!isDevLoginEnabled()) {
      return res.status(403).json({ 
        message: "DevLogin désactivé en production",
        code: "DEV_LOGIN_DISABLED"
      });
    }

    try {
      const { role = "candidate" } = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress || "unknown";
      const userAgent = req.get("User-Agent") || "unknown";
      
      // Créer un utilisateur de test
      const testUser = {
        id: `test-${role}-${Date.now()}`,
        email: `${role}@test.com`,
        firstName: "Test",
        lastName: role.charAt(0).toUpperCase() + role.slice(1),
        role,
        profileCompleted: role !== "candidate"
      };

      // Audit logging
      const auditEntry: DevLoginAudit = {
        timestamp: new Date(),
        userId: testUser.id,
        role: testUser.role,
        ipAddress,
        userAgent
      };
      devLoginAudits.push(auditEntry);
      
      // Log pour monitoring
      console.log(`🔧 DEV LOGIN AUDIT: ${JSON.stringify(auditEntry)}`);

      // Créer une session
      if (!req.session) {
        console.error("Session not available");
        return res.status(500).json({ message: "Configuration de session manquante" });
      }
      (req.session as any).user = testUser;
      
      // Redirection selon le rôle
      const AuthService = (await import("./auth")).AuthService;
      const redirectPath = AuthService.getRedirectPath(testUser.role);
      
      res.json({ 
        user: testUser,
        redirectPath,
        message: `Connexion de test réussie (${role})`,
        devMode: true,
        auditId: auditEntry.timestamp.toISOString()
      });
    } catch (error) {
      console.error("Dev login error:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Route pour consulter l'audit DevLogin (admin seulement)
  app.get("/api/admin/dev-login-audit", requireAuth, async (req, res) => {
    const user = req.user;
    if (user?.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé - Admin seulement" });
    }

    res.json({
      enabled: isDevLoginEnabled(),
      audits: devLoginAudits.slice(-50), // Dernières 50 entrées
      totalUsage: devLoginAudits.length
    });
  });

  // === ROUTES PUBLIQUES - JOBS AVEC FILTRES AVANCÉS ===
  
  app.get("/api/jobs", async (req, res) => {
    try {
      const { 
        search, 
        location, 
        contractType, 
        experienceLevel, 
        page = "1", 
        limit = "10",
        sortBy = "newest"
      } = req.query;

      // Pagination
      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
      const offset = (pageNum - 1) * limitNum;

      // Construire les filtres
      const filters: any = {};
      if (contractType) {
        filters.contractType = (contractType as string).split(',');
      }
      if (experienceLevel) {
        filters.experienceLevel = (experienceLevel as string).split(',');
      }
      if (location) {
        filters.location = location as string;
      }

      // Recherche avec filtres
      let jobs = await storage.searchJobs(search as string || '', filters);

      // Tri
      switch (sortBy) {
        case "salary_asc":
          jobs = jobs.sort((a, b) => (a.salary || "").localeCompare(b.salary || ""));
          break;
        case "salary_desc":
          jobs = jobs.sort((a, b) => (b.salary || "").localeCompare(a.salary || ""));
          break;
        case "relevance":
          // Tri par pertinence (score basé sur la recherche)
          if (search) {
            jobs = jobs.sort((a, b) => {
              const aScore = (a.title.toLowerCase().includes((search as string).toLowerCase()) ? 2 : 0) +
                           (a.description.toLowerCase().includes((search as string).toLowerCase()) ? 1 : 0);
              const bScore = (b.title.toLowerCase().includes((search as string).toLowerCase()) ? 2 : 0) +
                           (b.description.toLowerCase().includes((search as string).toLowerCase()) ? 1 : 0);
              return bScore - aScore;
            });
          }
          break;
        case "newest":
        default:
          jobs = jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }

      // Pagination
      const total = jobs.length;
      const paginatedJobs = jobs.slice(offset, offset + limitNum);

      res.json({
        jobs: paginatedJobs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        },
        filters: {
          search: search || null,
          location: location || null,
          contractType: contractType || null,
          experienceLevel: experienceLevel || null,
          sortBy
        }
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des offres d'emploi" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "ID d'emploi invalide" });
      }

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Offre d'emploi non trouvée" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Erreur lors de la récupération de l'offre" });
    }
  });

  // === ROUTES AUTHENTIFIÉES - APPLICATIONS AVEC UPLOAD ===
  
  app.get("/api/applications", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      
      const applications = await storage.getApplicationsByUser(userId);
      
      // Enrichir avec les détails du job
      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          const job = await storage.getJob(app.jobId);
          return { ...app, job };
        })
      );
      
      res.json(enrichedApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des candidatures" });
    }
  });

  app.post("/api/applications", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      
      // Validation des données avec le schéma Zod
      const validatedData = insertApplicationSchema.parse(req.body);
      
      // Convert availability string to Date if provided
      if (validatedData.availability && typeof validatedData.availability === 'string') {
        validatedData.availability = new Date(validatedData.availability);
      }
      
      // Vérifier que le job existe
      const job = await storage.getJob(validatedData.jobId);
      if (!job) {
        return res.status(404).json({ message: "Offre d'emploi non trouvée" });
      }

      // Vérifier qu'il n'y a pas déjà une candidature pour ce job
      const existingApplications = await storage.getApplicationsByUser(userId);
      const alreadyApplied = existingApplications.some(app => app.jobId === validatedData.jobId);
      
      if (alreadyApplied) {
        return res.status(409).json({ message: "Vous avez déjà postulé pour cette offre" });
      }
      
      // Création de la candidature via le storage
      const application = await storage.createApplication(validatedData, userId);
      
      res.status(201).json({
        ...application,
        message: "Candidature créée avec succès"
      });
    } catch (error: any) {
      console.error("Error creating application:", error);
      
      if (error?.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Erreur lors de la création de la candidature" });
    }
  });

  // === GESTION DES FICHIERS ET UPLOADS ===
  
  // Upload endpoint pour les documents
  app.get("/api/objects/upload", requireAuth, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ message: "Erreur lors de la génération de l'URL d'upload" });
    }
  });

  // Endpoint pour finaliser l'upload et définir les ACL
  app.put("/api/documents", requireAuth, async (req: any, res) => {
    if (!req.body.documentURL) {
      return res.status(400).json({ message: "documentURL est requis" });
    }

    const userId = req.user?.id;

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.documentURL,
        {
          owner: userId,
          visibility: "private", // Documents privés à l'utilisateur
        },
      );

      res.status(200).json({
        objectPath: objectPath,
        message: "Document uploadé avec succès"
      });
    } catch (error) {
      console.error("Error setting document ACL:", error);
      res.status(500).json({ message: "Erreur lors de la finalisation de l'upload" });
    }
  });

  // Téléchargement sécurisé des documents
  app.get("/objects/:objectPath(*)", requireAuth, async (req: any, res) => {
    const userId = req.user?.id;
    const objectStorageService = new ObjectStorageService();
    
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      
      if (!canAccess) {
        return res.status(403).json({ message: "Accès refusé au document" });
      }
      
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ message: "Document non trouvé" });
      }
      return res.status(500).json({ message: "Erreur lors de l'accès au document" });
    }
  });

  // === ROUTES ADMIN AVEC RBAC RENFORCÉ ===
  
  app.get("/api/admin/jobs", requireAuth, requirePermissions(["manage_jobs", "view_applications"]), async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      
      // Enrichir avec le nombre de candidatures
      const enrichedJobs = await Promise.all(
        jobs.map(async (job) => {
          const applications = await storage.getApplicationsForJob(job.id);
          return { 
            ...job, 
            applicationsCount: applications.length,
            pendingCount: applications.filter(app => app.status === 'pending').length,
            reviewedCount: applications.filter(app => app.status === 'reviewed').length
          };
        })
      );
      
      res.json(enrichedJobs);
    } catch (error) {
      console.error("Error fetching admin jobs:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des offres" });
    }
  });

  app.post("/api/admin/jobs", requireAuth, requirePermissions(["manage_jobs"]), async (req, res) => {
    try {
      // Validation des données avec le schéma Zod
      const validatedData = insertJobSchema.parse(req.body);
      
      // Création de l'emploi via le storage
      const newJob = await storage.createJob(validatedData);
      
      res.status(201).json({
        ...newJob,
        message: "Offre d'emploi créée avec succès"
      });
    } catch (error: any) {
      console.error("Error creating job:", error);
      
      if (error?.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Erreur lors de la création de l'offre" });
    }
  });

  app.patch("/api/admin/jobs/:id", requireAuth, requirePermissions(["manage_jobs"]), async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "ID d'emploi invalide" });
      }

      // Validation partielle des données avec le schéma Zod
      const validatedData = insertJobSchema.partial().parse(req.body);
      
      // Mise à jour de l'emploi via le storage
      const updatedJob = await storage.updateJob(jobId, validatedData);
      
      if (!updatedJob) {
        return res.status(404).json({ message: "Emploi non trouvé" });
      }
      
      res.json({
        ...updatedJob,
        message: "Offre mise à jour avec succès"
      });
    } catch (error: any) {
      console.error("Error updating job:", error);
      
      if (error?.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
  });

  app.delete("/api/admin/jobs/:id", requireAuth, requirePermissions(["manage_jobs"]), async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "ID d'emploi invalide" });
      }

      const deleted = await storage.deleteJob(jobId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Emploi non trouvé" });
      }
      
      res.json({ message: "Offre supprimée avec succès" });
    } catch (error: any) {
      console.error("Error deleting job:", error);
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  });

  // === GESTION DES CANDIDATURES ADMIN ===
  
  app.get("/api/admin/applications", requireAuth, requirePermissions(["view_all_applications", "view_applications"]), async (req, res) => {
    try {
      const { status, jobId, search, page = "1", limit = "20" } = req.query;
      
      let applications = await storage.getAllApplications();
      
      // Filtres
      if (status && status !== "all") {
        applications = applications.filter(app => app.status === status);
      }
      
      if (jobId) {
        applications = applications.filter(app => app.jobId === parseInt(jobId as string));
      }
      
      if (search) {
        const searchLower = (search as string).toLowerCase();
        applications = applications.filter(app => 
          app.coverLetter?.toLowerCase().includes(searchLower) ||
          app.salaryExpectation?.toLowerCase().includes(searchLower)
        );
      }

      // Enrichir avec les détails candidat et job
      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          const candidate = await storage.getUser(app.userId);
          const job = await storage.getJob(app.jobId);
          return { 
            ...app, 
            candidate: candidate ? {
              id: candidate.id,
              firstName: candidate.firstName,
              lastName: candidate.lastName,
              email: candidate.email,
              phone: candidate.phone
            } : null,
            job: job ? {
              id: job.id,
              title: job.title,
              company: job.company,
              location: job.location
            } : null
          };
        })
      );

      // Pagination
      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
      const offset = (pageNum - 1) * limitNum;
      const total = enrichedApplications.length;
      const paginatedApplications = enrichedApplications.slice(offset, offset + limitNum);

      res.json({
        applications: paginatedApplications,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error("Error fetching admin applications:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des candidatures" });
    }
  });

  app.patch("/api/admin/applications/:id", requireAuth, requirePermissions(["view_applications", "score_candidates"]), async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      if (isNaN(applicationId)) {
        return res.status(400).json({ message: "ID de candidature invalide" });
      }

      // Validation partielle des données avec le schéma Zod
      const validatedData = updateApplicationSchema.parse(req.body);
      
      // Mise à jour de la candidature via le storage
      const updatedApplication = await storage.updateApplication(applicationId, validatedData);
      
      if (!updatedApplication) {
        return res.status(404).json({ message: "Candidature non trouvée" });
      }
      
      res.json({
        ...updatedApplication,
        message: "Candidature mise à jour avec succès"
      });
    } catch (error: any) {
      console.error("Error updating application:", error);
      
      if (error?.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
  });

  app.delete("/api/admin/applications/:id", requireAuth, requirePermissions(["manage_applications"]), async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      if (isNaN(applicationId)) {
        return res.status(400).json({ message: "ID de candidature invalide" });
      }

      const deleted = await storage.deleteApplication(applicationId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Candidature non trouvée" });
      }
      
      res.json({ message: "Candidature supprimée avec succès" });
    } catch (error: any) {
      console.error("Error deleting application:", error);
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  });

  // Export CSV des candidatures
  app.get("/api/admin/applications/export", requireAuth, requirePermissions(["view_all_applications"]), async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      
      // Enrichir avec les détails
      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          const candidate = await storage.getUser(app.userId);
          const job = await storage.getJob(app.jobId);
          return { app, candidate, job };
        })
      );

      // Générer CSV
      const csvHeaders = "ID,Candidat,Email,Poste,Entreprise,Statut,Score Auto,Score Manuel,Date Candidature\n";
      const csvRows = enrichedApplications.map(({ app, candidate, job }) => 
        `${app.id},"${candidate?.firstName} ${candidate?.lastName}","${candidate?.email}","${job?.title}","${job?.company}","${app.status}",${app.autoScore || 0},${app.manualScore || ''},${app.createdAt.toISOString().split('T')[0]}`
      ).join('\n');

      const csv = csvHeaders + csvRows;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="candidatures_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } catch (error) {
      console.error("Error exporting applications:", error);
      res.status(500).json({ message: "Erreur lors de l'export" });
    }
  });

  // === SYSTÈME DE RECRUTEMENT AVANCÉ ===
  
  app.get("/api/admin/recruiters", requireAuth, requireAdminRole, async (req, res) => {
    try {
      const recruiters = await storage.getRecruiters();
      res.json(recruiters);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des recruteurs" });
    }
  });

  // Top candidats avec scoring automatique
  app.get("/api/admin/top-candidates/:jobId", requireAuth, requireAdminRole, async (req, res) => {
    try {
      const { recruitmentService } = await import("./recruitmentService");
      const jobId = parseInt(req.params.jobId);
      
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "ID de job invalide" });
      }
      
      const topCandidates = await recruitmentService.getTopCandidates(jobId);
      res.json(topCandidates);
    } catch (error) {
      console.error("Error fetching top candidates:", error);
      res.status(500).json({ message: "Erreur lors du calcul des meilleurs candidats" });
    }
  });

  // Attribution de candidats à un recruteur
  app.post("/api/admin/assign-candidates", requireAuth, requireAdminRole, async (req, res) => {
    try {
      const { recruitmentService } = await import("./recruitmentService");
      const { applicationIds, recruiterId } = req.body;
      
      if (!applicationIds || !Array.isArray(applicationIds) || !recruiterId) {
        return res.status(400).json({ 
          message: "applicationIds (array) et recruiterId sont requis" 
        });
      }
      
      await recruitmentService.assignCandidatesToRecruiter(applicationIds, recruiterId);
      res.json({ 
        message: "Candidats assignés avec succès",
        assignedCount: applicationIds.length 
      });
    } catch (error) {
      console.error("Error assigning candidates:", error);
      res.status(500).json({ message: "Erreur lors de l'attribution des candidats" });
    }
  });

  // Candidats assignés à un recruteur
  app.get("/api/recruiter/assigned-candidates", requireAuth, async (req: any, res) => {
    try {
      const { recruitmentService } = await import("./recruitmentService");
      const userId = req.user.id;
      const assignedCandidates = await recruitmentService.getAssignedApplications(userId);
      res.json(assignedCandidates);
    } catch (error) {
      console.error("Error fetching assigned candidates:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des candidats assignés" });
    }
  });

  // Mise à jour du score manuel
  app.put("/api/recruiter/score/:applicationId", requireAuth, async (req: any, res) => {
    try {
      const { recruitmentService } = await import("./recruitmentService");
      const applicationId = parseInt(req.params.applicationId);
      const { score, notes } = req.body;
      
      if (isNaN(applicationId)) {
        return res.status(400).json({ message: "ID de candidature invalide" });
      }
      
      if (score === undefined || score < 0 || score > 100) {
        return res.status(400).json({ message: "Score requis (0-100)" });
      }
      
      await recruitmentService.updateManualScore(applicationId, score, notes);
      res.json({ 
        message: "Score mis à jour avec succès",
        score,
        applicationId 
      });
    } catch (error) {
      console.error("Error updating manual score:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du score" });
    }
  });

  // Top 3 final après notation
  app.get("/api/admin/final-top3/:jobId", requireAuth, requireAdminRole, async (req, res) => {
    try {
      const { recruitmentService } = await import("./recruitmentService");
      const jobId = parseInt(req.params.jobId);
      
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "ID de job invalide" });
      }
      
      const finalTop3 = await recruitmentService.getFinalTop3(jobId);
      res.json(finalTop3);
    } catch (error) {
      console.error("Error fetching final top 3:", error);
      res.status(500).json({ message: "Erreur lors de la récupération du top 3" });
    }
  });

  // === GESTION DES UTILISATEURS ===
  
  app.get("/api/users", requireAuth, async (req, res) => {
    try {
      const currentUser = req.user as any;
      
      // Vérifier les permissions pour voir tous les utilisateurs
      if (!["admin", "hr"].includes(currentUser.role)) {
        return res.status(403).json({ message: "Accès refusé. Permissions insuffisantes." });
      }

      const { role } = req.query;
      const users = role ? await storage.getUsersByRole(role as string) : await storage.getAllUsers();
      
      // Enrichir avec les permissions pour chaque utilisateur
      const AuthService = (await import('./auth')).AuthService;
      const usersWithPermissions = users.map((user: any) => ({
        ...user,
        permissions: AuthService.getRolePermissions(user.role),
        moduleAccess: AuthService.getModuleAccess(user.role),
        // Masquer le mot de passe
        password: undefined
      }));
      
      res.json(usersWithPermissions);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
  });

  // === GESTION DE LA PAIE ===
  
  app.get("/api/payroll", requireAuth, requirePermissions(["manage_payroll"]), async (req, res) => {
    try {
      const payrolls = await storage.getAllPayrolls();
      
      // Enrichir avec les détails employé
      const enrichedPayrolls = await Promise.all(
        payrolls.map(async (payroll) => {
          const employee = await storage.getEmployee(payroll.employeeId);
          let employeeDetails = null;
          
          if (employee) {
            const user = await storage.getUser(employee.userId);
            employeeDetails = {
              id: employee.id,
              firstName: user?.firstName,
              lastName: user?.lastName,
              email: user?.email,
              position: employee.position,
              department: employee.department
            };
          }
          
          return { ...payroll, employee: employeeDetails };
        })
      );
      
      res.json(enrichedPayrolls);
    } catch (error) {
      console.error("Error fetching payrolls:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des fiches de paie" });
    }
  });

  app.post("/api/payroll", requireAuth, requirePermissions(["manage_payroll"]), async (req, res) => {
    try {
      const user = req.user as any;
      
      const payrollData = {
        ...req.body,
        createdBy: user.id
      };
      
      const newPayroll = await storage.createPayroll(payrollData);
      res.status(201).json({
        ...newPayroll,
        message: "Fiche de paie créée avec succès"
      });
    } catch (error) {
      console.error("Error creating payroll:", error);
      res.status(500).json({ message: "Erreur lors de la création de la fiche de paie" });
    }
  });

  // === ROUTES D'ONBOARDING ===
  
  app.get("/api/onboarding/processes", requireAuth, async (req, res) => {
    try {
      const currentUser = req.user as any;
      if (!["admin", "hr"].includes(currentUser.role)) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      
      const processes = await storage.getAllOnboardingProcesses();
      res.json(processes);
    } catch (error) {
      console.error("Error fetching onboarding processes:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des processus" });
    }
  });

  app.get("/api/onboarding/candidates/user/:userId", requireAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUser = req.user as any;
      
      // L'utilisateur peut voir son propre onboarding ou admin/hr peuvent voir tous
      if (userId !== currentUser.id && 
          !["admin", "hr"].includes(currentUser.role)) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      
      const onboardings = await storage.getCandidateOnboardingByUser(userId);
      res.json(onboardings);
    } catch (error) {
      console.error("Error fetching candidate onboarding:", error);
      res.status(500).json({ message: "Erreur lors de la récupération de l'onboarding" });
    }
  });

  // === ROUTES DE FEEDBACK ET ACHIEVEMENTS ===
  
  app.get("/api/onboarding/achievements", requireAuth, async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des achievements" });
    }
  });

  app.get("/api/onboarding/user-achievements", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des achievements utilisateur" });
    }
  });

  // === INVITATIONS CANDIDATS ===
  
  app.get("/api/candidate-invitations", requireAuth, requireAdminRole, async (req, res) => {
    try {
      const invitations = await storage.getCandidateInvitations();
      res.json(invitations);
    } catch (error) {
      console.error("Error fetching candidate invitations:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des invitations" });
    }
  });

  app.post("/api/candidate-invitations", requireAuth, requireAdminRole, async (req: any, res) => {
    try {
      const { randomUUID } = await import("crypto");
      
      const invitationData = {
        ...req.body,
        sentBy: req.user.id,
        invitationToken: randomUUID(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
        status: "sent"
      };
      
      const invitation = await storage.createCandidateInvitation(invitationData);
      
      res.status(201).json({
        ...invitation,
        message: "Invitation créée avec succès"
      });
    } catch (error) {
      console.error("Error creating candidate invitation:", error);
      res.status(500).json({ message: "Erreur lors de la création de l'invitation" });
    }
  });

  // Route publique pour valider l'invitation candidat
  app.get("/api/candidate-invitation/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const invitation = await storage.getCandidateInvitationByToken(token);
      
      if (!invitation) {
        return res.status(404).json({ message: "Invitation non trouvée" });
      }
      
      if (new Date() > new Date(invitation.expiresAt)) {
        return res.status(410).json({ message: "Invitation expirée" });
      }
      
      // Marquer l'invitation comme ouverte
      await storage.updateCandidateInvitation(invitation.id, {
        status: "opened"
      });
      
      res.json(invitation);
    } catch (error) {
      console.error("Error validating invitation:", error);
      res.status(500).json({ message: "Erreur lors de la validation de l'invitation" });
    }
  });

  // === ANALYTICS ET KPIS ===
  
  app.get("/api/admin/kpis", requireAuth, requireAdminRole, async (req, res) => {
    try {
      const kpis = await storage.getKPIs();
      res.json(kpis);
    } catch (error) {
      console.error("Error fetching KPIs:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des KPIs" });
    }
  });

  app.get("/api/admin/analytics/applications", requireAuth, requireAdminRole, async (req, res) => {
    try {
      const analytics = await storage.getApplicationAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching application analytics:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des analytics" });
    }
  });

  // === GESTION DES ERREURS GLOBALES ===
  
  // Middleware de gestion d'erreurs 404
  app.use("*", (req, res) => {
    if (req.path.startsWith("/api/")) {
      res.status(404).json({ 
        message: "Endpoint non trouvé",
        path: req.path,
        method: req.method
      });
    } else {
      // Pour les routes non-API, laisser Vite gérer
      res.status(404).json({ message: "Page non trouvée" });
    }
  });

  // Initialiser les achievements par défaut
  try {
    await storage.initializeDefaultAchievements();
    console.log("✅ Default achievements initialized");
  } catch (error) {
    console.log("⚠️ Achievements initialization:", error);
  }

  // Créer et retourner le serveur HTTP
  const server = createServer(app);
  return server;
}