# Text2Image Generator

Application complète de génération d'images IA à partir de texte avec traitement local.

## 🚀 Fonctionnalités

- **Interface web intuitive** pour saisir des descriptions textuelles
- **Génération d'images IA** en temps réel avec Stable Diffusion Turbo
- **Traitement local** avec diffusers et PyTorch
- **Téléchargement des images** générées
- **API backend robuste** avec gestion d'état des tâches
- **Design responsive** et moderne

## 📁 Structure du projet

```
text2image/
├── frontend/          # Interface React.js
├── backend/           # API Node.js/Express + script Python
├── README.md
└── package.json
```

## 🛠️ Prérequis

- **Node.js** (v16+)
- **Python** (v3.8+)
- **pip** pour les dépendances Python

## 🔧 Installation

### 1. Cloner le projet
```bash
git clone <repo-url>
cd text2image
```

### 2. Installer les dépendances Node.js
```bash
# Installation globale
npm run install-all

# Ou installation manuelle
npm install
cd frontend && npm install  
cd ../backend && npm install
```

### 3. Installer les dépendances Python
```bash
cd backend
pip install -r requirements.txt
```

## 🚀 Lancement

### Mode développement (recommandé)
```bash
npm run dev
```

Cela lance simultanément :
- Frontend sur `http://localhost:3000`
- Backend sur `http://localhost:5000`

### Lancement séparé
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm start
```

## 🎯 Utilisation

1. **Ouvrez** `http://localhost:3000`
2. **Entrez** une description d'image
3. **Ajustez** les paramètres (optionnel)
4. **Cliquez** sur "Générer l'image"
5. **Attendez** la génération (peut prendre quelques minutes)
6. **Téléchargez** l'image générée

## ⚙️ Configuration

Modifiez le fichier `backend/.env` :

```env
PORT=5000
DEFAULT_STEPS=4
DEFAULT_GUIDANCE_SCALE=0.0
# PYTHON_PATH=/usr/bin/python3  # Optionnel
```

## 🎨 Modèle IA utilisé

- **Stable Diffusion Turbo** (`stabilityai/sd-turbo`)
- **Optimisé** pour la génération rapide (1-4 étapes)
- **Compatible** GPU et CPU (GPU recommandé)
- **Qualité élevée** avec temps de génération réduit

## 📝 API Endpoints

### Backend (`http://localhost:5000`)

- `POST /api/generate` - Générer une image
- `GET /api/status/:taskId` - Vérifier le statut
- `GET /api/image/:taskId` - Récupérer l'image
- `GET /api/download/:taskId` - Télécharger l'image
- `GET /api/health` - Vérification de santé

### Exemple d'utilisation API

```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "un chat mignon qui joue avec une pelote de laine",
    steps: 4,
    guidance_scale: 0.0
  })
});
```

## 🎛️ Paramètres de génération

- **Prompt** : Description textuelle de l'image
- **Steps** : Nombre d'étapes (1-4 pour SD-Turbo)
- **Guidance Scale** : Contrôle de la fidélité au prompt (0.0 recommandé pour SD-Turbo)

## 🛠️ Technologies utilisées

### Frontend
- React.js 18
- Styled Components
- Axios

### Backend  
- Node.js
- Express.js
- CORS

### IA/ML
- Python 3.8+
- Diffusers (Hugging Face)
- PyTorch
- Stable Diffusion Turbo

## 🚨 Dépannage

### Problème : Port déjà utilisé
```bash
# Changer le port dans backend/.env
PORT=5001
```

### Problème : Erreur Python
1. Vérifiez que Python est installé (`python --version`)
2. Installez les dépendances (`pip install -r backend/requirements.txt`)
3. Vérifiez les logs du backend

### Problème : Génération lente
1. Installez PyTorch avec support CUDA si vous avez une GPU
2. Réduisez le nombre d'étapes (steps) à 1-2
3. Vérifiez que votre système a assez de RAM

### Problème : Images ne se chargent pas
1. Vérifiez les logs du backend
2. Testez l'endpoint `/api/health`
3. Vérifiez que le dossier `backend/generated_images` existe

## 🔧 Optimisations

### Pour GPU (recommandé)
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### Pour CPU uniquement
Le projet fonctionne sur CPU mais sera plus lent.

## 📄 Licence

MIT License

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur le repository GitHub.## 🎛️ Paramètres de génération

- **Prompt** : Description textuelle de l'image
- **Steps** : Nombre d'étapes (1-4 pour SD-Turbo)
- **Guidance Scale** : Contrôle de la fidélité au prompt (0.0 recommandé pour SD-Turbo)

## 🛠️ Technologies utilisées

### Frontend
- React.js 18
- Styled Components
- Axios

### Backend  
- Node.js
- Express.js
- CORS
- Axios

### IA/ML
- Diffusers (Hugging Face)
- PyTorch
- Stable Diffusion Turbo

## 🚨 Dépannage

### Problème : Port déjà utilisé
```bash
# Changer le port dans backend/.env
PORT=5001
```

### Problème : Erreur Colab
1. Vérifiez que le notebook Colab est en cours d'exécution
2. Vérifiez que l'URL ngrok est correcte dans `.env`
3. Redémarrez le backend après changement de configuration

### Problème : Images ne se chargent pas
1. Vérifiez les logs du backend
2. Testez l'endpoint `/api/health`
3. Vérifiez la connexion réseau

## 📄 Licence

MIT License

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur le repository GitHub.