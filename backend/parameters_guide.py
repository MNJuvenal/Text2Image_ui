#!/usr/bin/env python3
"""
Exemples des effets des paramètres steps et guidance_scale
avec Stable Diffusion Turbo
"""

# STEPS (Étapes) - Exemples d'utilisation
STEPS_EXAMPLES = {
    1: {
        "description": "Génération ultra-rapide",
        "qualité": "Basique, contours flous",
        "temps": "~2-5 secondes",
        "usage": "Prototypage rapide, prévisualisation"
    },
    2: {
        "description": "Génération rapide",
        "qualité": "Correcte, détails limités", 
        "temps": "~5-10 secondes",
        "usage": "Tests rapides, itérations"
    },
    4: {
        "description": "Génération équilibrée (RECOMMANDÉ)",
        "qualité": "Bonne qualité, détails fins",
        "temps": "~10-20 secondes", 
        "usage": "Production, résultats finaux"
    },
    8: {
        "description": "Sur-génération (non recommandé pour SD-Turbo)",
        "qualité": "Pas d'amélioration notable",
        "temps": "~20-40 secondes",
        "usage": "Éviter avec SD-Turbo"
    }
}

# GUIDANCE SCALE - Exemples d'utilisation
GUIDANCE_EXAMPLES = {
    0.0: {
        "description": "Mode libre (RECOMMANDÉ pour SD-Turbo)",
        "effet": "Le modèle génère naturellement",
        "qualité": "Optimale pour SD-Turbo",
        "prompt_influence": "Modérée mais naturelle"
    },
    1.0: {
        "description": "Guidance minimale",
        "effet": "Suit légèrement le prompt",
        "qualité": "Bonne, style naturel",
        "prompt_influence": "Faible"
    },
    7.5: {
        "description": "Guidance standard (autres modèles SD)",
        "effet": "Suit fidèlement le prompt",
        "qualité": "Peut dégrader SD-Turbo",
        "prompt_influence": "Forte"
    },
    15.0: {
        "description": "Guidance élevée (NON recommandé)",
        "effet": "Force l'adhésion au prompt",
        "qualité": "Risque d'artefacts",
        "prompt_influence": "Très forte, artificielle"
    }
}

def print_recommendations():
    print("🎯 RECOMMANDATIONS POUR SD-TURBO:")
    print("=" * 50)
    print("✅ Steps: 4 (optimal)")
    print("✅ Guidance Scale: 0.0 (pré-optimisé)")
    print("")
    print("🔄 Pour expérimenter:")
    print("• Steps 1-2: génération ultra-rapide")
    print("• Steps 3-4: meilleure qualité")
    print("• Guidance 0.0-1.0: résultats naturels")
    print("")
    print("❌ À éviter:")
    print("• Steps > 4: perte de temps")
    print("• Guidance > 2.0: dégradation qualité")

if __name__ == "__main__":
    print_recommendations()