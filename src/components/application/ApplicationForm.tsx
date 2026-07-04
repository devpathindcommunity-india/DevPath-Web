'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { submitApplication, getUserApplication } from '@/lib/applicationService';
import { CommunityApplication } from '@/types/application';
import { Country, State, City } from 'country-state-city';
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

const TECH_INTERESTS = [
  'Android', 'Web Development', 'AI/ML', 'Cloud', 'Cyber Security',
  'Open Source', 'Backend', 'Frontend', 'DevOps', 'UI/UX',
  'Blockchain', 'Game Development', 'IoT', 'Competitive Programming',
  'Startup', 'Research'
];

const COMMUNITY_PROGRAMS = [
  'Technical Contributor', 'Mentor', 'Speaker', 'City Lead',
  'Core Leadership (Future)', 'Women in Tech Lead (Women Only)', 'Women in Tech Admin (Women Only)'
];

const DRAFT_KEY = 'devpath_application_draft';

export default function ApplicationForm() {
  const { user, firebaseAvailable } = useAuth() as any;
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [existingStatus, setExistingStatus] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    personalInfo: {
      fullName: '', email: '', discordUsername: '', discordUserId: '',
      collegeOrCompany: '', currentYearOrProfession: '', country: '', state: '', city: ''
    },
    socialLinks: { github: '', linkedin: '', portfolio: '', resumeUrl: '' },
    interests: [],
    communityRoles: [],
    womenInTech: { isFemale: false, wantsAccess: false, linkedinProfile: '', githubProfile: '' },
    technicalContributor: { githubUrl: '', bestProjectUrl: '', openSourceExperience: '', technicalBlogUrl: '' },
    cityLead: { whyCityLead: '', howHelpDevelopers: '' },
    whyJoinDevPath: '', anythingElse: ''
  });
  
  // Dynamic Dropdown states
  const [countries, setCountries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    if (user?.email) {
      setFormData((prev: any) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, email: user.email }
      }));
    }
  }, [user]);

  // Load existing application or draft
  useEffect(() => {
    const initializeForm = async () => {
      if (!user) {
        setCheckingExisting(false);
        return;
      }
      try {
        const existingApp = await getUserApplication(user.uid);
        if (existingApp) {
          setExistingStatus(existingApp.status);
          setFormData(existingApp);
          setStep(9); // Success/Status Step
        } else {
          const draft = localStorage.getItem(DRAFT_KEY);
          if (draft) setFormData(JSON.parse(draft));
        }
      } catch (err) {
        console.error('Error fetching application:', err);
      } finally {
        setCheckingExisting(false);
      }
    };
    initializeForm();
  }, [user]);

  // Autosave Draft
  useEffect(() => {
    if (step < 9 && !existingStatus) {
      const timer = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData, step, existingStatus]);

  // Handle Country/State dropdown changes
  useEffect(() => {
    const selectedCountry = countries.find(c => c.name === formData.personalInfo.country);
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
    } else {
      setStates([]);
    }
  }, [formData.personalInfo.country, countries]);

  useEffect(() => {
    const selectedCountry = countries.find(c => c.name === formData.personalInfo.country);
    if (selectedCountry) {
      const selectedState = states.find(s => s.name === formData.personalInfo.state);
      if (selectedState) {
        setCities(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
      } else {
        setCities([]);
      }
    }
  }, [formData.personalInfo.state, states, countries, formData.personalInfo.country]);

  const updateNestedField = (section: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const finalData: Omit<CommunityApplication, 'status' | 'submittedAt'> = {
        uid: user?.uid || '',
        personalInfo: formData.personalInfo,
        socialLinks: formData.socialLinks,
        interests: formData.interests,
        communityRoles: formData.communityRoles,
        womenInTech: formData.womenInTech,
        whyJoinDevPath: formData.whyJoinDevPath,
        anythingElse: formData.anythingElse
      };

      if (formData.communityRoles.includes('City Lead')) {
        finalData.cityLead = formData.cityLead;
      }
      if (formData.communityRoles.includes('Technical Contributor')) {
        finalData.technicalContributor = formData.technicalContributor;
      }

      await submitApplication(finalData);
      localStorage.removeItem(DRAFT_KEY);
      setExistingStatus('Pending');
      setStep(9);
    } catch (error: any) {
      alert(error.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };



  if (checkingExisting) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  if (step === 9 || existingStatus) {
    return (
      <div className="text-center p-12 bg-secondary/30 rounded-xl border border-border animate-in fade-in zoom-in">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Application Submitted!</h2>
        <p className="text-gray-400 text-lg mb-6">
          Your current application status is: <span className="font-semibold text-primary">{existingStatus || 'Pending'}</span>
        </p>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          {user 
            ? 'You can track your application status anytime from your profile dashboard under the "My Application" section.' 
            : 'We have received your application. We will contact you via email regarding the next steps!'}
        </p>
        <button onClick={() => router.push(user ? '/profile' : '/')} className="px-6 py-2 bg-primary text-white rounded-lg font-medium">
          {user ? 'Go to Dashboard' : 'Return Home'}
        </button>
      </div>
    );
  }

  // Determine dynamic steps based on selections
  const showCityLeadStep = formData.communityRoles.includes('City Lead');
  const showTechContribStep = formData.communityRoles.includes('Technical Contributor');

  const totalSteps = 8;
  // Skip logic: if step is 6 but city lead is not selected, skip to 7. Same for 7.
  const handleSmartNext = () => {
    let nextStep = step + 1;
    if (nextStep === 6 && !showCityLeadStep) nextStep++;
    if (nextStep === 7 && !showTechContribStep) nextStep++;
    setStep(nextStep);
  };
  const handleSmartBack = () => {
    let prevStep = step - 1;
    if (prevStep === 7 && !showTechContribStep) prevStep--;
    if (prevStep === 6 && !showCityLeadStep) prevStep--;
    setStep(prevStep);
  };

  return (
    <div className="bg-secondary/40 backdrop-blur-md rounded-2xl border border-border p-6 md:p-10 shadow-xl">
      {/* Progress Bar */}
      <div className="mb-8 relative">
        <div className="flex justify-between text-sm text-gray-500 font-medium mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
      </div>

      <div className="min-h-[400px]">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-2xl font-semibold mb-6">1. Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input required type="text" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                  value={formData.personalInfo.fullName} onChange={(e) => updateNestedField('personalInfo', 'fullName', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input required type="email" disabled className="w-full p-3 rounded-lg bg-background/50 border border-border opacity-70 cursor-not-allowed" 
                  value={formData.personalInfo.email} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discord Username *</label>
                <input required type="text" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                  value={formData.personalInfo.discordUsername} onChange={(e) => updateNestedField('personalInfo', 'discordUsername', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discord User ID (Optional)</label>
                <input type="text" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                  value={formData.personalInfo.discordUserId} onChange={(e) => updateNestedField('personalInfo', 'discordUserId', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">College / Company *</label>
                <input required type="text" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                  value={formData.personalInfo.collegeOrCompany} onChange={(e) => updateNestedField('personalInfo', 'collegeOrCompany', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Year / Profession *</label>
                <input required type="text" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                  value={formData.personalInfo.currentYearOrProfession} onChange={(e) => updateNestedField('personalInfo', 'currentYearOrProfession', e.target.value)} />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Country *</label>
                <select className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  value={formData.personalInfo.country} onChange={(e) => updateNestedField('personalInfo', 'country', e.target.value)}>
                  <option value="">Select Country</option>
                  {countries.map(c => <option key={c.isoCode} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State *</label>
                <select disabled={!states.length} className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  value={formData.personalInfo.state} onChange={(e) => updateNestedField('personalInfo', 'state', e.target.value)}>
                  <option value="">Select State</option>
                  {states.map(s => <option key={s.isoCode} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">City *</label>
                <select disabled={!cities.length} className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none"
                  value={formData.personalInfo.city} onChange={(e) => updateNestedField('personalInfo', 'city', e.target.value)}>
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Professional Profiles */}
        {step === 2 && (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-2xl font-semibold mb-6">2. Professional Profiles</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">GitHub Profile *</label>
                <input type="url" placeholder="https://github.com/username" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                  value={formData.socialLinks.github} onChange={(e) => updateNestedField('socialLinks', 'github', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn Profile *</label>
                <input type="url" placeholder="https://linkedin.com/in/username" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                  value={formData.socialLinks.linkedin} onChange={(e) => updateNestedField('socialLinks', 'linkedin', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Portfolio Website (Optional)</label>
                <input type="url" placeholder="https://yourwebsite.com" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                  value={formData.socialLinks.portfolio} onChange={(e) => updateNestedField('socialLinks', 'portfolio', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Resume Link (Google Drive, etc.)</label>
                <input type="url" placeholder="https://drive.google.com/..." className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                  value={formData.socialLinks.resumeUrl} onChange={(e) => updateNestedField('socialLinks', 'resumeUrl', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Technology Interests */}
        {step === 3 && (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-2xl font-semibold mb-6">3. Technology Interests</h2>
            <p className="text-gray-400 mb-4">Select all the areas you are interested in.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {TECH_INTERESTS.map(tech => (
                <label key={tech} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${formData.interests.includes(tech) ? 'bg-primary/20 border-primary' : 'bg-background border-border hover:bg-secondary'}`}>
                  <input type="checkbox" className="hidden" checked={formData.interests.includes(tech)} onChange={(e) => {
                    if (e.target.checked) setFormData({ ...formData, interests: [...formData.interests, tech] });
                    else setFormData({ ...formData, interests: formData.interests.filter((i: string) => i !== tech) });
                  }} />
                  <span className="text-sm font-medium">{tech}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Community Programs */}
        {step === 4 && (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-2xl font-semibold mb-6">4. Community Programs</h2>
            <p className="text-gray-400 mb-4">Are you interested in joining any specialized programs or taking up a role?</p>
            <div className="space-y-3">
              {COMMUNITY_PROGRAMS.map(role => (
                <label key={role} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${formData.communityRoles.includes(role) ? 'bg-primary/10 border-primary' : 'bg-background border-border hover:bg-secondary'}`}>
                  <input type="checkbox" className="w-5 h-5 mr-3 accent-primary" checked={formData.communityRoles.includes(role)} onChange={(e) => {
                    if (e.target.checked) setFormData({ ...formData, communityRoles: [...formData.communityRoles, role] });
                    else setFormData({ ...formData, communityRoles: formData.communityRoles.filter((i: string) => i !== role) });
                  }} />
                  <span className="font-medium">{role}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Women in Tech */}
        {step === 5 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-2xl font-semibold mb-6">5. Women in Tech (Optional)</h2>
            <div>
              <label className="block text-lg font-medium mb-3">Are you Female?</label>
              <div className="flex gap-4">
                <button onClick={() => updateNestedField('womenInTech', 'isFemale', true)} className={`px-6 py-2 rounded-lg border ${formData.womenInTech.isFemale ? 'bg-primary text-white border-primary' : 'border-border'}`}>YES</button>
                <button onClick={() => updateNestedField('womenInTech', 'isFemale', false)} className={`px-6 py-2 rounded-lg border ${!formData.womenInTech.isFemale ? 'bg-primary text-white border-primary' : 'border-border'}`}>NO</button>
              </div>
            </div>

            {formData.womenInTech.isFemale && (
              <div className="space-y-4 mt-6 p-6 bg-background rounded-xl border border-border">
                <label className="block font-medium mb-3">Would you like access to the Women in Tech Community?</label>
                <div className="flex gap-4 mb-6">
                  <button onClick={() => updateNestedField('womenInTech', 'wantsAccess', true)} className={`px-6 py-2 rounded-lg border ${formData.womenInTech.wantsAccess ? 'bg-primary text-white border-primary' : 'border-border'}`}>YES</button>
                  <button onClick={() => updateNestedField('womenInTech', 'wantsAccess', false)} className={`px-6 py-2 rounded-lg border ${!formData.womenInTech.wantsAccess ? 'bg-primary text-white border-primary' : 'border-border'}`}>NO</button>
                </div>

                {formData.womenInTech.wantsAccess && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
                      <input type="url" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                        value={formData.womenInTech.linkedinProfile} onChange={(e) => updateNestedField('womenInTech', 'linkedinProfile', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">GitHub Profile</label>
                      <input type="url" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                        value={formData.womenInTech.githubProfile} onChange={(e) => updateNestedField('womenInTech', 'githubProfile', e.target.value)} />
                    </div>
                    <p className="text-xs text-gray-500">These details will help our team verify your eligibility for the exclusive Women in Tech groups.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 6: City Lead */}
        {step === 6 && showCityLeadStep && (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-2xl font-semibold mb-6">6. City Lead Application</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Why do you want to become a City Lead?</label>
              <textarea rows={4} className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none resize-none" 
                value={formData.cityLead.whyCityLead} onChange={(e) => updateNestedField('cityLead', 'whyCityLead', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">How will you help developers in your city?</label>
              <textarea rows={4} className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none resize-none" 
                value={formData.cityLead.howHelpDevelopers} onChange={(e) => updateNestedField('cityLead', 'howHelpDevelopers', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 7: Technical Contributor */}
        {step === 7 && showTechContribStep && (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-2xl font-semibold mb-6">7. Technical Contributor</h2>
            <div>
              <label className="block text-sm font-medium mb-1">GitHub URL</label>
              <input type="url" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                value={formData.technicalContributor.githubUrl} onChange={(e) => updateNestedField('technicalContributor', 'githubUrl', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Link to your Best Project</label>
              <input type="url" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                value={formData.technicalContributor.bestProjectUrl} onChange={(e) => updateNestedField('technicalContributor', 'bestProjectUrl', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Briefly describe your Open Source Experience</label>
              <textarea rows={3} className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none resize-none" 
                value={formData.technicalContributor.openSourceExperience} onChange={(e) => updateNestedField('technicalContributor', 'openSourceExperience', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Technical Blog URL (Optional)</label>
              <input type="url" className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none" 
                value={formData.technicalContributor.technicalBlogUrl} onChange={(e) => updateNestedField('technicalContributor', 'technicalBlogUrl', e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 8: Final */}
        {step === 8 && (
          <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
            <h2 className="text-2xl font-semibold mb-6">8. Final Thoughts</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Why do you want to join DevPath Bharat? *</label>
              <textarea required rows={5} className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none resize-none" 
                value={formData.whyJoinDevPath} onChange={(e) => setFormData({ ...formData, whyJoinDevPath: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Anything else you'd like to share? (Optional)</label>
              <textarea rows={3} className="w-full p-3 rounded-lg bg-background border border-border focus:border-primary outline-none resize-none" 
                value={formData.anythingElse} onChange={(e) => setFormData({ ...formData, anythingElse: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-border">
        <button 
          onClick={handleSmartBack} 
          disabled={step === 1 || loading}
          className="flex items-center px-5 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </button>

        {step < 8 ? (
          <button 
            onClick={handleSmartNext}
            className="flex items-center px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium shadow-lg shadow-primary/20"
          >
            Next <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={loading || !formData.whyJoinDevPath}
            className="flex items-center px-8 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors font-bold shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
            Submit Application
          </button>
        )}
      </div>
    </div>
  );
}
