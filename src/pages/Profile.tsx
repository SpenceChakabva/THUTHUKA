import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile, type StudentProfile } from '../lib/store';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Slider } from '../components/ui/Slider';
import { Button } from '../components/ui/Button';

export const Profile: React.FC = () => {
  const { profile, updateProfile, clearProfile } = useProfile();
  const navigate = useNavigate();

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

  return (
    <div className="max-w-[800px]">
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

      <div className="mt-8">
        <hr className="border-0 border-t border-ivory-deep dark:border-forest-darkpale mb-6" />
        <div className="text-text-secondary dark:text-text-dark-secondary">
          <h3 className="text-lg text-text-primary dark:text-text-dark-primary mb-2">About your data</h3>
          <p className="leading-relaxed max-w-[400px]">
            Everything is stored on your device only.
            Thuthuka does not collect, store, or transmit
            any personal information.
          </p>
          <Button variant="danger" size="sm" onClick={handleClear} className="mt-4">
            Clear all data
          </Button>
        </div>
      </div>
    </div>
  );
};
