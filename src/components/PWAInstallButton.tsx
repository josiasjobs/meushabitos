
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePWADiagnostic } from './PWADiagnostic';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { requirements, isReady } = usePWADiagnostic();

  useEffect(() => {
    console.log('PWA Install Button: Component mounted');
    
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    console.log('PWA Install Button: iOS detected:', iOS);

    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isWebApp = (window.navigator as any).standalone === true;
      const installed = isStandalone || isWebApp;
      console.log('PWA Install Button: App installed status:', installed);
      setIsInstalled(installed);
      return installed;
    };

    const installed = checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Install Button: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('PWA Install Button: PWA installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Enhanced fallback logic based on PWA requirements
  useEffect(() => {
    if (isInstalled) return;

    console.log('PWA Install Button: Checking enhanced fallback conditions...');
    console.log('PWA Install Button: PWA Requirements:', requirements);
    console.log('PWA Install Button: PWA Ready:', isReady);
    console.log('PWA Install Button: Has deferred prompt:', !!deferredPrompt);

    // Wait for PWA diagnostic to complete
    if (!isReady) return;

    // If we have the native prompt, use it
    if (deferredPrompt) {
      setIsInstallable(true);
      return;
    }

    // Enhanced fallback conditions
    const shouldShowFallback = 
      requirements.isHTTPS && 
      requirements.hasManifest && 
      requirements.hasServiceWorker &&
      requirements.hasIcons;

    if (shouldShowFallback) {
      console.log('PWA Install Button: Showing fallback install option');
      setIsInstallable(true);
    } else {
      console.log('PWA Install Button: PWA requirements not met, hiding install button');
      console.log('PWA Install Button: Missing requirements:', {
        HTTPS: !requirements.isHTTPS,
        Manifest: !requirements.hasManifest,
        ServiceWorker: !requirements.hasServiceWorker,
        Icons: !requirements.hasIcons
      });
    }
  }, [requirements, isReady, deferredPrompt, isInstalled]);

  const handleInstall = async () => {
    console.log('PWA Install Button: Install button clicked');
    console.log('PWA Install Button: deferredPrompt available:', !!deferredPrompt);
    console.log('PWA Install Button: isIOS:', isIOS);
    
    if (deferredPrompt) {
      try {
        console.log('PWA Install Button: Calling native prompt()');
        await deferredPrompt.prompt();
        
        const result = await deferredPrompt.userChoice;
        console.log('PWA Install Button: User choice result:', result);
        
        setDeferredPrompt(null);
        setIsInstallable(false);
      } catch (error) {
        console.error('PWA Install Button: Error during native installation:', error);
      }
    } else if (isIOS) {
      // iOS instructions
      const message = `Para instalar no iPhone/iPad:

1. Toque no ícone de compartilhar (📤) 
2. Selecione "Adicionar à Tela de Início"
3. Toque em "Adicionar"

O app aparecerá na sua tela inicial!`;
      
      alert(message);
    } else {
      // Enhanced browser-specific instructions
      const userAgent = navigator.userAgent.toLowerCase();
      let instructions = '';

      if (userAgent.includes('chrome')) {
        instructions = `Chrome: Clique nos 3 pontos (⋮) → "Instalar Meus Hábitos"`;
      } else if (userAgent.includes('edge')) {
        instructions = `Edge: Clique nos 3 pontos (⋯) → "Aplicativos" → "Instalar este site como um aplicativo"`;
      } else if (userAgent.includes('firefox')) {
        instructions = `Firefox: Procure pelo ícone de instalação (+) na barra de endereços`;
      } else {
        instructions = `Procure pela opção de "Instalar aplicativo" ou "Adicionar à tela inicial" no menu do navegador`;
      }

      const message = `Para instalar este app:

${instructions}

Se não conseguir, verifique se:
• Está usando HTTPS
• O navegador suporta PWA
• Todos os recursos foram carregados`;

      alert(message);
      console.log('PWA Install Button: Showed browser-specific instructions');
    }
  };

  console.log('PWA Install Button: Render state:', {
    installed: isInstalled,
    installable: isInstallable,
    iOS: isIOS,
    pwaCriteria: isReady,
    hasPrompt: !!deferredPrompt
  });

  // Only show if app is installable and not already installed
  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <Button
      variant="default"
      size="icon"
      onClick={handleInstall}
      title={deferredPrompt ? "Instalar App (Nativo)" : "Instruções de Instalação"}
      className="gradient-primary text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
    >
      📱
    </Button>
  );
};

export default PWAInstallButton;
