#!/usr/bin/env python3
"""
Script de test pour vérifier que diffusers fonctionne
"""

import sys
import os

def test_dependencies():
    try:
        print("Test des dépendances...")
        
        # Test torch
        import torch
        print(f"✓ PyTorch {torch.__version__} installé")
        print(f"✓ CUDA disponible: {torch.cuda.is_available()}")
        
        # Test diffusers
        from diffusers import AutoPipelineForText2Image
        print("✓ Diffusers installé")
        
        # Test transformers
        import transformers
        print(f"✓ Transformers {transformers.__version__} installé")
        
        print("\n✅ Toutes les dépendances sont installées correctement!")
        return True
        
    except ImportError as e:
        print(f"❌ Erreur d'import: {e}")
        print("\nInstallez les dépendances avec:")
        print("pip install torch diffusers transformers accelerate")
        return False

def test_model_loading():
    try:
        print("\nTest du chargement du modèle...")
        from diffusers import AutoPipelineForText2Image
        import torch
        
        pipe = AutoPipelineForText2Image.from_pretrained(
            "stabilityai/sd-turbo",
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
        )
        
        device = "cuda" if torch.cuda.is_available() else "cpu"
        pipe = pipe.to(device)
        
        print(f"✅ Modèle chargé avec succès sur {device}!")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors du chargement du modèle: {e}")
        return False

if __name__ == "__main__":
    success = test_dependencies()
    if success:
        test_model_loading()
    
    print("\n" + "="*50)
    print("Si tous les tests passent, votre environnement est prêt!")
    print("Sinon, installez les dépendances manquantes.")