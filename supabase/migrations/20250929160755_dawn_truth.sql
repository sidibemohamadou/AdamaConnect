-- =====================================================
-- SEED DATA POUR DÉMONSTRATION - AeroRecrutement
-- =====================================================
-- Ce fichier contient toutes les données de test pour la présentation
-- À importer via pgAdmin ou psql

-- Nettoyage des données existantes (optionnel)
-- TRUNCATE TABLE applications, jobs, users CASCADE;

-- =====================================================
-- 1. UTILISATEURS DE TEST
-- =====================================================

-- Super Administrateur
INSERT INTO users (id, email, password, first_name, last_name, role, profile_completed, phone, created_at) VALUES
('admin-mohamed-001', 'mohamed.admin@aerorecrut.com', '$2a$12$LQv3c1yqBwlVHpPRLEeOiOehsxTtnkPEjy/oiWS64zIpqk8bm/PJ6', 'Mohamed', 'Administrateur', 'admin', true, '+221 77 123 45 67', NOW()),
('hr-marie-001', 'marie.rh@aerorecrut.com', '$2a$12$LQv3c1yqBwlVHpPRLEeOiOehsxTtnkPEjy/oiWS64zIpqk8bm/PJ6', 'Marie', 'Martin', 'hr', true, '+221 77 234 56 78', NOW()),
('recruiter-pierre-001', 'pierre.recruteur@aerorecrut.com', '$2a$12$LQv3c1yqBwlVHpPRLEeOiOehsxTtnkPEjy/oiWS64zIpqk8bm/PJ6', 'Pierre', 'Durand', 'recruiter', true, '+221 77 345 67 89', NOW()),
('manager-sophie-001', 'sophie.manager@aerorecrut.com', '$2a$12$LQv3c1yqBwlVHpPRLEeOiOehsxTtnkPEjy/oiWS64zIpqk8bm/PJ6', 'Sophie', 'Bernard', 'manager', true, '+221 77 456 78 90', NOW());

-- Candidats de test avec profils complets
INSERT INTO users (id, email, password, first_name, last_name, role, profile_completed, phone, gender, marital_status, address, residence_place, id_document_type, id_document_number, birth_date, birth_place, birth_country, nationality, employee_id, created_at) VALUES
('candidate-jean-001', 'jean.dupont@example.com', '$2a$12$LQv3c1yqBwlVHpPRLEeOiOehsxTtnkPEjy/oiWS64zIpqk8bm/PJ6', 'Jean', 'Dupont', 'candidate', true, '+221 77 567 89 01', 'Homme', 'Célibataire', 'Rue 15, Plateau, Dakar', 'Dakar', 'CNI', 'SN1234567890123', '1995-03-15', 'Dakar', 'Sénégal', 'Sénégalaise', 'EMPJD240115', NOW() - INTERVAL '30 days'),
('candidate-fatou-002', 'fatou.fall@example.com', '$2a$12$LQv3c1yqBwlVHpPRLEeOiOehsxTtnkPEjy/oiWS64zIpqk8bm/PJ6', 'Fatou', 'Fall', 'candidate', true, '+221 77 678 90 12', 'Femme', 'Mariée', 'Cité Keur Gorgui, Dakar', 'Dakar', 'CNI', 'SN2345678901234', '1992-07-22', 'Thiès', 'Sénégal', 'Sénégalaise', 'EMPFF240116', NOW() - INTERVAL '25 days'),
('candidate-amadou-003', 'amadou.ba@example.com', '$2a$12$LQv3c1yqBwlVHpPRLEeOiOehsxTtnkPEjy/oiWS64zIpqk8bm/PJ6', 'Amadou', 'Ba', 'candidate', true, '+221 77 789 01 23', 'Homme', 'Célibataire', 'Médina, Dakar', 'Dakar', 'Passeport', 'SN3456789012345', '1990-11-08', 'Saint-Louis', 'Sénégal', 'Sénégalaise', 'EMPAB240117', NOW() - INTERVAL '20 days'),
('candidate-aissatou-004', 'aissatou.diop@example.com', '$2a$12$LQv3c1yqBwlVHpPRLEeOiOehsxTtnkPEjy/oiWS64zIpqk8bm/PJ6', 'Aissatou', 'Diop', 'candidate', true, '+221 77 890 12 34', 'Femme', 'Divorcée', 'Parcelles Assainies, Dakar', 'Dakar', 'CNI', 'SN4567890123456', '1988-05-12', 'Kaolack', 'Sénégal', 'Sénégalaise', 'EMPAD240118', NOW() - INTERVAL '15 days'),
('candidate-moussa-005', 'moussa.sow@example.com', '$2a$12$LQv3c1yqBwlVHpPRLEeOiOehsxTtnkPEjy/oiWS64zIpqk8bm/PJ6', 'Moussa', 'Sow', 'candidate', true, '+221 77 901 23 45', 'Homme', 'Marié', 'Guédiawaye, Dakar', 'Dakar', 'CNI', 'SN5678901234567', '1993-09-30', 'Ziguinchor', 'Sénégal', 'Sénégalaise', 'EMPMS240119', NOW() - INTERVAL '10 days'),
('candidate-mariama-006', 'mariama.kane@example.com', '$2a$12$LQv3c1yqBwlVHpPRLEeOiOehsxTtnkPEjy/oiWS64zIpqk8bm/PJ6', 'Mariama', 'Kane', 'candidate', true, '+221 77 012 34 56', 'Femme', 'Célibataire', 'Liberté 6, Dakar', 'Dakar', 'CNI', 'SN6789012345678', '1996-01-18', 'Tambacounda', 'Sénégal', 'Sénégalaise', 'EMPMK240120', NOW() - INTERVAL '5 days');

-- =====================================================
-- 2. OFFRES D'EMPLOI DIVERSIFIÉES
-- =====================================================

INSERT INTO jobs (id, title, company, location, description, requirements, salary, contract_type, experience_level, skills, is_active, created_at) VALUES
(1, 'Agent de Sûreté Aéroportuaire', 'Aéroport International Blaise Diagne', 'AIBD, Diass, Sénégal', 'Poste d''agent de sûreté pour la surveillance et contrôle des passagers et bagages. Formation sécurité fournie par l''entreprise. Travail en équipe dans un environnement international.', 'Baccalauréat minimum, casier judiciaire vierge, aptitude physique, maîtrise du français et notions d''anglais', '180 000 - 250 000 FCFA', 'CDI', 'Débutant', ARRAY['Sécurité', 'Surveillance', 'Communication', 'Anglais'], 1, NOW() - INTERVAL '45 days'),

(2, 'Hôtesse de l''Air / Steward', 'Air Sénégal', 'Aéroport LSS, Dakar', 'Service passagers en cabine, sécurité des vols, assistance clientèle. Formation complète assurée par la compagnie. Voyages internationaux réguliers.', 'Bac+2 minimum, taille minimum 1m60, maîtrise parfaite anglais/français, présentation soignée, aptitude au service', '400 000 - 600 000 FCFA', 'CDI', 'Débutant', ARRAY['Service Client', 'Anglais', 'Sécurité Aérienne', 'Communication'], 1, NOW() - INTERVAL '40 days'),

(3, 'Technicien Maintenance Aéronautique', 'Sénégal Airlines Maintenance', 'Aéroport LSS, Dakar', 'Maintenance préventive et curative des aéronefs. Inspection, réparation et certification des équipements. Respect strict des procédures de sécurité.', 'BTS Maintenance Aéronautique ou équivalent, certification EASA Part-66, expérience sur Airbus/Boeing souhaitée', '350 000 - 500 000 FCFA', 'CDI', 'Intermédiaire', ARRAY['Maintenance', 'Mécanique', 'Certification EASA', 'Aéronautique'], 1, NOW() - INTERVAL '35 days'),

(4, 'Contrôleur Aérien Junior', 'ASECNA Sénégal', 'Tour de Contrôle, Aéroport LSS', 'Contrôle du trafic aérien, coordination des vols, communication avec les pilotes. Formation spécialisée de 18 mois incluse.', 'Bac+2 scientifique, excellente maîtrise anglais technique, aptitude au stress, vue et audition parfaites', '500 000 - 700 000 FCFA', 'CDI', 'Débutant', ARRAY['Contrôle Aérien', 'Anglais Technique', 'Communication Radio', 'Gestion Stress'], 1, NOW() - INTERVAL '30 days'),

(5, 'Agent d''Escale Aéroportuaire', 'Dakar Dem Dikk Aviation Services', 'Aéroport LSS, Dakar', 'Accueil passagers, enregistrement, gestion bagages, coordination avec les équipes au sol. Interface entre passagers et compagnies aériennes.', 'Baccalauréat, maîtrise français/anglais, sens du service client, disponibilité horaires variables', '200 000 - 280 000 FCFA', 'CDI', 'Débutant', ARRAY['Service Client', 'Anglais', 'Informatique', 'Gestion Stress'], 1, NOW() - INTERVAL '25 days'),

(6, 'Responsable Sécurité Aéroportuaire', 'Société de Sécurité Aéroportuaire du Sénégal', 'AIBD, Diass', 'Supervision des équipes de sécurité, mise en place des procédures, formation du personnel, liaison avec les autorités.', 'Bac+3 sécurité ou équivalent, 5+ ans expérience sécurité, leadership, connaissance réglementation OACI', '600 000 - 850 000 FCFA', 'CDI', 'Senior', ARRAY['Management', 'Sécurité', 'Formation', 'Réglementation OACI'], 1, NOW() - INTERVAL '20 days'),

(7, 'Développeur Full Stack', 'DigiTech Solutions', 'Plateau, Dakar', 'Développement d''applications web et mobiles pour le secteur aéroportuaire. Stack moderne React/Node.js. Projets innovants.', 'Bac+3 informatique, 2+ ans expérience développement web, maîtrise JavaScript/TypeScript, bases de données', '450 000 - 750 000 FCFA', 'CDI', 'Intermédiaire', ARRAY['React', 'Node.js', 'JavaScript', 'TypeScript', 'PostgreSQL'], 1, NOW() - INTERVAL '15 days'),

(8, 'Chef de Projet Logistique Aéroportuaire', 'West Africa Logistics', 'Zone Cargo, Aéroport LSS', 'Gestion des opérations cargo, coordination avec les transitaires, optimisation des flux logistiques aéroportuaires.', 'Master logistique/transport, 3+ ans expérience cargo aérien, maîtrise anglais, leadership', '550 000 - 800 000 FCFA', 'CDI', 'Senior', ARRAY['Logistique', 'Management', 'Cargo Aérien', 'Anglais'], 1, NOW() - INTERVAL '10 days'),

(9, 'Mécanicien Équipements Sol', 'Ground Support Equipment Sénégal', 'Aéroport LSS, Dakar', 'Maintenance des équipements de piste : passerelles, tracteurs, groupes électrogènes, équipements de dégivrage.', 'CAP/BEP mécanique, expérience équipements industriels, permis de conduire, disponibilité 24h/24', '250 000 - 350 000 FCFA', 'CDI', 'Intermédiaire', ARRAY['Mécanique', 'Hydraulique', 'Électricité', 'Maintenance'], 1, NOW() - INTERVAL '8 days'),

(10, 'Analyste Données Trafic Aérien', 'ASECNA Analytics', 'Siège ASECNA, Dakar', 'Analyse des données de trafic aérien, reporting, optimisation des capacités, études prévisionnelles pour l''aviation civile.', 'Master statistiques/data science, maîtrise Python/R, expérience aviation souhaitée, anglais technique', '400 000 - 600 000 FCFA', 'CDI', 'Intermédiaire', ARRAY['Data Science', 'Python', 'Statistiques', 'Aviation', 'Anglais'], 1, NOW() - INTERVAL '5 days');

-- =====================================================
-- 3. CANDIDATURES AVEC MÉTADONNÉES DE DOCUMENTS
-- =====================================================

INSERT INTO applications (id, user_id, job_id, status, cover_letter, cv_path, motivation_letter_path, availability, salary_expectation, phone, assigned_recruiter, auto_score, manual_score, score_notes, created_at) VALUES

-- Candidatures pour Agent de Sûreté (Job ID 1)
(1, 'candidate-jean-001', 1, 'pending', 'Passionné par la sécurité aéroportuaire, je souhaite contribuer à la sûreté des voyageurs. Mon sérieux et ma rigueur sont mes atouts principaux.', '/objects/uploads/cv_jean_dupont.pdf', '/objects/uploads/lm_jean_dupont.pdf', NOW() + INTERVAL '15 days', '200 000 FCFA', '+221 77 567 89 01', 'recruiter-pierre-001', 75, 78, 'Candidat sérieux, bonne présentation, motivé', NOW() - INTERVAL '28 days'),

(2, 'candidate-amadou-003', 1, 'reviewed', 'Fort de mon expérience en sécurité privée, je souhaite évoluer vers la sécurité aéroportuaire. Ma connaissance du terrain est un atout.', '/objects/uploads/cv_amadou_ba.pdf', NULL, NOW() + INTERVAL '30 days', '220 000 FCFA', '+221 77 789 01 23', 'recruiter-pierre-001', 82, 85, 'Excellente expérience sécurité, très bon candidat', NOW() - INTERVAL '25 days'),

-- Candidatures pour Hôtesse de l'Air (Job ID 2)
(3, 'candidate-fatou-002', 2, 'interview', 'Diplômée en tourisme avec une passion pour l''aviation, je rêve de devenir hôtesse de l''air pour découvrir le monde tout en servant les passagers.', '/objects/uploads/cv_fatou_fall.pdf', '/objects/uploads/lm_fatou_fall.pdf', NOW() + INTERVAL '45 days', '450 000 FCFA', '+221 77 678 90 12', 'hr-marie-001', 88, 90, 'Excellente candidate, parfait profil, recommandée pour embauche', NOW() - INTERVAL '22 days'),

(4, 'candidate-aissatou-004', 2, 'pending', 'Avec mon expérience en accueil et ma maîtrise des langues, je suis prête à relever le défi de l''aviation commerciale.', '/objects/uploads/cv_aissatou_diop.pdf', '/objects/uploads/lm_aissatou_diop.pdf', NOW() + INTERVAL '60 days', '400 000 FCFA', '+221 77 890 12 34', NULL, 79, NULL, NULL, NOW() - INTERVAL '18 days'),

-- Candidatures pour Technicien Maintenance (Job ID 3)
(5, 'candidate-moussa-005', 3, 'accepted', 'Technicien expérimenté en maintenance industrielle, je souhaite me spécialiser dans l''aéronautique. Ma rigueur technique est reconnue.', '/objects/uploads/cv_moussa_sow.pdf', '/objects/uploads/lm_moussa_sow.pdf', NOW() + INTERVAL '20 days', '400 000 FCFA', '+221 77 901 23 45', 'recruiter-pierre-001', 91, 93, 'Candidat exceptionnel, embauche immédiate recommandée', NOW() - INTERVAL '20 days'),

-- Candidatures pour Contrôleur Aérien (Job ID 4)
(6, 'candidate-mariama-006', 4, 'pending', 'Diplômée en mathématiques avec une passion pour l''aviation, je souhaite devenir contrôleuse aérienne pour contribuer à la sécurité des vols.', '/objects/uploads/cv_mariama_kane.pdf', '/objects/uploads/lm_mariama_kane.pdf', NOW() + INTERVAL '90 days', '550 000 FCFA', '+221 77 012 34 56', NULL, 85, NULL, NULL, NOW() - INTERVAL '15 days'),

-- Candidatures pour Agent d'Escale (Job ID 5)
(7, 'candidate-jean-001', 5, 'reviewed', 'Mon expérience en service client et ma polyvalence me permettront d''exceller comme agent d''escale dans cet environnement dynamique.', '/objects/uploads/cv_jean_dupont_2.pdf', NULL, NOW() + INTERVAL '10 days', '250 000 FCFA', '+221 77 567 89 01', 'hr-marie-001', 72, 75, 'Bon candidat, expérience pertinente', NOW() - INTERVAL '12 days'),

(8, 'candidate-fatou-002', 5, 'rejected', 'Intéressée par le poste d''agent d''escale pour développer mes compétences en aviation civile.', '/objects/uploads/cv_fatou_fall_2.pdf', '/objects/uploads/lm_fatou_fall_2.pdf', NOW() + INTERVAL '30 days', '280 000 FCFA', '+221 77 678 90 12', 'hr-marie-001', 65, 60, 'Profil intéressant mais manque d''expérience spécifique', NOW() - INTERVAL '10 days'),

-- Candidatures pour Développeur (Job ID 7)
(9, 'candidate-amadou-003', 7, 'interview', 'Développeur passionné avec 3 ans d''expérience, je souhaite contribuer à la digitalisation du secteur aéroportuaire sénégalais.', '/objects/uploads/cv_amadou_ba_dev.pdf', '/objects/uploads/lm_amadou_ba_dev.pdf', NOW() + INTERVAL '30 days', '600 000 FCFA', '+221 77 789 01 23', 'recruiter-pierre-001', 87, 89, 'Excellent profil technique, entretien technique prévu', NOW() - INTERVAL '8 days'),

-- Candidatures pour Chef de Projet (Job ID 8)
(10, 'candidate-aissatou-004', 8, 'pending', 'Manager expérimentée en logistique, je souhaite apporter mon expertise au secteur aéroportuaire en pleine croissance.', '/objects/uploads/cv_aissatou_diop_manager.pdf', '/objects/uploads/lm_aissatou_diop_manager.pdf', NOW() + INTERVAL '45 days', '650 000 FCFA', '+221 77 890 12 34', NULL, 83, NULL, NULL, NOW() - INTERVAL '6 days'),

-- Candidatures multiples pour montrer la diversité
(11, 'candidate-moussa-005', 9, 'reviewed', 'Mécanicien polyvalent avec 5 ans d''expérience, je maîtrise parfaitement la maintenance des équipements industriels lourds.', '/objects/uploads/cv_moussa_sow_meca.pdf', NULL, NOW() + INTERVAL '15 days', '300 000 FCFA', '+221 77 901 23 45', 'hr-marie-001', 80, 82, 'Très bonne expérience technique, candidat solide', NOW() - INTERVAL '4 days'),

(12, 'candidate-mariama-006', 10, 'pending', 'Analyste de données junior avec une formation en statistiques, passionnée par l''aviation et les nouvelles technologies.', '/objects/uploads/cv_mariama_kane_data.pdf', '/objects/uploads/lm_mariama_kane_data.pdf', NOW() + INTERVAL '60 days', '450 000 FCFA', '+221 77 012 34 56', NULL, 76, NULL, NULL, NOW() - INTERVAL '2 days');

-- =====================================================
-- 4. EMPLOYÉS (CANDIDATS DEVENUS EMPLOYÉS)
-- =====================================================

INSERT INTO employees (id, user_id, employee_number, department, position, start_date, status, created_at) VALUES
(1, 'candidate-moussa-005', 'EMPMS240119', 'Maintenance', 'Technicien Maintenance Aéronautique', '2024-01-15', 'active', NOW() - INTERVAL '15 days'),
(2, 'candidate-fatou-002', 'EMPFF240116', 'Commercial', 'Hôtesse de l''Air', '2024-01-20', 'active', NOW() - INTERVAL '10 days');

-- =====================================================
-- 5. CONTRATS
-- =====================================================

INSERT INTO contracts (id, employee_id, application_id, contract_type, start_date, trial_period_end, base_salary, currency, working_hours, vacation_days, signature_status, status, created_at) VALUES
(1, 1, 5, 'CDI', '2024-01-15', '2024-04-15', 400000, 'FCFA', 40, 25, 'signed', 'active', NOW() - INTERVAL '15 days'),
(2, 2, 3, 'CDI', '2024-01-20', '2024-04-20', 450000, 'FCFA', 35, 30, 'signed', 'active', NOW() - INTERVAL '10 days');

-- =====================================================
-- 6. FICHES DE PAIE
-- =====================================================

INSERT INTO payroll (id, employee_id, period, base_salary, bonuses, overtime, deductions, social_charges, taxes, net_salary, working_days, absence_days, status, created_by, created_at) VALUES
(1, 1, '2024-01', 400000, 50000, 0, 20000, 88000, 86000, 256000, 22, 0, 'paid', 'hr-marie-001', NOW() - INTERVAL '30 days'),
(2, 1, '2024-02', 400000, 30000, 15000, 10000, 97900, 89020, 258080, 20, 2, 'paid', 'hr-marie-001', NOW() - INTERVAL '15 days'),
(3, 2, '2024-01', 450000, 40000, 0, 15000, 107800, 95000, 272200, 22, 0, 'paid', 'hr-marie-001', NOW() - INTERVAL '25 days'),
(4, 2, '2024-02', 450000, 60000, 20000, 5000, 116600, 105800, 302600, 22, 0, 'pending', 'hr-marie-001', NOW() - INTERVAL '5 days');

-- =====================================================
-- 7. PROCESSUS D'ONBOARDING
-- =====================================================

INSERT INTO onboarding_processes (id, name, description, department, is_active, estimated_duration, created_by, created_at) VALUES
(1, 'Onboarding Standard Aviation', 'Processus d''intégration pour le personnel navigant et technique aviation', 'Aviation', true, 21, 'admin-mohamed-001', NOW() - INTERVAL '60 days'),
(2, 'Onboarding Sécurité Aéroport', 'Processus d''intégration pour les agents de sûreté aéroportuaire', 'Sécurité', true, 14, 'admin-mohamed-001', NOW() - INTERVAL '55 days'),
(3, 'Onboarding Administration', 'Processus d''intégration pour le personnel administratif', 'Administration', true, 10, 'hr-marie-001', NOW() - INTERVAL '50 days');

-- =====================================================
-- 8. ÉTAPES D'ONBOARDING
-- =====================================================

-- Étapes pour Onboarding Aviation
INSERT INTO onboarding_steps (id, process_id, step_number, title, description, category, is_required, estimated_duration, assigned_role, created_at) VALUES
(1, 1, 1, 'Accueil et Présentation', 'Accueil du nouveau collaborateur, présentation de l''équipe et visite des installations', 'administrative', true, 4, 'hr', NOW() - INTERVAL '60 days'),
(2, 1, 2, 'Formation Sécurité Aérienne', 'Formation obligatoire sur les procédures de sécurité aérienne et les protocoles d''urgence', 'formation', true, 16, 'security', NOW() - INTERVAL '60 days'),
(3, 1, 3, 'Certification IATA', 'Obtention des certifications IATA requises pour le personnel aéronautique', 'technique', true, 24, 'admin', NOW() - INTERVAL '60 days'),
(4, 1, 4, 'Remise Équipements', 'Remise des équipements de travail, uniformes et badges d''accès', 'administrative', true, 2, 'hr', NOW() - INTERVAL '60 days'),

-- Étapes pour Onboarding Sécurité
(5, 2, 1, 'Formation Réglementation', 'Formation sur la réglementation de sûreté aéroportuaire nationale et internationale', 'formation', true, 12, 'security', NOW() - INTERVAL '55 days'),
(6, 2, 2, 'Habilitation Sécurité', 'Obtention de l''habilitation préfectorale pour accès zones sécurisées', 'administrative', true, 8, 'admin', NOW() - INTERVAL '55 days'),
(7, 2, 3, 'Formation Pratique', 'Formation pratique sur les équipements de détection et procédures de contrôle', 'technique', true, 16, 'security', NOW() - INTERVAL '55 days'),

-- Étapes pour Onboarding Administration
(8, 3, 1, 'Présentation Services', 'Présentation des différents services et départements de l''organisation', 'administrative', true, 4, 'hr', NOW() - INTERVAL '50 days'),
(9, 3, 2, 'Formation Outils', 'Formation sur les outils informatiques et logiciels métier', 'technique', true, 8, 'admin', NOW() - INTERVAL '50 days'),
(10, 3, 3, 'Intégration Équipe', 'Intégration dans l''équipe et définition des objectifs', 'administrative', true, 4, 'manager', NOW() - INTERVAL '50 days');

-- =====================================================
-- 9. ONBOARDING CANDIDATS
-- =====================================================

INSERT INTO candidate_onboarding (id, user_id, process_id, application_id, status, start_date, expected_completion_date, assigned_mentor, progress, notes, created_by, created_at) VALUES
(1, 'candidate-moussa-005', 1, 5, 'in_progress', '2024-01-15', '2024-02-05', 'hr-marie-001', 75, 'Progression excellente, très motivé', 'admin-mohamed-001', NOW() - INTERVAL '15 days'),
(2, 'candidate-fatou-002', 1, 3, 'completed', '2024-01-20', '2024-02-10', 'hr-marie-001', 100, 'Onboarding terminé avec succès, intégration parfaite', 'admin-mohamed-001', NOW() - INTERVAL '10 days'),
(3, 'candidate-jean-001', 2, 1, 'in_progress', '2024-02-01', '2024-02-15', 'recruiter-pierre-001', 60, 'Bon démarrage, formation en cours', 'hr-marie-001', NOW() - INTERVAL '5 days');

-- =====================================================
-- 10. COMPLÉTION DES ÉTAPES D'ONBOARDING
-- =====================================================

-- Étapes complétées pour Moussa (Onboarding 1)
INSERT INTO onboarding_step_completions (id, candidate_onboarding_id, step_id, status, start_date, completion_date, completed_by, notes, created_at) VALUES
(1, 1, 1, 'completed', '2024-01-15 09:00:00', '2024-01-15 13:00:00', 'hr-marie-001', 'Accueil réussi, très bonne première impression', NOW() - INTERVAL '15 days'),
(2, 1, 2, 'completed', '2024-01-16 08:00:00', '2024-01-18 17:00:00', 'admin-mohamed-001', 'Formation sécurité validée avec mention', NOW() - INTERVAL '13 days'),
(3, 1, 3, 'in_progress', '2024-01-22 09:00:00', NULL, NULL, 'Certification en cours, examens prévus la semaine prochaine', NOW() - INTERVAL '10 days'),
(4, 1, 4, 'pending', NULL, NULL, NULL, 'En attente de la fin de la certification', NOW() - INTERVAL '15 days'),

-- Étapes complétées pour Fatou (Onboarding 2) - Terminé
(5, 2, 1, 'completed', '2024-01-20 09:00:00', '2024-01-20 13:00:00', 'hr-marie-001', 'Excellent accueil, candidate très professionnelle', NOW() - INTERVAL '10 days'),
(6, 2, 2, 'completed', '2024-01-21 08:00:00', '2024-01-23 17:00:00', 'admin-mohamed-001', 'Formation sécurité excellente, résultats parfaits', NOW() - INTERVAL '8 days'),
(7, 2, 3, 'completed', '2024-01-24 09:00:00', '2024-01-26 17:00:00', 'admin-mohamed-001', 'Certification obtenue avec distinction', NOW() - INTERVAL '6 days'),
(8, 2, 4, 'completed', '2024-01-29 10:00:00', '2024-01-29 12:00:00', 'hr-marie-001', 'Équipements remis, prête pour le service', NOW() - INTERVAL '3 days'),

-- Étapes pour Jean (Onboarding 3) - En cours
(9, 3, 5, 'completed', '2024-02-01 09:00:00', '2024-02-02 17:00:00', 'admin-mohamed-001', 'Formation réglementation réussie', NOW() - INTERVAL '4 days'),
(10, 3, 6, 'in_progress', '2024-02-05 08:00:00', NULL, NULL, 'Dossier habilitation en cours de traitement', NOW() - INTERVAL '2 days'),
(11, 3, 7, 'pending', NULL, NULL, NULL, 'En attente de l''habilitation pour démarrer', NOW() - INTERVAL '5 days');

-- =====================================================
-- 11. ACHIEVEMENTS SYSTÈME
-- =====================================================

INSERT INTO onboarding_achievements (id, name, description, icon, category, criteria, points, is_active, created_at) VALUES
(1, 'Premier Pas', 'Commencer votre processus d''onboarding', 'Star', 'milestone', 'Démarrer un onboarding', 10, true, NOW() - INTERVAL '60 days'),
(2, 'Rapide comme l''Éclair', 'Terminer une étape en moins d''une heure', 'Zap', 'speed', 'Compléter une étape en moins de 60 minutes', 15, true, NOW() - INTERVAL '60 days'),
(3, 'Pilote Confirmé', 'Terminer toutes les formations obligatoires', 'Plane', 'quality', 'Compléter toutes les étapes de formation', 25, true, NOW() - INTERVAL '60 days'),
(4, 'Communicateur Expert', 'Participer activement aux discussions', 'MessageSquare', 'engagement', 'Laisser des commentaires sur 5 étapes', 20, true, NOW() - INTERVAL '60 days'),
(5, 'Gardien de la Sécurité', 'Réussir toutes les formations de sécurité', 'Shield', 'quality', 'Compléter toutes les formations sécurité avec succès', 30, true, NOW() - INTERVAL '60 days'),
(6, 'Champion de l''Onboarding', 'Terminer l''onboarding avec excellence', 'Award', 'milestone', 'Compléter un onboarding avec 100% de progression', 50, true, NOW() - INTERVAL '60 days');

-- =====================================================
-- 12. ACHIEVEMENTS UTILISATEURS
-- =====================================================

INSERT INTO user_achievements (id, user_id, achievement_id, candidate_onboarding_id, earned_at, created_at) VALUES
(1, 'candidate-moussa-005', 1, 1, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
(2, 'candidate-moussa-005', 2, 1, NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
(3, 'candidate-fatou-002', 1, 2, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
(4, 'candidate-fatou-002', 3, 2, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(5, 'candidate-fatou-002', 5, 2, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(6, 'candidate-fatou-002', 6, 2, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(7, 'candidate-jean-001', 1, 3, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

-- =====================================================
-- 13. ÉVÉNEMENTS CALENDRIER
-- =====================================================

INSERT INTO onboarding_events (id, candidate_onboarding_id, step_id, title, description, event_type, start_date_time, end_date_time, location, status, created_by, created_at) VALUES
(1, 1, 3, 'Examen Certification IATA', 'Passage de l''examen final pour la certification IATA', 'deadline', NOW() + INTERVAL '3 days 09:00:00', NOW() + INTERVAL '3 days 12:00:00', 'Centre de Formation IATA, Dakar', 'scheduled', 'hr-marie-001', NOW() - INTERVAL '10 days'),
(2, 3, 6, 'Rendez-vous Préfecture', 'Finalisation du dossier d''habilitation sécurité', 'meeting', NOW() + INTERVAL '5 days 14:00:00', NOW() + INTERVAL '5 days 16:00:00', 'Préfecture de Dakar', 'scheduled', 'recruiter-pierre-001', NOW() - INTERVAL '3 days'),
(3, 1, 4, 'Remise Équipements', 'Remise des équipements de travail et badge d''accès', 'meeting', NOW() + INTERVAL '7 days 10:00:00', NOW() + INTERVAL '7 days 11:00:00', 'Service RH, AIBD', 'scheduled', 'hr-marie-001', NOW() - INTERVAL '2 days');

-- =====================================================
-- 14. FEEDBACK D'ONBOARDING
-- =====================================================

INSERT INTO onboarding_feedback (id, candidate_onboarding_id, user_id, overall_rating, clarity, support, usefulness, comments, suggestions, would_recommend, created_at) VALUES
(1, 2, 'candidate-fatou-002', 5, 5, 4, 5, 'Excellent processus d''onboarding ! Très bien organisé et le support était fantastique. Je me sens parfaitement intégrée dans l''équipe.', 'Peut-être ajouter une session sur la culture d''entreprise en début de processus.', true, NOW() - INTERVAL '3 days'),
(2, 1, 'candidate-moussa-005', 4, 4, 5, 4, 'Bon processus dans l''ensemble. La formation technique était très complète. Le mentor assigné était très disponible et compétent.', 'La documentation pourrait être plus claire sur certains points techniques.', true, NOW() - INTERVAL '5 days');

-- =====================================================
-- 15. INVITATIONS CANDIDATS
-- =====================================================

INSERT INTO candidate_invitations (id, email, first_name, last_name, job_id, invitation_token, status, sent_by, sent_at, expires_at, personal_message, created_at) VALUES
(1, 'nouveau.candidat@example.com', 'Nouveau', 'Candidat', 1, 'inv-token-001-security', 'sent', 'recruiter-pierre-001', NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', 'Nous avons été impressionnés par votre profil et aimerions vous inviter à postuler pour notre poste d''agent de sûreté.', NOW() - INTERVAL '2 days'),
(2, 'pilote.experimente@example.com', 'Pilote', 'Expérimenté', 2, 'inv-token-002-pilot', 'opened', 'hr-marie-001', NOW() - INTERVAL '5 days', NOW() + INTERVAL '2 days', 'Votre expérience en aviation nous intéresse vivement. Nous vous invitons à découvrir nos opportunités.', NOW() - INTERVAL '5 days'),
(3, 'technicien.senior@example.com', 'Technicien', 'Senior', 3, 'inv-token-003-tech', 'completed', 'admin-mohamed-001', NOW() - INTERVAL '10 days', NOW() + INTERVAL '4 days', 'Nous recherchons un technicien de votre niveau pour rejoindre notre équipe maintenance.', NOW() - INTERVAL '10 days');

-- =====================================================
-- 16. DEMANDES DE CONGÉS
-- =====================================================

INSERT INTO leave_requests (id, employee_id, leave_type, start_date, end_date, total_days, reason, status, approved_by, approved_at, created_at) VALUES
(1, 1, 'vacation', '2024-03-15', '2024-03-22', 8, 'Congés annuels - vacances en famille', 'approved', 'hr-marie-001', NOW() - INTERVAL '5 days', NOW() - INTERVAL '10 days'),
(2, 2, 'sick', '2024-02-20', '2024-02-22', 3, 'Congé maladie - grippe', 'approved', 'hr-marie-001', NOW() - INTERVAL '3 days', NOW() - INTERVAL '8 days'),
(3, 1, 'personal', '2024-04-10', '2024-04-10', 1, 'Rendez-vous médical', 'pending', NULL, NULL, NOW() - INTERVAL '2 days');

-- =====================================================
-- 17. DEMANDES RH
-- =====================================================

INSERT INTO hr_requests (id, employee_id, request_type, title, description, priority, status, created_at) VALUES
(1, 1, 'equipment', 'Demande d''ordinateur portable', 'Besoin d''un ordinateur portable pour les déplacements techniques sur différents sites', 'normal', 'pending', NOW() - INTERVAL '3 days'),
(2, 2, 'address_change', 'Changement d''adresse', 'Déménagement vers Rufisque, mise à jour nécessaire pour les documents administratifs', 'low', 'completed', NOW() - INTERVAL '7 days'),
(3, 1, 'training', 'Formation Anglais Technique', 'Demande de formation en anglais technique aéronautique pour améliorer les compétences', 'high', 'in_progress', NOW() - INTERVAL '5 days');

-- =====================================================
-- 18. ENTRETIENS
-- =====================================================

INSERT INTO interviews (id, candidate_id, application_id, interviewer_id, interview_type, scheduled_date_time, duration, location, status, notes, created_by, created_at) VALUES
(1, 'candidate-fatou-002', 3, 'hr-marie-001', 'video', NOW() + INTERVAL '2 days 14:00:00', 60, 'Visioconférence Zoom', 'scheduled', 'Entretien RH pour validation finale', 'hr-marie-001', NOW() - INTERVAL '5 days'),
(2, 'candidate-amadou-003', 9, 'recruiter-pierre-001', 'technical', NOW() + INTERVAL '4 days 10:00:00', 90, 'Salle de réunion A, Plateau', 'scheduled', 'Entretien technique développement', 'recruiter-pierre-001', NOW() - INTERVAL '3 days'),
(3, 'candidate-moussa-005', 5, 'manager-sophie-001', 'onsite', NOW() - INTERVAL '10 days 15:00:00', 45, 'Atelier Maintenance, AIBD', 'completed', 'Entretien technique réussi, candidat retenu', 'manager-sophie-001', NOW() - INTERVAL '15 days');

-- =====================================================
-- 19. MISE À JOUR DES SÉQUENCES
-- =====================================================

-- Mise à jour des séquences pour éviter les conflits d'ID
SELECT setval('jobs_id_seq', (SELECT MAX(id) FROM jobs));
SELECT setval('applications_id_seq', (SELECT MAX(id) FROM applications));
SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees));
SELECT setval('contracts_id_seq', (SELECT MAX(id) FROM contracts));
SELECT setval('payroll_id_seq', (SELECT MAX(id) FROM payroll));
SELECT setval('leave_requests_id_seq', (SELECT MAX(id) FROM leave_requests));
SELECT setval('hr_requests_id_seq', (SELECT MAX(id) FROM hr_requests));
SELECT setval('onboarding_processes_id_seq', (SELECT MAX(id) FROM onboarding_processes));
SELECT setval('onboarding_steps_id_seq', (SELECT MAX(id) FROM onboarding_steps));
SELECT setval('candidate_onboarding_id_seq', (SELECT MAX(id) FROM candidate_onboarding));
SELECT setval('onboarding_step_completions_id_seq', (SELECT MAX(id) FROM onboarding_step_completions));
SELECT setval('onboarding_achievements_id_seq', (SELECT MAX(id) FROM onboarding_achievements));
SELECT setval('user_achievements_id_seq', (SELECT MAX(id) FROM user_achievements));
SELECT setval('onboarding_events_id_seq', (SELECT MAX(id) FROM onboarding_events));
SELECT setval('onboarding_feedback_id_seq', (SELECT MAX(id) FROM onboarding_feedback));
SELECT setval('candidate_invitations_id_seq', (SELECT MAX(id) FROM candidate_invitations));
SELECT setval('interviews_id_seq', (SELECT MAX(id) FROM interviews));

-- =====================================================
-- 20. VÉRIFICATION DES DONNÉES INSÉRÉES
-- =====================================================

-- Comptes utilisateurs
SELECT 'UTILISATEURS' as table_name, role, COUNT(*) as count FROM users GROUP BY role
UNION ALL
-- Offres d'emploi
SELECT 'JOBS' as table_name, contract_type, COUNT(*) FROM jobs GROUP BY contract_type
UNION ALL
-- Candidatures
SELECT 'APPLICATIONS' as table_name, status, COUNT(*) FROM applications GROUP BY status
UNION ALL
-- Employés
SELECT 'EMPLOYEES' as table_name, status, COUNT(*) FROM employees GROUP BY status
UNION ALL
-- Onboarding
SELECT 'ONBOARDING' as table_name, status, COUNT(*) FROM candidate_onboarding GROUP BY status;

-- =====================================================
-- NOTES D'UTILISATION
-- =====================================================

/*
COMPTES DE CONNEXION POUR LA DÉMONSTRATION :

🔐 SUPER ADMIN (Mohamed)
Email: mohamed.admin@aerorecrut.com
Mot de passe: admin123
Accès: Toutes les fonctionnalités

👥 RH (Marie)
Email: marie.rh@aerorecrut.com  
Mot de passe: admin123
Accès: Gestion RH, paie, employés

🎯 RECRUTEUR (Pierre)
Email: pierre.recruteur@aerorecrut.com
Mot de passe: admin123
Accès: Gestion candidatures, entretiens

👔 MANAGER (Sophie)
Email: sophie.manager@aerorecrut.com
Mot de passe: admin123
Accès: Gestion équipe, évaluations

👤 CANDIDATS DE TEST
Email: jean.dupont@example.com | Mot de passe: candidate123
Email: fatou.fall@example.com | Mot de passe: candidate123
Email: amadou.ba@example.com | Mot de passe: candidate123
Email: aissatou.diop@example.com | Mot de passe: candidate123
Email: moussa.sow@example.com | Mot de passe: candidate123
Email: mariama.kane@example.com | Mot de passe: candidate123

DONNÉES CRÉÉES :
- 10 offres d'emploi variées (aviation, sécurité, tech, logistique)
- 12 candidatures avec différents statuts
- 6 candidats avec profils complets
- 2 employés actifs avec contrats
- 4 fiches de paie (2 payées, 1 en attente)
- 3 processus d'onboarding avec étapes
- 6 achievements système
- 7 achievements utilisateur
- 3 entretiens planifiés/terminés
- 3 invitations candidats
- 3 demandes de congés
- 3 demandes RH

FICHIERS DE TEST À CRÉER :
Créer le dossier uploads/ avec des fichiers PDF de test :
- cv_jean_dupont.pdf, lm_jean_dupont.pdf
- cv_fatou_fall.pdf, lm_fatou_fall.pdf
- cv_amadou_ba.pdf, lm_amadou_ba.pdf
- cv_aissatou_diop.pdf, lm_aissatou_diop.pdf
- cv_moussa_sow.pdf, lm_moussa_sow.pdf
- cv_mariama_kane.pdf, lm_mariama_kane.pdf
*/