const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'generated_images')));

// Créer le dossier pour les images générées
const imagesDir = path.join(__dirname, 'generated_images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Store des tâches de génération
const tasks = new Map();

// Fonction pour générer une image avec Python/diffusers
function generateImageWithPython(prompt, steps, guidanceScale) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'generate_image.py');
    const python = spawn('python', [pythonScript, prompt, steps, guidanceScale]);
    
    let output = '';
    let error = '';
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    python.on('close', (code) => {
      if (code === 0) {
        const lines = output.trim().split('\n');
        const imagePath = lines[lines.length - 1]; // Dernière ligne = chemin de l'image
        resolve(imagePath);
      } else {
        reject(new Error(`Python script failed: ${error}`));
      }
    });
  });
}

// Endpoint pour générer une image
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, steps = 4, guidance_scale = 0.0 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const taskId = uuidv4();
    
    // Initialiser la tâche
    tasks.set(taskId, {
      status: 'processing',
      prompt,
      steps,
      guidance_scale,
      createdAt: new Date()
    });

    // Retourner immédiatement le taskId
    res.json({
      taskId,
      status: 'processing',
      message: 'Image generation started'
    });

    // Générer l'image en arrière-plan
    try {
      const imagePath = await generateImageWithPython(prompt, steps, guidance_scale);
      const imageUrl = `/images/${path.basename(imagePath)}`;
      
      tasks.set(taskId, {
        ...tasks.get(taskId),
        status: 'completed',
        imageUrl,
        imagePath,
        completedAt: new Date()
      });
    } catch (error) {
      console.error('Error generating image:', error);
      tasks.set(taskId, {
        ...tasks.get(taskId),
        status: 'error',
        error: error.message,
        completedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error in generate endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint pour vérifier le statut d'une tâche
app.get('/api/status/:taskId', (req, res) => {
  const { taskId } = req.params;
  const task = tasks.get(taskId);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.json(task);
});

// Endpoint pour récupérer une image générée
app.get('/api/image/:taskId', (req, res) => {
  const { taskId } = req.params;
  const task = tasks.get(taskId);
  
  if (!task || task.status !== 'completed') {
    return res.status(404).json({ error: 'Image not found or not ready' });
  }
  
  if (task.imageUrl.startsWith('http')) {
    // Rediriger vers l'URL externe
    res.redirect(task.imageUrl);
  } else {
    // Servir le fichier local
    res.sendFile(task.imageUrl);
  }
});

// Endpoint pour télécharger une image
app.get('/api/download/:taskId', (req, res) => {
  const { taskId } = req.params;
  const task = tasks.get(taskId);
  
  if (!task || task.status !== 'completed' || !task.imagePath) {
    return res.status(404).json({ error: 'Image not found or not ready' });
  }
  
  if (fs.existsSync(task.imagePath)) {
    const fileName = `generated_${taskId}.png`;
    res.download(task.imagePath, fileName);
  } else {
    res.status(404).json({ error: 'Image file not found' });
  }
});

// Endpoint pour lister les tâches récentes
app.get('/api/tasks', (req, res) => {
  const recentTasks = Array.from(tasks.entries())
    .map(([id, task]) => ({ id, ...task }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);
  
  res.json(recentTasks);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mode: 'local'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Mode: Local processing with diffusers`);
});