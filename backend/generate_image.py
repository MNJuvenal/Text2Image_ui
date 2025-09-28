#!/usr/bin/env python3
"""
Script de génération d'images avec diffusers
Utilise le modèle SD-Turbo pour une génération rapide
"""

import sys
import os
import torch
from diffusers import AutoPipelineForText2Image
from datetime import datetime
import uuid

def generate_image(prompt, steps=4, guidance_scale=0.0):
    try:
        # Initialiser le pipeline
        print("Initialisation du pipeline SD-Turbo...", file=sys.stderr)
        pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sd-turbo",
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )
        
        # Utiliser CUDA si disponible, sinon CPU
        device = "cuda" if torch.cuda.is_available() else "cpu"
        pipe = pipe.to(device)
        print(f"Utilisation du device: {device}", file=sys.stderr)
        
        # Générer l'image
        print(f"Génération de l'image pour: '{prompt}'", file=sys.stderr)
        image = pipe(
            prompt,
            num_inference_steps=int(steps),
            guidance_scale=float(guidance_scale)
        ).images[0]
        
        # Sauvegarder l'image
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        image_id = str(uuid.uuid4())[:8]
        filename = f"image_{timestamp}_{image_id}.png"
        
        # Créer le dossier s'il n'existe pas
        output_dir = os.path.join(os.path.dirname(__file__), 'generated_images')
        os.makedirs(output_dir, exist_ok=True)
        
        image_path = os.path.join(output_dir, filename)
        image.save(image_path)
        
        print(f"Image sauvegardée: {image_path}", file=sys.stderr)
        
        # Retourner le chemin de l'image (sur stdout pour le script Node.js)
        print(image_path)
        
    except Exception as e:
        print(f"Erreur lors de la génération: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_image.py <prompt> [steps] [guidance_scale]", file=sys.stderr)
        sys.exit(1)
    
    prompt = sys.argv[1]
    steps = int(sys.argv[2]) if len(sys.argv) > 2 else 4
    guidance_scale = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
    
    generate_image(prompt, steps, guidance_scale)