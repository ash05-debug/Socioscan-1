import { Shield, LogOut, User, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="gradient-header text-primary-foreground py-4 px-6">
      <div className="container mx-auto flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-heading">SocioScan</h1>
            <p className="text-[10px] text-primary-foreground/60 font-body">AI Welfare Eligibility & Fraud Detection</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-auto hidden md:flex items-center gap-2">
          {user && (
            <>
              <Link to="/application"><Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">New Application</Button></Link>
              <Link to="/my-applications"><Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">My Applications</Button></Link>
              <Link to="/documents"><Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">Documents</Button></Link>
              {isAdmin && (
                <Link to="/admin"><Button variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">Admin</Button></Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
                <LogOut className="w-4 h-4 mr-1" />Sign Out
              </Button>
            </>
          )}
          {!user && (
            <Link to="/auth"><Button size="sm" className="bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 hover:bg-primary-foreground/20">Login</Button></Link>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button className="ml-auto md:hidden text-primary-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-1 border-t border-primary-foreground/10 pt-3">
          {user ? (
            <>
              <Link to="/application" onClick={() => setMenuOpen(false)} className="text-sm text-primary-foreground/80 py-1.5">New Application</Link>
              <Link to="/my-applications" onClick={() => setMenuOpen(false)} className="text-sm text-primary-foreground/80 py-1.5">My Applications</Link>
              <Link to="/documents" onClick={() => setMenuOpen(false)} className="text-sm text-primary-foreground/80 py-1.5">Documents</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-primary-foreground/80 py-1.5">Admin</Link>}
              <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="text-sm text-primary-foreground/80 py-1.5 text-left">Sign Out</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMenuOpen(false)} className="text-sm text-primary-foreground/80 py-1.5">Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
