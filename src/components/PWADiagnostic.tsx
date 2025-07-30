
import React, { useEffect, useState } from 'react';

interface PWARequirements {
  isHTTPS: boolean;
  hasManifest: boolean;
  hasServiceWorker: boolean;
  hasIcons: boolean;
  manifestValid: boolean;
  iconsAccessible: boolean;
}

export const usePWADiagnostic = () => {
  const [requirements, setRequirements] = useState<PWARequirements>({
    isHTTPS: false,
    hasManifest: false,
    hasServiceWorker: false,
    hasIcons: false,
    manifestValid: false,
    iconsAccessible: false
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkPWARequirements = async () => {
      console.log('PWA Diagnostic: Starting comprehensive PWA requirements check...');

      const checks: PWARequirements = {
        isHTTPS: false,
        hasManifest: false,
        hasServiceWorker: false,
        hasIcons: false,
        manifestValid: false,
        iconsAccessible: false
      };

      // Check HTTPS
      checks.isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
      console.log('PWA Diagnostic: HTTPS check:', checks.isHTTPS);

      // Check Service Worker
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          checks.hasServiceWorker = !!registration && registration.active !== null;
          console.log('PWA Diagnostic: Service Worker check:', checks.hasServiceWorker);
        } catch (error) {
          console.error('PWA Diagnostic: Service Worker check failed:', error);
        }
      }

      // Check Manifest
      try {
        const manifestResponse = await fetch('/manifest.json');
        checks.hasManifest = manifestResponse.ok;
        
        if (checks.hasManifest) {
          const manifest = await manifestResponse.json();
          checks.manifestValid = !!(
            manifest.name && 
            manifest.icons && 
            manifest.icons.length > 0 &&
            manifest.start_url
          );
          console.log('PWA Diagnostic: Manifest check:', checks.manifestValid);
        }
      } catch (error) {
        console.error('PWA Diagnostic: Manifest check failed:', error);
      }

      // Check Icons
      const iconSizes = ['16x16', '32x32', '192x192', '512x512'];
      const iconChecks = await Promise.all(
        iconSizes.map(async (size) => {
          try {
            const response = await fetch(`/icon-${size}.png`);
            return response.ok;
          } catch {
            return false;
          }
        })
      );
      
      checks.iconsAccessible = iconChecks.every(check => check);
      checks.hasIcons = iconChecks.some(check => check);
      console.log('PWA Diagnostic: Icons check:', {
        hasIcons: checks.hasIcons,
        iconsAccessible: checks.iconsAccessible,
        individual: iconSizes.map((size, i) => ({ size, accessible: iconChecks[i] }))
      });

      setRequirements(checks);
      
      const allRequirementsMet = Object.values(checks).every(Boolean);
      setIsReady(allRequirementsMet);
      
      console.log('PWA Diagnostic: Final status:', {
        requirements: checks,
        allRequirementsMet
      });
    };

    checkPWARequirements();
  }, []);

  return { requirements, isReady };
};
