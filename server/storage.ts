import { eq, and, desc, asc, like, gte, lte, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import * as schema from "@shared/schema";
import type { 
  User, 
  UpsertUser, 
  Job, 
  InsertJob, 
  Application, 
  InsertApplication,
  UpdateApplication,
  Employee,
  InsertEmployee,
  Contract,
  InsertContract,
  Payroll,
  InsertPayroll,
  LeaveRequest,
  InsertLeaveRequest,
  HrRequest,
  InsertHrRequest,
  OnboardingProcess,
  InsertOnboardingProcess,
  OnboardingStep,
  InsertOnboardingStep,
  CandidateOnboarding,
  InsertCandidateOnboarding,
  OnboardingStepCompletion,
  InsertStepCompletion,
  OnboardingFeedback,
  InsertOnboardingFeedback,
  OnboardingAchievement,
  UserAchievement,
  OnboardingEvent,
  InsertOnboardingEvent,
  Interview,
  InsertInterview,
  InterviewEvaluation,
  InsertInterviewEvaluation,
  InterviewFeedback,
  InsertInterviewFeedback,
  PerformanceReview,
  InsertPerformanceReview,
  TrainingProgram,
  InsertTrainingProgram,
  EmployeeTraining,
  InsertEmployeeTraining,
  TimeEntry,
  InsertTimeEntry,
  CandidateInvitation,
  InsertCandidateInvitation
} from "@shared/schema";

export interface IStorage {
  // User management
  createUser(userData: UpsertUser): Promise<User>;
  getUser(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  upsertUser(userData: UpsertUser): Promise<User>;

  // Job management
  getAllJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | null>;
  createJob(jobData: InsertJob): Promise<Job>;
  updateJob(id: number, jobData: Partial<InsertJob>): Promise<Job | null>;
  deleteJob(id: number): Promise<boolean>;
  searchJobs(query: string, filters: any): Promise<Job[]>;

  // Application management
  getAllApplications(): Promise<Application[]>;
  getApplicationsByUser(userId: string): Promise<Application[]>;
  getApplicationsForJob(jobId: number): Promise<Application[]>;
  getApplication(id: number): Promise<Application | null>;
  createApplication(appData: InsertApplication, userId: string): Promise<Application>;
  updateApplication(id: number, appData: Partial<UpdateApplication>): Promise<Application | null>;
  deleteApplication(id: number): Promise<boolean>;
  getApplicationsByRecruiter(recruiterId: string): Promise<Application[]>;
  searchApplicationsByScore(minAuto?: number, maxAuto?: number, minManual?: number, maxManual?: number): Promise<Application[]>;
  getApplicationsByDateRange(startDate: Date, endDate: Date): Promise<Application[]>;

  // Employee management
  getAllEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | null>;
  getEmployeeByUserId(userId: string): Promise<Employee | null>;
  createEmployee(empData: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, empData: Partial<InsertEmployee>): Promise<Employee>;
  generateEmployeeId(firstName: string, lastName: string): Promise<string>;

  // Contract management
  getActiveContracts(): Promise<Contract[]>;
  getContract(id: number): Promise<Contract | null>;
  createContract(contractData: InsertContract): Promise<Contract>;
  updateContract(id: number, contractData: Partial<InsertContract>): Promise<Contract>;

  // Payroll management
  getAllPayrolls(): Promise<Payroll[]>;
  getPayroll(id: number): Promise<Payroll | null>;
  createPayroll(payrollData: InsertPayroll): Promise<Payroll>;
  updatePayroll(id: number, payrollData: Partial<InsertPayroll>): Promise<Payroll>;
  getPayrollByEmployee(employeeId: number, period: string): Promise<Payroll[]>;

  // Leave management
  getLeaveRequestsByEmployee(employeeId: number): Promise<LeaveRequest[]>;
  getLeaveRequest(id: number): Promise<LeaveRequest | null>;
  createLeaveRequest(leaveData: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequest(id: number, leaveData: Partial<InsertLeaveRequest>): Promise<LeaveRequest>;
  getLeaveBalance(employeeId: number, year: number): Promise<any[]>;
  updateLeaveBalance(employeeId: number, year: number, leaveType: string, daysUsed: number): Promise<void>;

  // HR requests
  getAllHrRequests(): Promise<HrRequest[]>;
  getHrRequest(id: number): Promise<HrRequest | null>;
  createHrRequest(requestData: InsertHrRequest): Promise<HrRequest>;
  updateHrRequest(id: number, requestData: Partial<InsertHrRequest>): Promise<HrRequest>;

  // Analytics and KPIs
  getKPIs(): Promise<any>;
  getApplicationAnalytics(): Promise<any>;
  getJobAnalytics(): Promise<any>;
  getRecruiters(): Promise<User[]>;

  // Onboarding management
  getAllOnboardingProcesses(): Promise<OnboardingProcess[]>;
  createOnboardingProcess(processData: InsertOnboardingProcess): Promise<OnboardingProcess>;
  updateOnboardingProcess(id: number, processData: Partial<InsertOnboardingProcess>): Promise<OnboardingProcess>;
  getOnboardingStepsByProcess(processId: number): Promise<OnboardingStep[]>;
  createOnboardingStep(stepData: InsertOnboardingStep): Promise<OnboardingStep>;
  getCandidateOnboardingByUser(userId: string): Promise<CandidateOnboarding[]>;
  getCandidateOnboarding(id: number): Promise<CandidateOnboarding | null>;
  createCandidateOnboarding(onboardingData: InsertCandidateOnboarding): Promise<CandidateOnboarding>;
  getStepCompletionsByOnboarding(onboardingId: number): Promise<OnboardingStepCompletion[]>;
  updateStepCompletion(id: number, completionData: Partial<InsertStepCompletion>): Promise<OnboardingStepCompletion>;
  getOnboardingAnalytics(): Promise<any>;
  getOnboardingProcessTemplates(): Promise<any[]>;

  // Feedback and achievements
  createOnboardingFeedback(feedbackData: InsertOnboardingFeedback): Promise<OnboardingFeedback>;
  getOnboardingFeedback(candidateOnboardingId?: number): Promise<OnboardingFeedback[]>;
  getAchievements(): Promise<OnboardingAchievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  awardAchievement(userId: string, achievementId: number, candidateOnboardingId?: number): Promise<UserAchievement>;
  initializeDefaultAchievements(): Promise<void>;

  // Calendar events
  createOnboardingEvent(eventData: InsertOnboardingEvent): Promise<OnboardingEvent>;
  getOnboardingEvents(candidateOnboardingId?: number): Promise<OnboardingEvent[]>;
  updateOnboardingEvent(id: number, eventData: Partial<InsertOnboardingEvent>): Promise<OnboardingEvent>;

  // Interview management
  getInterviews(): Promise<Interview[]>;
  createInterview(interviewData: InsertInterview): Promise<Interview>;
  createInterviewEvaluation(evaluationData: InsertInterviewEvaluation): Promise<InterviewEvaluation>;
  createInterviewFeedback(feedbackData: InsertInterviewFeedback): Promise<InterviewFeedback>;

  // Performance and training
  getPerformanceReviews(): Promise<PerformanceReview[]>;
  createPerformanceReview(reviewData: InsertPerformanceReview): Promise<PerformanceReview>;
  getTrainingPrograms(): Promise<TrainingProgram[]>;
  createTrainingProgram(programData: InsertTrainingProgram): Promise<TrainingProgram>;
  getEmployeeTraining(): Promise<EmployeeTraining[]>;
  createEmployeeTraining(trainingData: InsertEmployeeTraining): Promise<EmployeeTraining>;
  getTimeEntries(): Promise<TimeEntry[]>;
  createTimeEntry(timeData: InsertTimeEntry): Promise<TimeEntry>;

  // Candidate invitations
  getCandidateInvitations(): Promise<CandidateInvitation[]>;
  getCandidateInvitationByToken(token: string): Promise<CandidateInvitation | null>;
  createCandidateInvitation(invitationData: InsertCandidateInvitation): Promise<CandidateInvitation>;
  updateCandidateInvitation(id: number, data: Partial<InsertCandidateInvitation>): Promise<CandidateInvitation>;
}

class PostgreSQLStorage implements IStorage {
  // === USER MANAGEMENT ===
  
  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values(userData).returning();
    return user;
  }

  async getUser(id: string): Promise<User | null> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return user || null;
  }

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db.update(schema.users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(schema.users).where(eq(schema.users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(schema.users).orderBy(desc(schema.users.createdAt));
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(schema.users)
      .where(eq(schema.users.role, role))
      .orderBy(desc(schema.users.createdAt));
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = await this.getUserByEmail(userData.email!);
    if (existingUser) {
      return await this.updateUser(existingUser.id, userData);
    } else {
      return await this.createUser(userData);
    }
  }

  // === JOB MANAGEMENT ===
  
  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(schema.jobs)
      .where(eq(schema.jobs.isActive, 1))
      .orderBy(desc(schema.jobs.createdAt));
  }

  async getJob(id: number): Promise<Job | null> {
    const [job] = await db.select().from(schema.jobs).where(eq(schema.jobs.id, id));
    return job || null;
  }

  async createJob(jobData: InsertJob): Promise<Job> {
    const [job] = await db.insert(schema.jobs).values(jobData).returning();
    return job;
  }

  async updateJob(id: number, jobData: Partial<InsertJob>): Promise<Job | null> {
    const [job] = await db.update(schema.jobs)
      .set({ ...jobData, updatedAt: new Date() })
      .where(eq(schema.jobs.id, id))
      .returning();
    return job || null;
  }

  async deleteJob(id: number): Promise<boolean> {
    // Soft delete - mark as inactive instead of deleting
    const [job] = await db.update(schema.jobs)
      .set({ isActive: 0, updatedAt: new Date() })
      .where(eq(schema.jobs.id, id))
      .returning();
    return !!job;
  }

  async searchJobs(query: string, filters: any): Promise<Job[]> {
    let queryBuilder = db.select().from(schema.jobs).where(eq(schema.jobs.isActive, 1));

    if (query) {
      queryBuilder = queryBuilder.where(
        sql`(${schema.jobs.title} ILIKE ${`%${query}%`} OR ${schema.jobs.description} ILIKE ${`%${query}%`} OR ${schema.jobs.company} ILIKE ${`%${query}%`})`
      );
    }

    if (filters.contractType && filters.contractType.length > 0) {
      queryBuilder = queryBuilder.where(inArray(schema.jobs.contractType, filters.contractType));
    }

    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      queryBuilder = queryBuilder.where(inArray(schema.jobs.experienceLevel, filters.experienceLevel));
    }

    if (filters.location) {
      queryBuilder = queryBuilder.where(like(schema.jobs.location, `%${filters.location}%`));
    }

    return await queryBuilder.orderBy(desc(schema.jobs.createdAt));
  }

  // === APPLICATION MANAGEMENT ===
  
  async getAllApplications(): Promise<Application[]> {
    return await db.select().from(schema.applications)
      .orderBy(desc(schema.applications.createdAt));
  }

  async getApplicationsByUser(userId: string): Promise<Application[]> {
    return await db.select().from(schema.applications)
      .where(eq(schema.applications.userId, userId))
      .orderBy(desc(schema.applications.createdAt));
  }

  async getApplicationsForJob(jobId: number): Promise<Application[]> {
    return await db.select().from(schema.applications)
      .where(eq(schema.applications.jobId, jobId))
      .orderBy(desc(schema.applications.createdAt));
  }

  async getApplication(id: number): Promise<Application | null> {
    const [application] = await db.select().from(schema.applications)
      .where(eq(schema.applications.id, id));
    return application || null;
  }

  async createApplication(appData: InsertApplication, userId: string): Promise<Application> {
    const [application] = await db.insert(schema.applications)
      .values({ ...appData, userId })
      .returning();
    return application;
  }

  async updateApplication(id: number, appData: Partial<UpdateApplication>): Promise<Application | null> {
    const [application] = await db.update(schema.applications)
      .set({ ...appData, updatedAt: new Date() })
      .where(eq(schema.applications.id, id))
      .returning();
    return application || null;
  }

  async deleteApplication(id: number): Promise<boolean> {
    // Soft delete - update status instead of deleting
    const [application] = await db.update(schema.applications)
      .set({ status: "deleted", updatedAt: new Date() })
      .where(eq(schema.applications.id, id))
      .returning();
    return !!application;
  }

  async getApplicationsByRecruiter(recruiterId: string): Promise<Application[]> {
    return await db.select().from(schema.applications)
      .where(eq(schema.applications.assignedRecruiter, recruiterId))
      .orderBy(desc(schema.applications.createdAt));
  }

  async searchApplicationsByScore(minAuto?: number, maxAuto?: number, minManual?: number, maxManual?: number): Promise<Application[]> {
    let queryBuilder = db.select().from(schema.applications);

    const conditions = [];
    if (minAuto !== undefined) conditions.push(gte(schema.applications.autoScore, minAuto));
    if (maxAuto !== undefined) conditions.push(lte(schema.applications.autoScore, maxAuto));
    if (minManual !== undefined) conditions.push(gte(schema.applications.manualScore, minManual));
    if (maxManual !== undefined) conditions.push(lte(schema.applications.manualScore, maxManual));

    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions));
    }

    return await queryBuilder.orderBy(desc(schema.applications.createdAt));
  }

  async getApplicationsByDateRange(startDate: Date, endDate: Date): Promise<Application[]> {
    return await db.select().from(schema.applications)
      .where(and(
        gte(schema.applications.createdAt, startDate),
        lte(schema.applications.createdAt, endDate)
      ))
      .orderBy(desc(schema.applications.createdAt));
  }

  // === EMPLOYEE MANAGEMENT ===
  
  async getAllEmployees(): Promise<Employee[]> {
    return await db.select().from(schema.employees)
      .orderBy(desc(schema.employees.createdAt));
  }

  async getEmployee(id: number): Promise<Employee | null> {
    const [employee] = await db.select().from(schema.employees)
      .where(eq(schema.employees.id, id));
    return employee || null;
  }

  async getEmployeeByUserId(userId: string): Promise<Employee | null> {
    const [employee] = await db.select().from(schema.employees)
      .where(eq(schema.employees.userId, userId));
    return employee || null;
  }

  async createEmployee(empData: InsertEmployee): Promise<Employee> {
    const [employee] = await db.insert(schema.employees).values(empData).returning();
    return employee;
  }

  async updateEmployee(id: number, empData: Partial<InsertEmployee>): Promise<Employee> {
    const [employee] = await db.update(schema.employees)
      .set({ ...empData, updatedAt: new Date() })
      .where(eq(schema.employees.id, id))
      .returning();
    return employee;
  }

  async generateEmployeeId(firstName: string, lastName: string): Promise<string> {
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `EMP${initials}${timestamp}`;
  }

  // === CONTRACT MANAGEMENT ===
  
  async getActiveContracts(): Promise<Contract[]> {
    return await db.select().from(schema.contracts)
      .where(eq(schema.contracts.status, "active"))
      .orderBy(desc(schema.contracts.createdAt));
  }

  async getContract(id: number): Promise<Contract | null> {
    const [contract] = await db.select().from(schema.contracts)
      .where(eq(schema.contracts.id, id));
    return contract || null;
  }

  async createContract(contractData: InsertContract): Promise<Contract> {
    const [contract] = await db.insert(schema.contracts).values(contractData).returning();
    return contract;
  }

  async updateContract(id: number, contractData: Partial<InsertContract>): Promise<Contract> {
    const [contract] = await db.update(schema.contracts)
      .set({ ...contractData, updatedAt: new Date() })
      .where(eq(schema.contracts.id, id))
      .returning();
    return contract;
  }

  // === PAYROLL MANAGEMENT ===
  
  async getAllPayrolls(): Promise<Payroll[]> {
    return await db.select().from(schema.payroll)
      .orderBy(desc(schema.payroll.createdAt));
  }

  async getPayroll(id: number): Promise<Payroll | null> {
    const [payroll] = await db.select().from(schema.payroll)
      .where(eq(schema.payroll.id, id));
    return payroll || null;
  }

  async createPayroll(payrollData: InsertPayroll): Promise<Payroll> {
    const [payroll] = await db.insert(schema.payroll).values(payrollData).returning();
    return payroll;
  }

  async updatePayroll(id: number, payrollData: Partial<InsertPayroll>): Promise<Payroll> {
    const [payroll] = await db.update(schema.payroll)
      .set({ ...payrollData, updatedAt: new Date() })
      .where(eq(schema.payroll.id, id))
      .returning();
    return payroll;
  }

  async getPayrollByEmployee(employeeId: number, period: string): Promise<Payroll[]> {
    return await db.select().from(schema.payroll)
      .where(and(
        eq(schema.payroll.employeeId, employeeId),
        eq(schema.payroll.period, period)
      ));
  }

  // === LEAVE MANAGEMENT ===
  
  async getLeaveRequestsByEmployee(employeeId: number): Promise<LeaveRequest[]> {
    return await db.select().from(schema.leaveRequests)
      .where(eq(schema.leaveRequests.employeeId, employeeId))
      .orderBy(desc(schema.leaveRequests.createdAt));
  }

  async getLeaveRequest(id: number): Promise<LeaveRequest | null> {
    const [request] = await db.select().from(schema.leaveRequests)
      .where(eq(schema.leaveRequests.id, id));
    return request || null;
  }

  async createLeaveRequest(leaveData: InsertLeaveRequest): Promise<LeaveRequest> {
    const [request] = await db.insert(schema.leaveRequests).values(leaveData).returning();
    return request;
  }

  async updateLeaveRequest(id: number, leaveData: Partial<InsertLeaveRequest>): Promise<LeaveRequest> {
    const [request] = await db.update(schema.leaveRequests)
      .set({ ...leaveData, updatedAt: new Date() })
      .where(eq(schema.leaveRequests.id, id))
      .returning();
    return request;
  }

  async getLeaveBalance(employeeId: number, year: number): Promise<any[]> {
    return await db.select().from(schema.leaveBalances)
      .where(and(
        eq(schema.leaveBalances.employeeId, employeeId),
        eq(schema.leaveBalances.year, year)
      ));
  }

  async updateLeaveBalance(employeeId: number, year: number, leaveType: string, daysUsed: number): Promise<void> {
    // Implementation for updating leave balance
    await db.update(schema.leaveBalances)
      .set({ 
        usedDays: sql`${schema.leaveBalances.usedDays} + ${daysUsed}`,
        remainingDays: sql`${schema.leaveBalances.remainingDays} - ${daysUsed}`,
        updatedAt: new Date()
      })
      .where(and(
        eq(schema.leaveBalances.employeeId, employeeId),
        eq(schema.leaveBalances.year, year),
        eq(schema.leaveBalances.leaveType, leaveType)
      ));
  }

  // === HR REQUESTS ===
  
  async getAllHrRequests(): Promise<HrRequest[]> {
    return await db.select().from(schema.hrRequests)
      .orderBy(desc(schema.hrRequests.createdAt));
  }

  async getHrRequest(id: number): Promise<HrRequest | null> {
    const [request] = await db.select().from(schema.hrRequests)
      .where(eq(schema.hrRequests.id, id));
    return request || null;
  }

  async createHrRequest(requestData: InsertHrRequest): Promise<HrRequest> {
    const [request] = await db.insert(schema.hrRequests).values(requestData).returning();
    return request;
  }

  async updateHrRequest(id: number, requestData: Partial<InsertHrRequest>): Promise<HrRequest> {
    const [request] = await db.update(schema.hrRequests)
      .set({ ...requestData, updatedAt: new Date() })
      .where(eq(schema.hrRequests.id, id))
      .returning();
    return request;
  }

  // === ANALYTICS AND KPIS ===
  
  async getKPIs(): Promise<any> {
    const totalJobs = await db.select({ count: sql<number>`count(*)` }).from(schema.jobs);
    const totalApplications = await db.select({ count: sql<number>`count(*)` }).from(schema.applications);
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(schema.users);
    
    return {
      totalJobs: totalJobs[0]?.count || 0,
      totalApplications: totalApplications[0]?.count || 0,
      totalUsers: totalUsers[0]?.count || 0,
      pendingApplications: 0, // Will be calculated
      activeJobs: 0 // Will be calculated
    };
  }

  async getApplicationAnalytics(): Promise<any> {
    // Mock analytics data
    return {
      byStatus: [
        { status: "pending", count: 15 },
        { status: "reviewed", count: 8 },
        { status: "interview", count: 5 },
        { status: "accepted", count: 3 },
        { status: "rejected", count: 12 }
      ],
      byMonth: [
        { month: "Jan", applications: 25 },
        { month: "Feb", applications: 32 },
        { month: "Mar", applications: 28 }
      ]
    };
  }

  async getJobAnalytics(): Promise<any> {
    // Mock job analytics
    return {
      byContractType: [
        { type: "CDI", count: 8 },
        { type: "CDD", count: 5 },
        { type: "Freelance", count: 3 }
      ],
      byLocation: [
        { location: "Dakar", count: 10 },
        { location: "Thiès", count: 4 },
        { location: "Saint-Louis", count: 2 }
      ]
    };
  }

  async getRecruiters(): Promise<User[]> {
    return await db.select().from(schema.users)
      .where(inArray(schema.users.role, ["recruiter", "hr", "admin"]))
      .orderBy(asc(schema.users.firstName));
  }

  // === ONBOARDING MANAGEMENT ===
  
  async getAllOnboardingProcesses(): Promise<OnboardingProcess[]> {
    return await db.select().from(schema.onboardingProcesses)
      .orderBy(desc(schema.onboardingProcesses.createdAt));
  }

  async createOnboardingProcess(processData: InsertOnboardingProcess): Promise<OnboardingProcess> {
    const [process] = await db.insert(schema.onboardingProcesses).values(processData).returning();
    return process;
  }

  async updateOnboardingProcess(id: number, processData: Partial<InsertOnboardingProcess>): Promise<OnboardingProcess> {
    const [process] = await db.update(schema.onboardingProcesses)
      .set({ ...processData, updatedAt: new Date() })
      .where(eq(schema.onboardingProcesses.id, id))
      .returning();
    return process;
  }

  async getOnboardingStepsByProcess(processId: number): Promise<OnboardingStep[]> {
    return await db.select().from(schema.onboardingSteps)
      .where(eq(schema.onboardingSteps.processId, processId))
      .orderBy(asc(schema.onboardingSteps.stepNumber));
  }

  async createOnboardingStep(stepData: InsertOnboardingStep): Promise<OnboardingStep> {
    const [step] = await db.insert(schema.onboardingSteps).values(stepData).returning();
    return step;
  }

  async getCandidateOnboardingByUser(userId: string): Promise<CandidateOnboarding[]> {
    return await db.select().from(schema.candidateOnboarding)
      .where(eq(schema.candidateOnboarding.userId, userId))
      .orderBy(desc(schema.candidateOnboarding.createdAt));
  }

  async getCandidateOnboarding(id: number): Promise<CandidateOnboarding | null> {
    const [onboarding] = await db.select().from(schema.candidateOnboarding)
      .where(eq(schema.candidateOnboarding.id, id));
    return onboarding || null;
  }

  async createCandidateOnboarding(onboardingData: InsertCandidateOnboarding): Promise<CandidateOnboarding> {
    const [onboarding] = await db.insert(schema.candidateOnboarding).values(onboardingData).returning();
    
    // Create step completions for all steps in the process
    const steps = await this.getOnboardingStepsByProcess(onboarding.processId);
    for (const step of steps) {
      await db.insert(schema.onboardingStepCompletions).values({
        candidateOnboardingId: onboarding.id,
        stepId: step.id,
        status: "pending"
      });
    }
    
    return onboarding;
  }

  async getStepCompletionsByOnboarding(onboardingId: number): Promise<OnboardingStepCompletion[]> {
    return await db.select({
      id: schema.onboardingStepCompletions.id,
      candidateOnboardingId: schema.onboardingStepCompletions.candidateOnboardingId,
      stepId: schema.onboardingStepCompletions.stepId,
      status: schema.onboardingStepCompletions.status,
      startDate: schema.onboardingStepCompletions.startDate,
      completionDate: schema.onboardingStepCompletions.completionDate,
      completedBy: schema.onboardingStepCompletions.completedBy,
      notes: schema.onboardingStepCompletions.notes,
      attachments: schema.onboardingStepCompletions.attachments,
      validationRequired: schema.onboardingStepCompletions.validationRequired,
      validatedBy: schema.onboardingStepCompletions.validatedBy,
      validationDate: schema.onboardingStepCompletions.validationDate,
      createdAt: schema.onboardingStepCompletions.createdAt,
      updatedAt: schema.onboardingStepCompletions.updatedAt,
      step: {
        id: schema.onboardingSteps.id,
        processId: schema.onboardingSteps.processId,
        stepNumber: schema.onboardingSteps.stepNumber,
        title: schema.onboardingSteps.title,
        description: schema.onboardingSteps.description,
        category: schema.onboardingSteps.category,
        isRequired: schema.onboardingSteps.isRequired,
        estimatedDuration: schema.onboardingSteps.estimatedDuration,
        assignedRole: schema.onboardingSteps.assignedRole,
        requiredDocuments: schema.onboardingSteps.requiredDocuments,
        completionCriteria: schema.onboardingSteps.completionCriteria,
        createdAt: schema.onboardingSteps.createdAt,
        updatedAt: schema.onboardingSteps.updatedAt,
      }
    })
    .from(schema.onboardingStepCompletions)
    .leftJoin(schema.onboardingSteps, eq(schema.onboardingStepCompletions.stepId, schema.onboardingSteps.id))
    .where(eq(schema.onboardingStepCompletions.candidateOnboardingId, onboardingId))
    .orderBy(asc(schema.onboardingSteps.stepNumber));
  }

  async updateStepCompletion(id: number, completionData: Partial<InsertStepCompletion>): Promise<OnboardingStepCompletion> {
    const [completion] = await db.update(schema.onboardingStepCompletions)
      .set({ ...completionData, updatedAt: new Date() })
      .where(eq(schema.onboardingStepCompletions.id, id))
      .returning();
    return completion;
  }

  async getOnboardingAnalytics(): Promise<any> {
    // Mock analytics data for onboarding
    return {
      overview: {
        totalOnboardings: 25,
        completionRate: 85,
        averageCompletionTime: 14,
        inProgressOnboardings: 8
      },
      monthlyProgress: [
        { month: "Jan", started: 10, completed: 8 },
        { month: "Feb", started: 12, completed: 10 },
        { month: "Mar", started: 8, completed: 7 }
      ],
      departmentStats: [
        { department: "Aviation", total: 15, completed: 12 },
        { department: "Sécurité", total: 8, completed: 7 },
        { department: "Administration", total: 5, completed: 4 }
      ],
      stepPerformance: [
        { stepTitle: "Formation Sécurité", category: "formation", totalCompletions: 20, completionRate: 65 },
        { stepTitle: "Remise Badge", category: "administrative", totalCompletions: 25, completionRate: 95 }
      ]
    };
  }

  async getOnboardingProcessTemplates(): Promise<any[]> {
    // Mock templates data
    return [
      {
        id: 1,
        name: "Onboarding Standard Aviation",
        description: "Processus d'intégration pour le personnel navigant",
        department: "Aviation",
        estimatedDuration: 21,
        steps: [
          { title: "Formation Sécurité Aérienne", category: "formation", duration: 8 },
          { title: "Certification IATA", category: "technique", duration: 16 },
          { title: "Remise Uniforme", category: "administrative", duration: 2 }
        ]
      },
      {
        id: 2,
        name: "Onboarding Sécurité Aéroport",
        description: "Processus pour agents de sûreté",
        department: "Sécurité",
        estimatedDuration: 14,
        steps: [
          { title: "Formation Réglementation", category: "formation", duration: 12 },
          { title: "Habilitation Sécurité", category: "administrative", duration: 3 }
        ]
      }
    ];
  }

  // === FEEDBACK AND ACHIEVEMENTS ===
  
  async createOnboardingFeedback(feedbackData: InsertOnboardingFeedback): Promise<OnboardingFeedback> {
    const [feedback] = await db.insert(schema.onboardingFeedback).values(feedbackData).returning();
    return feedback;
  }

  async getOnboardingFeedback(candidateOnboardingId?: number): Promise<OnboardingFeedback[]> {
    let query = db.select().from(schema.onboardingFeedback);
    
    if (candidateOnboardingId) {
      query = query.where(eq(schema.onboardingFeedback.candidateOnboardingId, candidateOnboardingId));
    }
    
    return await query.orderBy(desc(schema.onboardingFeedback.createdAt));
  }

  async getAchievements(): Promise<OnboardingAchievement[]> {
    return await db.select().from(schema.onboardingAchievements)
      .where(eq(schema.onboardingAchievements.isActive, true))
      .orderBy(asc(schema.onboardingAchievements.category));
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db.select({
      id: schema.userAchievements.id,
      userId: schema.userAchievements.userId,
      achievementId: schema.userAchievements.achievementId,
      candidateOnboardingId: schema.userAchievements.candidateOnboardingId,
      earnedAt: schema.userAchievements.earnedAt,
      createdAt: schema.userAchievements.createdAt,
      achievement: {
        id: schema.onboardingAchievements.id,
        name: schema.onboardingAchievements.name,
        description: schema.onboardingAchievements.description,
        icon: schema.onboardingAchievements.icon,
        category: schema.onboardingAchievements.category,
        criteria: schema.onboardingAchievements.criteria,
        points: schema.onboardingAchievements.points,
        isActive: schema.onboardingAchievements.isActive,
        createdAt: schema.onboardingAchievements.createdAt,
      }
    })
    .from(schema.userAchievements)
    .leftJoin(schema.onboardingAchievements, eq(schema.userAchievements.achievementId, schema.onboardingAchievements.id))
    .where(eq(schema.userAchievements.userId, userId))
    .orderBy(desc(schema.userAchievements.earnedAt));
  }

  async awardAchievement(userId: string, achievementId: number, candidateOnboardingId?: number): Promise<UserAchievement> {
    const [award] = await db.insert(schema.userAchievements).values({
      userId,
      achievementId,
      candidateOnboardingId: candidateOnboardingId || null
    }).returning();
    return award;
  }

  async initializeDefaultAchievements(): Promise<void> {
    const defaultAchievements = [
      {
        name: "Premier Pas",
        description: "Commencer votre processus d'onboarding",
        icon: "Star",
        category: "milestone",
        points: 10
      },
      {
        name: "Rapide comme l'Éclair",
        description: "Terminer une étape en moins d'une heure",
        icon: "Zap",
        category: "speed",
        points: 15
      },
      {
        name: "Pilote Confirmé",
        description: "Terminer toutes les formations obligatoires",
        icon: "Plane",
        category: "quality",
        points: 25
      },
      {
        name: "Communicateur Expert",
        description: "Participer activement aux discussions",
        icon: "MessageSquare",
        category: "engagement",
        points: 20
      },
      {
        name: "Gardien de la Sécurité",
        description: "Réussir toutes les formations de sécurité",
        icon: "Shield",
        category: "quality",
        points: 30
      },
      {
        name: "Champion de l'Onboarding",
        description: "Terminer l'onboarding avec excellence",
        icon: "Award",
        category: "milestone",
        points: 50
      }
    ];

    for (const achievement of defaultAchievements) {
      try {
        await db.insert(schema.onboardingAchievements).values(achievement).onConflictDoNothing();
      } catch (error) {
        // Ignore conflicts - achievements already exist
      }
    }
  }

  // === CALENDAR EVENTS ===
  
  async createOnboardingEvent(eventData: InsertOnboardingEvent): Promise<OnboardingEvent> {
    const [event] = await db.insert(schema.onboardingEvents).values(eventData).returning();
    return event;
  }

  async getOnboardingEvents(candidateOnboardingId?: number): Promise<OnboardingEvent[]> {
    let query = db.select().from(schema.onboardingEvents);
    
    if (candidateOnboardingId) {
      query = query.where(eq(schema.onboardingEvents.candidateOnboardingId, candidateOnboardingId));
    }
    
    return await query.orderBy(asc(schema.onboardingEvents.startDateTime));
  }

  async updateOnboardingEvent(id: number, eventData: Partial<InsertOnboardingEvent>): Promise<OnboardingEvent> {
    const [event] = await db.update(schema.onboardingEvents)
      .set({ ...eventData, updatedAt: new Date() })
      .where(eq(schema.onboardingEvents.id, id))
      .returning();
    return event;
  }

  // === INTERVIEW MANAGEMENT ===
  
  async getInterviews(): Promise<Interview[]> {
    return await db.select().from(schema.interviews)
      .orderBy(desc(schema.interviews.createdAt));
  }

  async createInterview(interviewData: InsertInterview): Promise<Interview> {
    const [interview] = await db.insert(schema.interviews).values(interviewData).returning();
    return interview;
  }

  async createInterviewEvaluation(evaluationData: InsertInterviewEvaluation): Promise<InterviewEvaluation> {
    const [evaluation] = await db.insert(schema.interviewEvaluations).values(evaluationData).returning();
    return evaluation;
  }

  async createInterviewFeedback(feedbackData: InsertInterviewFeedback): Promise<InterviewFeedback> {
    const [feedback] = await db.insert(schema.interviewFeedback).values(feedbackData).returning();
    return feedback;
  }

  // === PERFORMANCE AND TRAINING ===
  
  async getPerformanceReviews(): Promise<PerformanceReview[]> {
    return await db.select().from(schema.performanceReviews)
      .orderBy(desc(schema.performanceReviews.createdAt));
  }

  async createPerformanceReview(reviewData: InsertPerformanceReview): Promise<PerformanceReview> {
    const [review] = await db.insert(schema.performanceReviews).values(reviewData).returning();
    return review;
  }

  async getTrainingPrograms(): Promise<TrainingProgram[]> {
    return await db.select().from(schema.trainingPrograms)
      .where(eq(schema.trainingPrograms.isActive, true))
      .orderBy(asc(schema.trainingPrograms.name));
  }

  async createTrainingProgram(programData: InsertTrainingProgram): Promise<TrainingProgram> {
    const [program] = await db.insert(schema.trainingPrograms).values(programData).returning();
    return program;
  }

  async getEmployeeTraining(): Promise<EmployeeTraining[]> {
    return await db.select().from(schema.employeeTraining)
      .orderBy(desc(schema.employeeTraining.createdAt));
  }

  async createEmployeeTraining(trainingData: InsertEmployeeTraining): Promise<EmployeeTraining> {
    const [training] = await db.insert(schema.employeeTraining).values(trainingData).returning();
    return training;
  }

  async getTimeEntries(): Promise<TimeEntry[]> {
    return await db.select().from(schema.timeEntries)
      .orderBy(desc(schema.timeEntries.createdAt));
  }

  async createTimeEntry(timeData: InsertTimeEntry): Promise<TimeEntry> {
    const [timeEntry] = await db.insert(schema.timeEntries).values(timeData).returning();
    return timeEntry;
  }

  // === CANDIDATE INVITATIONS ===
  
  async getCandidateInvitations(): Promise<CandidateInvitation[]> {
    return await db.select().from(schema.candidateInvitations)
      .orderBy(desc(schema.candidateInvitations.createdAt));
  }

  async getCandidateInvitationByToken(token: string): Promise<CandidateInvitation | null> {
    const [invitation] = await db.select().from(schema.candidateInvitations)
      .where(eq(schema.candidateInvitations.invitationToken, token));
    return invitation || null;
  }

  async createCandidateInvitation(invitationData: InsertCandidateInvitation): Promise<CandidateInvitation> {
    const [invitation] = await db.insert(schema.candidateInvitations).values(invitationData).returning();
    return invitation;
  }

  async updateCandidateInvitation(id: number, data: Partial<InsertCandidateInvitation>): Promise<CandidateInvitation> {
    const [invitation] = await db.update(schema.candidateInvitations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.candidateInvitations.id, id))
      .returning();
    return invitation;
  }
}

export const storage: IStorage = new PostgreSQLStorage();