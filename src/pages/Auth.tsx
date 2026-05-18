import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, LogIn, UserPlus, AlertCircle, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Auth = () => {
  const [mode, setMode] = useState<'choose' | 'login' | 'register'>('choose');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else navigate('/');
    } else {
      if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
      const { error } = await signUp(email, password, name);
      if (error) setError(error.message);
      else {
        setSuccess('Account created! You can now log in.');
        setMode('login');
      }
    }
    setLoading(false);
  };

  if (mode === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/80 via-primary to-primary/90 flex flex-col items-center justify-center p-4 text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
            <Shield className="w-4 h-4" />
            AI-Powered Welfare System
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading leading-tight mb-3">
            SocioScan
          </h1>
          <p className="text-lg font-medium mb-1">Welfare Eligibility & Fraud Detection</p>
          <p className="text-sm opacity-80 max-w-md mx-auto">
            AI-powered welfare eligibility screening. Submit, verify, and track your application — all in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={() => setMode('login')}
            variant="outline"
            className="h-12 px-8 text-base font-semibold bg-white text-primary hover:bg-white/90 border-0 rounded-full gap-2"
          >
            <Users className="w-5 h-5" />
            User Login
          </Button>
          <Button
            onClick={() => navigate('/admin-login')}
            className="h-12 px-8 text-base font-semibold bg-white/20 backdrop-blur-sm text-primary-foreground hover:bg-white/30 border border-white/30 rounded-full gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            Admin Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-header mb-3">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">SocioScan</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 card-shadow-elevated">
          <div className="flex gap-2 mb-5">
            <Button
              variant={mode === 'login' ? 'default' : 'outline'}
              className={`flex-1 ${mode === 'login' ? 'gradient-primary text-primary-foreground' : ''}`}
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            >
              <LogIn className="w-4 h-4 mr-2" />Login
            </Button>
            <Button
              variant={mode === 'register' ? 'default' : 'outline'}
              className={`flex-1 ${mode === 'register' ? 'gradient-primary text-primary-foreground' : ''}`}
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
            >
              <UserPlus className="w-4 h-4 mr-2" />Register
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-ineligible bg-ineligible-light p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-eligible bg-eligible-light p-3 rounded-lg">{success}</div>
            )}

            <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground font-semibold h-11">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </div>

        <div className="text-center mt-4">
          <Button variant="ghost" size="sm" onClick={() => setMode('choose')} className="text-muted-foreground">
            ← Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
