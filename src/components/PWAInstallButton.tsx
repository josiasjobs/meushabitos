
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
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isWebApp = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isWebApp);
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('PWA installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Fallback for browsers that support PWA but don't fire beforeinstallprompt
    setTimeout(() => {
      if (!isInstalled && !deferredPrompt && !iOS) {
        console.log('Fallback: showing install button');
        setIsInstallable(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        
        if (result.outcome === 'accepted') {
          console.log('PWA instalado com sucesso!');
        }
        
        setDeferredPrompt(null);
        setIsInstallable(false);
      } catch (error) {
        console.error('Erro ao instalar PWA:', error);
      }
    } else if (isIOS) {
      // Show instructions for iOS
      alert('Para instalar este app no iOS:\n1. Toque no ícone de compartilhar\n2. Selecione "Adicionar à Tela de Início"');
    } else {
      // Generic fallback
      console.log('Install prompt not available, but button was shown');
    }
  };

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
