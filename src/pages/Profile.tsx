import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, type StudentProfile } from '../lib/store';
import { secureStorage } from '../lib/crypto';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Slider } from '../components/ui/Slider';
import { Button } from '../components/ui/Button';
import { Download, ShieldCheck, Trash2, Upload, Bot, Key, Server } from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile, updateProfile, clearProfile } = useProfile();
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<StudentProfile>>(profile || {});

  const handleChange = (field: keyof StudentProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    // Could add a toast notification here
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearProfile();
      navigate('/');
    }
  };

  const handleExport = () => {
    const data = {
      thuthuka_profile: JSON.parse(secureStorage.getItem('thuthuka_profile') || 'null'),
      thuthuka_notes: JSON.parse(secureStorage.getItem('thuthuka_notes') || '[]'),
      thuthuka_events: JSON.parse(secureStorage.getItem('thuthuka_events') || '[]'),
      thuthuka_exams_list: JSON.parse(secureStorage.getItem('thuthuka_exams_list') || '[]'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thuthuka_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.thuthuka_profile) secureStorage.setItem('thuthuka_profile', JSON.stringify(data.thuthuka_profile));
        if (data.thuthuka_notes) secureStorage.setItem('thuthuka_notes', JSON.stringify(data.thuthuka_notes));
        if (data.thuthuka_events) secureStorage.setItem('thuthuka_events', JSON.stringify(data.thuthuka_events));
        if (data.thuthuka_exams_list) secureStorage.setItem('thuthuka_exams_list', JSON.stringify(data.thuthuka_exams_list));

        alert('Data imported successfully. Refreshing page...');
        window.location.reload();
      } catch (err) {
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-[800px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-3xl mb-4">Your profile</h1>
      <hr className="border-0 border-t border-ivory-deep dark:border-forest-darkpale mb-6" />

      <div>
        <div className="mb-6 max-w-[400px]">
          <label className="block font-medium text-text-primary dark:text-text-dark-primary mb-2">Faculty</label>
          <Select 
            value={formData.faculty || ''} 
            onChange={(e) => handleChange('faculty', e.target.value)}
          >
            <option value="">Select Faculty</option>
            <option value="Commerce">Commerce</option>
            <option value="Engineering">Engineering</option>
            <option value="Humanities">Humanities</option>
            <option value="Health Sciences">Health Sciences</option>
            <option value="Law">Law</option>
            <option value="Science">Science</option>
          </Select>
        </div>

        <div className="mb-6 max-w-[400px]">
          <label className="block font-medium text-text-primary dark:text-text-dark-primary mb-2">Year</label>
          <Select 
            value={formData.year || ''} 
            onChange={(e) => handleChange('year', e.target.value)}
          >
            <option value="">Select Year</option>
            <option value="1st year">1st year</option>
            <option value="2nd year">2nd year</option>
            <option value="3rd year">3rd year</option>
            <option value="4th year">4th year</option>
            <option value="Honours">Honours</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
          </Select>
        </div>

        <div className="mb-6 max-w-[400px]">
          <label className="block font-medium text-text-primary dark:text-text-dark-primary mb-2">NSFAS status</label>
          <Select 
            value={formData.nsfasStatus || ''} 
            onChange={(e) => handleChange('nsfasStatus', e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="Yes — approved">Yes — approved</option>
            <option value="Pending / applied">Pending / applied</option>
            <option value="Not applicable">Not applicable</option>
            <option value="Declined">Declined</option>
          </Select>
        </div>

        <div className="mb-6 max-w-[400px]">
          <label className="block font-medium text-text-primary dark:text-text-dark-primary mb-2">
            Monthly budget: R{formData.budget?.toLocaleString() || 0}
          </label>
          <Slider 
            min={1000} max={12000} step={100}
            value={formData.budget || 4500}
            onChange={(e) => handleChange('budget', parseInt(e.target.value))}
          />
        </div>

        <div className="mb-6 max-w-[400px]">
          <label className="block font-medium text-text-primary dark:text-text-dark-primary mb-2">Home province</label>
          <Select 
            value={formData.homeProvince || ''} 
            onChange={(e) => handleChange('homeProvince', e.target.value)}
          >
            <option value="">Select Province</option>
            <option value="Eastern Cape">Eastern Cape</option>
            <option value="Free State">Free State</option>
            <option value="Gauteng">Gauteng</option>
            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
            <option value="Limpopo">Limpopo</option>
            <option value="Mpumalanga">Mpumalanga</option>
            <option value="Northern Cape">Northern Cape</option>
            <option value="North West">North West</option>
            <option value="Western Cape">Western Cape</option>
            <option value="Outside SA">Outside SA</option>
          </Select>
        </div>

        <div className="mb-6 max-w-[400px]">
          <label className="block font-medium text-text-primary dark:text-text-dark-primary mb-2">Registered credits</label>
          <Input 
            type="number" 
            placeholder="e.g. 120"
            value={formData.registeredCredits || ''}
            onChange={(e) => handleChange('registeredCredits', parseInt(e.target.value))}
          />
        </div>

        <Button size="lg" onClick={handleSave} className="mb-8">
          Save changes
        </Button>
      </div>

      {/* AI Settings */}
      <div className="mt-8 p-6 bg-ivory-warm dark:bg-dark-surface/40 rounded-[2rem] border border-ivory-deep dark:border-dark-border">
        <div className="text-text-secondary dark:text-text-dark-secondary">
          <h3 className="text-xl text-text-primary dark:text-text-dark-primary mb-3 flex items-center gap-2">
            <Bot className="text-terracotta" size={24} />
            AI Planner Settings
          </h3>
          <p className="leading-relaxed max-w-[500px] mb-6 text-sm">
            Choose how the AI Study Planner connects to Claude. Use the server key (set by the admin) or bring your own Anthropic API key.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {[
              { id: 'server' as const, icon: Server, label: 'Server Key', desc: 'Uses the key set on Vercel' },
              { id: 'anthropic' as const, icon: Key, label: 'Anthropic (BYOK)', desc: 'Your own Claude API key' },
              { id: 'openai' as const, icon: Key, label: 'OpenAI (BYOK)', desc: 'Your own OpenAI API key' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => handleChange('apiProvider', opt.id)}
                className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                  (formData.apiProvider || 'server') === opt.id
                    ? 'border-terracotta bg-terracotta/5 dark:bg-terracotta/10'
                    : 'border-ivory-deep dark:border-dark-border bg-white/30 dark:bg-dark-card/30 hover:border-terracotta/40'
                }`}
              >
                <opt.icon size={20} className="text-terracotta shrink-0" />
                <div>
                  <span className="block text-sm font-bold text-text-primary dark:text-text-dark-primary">{opt.label}</span>
                  <span className="block text-xs text-text-muted">{opt.desc}</span>
                </div>
              </button>
            ))}
          </div>

          {(formData.apiProvider === 'anthropic' || formData.apiProvider === 'openai') && (
            <div className="mb-4 max-w-[400px] animate-in slide-in-from-top-2 duration-300">
              <label className="block font-medium text-text-primary dark:text-text-dark-primary mb-2 text-sm">
                {formData.apiProvider === 'openai' ? 'OpenAI' : 'Anthropic'} API Key
              </label>
              <Input
                type="password"
                placeholder={formData.apiProvider === 'openai' ? 'sk-...' : 'sk-ant-...'}
                value={formData.apiKey || ''}
                onChange={(e) => handleChange('apiKey', e.target.value)}
              />
              <p className="text-xs text-text-muted mt-2">
                Stored encrypted on this device only. Get one at{' '}
                <a
                  href={formData.apiProvider === 'openai' ? 'https://platform.openai.com/api-keys' : 'https://console.anthropic.com/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terracotta hover:underline"
                >
                  {formData.apiProvider === 'openai' ? 'platform.openai.com' : 'console.anthropic.com'}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Privacy & Portability */}
      <div className="mt-8 p-6 bg-ivory-warm dark:bg-dark-surface/40 rounded-[2rem] border border-ivory-deep dark:border-dark-border">
        <div className="text-text-secondary dark:text-text-dark-secondary">
          <h3 className="text-xl text-text-primary dark:text-text-dark-primary mb-3 flex items-center gap-2">
            <ShieldCheck className="text-sage" size={24} />
            Privacy & Portability
          </h3>
          <p className="leading-relaxed max-w-[500px] mb-6">
            Thuthuka is built on a **Local-First** philosophy. Your data lives exclusively on this device. You can export a backup to move your data between devices or clear it all instantly.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" size="sm" onClick={handleExport} className="flex items-center gap-2">
              <Download size={16} /> Export Data Backup
            </Button>
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
              <Upload size={16} /> Import Data Backup
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImport} 
              className="hidden" 
              accept=".json"
            />
            <Button variant="danger" size="sm" onClick={handleClear} className="flex items-center gap-2">
              <Trash2 size={16} /> Clear all data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
