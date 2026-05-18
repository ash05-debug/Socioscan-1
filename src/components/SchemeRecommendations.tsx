import { motion } from 'framer-motion';
import { Scheme } from '@/lib/types';
import { ExternalLink, Award } from 'lucide-react';

interface Props {
  schemes: Scheme[];
}

const categoryColors: Record<string, string> = {
  'Food Security': 'bg-eligible-light text-eligible',
  Housing: 'bg-info-light text-primary',
  Agriculture: 'bg-eligible-light text-eligible',
  Healthcare: 'bg-ineligible-light text-ineligible',
  Financial: 'bg-warning-light text-warning-custom',
  Employment: 'bg-info-light text-primary',
};

const SchemeRecommendations = ({ schemes }: Props) => {
  if (schemes.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card rounded-xl p-6 card-shadow-elevated"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
        <Award className="w-4 h-4 text-primary" />
        <h3 className="font-heading font-semibold text-foreground">Recommended Schemes</h3>
        <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
          {schemes.length} found
        </span>
      </div>

      <div className="grid gap-3">
        {schemes.map((scheme, i) => (
          <motion.a
            key={scheme.name}
            href={scheme.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:card-shadow-elevated transition-all group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {scheme.name}
                </span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${categoryColors[scheme.category] || 'bg-muted text-muted-foreground'}`}>
                  {scheme.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{scheme.description}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default SchemeRecommendations;
