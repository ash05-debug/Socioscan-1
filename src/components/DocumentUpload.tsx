import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Check, X, CloudDownload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Props {
  onUploadComplete: (paths: string[]) => void;
}

interface DocFile {
  key: string;
  label: string;
  file: File | null;
  uploaded: boolean;
  path: string;
  digilocker?: boolean;
}

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE = 5 * 1024 * 1024;

const DocumentUpload = ({ onUploadComplete }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [docs, setDocs] = useState<DocFile[]>([
    { key: 'aadhaar', label: 'Aadhaar Card', file: null, uploaded: false, path: '' },
    { key: 'land', label: 'Land Document', file: null, uploaded: false, path: '' },
    { key: 'electricity', label: 'Electricity Bill', file: null, uploaded: false, path: '' },
    { key: 'income', label: 'Income Certificate / Bank Statement', file: null, uploaded: false, path: '' },
  ]);
  const [uploading, setUploading] = useState(false);
  const [digilockerLoading, setDigilockerLoading] = useState(false);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = (key: string, file: File | null) => {
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({ title: 'Invalid file type', description: 'Only PDF, JPG, and PNG allowed', variant: 'destructive' });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast({ title: 'File too large', description: 'Maximum 5MB per file', variant: 'destructive' });
      return;
    }
    setDocs(prev => prev.map(d => d.key === key ? { ...d, file, uploaded: false, path: '' } : d));
  };

  const uploadAll = async () => {
    if (!user) return;
    setUploading(true);
    const updatedDocs = [...docs];

    for (let i = 0; i < updatedDocs.length; i++) {
      const doc = updatedDocs[i];
      if (doc.uploaded || doc.digilocker) continue;
      if (!doc.file) continue;

      const ext = doc.file.name.split('.').pop();
      const path = `${user.id}/${doc.key}_${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('documents').upload(path, doc.file);

      if (error) {
        toast({ title: `Failed to upload ${doc.label}`, description: error.message, variant: 'destructive' });
      } else {
        updatedDocs[i] = { ...doc, uploaded: true, path };
      }
    }

    setDocs(updatedDocs);
    const paths = updatedDocs.filter(d => d.uploaded || d.digilocker).map(d => d.path);
    if (paths.length > 0) onUploadComplete(paths);
    setUploading(false);
    toast({ title: 'Documents uploaded successfully' });
  };

  const simulateDigiLocker = () => {
    setDigilockerLoading(true);
    setTimeout(() => {
      setDocs(prev => prev.map(d => {
        if (d.key === 'aadhaar') return { ...d, uploaded: true, digilocker: true, path: 'digilocker/aadhaar' };
        if (d.key === 'income') return { ...d, uploaded: true, digilocker: true, path: 'digilocker/income_certificate' };
        return d;
      }));
      setDigilockerLoading(false);
      toast({ title: 'DigiLocker Connected', description: 'Aadhaar & Income Certificate fetched successfully' });
    }, 2000);
  };

  const allReady = docs.every(d => d.file || d.uploaded || d.digilocker);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-6 card-shadow-elevated space-y-4"
    >
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold text-foreground">Upload Documents</h3>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={simulateDigiLocker} disabled={digilockerLoading}>
          {digilockerLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <CloudDownload className="w-4 h-4 mr-1" />}
          Fetch from DigiLocker
        </Button>
      </div>

      <div className="grid gap-3">
        {docs.map(doc => (
          <div key={doc.key} className={`flex items-center gap-3 p-3 rounded-lg border ${doc.uploaded || doc.digilocker ? 'border-eligible/30 bg-eligible-light' : 'border-border'}`}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{doc.label}</p>
              {doc.digilocker && <p className="text-xs text-eligible">✓ Fetched from DigiLocker</p>}
              {doc.file && !doc.uploaded && <p className="text-xs text-muted-foreground truncate">{doc.file.name} ({(doc.file.size / 1024).toFixed(0)} KB)</p>}
              {doc.uploaded && !doc.digilocker && <p className="text-xs text-eligible">✓ Uploaded</p>}
            </div>
            {doc.uploaded || doc.digilocker ? (
              <Check className="w-5 h-5 text-eligible shrink-0" />
            ) : (
              <>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  ref={el => { fileRefs.current[doc.key] = el; }}
                  className="hidden"
                  onChange={e => handleFileSelect(doc.key, e.target.files?.[0] ?? null)}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => fileRefs.current[doc.key]?.click()}>
                  <Upload className="w-3 h-3 mr-1" />Choose
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">Accepted: PDF, JPG, PNG · Max 5MB each</p>

      <Button type="button" onClick={uploadAll} disabled={uploading || !docs.some(d => d.file && !d.uploaded)} className="w-full gradient-primary text-primary-foreground">
        {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
        Upload Documents
      </Button>
    </motion.div>
  );
};

export default DocumentUpload;
