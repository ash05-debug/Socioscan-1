import { motion } from 'framer-motion';
import { MessageSquareText, ChevronRight } from 'lucide-react';

interface Props {
  explanations: string[];
  eligible: boolean;
}

const ExplanationSection = ({ explanations, eligible }: Props) => {
  if (explanations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-card rounded-xl p-6 card-shadow-elevated"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
        <MessageSquareText className="w-4 h-4 text-primary" />
        <h3 className="font-heading font-semibold text-foreground">Why This Result?</h3>
      </div>

      <ul className="space-y-2">
        {explanations.map((exp, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.06 }}
            className="flex items-start gap-2 text-sm"
          >
            <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${eligible ? 'text-eligible' : 'text-ineligible'}`} />
            <span className="text-foreground/80">{exp}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default ExplanationSection;
