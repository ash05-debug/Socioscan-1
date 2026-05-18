import { Heart } from 'lucide-react';

const Footer = () => (
  <footer className="py-6 text-center border-t border-border mt-12">
    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
      <Heart className="w-3.5 h-3.5 text-ineligible" />
      AI for Social Good — SocioScan © {new Date().getFullYear()}
    </p>
  </footer>
);

export default Footer;
