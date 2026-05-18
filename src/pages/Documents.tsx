import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { FileText, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const documents = [
  {
    title: 'Income Certificate',
    description: 'Required to prove annual household income for welfare schemes',
    applyUrl: 'https://services.india.gov.in/',
    applyLabel: 'Apply Online',
  },
  {
    title: 'Land Records',
    description: 'Digital land records for property ownership verification',
    applyUrl: 'https://dilrmp.gov.in/',
    applyLabel: 'Check Land Records',
  },
  {
    title: 'Aadhaar Card',
    description: 'Unique identity document required for all government schemes',
    applyUrl: 'https://uidai.gov.in/',
    applyLabel: 'Aadhaar Portal',
  },
  {
    title: 'Caste Certificate',
    description: 'Required for reservation-based schemes and benefits',
    applyUrl: 'https://services.india.gov.in/',
    applyLabel: 'Apply Online',
  },
  {
    title: 'BPL Certificate',
    description: 'Below Poverty Line certificate for subsidized benefits',
    applyUrl: 'https://services.india.gov.in/',
    applyLabel: 'Apply Online',
  },
];

const Documents = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-heading font-bold text-foreground">Get Required Documents</h2>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Apply for or download the documents needed for your welfare eligibility application.
        </p>

        <div className="grid gap-4">
          {documents.map((doc, i) => (
            <motion.div
              key={doc.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl p-5 card-shadow border border-border flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-foreground text-sm">{doc.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
              </div>
              <a href={doc.applyUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-3 h-3 mr-1" />{doc.applyLabel}
                </Button>
              </a>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 bg-info-light rounded-xl p-5 border border-primary/10">
          <h3 className="font-heading font-semibold text-foreground text-sm mb-2">💡 Tip: Use DigiLocker</h3>
          <p className="text-xs text-muted-foreground">
            You can fetch your Aadhaar and Income Certificate directly from DigiLocker when submitting your application.
            This saves time and ensures document authenticity.
          </p>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Documents;
