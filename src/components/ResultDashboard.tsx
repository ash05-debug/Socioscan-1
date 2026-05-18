import { motion } from 'framer-motion';
import { PredictionResult } from '@/lib/types';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ShieldAlert, TrendingUp, Info } from 'lucide-react';

interface Props {
  result: PredictionResult;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const ResultDashboard = ({ result }: Props) => {
  const { eligible, confidence, fraudRiskScore, anomalyStatus, percentile } = result;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Eligibility */}
      <motion.div variants={item} className={`col-span-2 sm:col-span-1 rounded-xl p-5 ${eligible ? 'bg-eligible-light border border-eligible/20' : 'bg-ineligible-light border border-ineligible/20'}`}>
        <div className="flex items-center gap-2 mb-2">
          {eligible ? <CheckCircle2 className="w-5 h-5 text-eligible" /> : <XCircle className="w-5 h-5 text-ineligible" />}
          <span className="text-xs font-medium text-muted-foreground">Eligibility</span>
        </div>
        <p className={`text-xl font-bold font-heading ${eligible ? 'text-eligible' : 'text-ineligible'}`}>
          {eligible ? 'Eligible' : 'Not Eligible'}
        </p>
      </motion.div>

      {/* Confidence */}
      <motion.div variants={item} className="rounded-xl p-5 bg-info-light border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Confidence</span>
        </div>
        <p className="text-xl font-bold font-heading text-primary">{confidence}%</p>
        <div className="mt-2 h-2 rounded-full bg-primary/10 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full gradient-primary" />
        </div>
      </motion.div>

      {/* Fraud Risk */}
      <motion.div variants={item} className={`rounded-xl p-5 ${fraudRiskScore > 45 ? 'bg-warning-light border border-warning/20' : 'bg-eligible-light border border-eligible/20'}`}>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className={`w-5 h-5 ${fraudRiskScore > 45 ? 'text-warning-custom' : 'text-eligible'}`} />
          <span className="text-xs font-medium text-muted-foreground">Fraud Risk</span>
        </div>
        <p className={`text-xl font-bold font-heading ${fraudRiskScore > 45 ? 'text-warning-custom' : 'text-eligible'}`}>
          {fraudRiskScore}/100
        </p>
        <div className="mt-2 h-2 rounded-full bg-foreground/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fraudRiskScore}%` }}
            transition={{ duration: 0.8 }}
            className={`h-full rounded-full ${fraudRiskScore > 70 ? 'gradient-ineligible' : fraudRiskScore > 45 ? 'bg-warning' : 'gradient-eligible'}`}
          />
        </div>
      </motion.div>

      {/* Anomaly */}
      <motion.div variants={item} className={`rounded-xl p-5 ${anomalyStatus === 'suspicious' ? 'bg-warning-light border border-warning/20' : 'bg-eligible-light border border-eligible/20'}`}>
        <div className="flex items-center gap-2 mb-2">
          {anomalyStatus === 'normal' ? <ShieldCheck className="w-5 h-5 text-eligible" /> : <ShieldAlert className="w-5 h-5 text-warning-custom" />}
          <span className="text-xs font-medium text-muted-foreground">Anomaly</span>
        </div>
        <p className={`text-xl font-bold font-heading ${anomalyStatus === 'normal' ? 'text-eligible' : 'text-warning-custom'}`}>
          {anomalyStatus === 'normal' ? 'Normal' : 'Suspicious'}
        </p>
      </motion.div>

      {/* Percentile - full width */}
      <motion.div variants={item} className="col-span-2 lg:col-span-4 rounded-xl p-5 bg-card border border-border card-shadow">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">National Income Percentile</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentile}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full gradient-primary"
            />
          </div>
          <span className="text-sm font-bold text-primary font-heading min-w-[3rem] text-right">{percentile}th</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Applicant's income is higher than {percentile}% of the national population
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ResultDashboard;
