import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, CartesianGrid, ReferenceLine, Legend } from 'recharts';
import { PredictionResult } from '@/lib/types';
import { NATIONAL_INCOME_DISTRIBUTION, SCATTER_DATA } from '@/lib/mlEngine';
import { BarChart3, ScatterChart as ScatterIcon } from 'lucide-react';

interface Props {
  result: PredictionResult;
}

const Visualizations = ({ result }: Props) => {
  const userIncomeRange = NATIONAL_INCOME_DISTRIBUTION.map((d) => ({
    ...d,
    isUser: result.input.annualIncome >= (d.midpoint - 30000) && result.input.annualIncome <= (d.midpoint + 30000),
  }));

  const scatterWithUser = [
    ...SCATTER_DATA,
    { land: result.input.landOwned, consumption: result.features.totalMonthlyExpense, label: 'You' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {/* Income Distribution */}
      <div className="bg-card rounded-xl p-6 card-shadow-elevated">
        <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold text-sm text-foreground">Income Distribution — Your Position</h3>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={userIncomeRange}>
            <XAxis dataKey="range" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {userIncomeRange.map((entry, i) => (
                <Cell key={i} fill={entry.isUser ? 'hsl(215, 80%, 42%)' : 'hsl(214, 25%, 88%)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Highlighted bar shows your income bracket
        </p>
      </div>

      {/* Scatter Plot */}
      <div className="bg-card rounded-xl p-6 card-shadow-elevated">
        <div className="flex items-center gap-2 pb-3 border-b border-border mb-4">
          <ScatterIcon className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold text-sm text-foreground">Land vs. Monthly Consumption</h3>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 25%, 92%)" />
            <XAxis dataKey="land" name="Land (acres)" tick={{ fontSize: 10 }} />
            <YAxis dataKey="consumption" name="Expense (₹)" tick={{ fontSize: 10 }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="National Data" data={SCATTER_DATA} fill="hsl(214, 25%, 78%)" fillOpacity={0.5} />
            <Scatter
              name="You"
              data={[{ land: result.input.landOwned, consumption: result.features.totalMonthlyExpense }]}
              fill="hsl(0, 72%, 51%)"
              shape="diamond"
            >
              <Cell fill="hsl(215, 80%, 42%)" r={8} />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Your position highlighted among national sample data
        </p>
      </div>
    </motion.div>
  );
};

export default Visualizations;
