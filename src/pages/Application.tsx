import { useState } from 'react';
import { UserInput, PredictionResult } from '@/lib/types';
import { predict } from '@/lib/mlEngine';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import MultiStepForm from '@/components/MultiStepForm';
import DocumentUpload from '@/components/DocumentUpload';
import ResultDashboard from '@/components/ResultDashboard';
import SchemeRecommendations from '@/components/SchemeRecommendations';
import Visualizations from '@/components/Visualizations';
import ExplanationSection from '@/components/ExplanationSection';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const Application = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [documentPaths, setDocumentPaths] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (input: UserInput) => {
    setLoading(true);
    setResult(null);
    setSaved(false);

    setTimeout(async () => {
      const prediction = predict(input);
      setResult(prediction);
      setLoading(false);

      // Save to database
      if (user) {
        const { error } = await supabase.from('applications').insert({
          user_id: user.id,
          name: input.name,
          household_size: input.householdSize,
          annual_income: input.annualIncome,
          monthly_electricity: input.monthlyElectricity,
          monthly_gas: input.monthlyGas,
          land_owned: input.landOwned,
          sector: input.sector,
          education_level: input.educationLevel,
          eligibility: prediction.eligible,
          confidence: prediction.confidence,
          fraud_score: prediction.fraudRiskScore,
          anomaly_status: prediction.anomalyStatus,
          percentile: prediction.percentile,
          schemes: prediction.schemes as any,
          explanations: prediction.explanations as any,
          features: prediction.features as any,
          document_paths: documentPaths as any,
        });

        if (error) {
          toast({ title: 'Failed to save application', description: error.message, variant: 'destructive' });
        } else {
          setSaved(true);
          toast({ title: 'Application submitted', description: 'Your application has been saved for admin review.' });
        }
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <MultiStepForm onSubmit={handleSubmit} loading={loading} />
            <DocumentUpload onUploadComplete={setDocumentPaths} />
          </div>

          <div className="lg:col-span-3 space-y-5">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 gap-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full" style={{ borderWidth: 3 }} />
                  <p className="text-sm text-muted-foreground">Analyzing profile with AI models...</p>
                </motion.div>
              )}

              {!loading && result && (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  {saved && (
                    <div className="bg-eligible-light border border-eligible/20 rounded-lg p-3 text-sm text-eligible text-center">
                      ✓ Application saved — pending admin review
                    </div>
                  )}
                  <ResultDashboard result={result} />
                  <SchemeRecommendations schemes={result.schemes} />
                  <ExplanationSection explanations={result.explanations} eligible={result.eligible} />
                </motion.div>
              )}

              {!loading && !result && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                    </svg>
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">Submit New Application</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Fill in the form, upload documents, then check eligibility. Your application will be saved for admin review.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {result && !loading && (
          <div className="mt-6">
            <Visualizations result={result} />
          </div>
        )}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Application;
