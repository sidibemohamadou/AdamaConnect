import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  LogOut,
  Settings,
  Download
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["/api/admin/kpis"],
  });

  const { data: applicationAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/admin/analytics/applications"],
  });

  const { data: jobAnalytics, isLoading: jobAnalyticsLoading } = useQuery({
    queryKey: ["/api/admin/analytics/jobs"],
  });

  const { data: recentApplications = [], isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/admin/applications"],
    select: (data: any[]) => data.slice(0, 5), // Dernières 5 candidatures
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleExportData = () => {
    window.open("/api/admin/applications/export", "_blank");
  };

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (kpisLoading || analyticsLoading || jobAnalyticsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">AeroRecrutement Admin</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user?.firstName} {user?.lastName}
              </span>
              <Badge variant="secondary">
                {user?.role === "admin" ? "Super Admin" : 
                 user?.role === "hr" ? "RH" : 
                 user?.role === "recruiter" ? "Recruteur" : "Manager"}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex space-x-6 mb-8 border-b border-border">
          <Button variant="ghost" className="border-b-2 border-primary text-primary">
            <BarChart3 className="h-4 w-4 mr-2" />
            Tableau de bord
          </Button>
          <Link href="/admin/jobs">
            <Button variant="ghost" className="text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-2" />
              Offres d'emploi
            </Button>
          </Link>
          <Link href="/admin/applications">
            <Button variant="ghost" className="text-muted-foreground">
              <FileText className="h-4 w-4 mr-2" />
              Candidatures
            </Button>
          </Link>
          {user?.role === "admin" && (
            <Link href="/admin/users">
              <Button variant="ghost" className="text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                Utilisateurs
              </Button>
            </Link>
          )}
          <Link href="/admin/payroll">
            <Button variant="ghost" className="text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Paie
            </Button>
          </Link>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidatures</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-applications">
                {kpis?.totalApplications || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offres Actives</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-active-jobs">
                {kpis?.totalJobs || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {kpis?.activeJobs || 0} publiées cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-users">
                {kpis?.totalUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Candidats et équipe RH
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                24%
              </div>
              <p className="text-xs text-muted-foreground">
                Candidatures → Entretiens
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Applications by Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Candidatures par Statut
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applicationAnalytics?.byStatus ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={applicationAnalytics.byStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {applicationAnalytics.byStatus.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Données en cours de chargement...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Applications Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Évolution Mensuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applicationAnalytics?.byMonth ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={applicationAnalytics.byMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Données en cours de chargement...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Jobs Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Jobs by Contract Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Offres par Type de Contrat
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jobAnalytics?.byContractType ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={jobAnalytics.byContractType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Données en cours de chargement...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Jobs by Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Offres par Localisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jobAnalytics?.byLocation ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={jobAnalytics.byLocation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Données en cours de chargement...
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Candidatures Récentes
                </span>
                <Link href="/admin/applications">
                  <Button variant="outline" size="sm">
                    Voir tout
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applicationsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse p-4 bg-muted rounded-lg">
                      <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentApplications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Aucune candidature récente
                </p>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((application: any) => (
                    <div 
                      key={application.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {application.candidate?.firstName} {application.candidate?.lastName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {application.job?.title} - {application.job?.company}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(application.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={
                            application.status === 'pending' ? 'secondary' :
                            application.status === 'reviewed' ? 'default' :
                            application.status === 'interview' ? 'default' :
                            application.status === 'accepted' ? 'default' : 'destructive'
                          }
                          className={
                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                            application.status === 'interview' ? 'bg-green-100 text-green-800' :
                            application.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {application.status === 'pending' ? 'En attente' :
                           application.status === 'reviewed' ? 'Examinée' :
                           application.status === 'interview' ? 'Entretien' :
                           application.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                        </Badge>
                        {application.autoScore && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Score: {application.autoScore}/100
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/jobs">
                <Button className="w-full justify-start" variant="outline">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Créer une Offre d'Emploi
                </Button>
              </Link>
              
              <Link href="/admin/applications">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Gérer les Candidatures
                </Button>
              </Link>
              
              {user?.role === "admin" && (
                <Link href="/admin/users">
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Ajouter un Utilisateur
                  </Button>
                </Link>
              )}
              
              <Button 
                onClick={handleExportData}
                className="w-full justify-start" 
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter les Données
              </Button>

              <Link href="/admin/assignment">
                <Button className="w-full justify-start" variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  Attribution Candidats
                </Button>
              </Link>

              <Link href="/admin/onboarding">
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Gestion Onboarding
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                En Attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {applicationAnalytics?.byStatus?.find((s: any) => s.status === 'pending')?.count || 0}
              </div>
              <p className="text-sm text-muted-foreground">
                Candidatures à examiner
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Acceptées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {applicationAnalytics?.byStatus?.find((s: any) => s.status === 'accepted')?.count || 0}
              </div>
              <p className="text-sm text-muted-foreground">
                Candidats retenus
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Entretiens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {applicationAnalytics?.byStatus?.find((s: any) => s.status === 'interview')?.count || 0}
              </div>
              <p className="text-sm text-muted-foreground">
                Entretiens programmés
              </p>
            </CardContent>
          </Card>
        </div>

        {/* DevLogin Audit (Admin seulement) */}
        {user?.role === "admin" && process.env.NODE_ENV === "development" && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                DevLogin Audit (Développement)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700">
                    Mode développement détecté. DevLogin disponible pour les tests.
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    ⚠️ Assurez-vous de désactiver DevLogin en production
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link href="/dev-login">
                    <Button variant="outline" size="sm" className="border-orange-300 text-orange-700">
                      Accéder DevLogin
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open("/api/admin/dev-login-audit", "_blank")}
                    className="border-orange-300 text-orange-700"
                  >
                    Voir Audit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              État du Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Base de données</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Stockage fichiers</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Authentification</span>
              </div>
              <div className="flex items-center space-x-2">
                {process.env.NODE_ENV === "development" ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                <span className="text-sm">
                  Mode {process.env.NODE_ENV === "development" ? "Développement" : "Production"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}