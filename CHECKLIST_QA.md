# ✅ Checklist QA - AeroRecrutement

## 🎯 Tests Critiques pour la Présentation

### 🔐 **1. Authentification et Sécurité**

#### Tests de Connexion
- [ ] **Admin**: `mohamed.admin@aerorecrut.com` / `admin123` → Dashboard admin
- [ ] **RH**: `marie.rh@aerorecrut.com` / `admin123` → Dashboard RH  
- [ ] **Recruteur**: `pierre.recruteur@aerorecrut.com` / `admin123` → Interface recruteur
- [ ] **Candidat**: `jean.dupont@example.com` / `candidate123` → Dashboard candidat
- [ ] **DevLogin**: `/dev-login` fonctionne en développement
- [ ] **DevLogin**: Inaccessible en production (`DEV_LOGIN_ENABLED=false`)

#### Sécurité
- [ ] Sessions persistantes après connexion
- [ ] Déconnexion propre sur toutes les pages
- [ ] Redirection automatique si non connecté
- [ ] Permissions respectées selon les rôles
- [ ] Audit DevLogin accessible via admin

---

### 🏠 **2. Page d'Accueil et Recherche**

#### Affichage
- [ ] Page d'accueil charge sans erreur
- [ ] Liste des offres d'emploi visible
- [ ] Design responsive (desktop/mobile)
- [ ] Navigation fonctionnelle

#### Filtres et Recherche
- [ ] **Recherche par mot-clé**: Titre, description, entreprise
- [ ] **Filtre par lieu**: Dakar, AIBD, etc.
- [ ] **Filtre par contrat**: CDI, CDD, Freelance
- [ ] **Filtre par expérience**: Débutant, Intermédiaire, Senior
- [ ] **Combinaison de filtres**: Plusieurs filtres simultanés
- [ ] **Pagination**: Navigation entre pages
- [ ] **Tri**: Plus récent, salaire, pertinence
- [ ] **Résultats cohérents**: API et UI synchronisés

---

### 👤 **3. Flow Candidat Complet**

#### Inscription et Profil
- [ ] Inscription nouveau candidat
- [ ] Complétion profil en 4 étapes
- [ ] Sauvegarde des informations
- [ ] Validation des champs obligatoires

#### Candidature
- [ ] Consultation des offres depuis dashboard
- [ ] Formulaire de candidature complet
- [ ] **Upload CV**: Fichier PDF accepté et sauvegardé
- [ ] **Upload lettre motivation**: Fichier PDF accepté
- [ ] Validation des données avant envoi
- [ ] Consentement RGPD obligatoire
- [ ] Candidature visible dans "Mes candidatures"

#### Suivi
- [ ] Timeline de candidature s'affiche
- [ ] Statuts mis à jour en temps réel
- [ ] Documents accessibles depuis l'interface
- [ ] Notifications de changement de statut

---

### 🛡️ **4. Administration et RH**

#### Gestion des Offres (Admin)
- [ ] Liste des offres avec statistiques
- [ ] Création nouvelle offre avec tous les champs
- [ ] Modification offre existante
- [ ] Activation/désactivation offres
- [ ] Suppression offre (soft delete)

#### Gestion des Candidatures
- [ ] Liste complète des candidatures
- [ ] Filtres par statut, poste, date
- [ ] Recherche par nom candidat
- [ ] Modification statut candidature
- [ ] Ajout de notes internes
- [ ] **Export CSV**: Téléchargement fonctionnel
- [ ] Pagination des résultats

#### Système de Scoring
- [ ] Top 10 candidats automatique
- [ ] Attribution candidats à recruteur
- [ ] Notation manuelle par recruteur
- [ ] Calcul score final (60% auto + 40% manuel)
- [ ] Top 3 final après notation

#### Gestion RH
- [ ] Dashboard RH avec KPIs
- [ ] Création fiche de paie
- [ ] Calculs automatiques (brut, net, charges)
- [ ] Génération PDF bulletin (simulation)
- [ ] Envoi email bulletin (simulation)
- [ ] Gestion des employés
- [ ] Gestion des congés

---

### 📁 **5. Upload et Gestion de Documents**

#### Upload
- [ ] Interface upload intuitive
- [ ] Validation type fichier (PDF, DOC, DOCX)
- [ ] Validation taille fichier (max 5MB)
- [ ] Barre de progression upload
- [ ] Message de confirmation

#### Stockage et Accès
- [ ] Fichiers sauvegardés avec ACL appropriées
- [ ] Métadonnées enregistrées en base
- [ ] Documents accessibles depuis l'interface candidat
- [ ] Documents accessibles depuis l'interface admin
- [ ] Sécurité: accès restreint au propriétaire

---

### 🎯 **6. Processus d'Onboarding**

#### Candidat
- [ ] Accès au processus d'onboarding
- [ ] Visualisation des étapes
- [ ] Marquage étapes comme terminées
- [ ] Progression calculée automatiquement
- [ ] Achievements débloqués
- [ ] Calendrier d'événements
- [ ] Feedback sur l'expérience

#### Admin/RH
- [ ] Création processus d'onboarding
- [ ] Gestion des étapes
- [ ] Attribution à un candidat
- [ ] Suivi de la progression
- [ ] Analytics d'onboarding

---

### 📊 **7. Analytics et Dashboards**

#### Dashboard Admin
- [ ] KPIs généraux (candidatures, offres, utilisateurs)
- [ ] Graphiques candidatures par statut
- [ ] Évolution mensuelle
- [ ] Répartition par type de contrat
- [ ] Candidatures récentes
- [ ] Actions rapides fonctionnelles

#### Dashboard Candidat
- [ ] Statistiques personnelles
- [ ] Candidatures récentes
- [ ] Progression profil
- [ ] Timeline de candidature

#### Dashboard RH
- [ ] Métriques RH
- [ ] Employés actifs
- [ ] Fiches de paie en attente
- [ ] Demandes de congés

---

### 🔗 **8. Navigation et URLs**

#### Routes Publiques
- [ ] `/` → Page d'accueil
- [ ] `/login` → Connexion candidat
- [ ] `/admin/login` → Connexion admin
- [ ] `/dev-login` → DevLogin (dev seulement)

#### Routes Candidat
- [ ] `/` → Dashboard candidat
- [ ] `/profile` → Profil
- [ ] `/applications` → Mes candidatures
- [ ] `/candidate-onboarding` → Onboarding
- [ ] `/achievements` → Mes achievements
- [ ] `/onboarding-calendar` → Calendrier

#### Routes Admin/RH
- [ ] `/admin` → Dashboard admin
- [ ] `/admin/jobs` → Gestion offres
- [ ] `/admin/applications` → Gestion candidatures
- [ ] `/admin/users` → Gestion utilisateurs (admin seulement)
- [ ] `/admin/payroll` → Gestion paie
- [ ] `/admin/assignment` → Attribution candidats
- [ ] `/admin/scoring` → Notation candidats
- [ ] `/admin/final-results` → Top 3 final

#### Gestion d'Erreurs
- [ ] **404**: Pages inexistantes → Message d'erreur clair
- [ ] **403**: Accès refusé → Redirection appropriée
- [ ] **500**: Erreurs serveur → Message utilisateur
- [ ] **401**: Non connecté → Redirection vers login

---

### 🗄️ **9. Base de Données et APIs**

#### Endpoints Critiques
- [ ] `GET /api/jobs` → Liste des offres avec filtres
- [ ] `POST /api/applications` → Création candidature
- [ ] `GET /api/applications` → Candidatures utilisateur
- [ ] `GET /api/admin/applications` → Toutes candidatures (admin)
- [ ] `POST /api/admin/jobs` → Création offre (admin)
- [ ] `GET /api/users` → Liste utilisateurs (admin)

#### Validation des Données
- [ ] Schémas Zod appliqués
- [ ] Messages d'erreur explicites
- [ ] Codes HTTP appropriés
- [ ] Gestion des cas limites

#### Données de Test
- [ ] 10 offres d'emploi variées
- [ ] 6 candidats avec profils complets
- [ ] 12 candidatures avec statuts différents
- [ ] 4 comptes administrateurs
- [ ] 2 employés avec contrats
- [ ] 4 fiches de paie
- [ ] Documents de test accessibles

---

### 🎨 **10. Interface Utilisateur**

#### Design et UX
- [ ] Interface cohérente sur toutes les pages
- [ ] Responsive design (mobile/desktop)
- [ ] Loading states appropriés
- [ ] Messages de feedback utilisateur
- [ ] Navigation intuitive

#### Composants
- [ ] Boutons tous cliquables et réactifs
- [ ] Formulaires avec validation temps réel
- [ ] Modales s'ouvrent/ferment correctement
- [ ] Tableaux avec tri et pagination
- [ ] Graphiques s'affichent correctement

#### Accessibilité
- [ ] Attributs `data-testid` sur éléments critiques
- [ ] Contrastes de couleurs suffisants
- [ ] Navigation au clavier possible
- [ ] Messages d'erreur lisibles

---

## 🚨 **Tests d'Intégration Critiques**

### **Scénario 1: Candidature End-to-End**
1. [ ] Candidat visite page d'accueil
2. [ ] Utilise filtres pour trouver offre
3. [ ] Se connecte avec compte test
4. [ ] Postule avec upload CV + lettre
5. [ ] Candidature apparaît dans son dashboard
6. [ ] Admin voit la candidature
7. [ ] Admin change le statut
8. [ ] Candidat voit la mise à jour

### **Scénario 2: Gestion Admin Complète**
1. [ ] Admin se connecte
2. [ ] Crée nouvelle offre d'emploi
3. [ ] Consulte candidatures reçues
4. [ ] Filtre et recherche candidatures
5. [ ] Modifie statut et ajoute notes
6. [ ] Exporte données en CSV
7. [ ] Gère les utilisateurs

### **Scénario 3: Processus RH**
1. [ ] RH accède au dashboard
2. [ ] Consulte les employés
3. [ ] Crée fiche de paie
4. [ ] Génère PDF (simulation)
5. [ ] Gère demande de congés
6. [ ] Consulte analytics

---

## 🔧 **Tests Techniques**

### Performance
- [ ] Temps de chargement < 3 secondes
- [ ] Upload fichiers < 30 secondes
- [ ] Recherche réactive < 1 seconde
- [ ] Navigation fluide

### Compatibilité
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (si possible)
- [ ] Mobile responsive

### Robustesse
- [ ] Gestion perte connexion réseau
- [ ] Gestion erreurs serveur
- [ ] Validation côté client et serveur
- [ ] Pas d'erreurs JavaScript console

---

## 📋 **Rapport de Test**

### Informations de Test
- **Date**: _______________
- **Testeur**: _______________
- **Version**: _______________
- **Environnement**: _______________

### Résultats
- **✅ Tests réussis**: _____ / _____
- **❌ Tests échoués**: _____ / _____
- **⚠️ Points d'attention**: _____ / _____

### Problèmes Identifiés
```
[À compléter pendant les tests]

Exemple:
- Upload parfois lent sur mobile
- Filtre par salaire ne fonctionne pas
- Erreur 500 sur création utilisateur
```

### Actions Correctives
```
[À compléter selon les résultats]

Exemple:
- Optimiser upload pour mobile
- Corriger filtre salaire
- Déboguer création utilisateur
```

---

## 🚀 **Validation Finale**

### Critères d'Acceptation
- [ ] **Tous les flows critiques** fonctionnent sans erreur
- [ ] **Upload de documents** opérationnel
- [ ] **Filtres et recherche** réactifs et précis
- [ ] **Données de test** visibles et cohérentes
- [ ] **DevLogin sécurisé** et auditable
- [ ] **Export CSV** génère un fichier valide
- [ ] **Responsive design** sur mobile et desktop
- [ ] **Performance** acceptable (< 3s)

### Prêt pour Présentation
- [ ] **Base de données** peuplée avec données de test
- [ ] **Tous les comptes** de test fonctionnent
- [ ] **Documentation** à jour et complète
- [ ] **Procédure de déploiement** testée
- [ ] **Plan de rollback** documenté

---

## 📞 **Support et Dépannage**

### En cas de problème
1. **Vérifier les logs**: `journalctl -u aerorecrut -f`
2. **Tester la DB**: `psql $DATABASE_URL -c "SELECT 1;"`
3. **Vérifier les variables**: `env | grep -E "(DATABASE|DEV_LOGIN|SESSION)"`
4. **Redémarrer**: `systemctl restart aerorecrut`

### Contacts
- **Développeur**: Mohamed
- **Documentation**: README.md + guides
- **Logs**: `/var/log/nginx/` + `journalctl`

---

**🎯 Application validée et prête pour la présentation !**

*Checklist complétée le: _______________*