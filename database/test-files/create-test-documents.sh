#!/bin/bash

# Script pour créer les fichiers de test pour la démonstration
# Usage: ./create-test-documents.sh

echo "📁 Création des fichiers de test pour la démonstration..."

# Créer le dossier uploads s'il n'existe pas
mkdir -p uploads/objects/uploads

# Fonction pour créer un CV de test
create_cv() {
    local name="$1"
    local filename="$2"
    
    cat > "uploads/objects/uploads/$filename" << EOF
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(CURRICULUM VITAE) Tj
0 -30 Td
($name) Tj
0 -20 Td
(Agent de Sûreté Aéroportuaire) Tj
0 -30 Td
(EXPÉRIENCE:) Tj
0 -15 Td
(- 3 ans en sécurité privée) Tj
0 -15 Td
(- Formation premiers secours) Tj
0 -15 Td
(- Maîtrise français/anglais) Tj
0 -30 Td
(FORMATION:) Tj
0 -15 Td
(- Baccalauréat série S) Tj
0 -15 Td
(- Certificat sécurité) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000526 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF
EOF
}

# Fonction pour créer une lettre de motivation de test
create_motivation_letter() {
    local name="$1"
    local filename="$2"
    local poste="$3"
    
    cat > "uploads/objects/uploads/$filename" << EOF
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 300
>>
stream
BT
/F1 12 Tf
50 750 Td
(LETTRE DE MOTIVATION) Tj
0 -30 Td
($name) Tj
0 -20 Td
(Candidature pour: $poste) Tj
0 -30 Td
(Madame, Monsieur,) Tj
0 -20 Td
(Je vous adresse ma candidature pour le poste de $poste.) Tj
0 -15 Td
(Mon expérience et ma motivation me permettront de) Tj
0 -15 Td
(contribuer efficacement à votre équipe.) Tj
0 -20 Td
(Je suis disponible pour un entretien à votre convenance.) Tj
0 -20 Td
(Cordialement,) Tj
0 -15 Td
($name) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000676 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
775
%%EOF
EOF
}

echo "📄 Création des CVs de test..."

# Créer les CVs
create_cv "Jean Dupont" "cv_jean_dupont.pdf"
create_cv "Fatou Fall" "cv_fatou_fall.pdf"
create_cv "Amadou Ba" "cv_amadou_ba.pdf"
create_cv "Aissatou Diop" "cv_aissatou_diop.pdf"
create_cv "Moussa Sow" "cv_moussa_sow.pdf"
create_cv "Mariama Kane" "cv_mariama_kane.pdf"

# Créer les CVs supplémentaires pour candidatures multiples
create_cv "Jean Dupont" "cv_jean_dupont_2.pdf"
create_cv "Fatou Fall" "cv_fatou_fall_2.pdf"
create_cv "Amadou Ba (Dev)" "cv_amadou_ba_dev.pdf"
create_cv "Aissatou Diop (Manager)" "cv_aissatou_diop_manager.pdf"
create_cv "Moussa Sow (Meca)" "cv_moussa_sow_meca.pdf"
create_cv "Mariama Kane (Data)" "cv_mariama_kane_data.pdf"

echo "✉️ Création des lettres de motivation..."

# Créer les lettres de motivation
create_motivation_letter "Jean Dupont" "lm_jean_dupont.pdf" "Agent de Sûreté"
create_motivation_letter "Fatou Fall" "lm_fatou_fall.pdf" "Hôtesse de l'Air"
create_motivation_letter "Amadou Ba" "lm_amadou_ba.pdf" "Agent de Sûreté"
create_motivation_letter "Aissatou Diop" "lm_aissatou_diop.pdf" "Hôtesse de l'Air"
create_motivation_letter "Moussa Sow" "lm_moussa_sow.pdf" "Technicien Maintenance"
create_motivation_letter "Mariama Kane" "lm_mariama_kane.pdf" "Contrôleur Aérien"

# Lettres supplémentaires
create_motivation_letter "Fatou Fall" "lm_fatou_fall_2.pdf" "Agent d'Escale"
create_motivation_letter "Amadou Ba" "lm_amadou_ba_dev.pdf" "Développeur Full Stack"
create_motivation_letter "Aissatou Diop" "lm_aissatou_diop_manager.pdf" "Chef de Projet"
create_motivation_letter "Mariama Kane" "lm_mariama_kane_data.pdf" "Analyste Données"

echo "✅ Fichiers de test créés avec succès !"
echo "📂 Emplacement: uploads/objects/uploads/"
echo "📋 Fichiers créés:"
ls -la uploads/objects/uploads/

echo ""
echo "🔧 Pour utiliser ces fichiers :"
echo "1. Copiez le dossier uploads/ dans votre répertoire de projet"
echo "2. Configurez la variable PRIVATE_OBJECT_DIR dans votre .env"
echo "3. Les chemins dans la base de données pointent vers ces fichiers"
echo ""
echo "💡 Note: Ces fichiers PDF sont des exemples basiques pour la démonstration"
echo "   En production, utilisez de vrais documents avec validation appropriée"