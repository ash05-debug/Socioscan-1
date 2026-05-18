import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ADMIN_EMAIL = 'admin@socioscan.com';
const ADMIN_PASS = 'admin123';

const AdminLogin = () => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInErr } = await signIn(email, password);
    if (signInErr) {
      if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        const { error: signUpErr } = await signUp(email, password, 'Admin');
        if (signUpErr) {
          setError('Failed to create demo admin: ' + signUpErr.message);
          setLoading(false);
          return;
        }
        const { error: retryErr } = await signIn(email, password);
        if (retryErr) {
          setError(retryErr.message);
          setLoading(false);
          return;
        }
      } else {
        setError(signInErr.message);
        setLoading(false);
        return;
      }
    }
    navigate('/admin');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in with admin credentials</p>
        </div>

        <div className="bg-card rounded-xl p-6 card-shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-foreground font-medium">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@socioscan.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-foreground font-medium">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-ineligible bg-ineligible-light p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary text-primary-foreground font-semibold h-11"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo: {ADMIN_EMAIL} / {ADMIN_PASS}
          </p>
        </div>

        <div className="text-center mt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="text-muted-foreground">
            ← Back to User Login
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
