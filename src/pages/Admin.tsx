import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, CheckCircle2, XCircle, AlertTriangle, Eye, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

interface App {
  id: string;
  name: string;
  eligibility: boolean | null;
  fraud_score: number | null;
  anomaly_status: string | null;
  confidence: number | null;
  status: string;
  created_at: string;
  annual_income: number;
  education_level: string;
  sector: string;
  user_id: string;
}

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchApps = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('id, name, eligibility, fraud_score, anomaly_status, confidence, status, created_at, annual_income, education_level, sector, user_id')
      .order('created_at', { ascending: false });

    if (!error && data) setApps(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchApps();
  }, [isAdmin]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('applications').update({ status }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Application ${status}` });
      fetchApps();
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-warning-light text-warning-custom',
      approved: 'bg-eligible-light text-eligible',
      rejected: 'bg-ineligible-light text-ineligible',
      verification: 'bg-info-light text-primary',
    };
    return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || 'bg-muted text-muted-foreground'}`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-heading font-bold text-foreground">Admin Dashboard</h2>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({apps.length})</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="verification">Verification</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No applications found</div>
        ) : (
          <div className="bg-card rounded-xl card-shadow-elevated overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Applicant</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Eligibility</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Fraud Score</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Anomaly</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Income</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(app => (
                    <motion.tr key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{app.name}</td>
                      <td className="p-3">
                        {app.eligibility ? (
                          <span className="flex items-center gap-1 text-eligible"><CheckCircle2 className="w-4 h-4" />Eligible</span>
                        ) : (
                          <span className="flex items-center gap-1 text-ineligible"><XCircle className="w-4 h-4" />Not Eligible</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={app.fraud_score && app.fraud_score > 45 ? 'text-warning-custom font-semibold' : 'text-foreground'}>
                          {app.fraud_score ?? '-'}/100
                        </span>
                      </td>
                      <td className="p-3">
                        {app.anomaly_status === 'suspicious' ? (
                          <span className="flex items-center gap-1 text-warning-custom"><AlertTriangle className="w-4 h-4" />Suspicious</span>
                        ) : (
                          <span className="text-eligible">Normal</span>
                        )}
                      </td>
                      <td className="p-3">₹{Number(app.annual_income).toLocaleString()}</td>
                      <td className="p-3">{statusBadge(app.status)}</td>
                      <td className="p-3 text-muted-foreground text-xs">{new Date(app.created_at).toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="outline" className="h-7 text-xs text-eligible border-eligible/30" onClick={() => updateStatus(app.id, 'approved')}>
                            <CheckCircle2 className="w-3 h-3 mr-1" />Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-ineligible border-ineligible/30" onClick={() => updateStatus(app.id, 'rejected')}>
                            <XCircle className="w-3 h-3 mr-1" />Reject
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(app.id, 'verification')}>
                            <Eye className="w-3 h-3 mr-1" />Verify
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
