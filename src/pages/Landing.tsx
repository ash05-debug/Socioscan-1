import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle2, BarChart3, FileText, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Shield, title: 'AI Eligibility Check', desc: 'Machine learning model predicts welfare eligibility with high accuracy' },
  { icon: BarChart3, title: 'Fraud Detection', desc: 'Isolation Forest algorithm detects suspicious profiles and anomalies' },
  { icon: CheckCircle2, title: 'Scheme Recommendations', desc: 'Dynamic recommendations for NFSA, PMAY, PM-Kisan, Ayushman Bharat & more' },
  { icon: FileText, title: 'Document Verification', desc: 'Upload and verify Aadhaar, income certificates, and land records' },
  { icon: Users, title: 'Admin Workflow', desc: 'Complete admin dashboard for reviewing and approving applications' },
  { icon: BarChart3, title: 'Data Visualization', desc: 'Income distribution and land-consumption scatter plots with your position' },
];

const Landing = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="gradient-header text-primary-foreground py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-heading font-bold mb-4"
            >
              SocioScan — AI-Based Welfare Eligibility & Fraud Detection
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-primary-foreground/70 text-lg mb-8 max-w-2xl mx-auto"
            >
              A production-grade system for predicting welfare eligibility, detecting fraudulent applications, and recommending government schemes using AI.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-3 justify-center flex-wrap"
            >
              {user ? (
                <>
                  <Link to="/application">
                    <Button size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 font-semibold">
                      New Application<ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <div className="flex gap-3 flex-wrap justify-center">
                  <Link to="/auth">
                    <Button size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 font-semibold">
                      Get Started<ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                      Admin Login
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-2xl font-heading font-bold text-center mb-10">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-card rounded-xl p-5 card-shadow border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Landing;
