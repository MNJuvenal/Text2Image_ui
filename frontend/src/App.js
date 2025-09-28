import React, { useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 800px;
  width: 100%;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const ControlGroup = styled.div`
  flex: 1;
  min-width: 150px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatusCard = styled.div`
  background: ${props => {
    switch(props.status) {
      case 'processing': return '#fff3cd';
      case 'completed': return '#d4edda';
      case 'error': return '#f8d7da';
      default: return '#d1ecf1';
    }
  }};
  border: 1px solid ${props => {
    switch(props.status) {
      case 'processing': return '#ffeaa7';
      case 'completed': return '#c3e6cb';
      case 'error': return '#f5c6cb';
      default: return '#bee5eb';
    }
  }};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`;

const ImageContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const GeneratedImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  margin-bottom: 15px;
`;

const DownloadButton = styled(Button)`
  width: auto;
  margin: 0 10px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ExamplePrompts = styled.div`
  margin-top: 15px;
`;

const ExampleButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 8px 15px;
  margin: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #e9ecef;
    border-color: #667eea;
  }
`;

const HelpSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #6c757d;
`;

const HelpTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 16px;
`;

const HelpList = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

function App() {
  const [prompt, setPrompt] = useState('');
  const [steps, setSteps] = useState(4);
  const [guidanceScale, setGuidanceScale] = useState(0.0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const imageRef = useRef(null);

  const examplePrompts = [
    "un chat mignon qui joue avec une pelote de laine, style réaliste",
    "un paysage de montagne au coucher du soleil, style artistique",
    "un robot futuriste dans une ville cyberpunk",
    "une forêt enchantée avec des créatures magiques",
    "un portrait d'une personne souriante, style photographique"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Veuillez entrer une description d\'image');
      return;
    }

    setIsGenerating(true);
    setCurrentTask(null);
    setGeneratedImage(null);

    try {
      const response = await axios.post('/api/generate', {
        prompt: prompt.trim(),
        steps: parseInt(steps),
        guidance_scale: parseFloat(guidanceScale)
      });

      const { taskId, status, imageUrl } = response.data;
      
      if (status === 'completed' && imageUrl) {
        // Image générée immédiatement
        setGeneratedImage(imageUrl);
        setCurrentTask({ status: 'completed', taskId });
      } else {
        // Mode asynchrone (traitement local)
        setCurrentTask({ status, taskId });
        pollTaskStatus(taskId);
      }
    } catch (error) {
      console.error('Erreur génération:', error);
      setCurrentTask({
        status: 'error',
        error: error.response?.data?.error || 'Erreur de génération'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const pollTaskStatus = async (taskId) => {
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await axios.get(`/api/status/${taskId}`);
        const task = response.data;
        
        setCurrentTask(task);

        if (task.status === 'completed') {
          if (task.imageUrl) {
            setGeneratedImage(task.imageUrl);
          }
          return;
        } else if (task.status === 'error') {
          return;
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 5000); // Poll toutes les 5 secondes
        } else {
          setCurrentTask({
            status: 'error',
            error: 'Timeout - génération trop longue'
          });
        }
      } catch (error) {
        console.error('Erreur polling:', error);
        setCurrentTask({
          status: 'error',
          error: 'Erreur de communication avec le serveur'
        });
      }
    };

    poll();
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExampleClick = (examplePrompt) => {
    setPrompt(examplePrompt);
  };

  const getStatusMessage = () => {
    if (!currentTask) return null;

    switch (currentTask.status) {
      case 'pending':
        return 'Tâche en attente...';
      case 'processing':
        return 'Génération de l\'image en cours...';
      case 'completed':
        return 'Image générée avec succès !';
      case 'error':
        return `Erreur: ${currentTask.error}`;
      default:
        return 'Statut inconnu';
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>🎨 Générateur d'Images IA</Title>
        
        <Card>
          <InputGroup>
            <Label htmlFor="prompt">Description de l'image :</Label>
            <TextArea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Décrivez l'image que vous souhaitez générer..."
            />
            
            <ExamplePrompts>
              <small>Exemples :</small>
              <div>
                {examplePrompts.map((example, index) => (
                  <ExampleButton
                    key={index}
                    onClick={() => handleExampleClick(example)}
                  >
                    {example}
                  </ExampleButton>
                ))}
              </div>
            </ExamplePrompts>
          </InputGroup>

          <HelpSection>
            <HelpTitle>🎯 Paramètres de génération :</HelpTitle>
            <HelpList>
              <li><strong>Étapes (Steps) :</strong> Plus d'étapes = meilleure qualité mais plus lent. Pour SD-Turbo : 1-2 = rapide, 4 = optimal</li>
              <li><strong>Guidance Scale :</strong> Fidélité au prompt. 0.0 = recommandé pour SD-Turbo (pré-optimisé)</li>
            </HelpList>
          </HelpSection>

          <ControlsRow>
            <ControlGroup>
              <Label htmlFor="steps">
                Étapes (1-4) :
                <span title="Nombre d'étapes de débruitage. 1=ultra-rapide, 4=meilleure qualité (recommandé)">ℹ️</span>
              </Label>
              <Input
                id="steps"
                type="number"
                min="1"
                max="4"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />
            </ControlGroup>
            
            <ControlGroup>
              <Label htmlFor="guidance">
                Guidance Scale :
                <span title="Fidélité au prompt. 0.0=recommandé pour SD-Turbo, >1.0=risque de dégradation">ℹ️</span>
              </Label>
              <Input
                id="guidance"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(e.target.value)}
              />
            </ControlGroup>
          </ControlsRow>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? 'Génération en cours...' : 'Générer l\'image'}
          </Button>
        </Card>

        {currentTask && (
          <Card>
            <StatusCard status={currentTask.status}>
              <strong>Statut :</strong> {getStatusMessage()}
              {currentTask.status === 'processing' && <LoadingSpinner />}
            </StatusCard>
          </Card>
        )}

        {generatedImage && (
          <Card>
            <ImageContainer>
              <GeneratedImage 
                ref={imageRef}
                src={generatedImage} 
                alt="Image générée"
                onError={(e) => {
                  console.error('Erreur chargement image:', e);
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <DownloadButton onClick={handleDownload}>
                  📥 Télécharger
                </DownloadButton>
              </div>
            </ImageContainer>
          </Card>
        )}
      </Container>
    </>
  );
}

export default App;