import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  from: 'user' | 'bot';
  text: string;
}

const FAQ: Record<string, string> = {
  'household size': 'Household size is the total number of people living in your home who share meals and expenses — including children and elderly members.',
  'income': 'Enter your total annual household income from all sources (salary, farming, business, pensions) before taxes.',
  'eligibility': 'Eligibility is determined by a machine learning model that considers your income, household size, land ownership, expenses, education, and sector. The system uses logistic regression with a 0.45 probability threshold.',
  'schemes': 'Government schemes are recommended based on your income level, land ownership, education, and sector. You can apply for them through the official portals linked in the results.',
  'fraud': 'The fraud detection system uses anomaly detection (Isolation Forest) and rule-based scoring to identify inconsistent data patterns — like very high expenses with very low income.',
  'documents': 'You need to upload: Aadhaar Card, Land Document, Electricity Bill, and Income Certificate or Bank Statement. Accepted formats are PDF, JPG, and PNG (max 5MB each).',
  'digilocker': 'DigiLocker is a government cloud storage for documents. Click "Fetch from DigiLocker" to simulate fetching your Aadhaar and Income Certificate automatically.',
  'admin': 'After you submit an application, an admin will review it. They can approve, reject, or mark it for additional verification.',
};

function getResponse(msg: string): string {
  const lower = msg.toLowerCase();
  for (const [key, answer] of Object.entries(FAQ)) {
    if (lower.includes(key)) return answer;
  }
  if (lower.includes('hello') || lower.includes('hi')) return 'Hello! I can help you with questions about eligibility, income, household size, schemes, documents, and fraud detection. What would you like to know?';
  if (lower.includes('help')) return 'I can answer questions about: household size, income entry, eligibility process, scheme recommendations, fraud detection, document uploads, and DigiLocker. Just ask!';
  return "I'm not sure about that. Try asking about: eligibility, income, household size, schemes, fraud detection, or documents.";
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hi! I\'m your SocioScan assistant. Ask me anything about eligibility, schemes, or how to use this system.' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: getResponse(userMsg) }]);
    }, 500);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-20 right-4 z-50 w-80 max-h-[28rem] bg-card rounded-xl card-shadow-lg border border-border flex flex-col overflow-hidden"
          >
            <div className="gradient-header text-primary-foreground p-3 flex items-center justify-between">
              <span className="font-heading font-semibold text-sm">SocioScan Assistant</span>
              <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-72">
              {messages.map((m, i) => (
                <div key={i} className={`text-xs p-2.5 rounded-lg max-w-[85%] ${m.from === 'bot' ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground ml-auto'}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-border flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask a question..."
                className="text-xs h-8"
              />
              <Button size="sm" onClick={send} className="h-8 w-8 p-0 gradient-primary">
                <Send className="w-3 h-3 text-primary-foreground" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full gradient-primary text-primary-foreground flex items-center justify-center card-shadow-elevated"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </motion.button>
    </>
  );
};

export default Chatbot;
