
import React from 'react';

const Footer: React.FC = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '5519987152050';
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <footer className="text-center mt-8 pb-4">
      <button
        onClick={handleWhatsAppClick}
        className="text-white/80 hover:text-white text-sm transition-colors duration-300 cursor-pointer bg-transparent border-none"
      >
        Desenvolvido por Josias da Rosa
      </button>
    </footer>
  );
};

export default Footer;
