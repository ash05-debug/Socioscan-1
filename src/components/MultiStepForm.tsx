import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserInput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Home, IndianRupee, Zap, Flame, LandPlot, MapPin, GraduationCap, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  onSubmit: (input: UserInput) => void;
  loading: boolean;
}

const STEPS = ['Personal', 'Income & Bills', 'Land & Sector'];

const MultiStepForm = ({ onSubmit, loading }: Props) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    householdSize: '',
    annualIncome: '',
    monthlyElectricity: '',
    monthlyGas: '',
    landOwned: '',
    sector: '' as '' | 'rural' | 'urban',
    educationLevel: '' as '' | 'low' | 'medium' | 'high',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => setForm({ ...form, [key]: val });

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = 'Required';
      if (!form.householdSize || +form.householdSize < 1) e.householdSize = 'Must be ≥ 1';
    } else if (step === 1) {
      if (!form.annualIncome || +form.annualIncome < 0) e.annualIncome = 'Required';
      if (!form.monthlyElectricity || +form.monthlyElectricity < 0) e.monthlyElectricity = 'Required';
      if (!form.monthlyGas || +form.monthlyGas < 0) e.monthlyGas = 'Required';
    } else {
      if (form.landOwned === '' || +form.landOwned < 0) e.landOwned = 'Required';
      if (!form.sector) e.sector = 'Select sector';
      if (!form.educationLevel) e.educationLevel = 'Select education level';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    onSubmit({
      name: form.name,
      householdSize: +form.householdSize,
      annualIncome: +form.annualIncome,
      monthlyElectricity: +form.monthlyElectricity,
      monthlyGas: +form.monthlyGas,
      landOwned: +form.landOwned,
      sector: form.sector as 'rural' | 'urban',
      educationLevel: form.educationLevel as 'low' | 'medium' | 'high',
    });
  };

  const field = (key: string, label: string, icon: React.ReactNode, type = 'number', placeholder = '') => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">{icon}{label}</Label>
      <Input type={type} placeholder={placeholder} value={(form as any)[key]} onChange={e => set(key, e.target.value)} className={errors[key] ? 'border-ineligible' : ''} />
      {errors[key] && <p className="text-xs text-ineligible">{errors[key]}</p>}
    </div>
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-card rounded-xl p-6 card-shadow-elevated space-y-5"
    >
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          {STEPS.map((s, i) => (
            <span key={s} className={i <= step ? 'text-primary font-semibold' : ''}>{s}</span>
          ))}
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-primary"
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {step === 0 && (
            <div className="grid grid-cols-1 gap-4">
              {field('name', 'Full Name', <User className="w-3 h-3" />, 'text', 'Applicant name')}
              {field('householdSize', 'Household Size', <Home className="w-3 h-3" />, 'number', 'e.g. 4')}
            </div>
          )}
          {step === 1 && (
            <div className="grid grid-cols-1 gap-4">
              {field('annualIncome', 'Annual Income (₹)', <IndianRupee className="w-3 h-3" />, 'number', 'e.g. 120000')}
              {field('monthlyElectricity', 'Monthly Electricity (₹)', <Zap className="w-3 h-3" />, 'number', 'e.g. 800')}
              {field('monthlyGas', 'Monthly Gas (₹)', <Flame className="w-3 h-3" />, 'number', 'e.g. 500')}
            </div>
          )}
          {step === 2 && (
            <div className="grid grid-cols-1 gap-4">
              {field('landOwned', 'Land Owned (acres)', <LandPlot className="w-3 h-3" />, 'number', 'e.g. 1.5')}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3 h-3" />Sector</Label>
                <Select value={form.sector} onValueChange={v => set('sector', v)}>
                  <SelectTrigger className={errors.sector ? 'border-ineligible' : ''}><SelectValue placeholder="Select sector" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rural">Rural</SelectItem>
                    <SelectItem value="urban">Urban</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sector && <p className="text-xs text-ineligible">{errors.sector}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><GraduationCap className="w-3 h-3" />Education Level</Label>
                <Select value={form.educationLevel} onValueChange={v => set('educationLevel', v)}>
                  <SelectTrigger className={errors.educationLevel ? 'border-ineligible' : ''}><SelectValue placeholder="Select education" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (College + Employed)</SelectItem>
                    <SelectItem value="medium">Medium (Up to 12th)</SelectItem>
                    <SelectItem value="low">Low (Primary Level)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.educationLevel && <p className="text-xs text-ineligible">{errors.educationLevel}</p>}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={prev} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-1" />Back
          </Button>
        )}
        {step < 2 ? (
          <Button type="button" onClick={next} className="flex-1 gradient-primary text-primary-foreground">
            Next<ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button type="submit" disabled={loading} className="flex-1 gradient-primary text-primary-foreground font-semibold h-11">
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
            ) : (
              <><Shield className="w-4 h-4 mr-2" />Check Eligibility</>
            )}
          </Button>
        )}
      </div>
    </motion.form>
  );
};

export default MultiStepForm;
