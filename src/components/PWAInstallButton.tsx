
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    console.log('PWA Install Button: Component mounted');
    
    // Check if app is already installed
    const checkInstalled = () => {
      try {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isWebApp = (window.navigator as any).standalone === true;
        const installed = isStandalone || isWebApp;
        console.log('PWA Install Button: App installed status:', installed);
        setIsInstalled(installed);
        return installed;
      } catch (error) {
        console.error('PWA Install Button: Error checking installed status:', error);
        return false;
      }
    };

    const installed = checkInstalled();
    if (installed) return;

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

  const handleInstall = async () => {
    console.log('PWA Install Button: Install button clicked');
    
    if (deferredPrompt) {
      try {
        console.log('PWA Install Button: Calling native prompt()');
        await deferredPrompt.prompt();
        
        const result = await deferredPrompt.userChoice;
        console.log('PWA Install Button: User choice result:', result);
        
        if (result.outcome === 'accepted') {
          setIsInstalled(true);
        }
        
        setDeferredPrompt(null);
        setIsInstallable(false);
      } catch (error) {
        console.error('PWA Install Button: Error during installation:', error);
      }
    } else {
      // Fallback instructions for browsers that don't support the install prompt
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        alert(`Para instalar no iPhone/iPad:

1. Toque no ícone de compartilhar (📤) 
2. Selecione "Adicionar à Tela de Início"
3. Toque em "Adicionar"

O app aparecerá na sua tela inicial!`);
      } else {
        alert(`Para instalar este app:

Chrome: Clique nos 3 pontos (⋮) → "Instalar Meus Hábitos"
Edge: Clique nos 3 pontos (⋯) → "Aplicativos" → "Instalar este site como um aplicativo"
Firefox: Procure pelo ícone de instalação (+) na barra de endereços`);
      }
    }
  };

  console.log('PWA Install Button: Render state:', {
    installed: isInstalled,
    installable: isInstallable,
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
      title="Instalar App"
      className="gradient-primary text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
    >
      📱
    </Button>
  );
};

export default PWAInstallButton;
