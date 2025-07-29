
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
  const [isIOS, setIsIOS] = useState(false);

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

    // Check PWA requirements
    const checkPWARequirements = async () => {
      console.log('PWA Install Button: Checking PWA requirements...');
      
      // Check if HTTPS
      const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
      console.log('PWA Install Button: HTTPS:', isHTTPS);
      
      // Check if manifest exists
      try {
        const manifestResponse = await fetch('/manifest.json');
        const manifestExists = manifestResponse.ok;
        console.log('PWA Install Button: Manifest exists:', manifestExists);
      } catch (e) {
        console.log('PWA Install Button: Manifest check failed:', e);
      }
      
      // Check if service worker is registered
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        console.log('PWA Install Button: Service Worker registered:', !!registration);
      }
    };

    checkPWARequirements();

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

    // Enhanced fallback for browsers that support PWA but don't fire beforeinstallprompt
    setTimeout(() => {
      console.log('PWA Install Button: Checking fallback conditions...');
      console.log('PWA Install Button: isInstalled:', installed);
      console.log('PWA Install Button: deferredPrompt:', !!deferredPrompt);
      console.log('PWA Install Button: iOS:', iOS);
      
      if (!installed && !deferredPrompt) {
        if (iOS) {
          console.log('PWA Install Button: iOS fallback - showing install button');
          setIsInstallable(true);
        } else {
          // Check if we're in a PWA-capable browser
          const isPWACapable = 'serviceWorker' in navigator && 
                              window.matchMedia && 
                              (location.protocol === 'https:' || location.hostname === 'localhost');
          
          if (isPWACapable) {
            console.log('PWA Install Button: Browser fallback - showing install button');
            setIsInstallable(true);
          }
        }
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    console.log('PWA Install Button: Install button clicked');
    console.log('PWA Install Button: deferredPrompt available:', !!deferredPrompt);
    console.log('PWA Install Button: isIOS:', isIOS);
    
    if (deferredPrompt) {
      try {
        console.log('PWA Install Button: Calling prompt()');
        await deferredPrompt.prompt();
        
        const result = await deferredPrompt.userChoice;
        console.log('PWA Install Button: User choice result:', result);
        
        if (result.outcome === 'accepted') {
          console.log('PWA Install Button: PWA installation accepted');
        } else {
          console.log('PWA Install Button: PWA installation dismissed');
        }
        
        setDeferredPrompt(null);
        setIsInstallable(false);
      } catch (error) {
        console.error('PWA Install Button: Error during installation:', error);
      }
    } else if (isIOS) {
      // Enhanced iOS instructions
      const message = `Para instalar este app no iOS:

1. Toque no ícone de compartilhar (📤) na barra inferior
2. Role para baixo e selecione "Adicionar à Tela de Início"
3. Toque em "Adicionar" no canto superior direito

O app aparecerá na sua tela inicial como um aplicativo nativo!`;
      
      alert(message);
    } else {
      // Generic fallback with more helpful instructions
      const message = `Para instalar este app:

Chrome/Edge:
• Clique nos 3 pontos (⋮) no menu
• Selecione "Instalar Meus Hábitos"

Firefox:
• Clique no ícone de instalação na barra de endereços

Se não vê a opção, tente:
• Atualizar a página
• Verificar se está usando HTTPS
• Tentar em outro navegador`;

      alert(message);
      console.log('PWA Install Button: Showed generic install instructions');
    }
  };

  console.log('PWA Install Button: Render - installed:', isInstalled, 'installable:', isInstallable, 'iOS:', isIOS);

  // Show button if app is installable or on iOS (and not already installed)
  if (isInstalled || (!isInstallable && !isIOS)) {
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
