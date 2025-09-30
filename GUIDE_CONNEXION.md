# 🔐 Guide de Connexion - AeroRecrutement

## 🚀 Accès Rapide pour la Présentation

### **[CONNEXION ADMIN PRINCIPALE ↗](/admin/login)**

---

## 👤 Comptes de Démonstration

### 🛡️ **Super Administrateur - Mohamed**
- **URL de connexion**: [/admin/login](/admin/login)
- **Email**: `mohamed.admin@aerorecrut.com`
- **Mot de passe**: `admin123`
- **Rôle**: Super Administrateur
- **Accès**: 
  - ✅ Toutes les fonctionnalités
  - ✅ Gestion des utilisateurs
  - ✅ Analytics complètes
  - ✅ Configuration système

### 👥 **Responsable RH - Marie**
- **URL de connexion**: [/admin/login](/admin/login)
- **Email**: `marie.rh@aerorecrut.com`
- **Mot de passe**: `admin123`
- **Rôle**: Ressources Humaines
- **Accès**:
  - ✅ Gestion des employés
  - ✅ Système de paie
  - ✅ Gestion des congés
  - ✅ Processus d'onboarding
  - ✅ Contrats et avenants

### 🎯 **Recruteur - Pierre**
- **URL de connexion**: [/admin/login](/admin/login)
- **Email**: `pierre.recruteur@aerorecrut.com`
- **Mot de passe**: `admin123`
- **Rôle**: Recruteur
- **Accès**:
  - ✅ Gestion des candidatures
  - ✅ Notation des candidats
  - ✅ Gestion des entretiens
  - ✅ Attribution des candidats

### 👔 **Manager - Sophie**
- **URL de connexion**: [/admin/login](/admin/login)
- **Email**: `sophie.manager@aerorecrut.com`
- **Mot de passe**: `admin123`
- **Rôle**: Manager
- **Accès**:
  - ✅ Gestion d'équipe
  - ✅ Évaluations de performance
  - ✅ Approbation des congés
  - ✅ Rapports d'équipe

---

## 👤 Candidats de Test

### **Connexion Candidats**: [/login](/login)

| Nom | Email | Mot de passe | Statut Profil | Candidatures |
|-----|-------|--------------|---------------|--------------|
| **Jean Dupont** | `jean.dupont@example.com` | `candidate123` | ✅ Complété | 2 candidatures |
| **Fatou Fall** | `fatou.fall@example.com` | `candidate123` | ✅ Complété | 2 candidatures |
| **Amadou Ba** | `amadou.ba@example.com` | `candidate123` | ✅ Complété | 2 candidatures |
| **Aissatou Diop** | `aissatou.diop@example.com` | `candidate123` | ✅ Complété | 2 candidatures |
| **Moussa Sow** | `moussa.sow@example.com` | `candidate123` | ✅ Complété | 2 candidatures |
| **Mariama Kane** | `mariama.kane@example.com` | `candidate123` | ✅ Complété | 2 candidatures |

---

## 🔧 DevLogin (Développement Seulement)

### **[Accès DevLogin ↗](/dev-login)**

⚠️ **Disponible uniquement en mode développement**

#### Rôles Disponibles
- 🛡️ **Admin** - Accès complet
- 👥 **HR** - Gestion RH
- 🎯 **Recruiter** - Gestion candidatures
- 👔 **Manager** - Gestion équipe
- 🏢 **Employee** - Employé standard
- 👤 **Candidate** - Candidat

#### Sécurité DevLogin
- ✅ **Audit automatique** de chaque connexion
- ✅ **Journalisation** complète (IP, timestamp, rôle)
- ✅ **Désactivable** via `DEV_LOGIN_ENABLED=false`
- ✅ **Consultation audit** via `/api/admin/dev-login-audit`

---

## 🗺️ Navigation par Rôle

### 🛡️ Super Admin (Mohamed)
| Fonctionnalité | URL | Description |
|----------------|-----|-------------|
| Dashboard | `/admin` | Vue d'ensemble administrative |
| Gestion Offres | `/admin/jobs` | CRUD complet des offres |
| Candidatures | `/admin/applications` | Toutes les candidatures |
| Utilisateurs | `/admin/users` | Gestion des comptes |
| Attribution | `/admin/assignment` | Attribution candidats |
| Notation | `/admin/scoring` | Système de scoring |
| Résultats | `/admin/final-results` | Top 3 final |
| Entretiens | `/admin/interviews` | Gestion entretiens |
| Employés | `/admin/employees` | Gestion employés |
| Onboarding | `/admin/onboarding` | Processus d'intégration |
| Invitations | `/admin/invitations` | Invitations candidats |

### 👥 RH (Marie)
| Fonctionnalité | URL | Description |
|----------------|-----|-------------|
| Dashboard RH | `/hr` | Centre de contrôle RH |
| Paie | `/admin/payroll` | Gestion des salaires |
| Contrats | `/contracts` | Gestion contractuelle |
| Employés | `/admin/employees` | Dossiers employés |
| Congés | `/hr/leaves` | Gestion des congés |
| Avantages | `/hr/benefits` | Indemnités et primes |

### 🎯 Recruteur (Pierre)
| Fonctionnalité | URL | Description |
|----------------|-----|-------------|
| Dashboard | `/admin` | Vue recruteur |
| Candidatures | `/admin/applications` | Candidatures assignées |
| Notation | `/admin/scoring` | Évaluation candidats |
| Entretiens | `/admin/interviews` | Planning entretiens |

### 👤 Candidat (Jean, Fatou, etc.)
| Fonctionnalité | URL | Description |
|----------------|-----|-------------|
| Dashboard | `/` | Tableau de bord personnel |
| Profil | `/profile` | Gestion du profil |
| Candidatures | `/applications` | Mes candidatures |
| Recherche | `/jobs` | Offres disponibles |
| Onboarding | `/candidate-onboarding` | Mon intégration |
| Achievements | `/achievements` | Mes badges |
| Calendrier | `/onboarding-calendar` | Planning personnel |
| Feedback | `/onboarding-feedback` | Évaluation expérience |

---

## 🎯 Scénarios de Test pour la Présentation

### 🔥 **Scénario 1: Candidature Complète**
1. **Candidat** se connecte (`jean.dupont@example.com`)
2. Consulte les offres sur la page d'accueil
3. Utilise les filtres (type contrat, lieu, expérience)
4. Postule avec upload CV + lettre de motivation
5. **Admin** consulte la nouvelle candidature
6. Change le statut et ajoute des notes
7. **Candidat** voit la mise à jour dans sa timeline

### 🔥 **Scénario 2: Gestion RH**
1. **RH** se connecte (`marie.rh@aerorecrut.com`)
2. Accède au dashboard RH
3. Crée une fiche de paie pour un employé
4. Génère le PDF de la fiche
5. Envoie par email (simulation)
6. Gère une demande de congés

### 🔥 **Scénario 3: Processus de Recrutement**
1. **Admin** crée une nouvelle offre d'emploi
2. **Recruteur** consulte les candidatures
3. Utilise le système de scoring automatique
4. Attribue des notes manuelles
5. Consulte le Top 3 final
6. Programme des entretiens

### 🔥 **Scénario 4: Onboarding Candidat**
1. **Candidat** accède à son onboarding
2. Consulte ses étapes d'intégration
3. Marque des étapes comme terminées
4. Consulte ses achievements
5. Donne son feedback sur l'expérience

---

## 🔍 Vérification Base de Données

### Connexion pgAdmin
1. **Host**: `localhost`
2. **Port**: `5432`
3. **Database**: `aerorecrut`
4. **Username**: `aerorecrut_user`
5. **Password**: Celui configuré lors de l'installation

### Tables Principales à Vérifier
```sql
-- Utilisateurs
SELECT id, email, first_name, last_name, role, profile_completed FROM users;

-- Offres d'emploi
SELECT id, title, company, location, contract_type, is_active FROM jobs;

-- Candidatures
SELECT id, user_id, job_id, status, auto_score, manual_score FROM applications;

-- Employés
SELECT id, user_id, employee_number, position, department, status FROM employees;

-- Fiches de paie
SELECT id, employee_id, period, base_salary, net_salary, status FROM payroll;
```

---

## 🚨 Points d'Attention pour la Présentation

### ✅ À Vérifier Avant la Démo
- [ ] Base de données accessible
- [ ] Données de test injectées
- [ ] DevLogin désactivé si en production
- [ ] Tous les comptes de test fonctionnent
- [ ] Upload de fichiers opérationnel
- [ ] Filtres de recherche réactifs
- [ ] Dashboards avec données réelles

### 🔧 Dépannage Rapide
- **Erreur de connexion DB**: Vérifier `DATABASE_URL` dans `.env`
- **DevLogin inaccessible**: Vérifier `DEV_LOGIN_ENABLED=true`
- **Upload ne fonctionne pas**: Vérifier `PRIVATE_OBJECT_DIR`
- **Session expirée**: Vérifier `SESSION_SECRET`

---

## 📊 Données de Démonstration Disponibles

### 📈 Statistiques Générales
- **10 offres d'emploi** actives
- **12 candidatures** avec statuts variés
- **6 candidats** avec profils complets
- **4 comptes administrateurs**
- **2 employés** actifs avec contrats
- **4 fiches de paie** (exemples réels)

### 🎯 Répartition des Candidatures
- **3 en attente** (pending)
- **3 examinées** (reviewed)  
- **2 entretiens** (interview)
- **2 acceptées** (accepted)
- **2 refusées** (rejected)

### 💼 Types d'Offres
- **Aviation**: Hôtesse, Pilote, Contrôleur
- **Sécurité**: Agent sûreté, Responsable sécurité
- **Technique**: Maintenance, Développeur
- **Logistique**: Chef de projet, Analyste

---

**🎯 Tout est prêt pour une démonstration réussie !**

*Guide mis à jour le: $(date)*