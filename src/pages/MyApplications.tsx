import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Loader2, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const MyApplications = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setApps(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="w-4 h-4 text-eligible" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-ineligible" />;
      case 'verification': return <Eye className="w-4 h-4 text-primary" />;
      default: return <Clock className="w-4 h-4 text-warning-custom" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-xl font-heading font-bold text-foreground mb-6">My Applications</h2>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : apps.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No applications yet. Submit your first application!</div>
        ) : (
          <div className="grid gap-4">
            {apps.map((app, i) => (
              <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl p-5 card-shadow border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-foreground">{app.name}</h3>
                  <div className="flex items-center gap-2">
                    {statusIcon(app.status)}
                    <span className="text-xs font-medium capitalize">{app.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Eligibility</span>
                    <p className={`font-semibold ${app.eligibility ? 'text-eligible' : 'text-ineligible'}`}>{app.eligibility ? 'Eligible' : 'Not Eligible'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Confidence</span>
                    <p className="font-semibold text-primary">{app.confidence}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fraud Score</span>
                    <p className={`font-semibold ${app.fraud_score > 45 ? 'text-warning-custom' : 'text-eligible'}`}>{app.fraud_score}/100</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Submitted</span>
                    <p className="font-semibold text-foreground">{new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default MyApplications;
