import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Camera, Palette, Bell, Lock, CreditCard, Mail, Globe,
  Save, Eye, EyeOff
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPwd, setShowPwd] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Camera },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'email', label: 'Email Templates', icon: Mail },
    { id: 'integrations', label: 'Integrations', icon: Globe },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-slate-400 text-sm">Manage your studio preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar */}
        <div className="lg:w-56 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                activeTab === tab.id ? 'bg-cyan-500/15 text-cyan-400 font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#0d1321] border border-white/5 rounded-xl p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="font-semibold">Studio Profile</h3>
              <div className="flex items-center gap-4">
                <img src={user?.avatar_url || '/icons/logo.png'} alt="" className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <button className="text-sm text-cyan-400 hover:text-cyan-300">Change photo</button>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG. Max 2MB</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Studio Name</label>
                  <input defaultValue={user?.studio_name || 'Sparkle Photography'} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Owner Name</label>
                  <input defaultValue={user?.full_name} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Email</label>
                  <input defaultValue={user?.email} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Phone</label>
                  <input defaultValue="+1 (555) 000-0000" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Bio / About</label>
                <textarea
                  defaultValue="Professional photography studio specializing in weddings, portraits, and events. Serving clients since 2018."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>
              <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#0a0f1a] font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="font-semibold">Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Current Password</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} defaultValue="demo123" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50 pr-10" />
                    <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">New Password</label>
                  <input type="password" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
                  <input type="password" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
              <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-[#0a0f1a] font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                <Save className="w-4 h-4" /> Update Password
              </button>
            </div>
          )}

          {(activeTab === 'appearance' || activeTab === 'notifications' || activeTab === 'billing' || activeTab === 'email' || activeTab === 'integrations') && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">This section is under development.</p>
              <p className="text-xs text-slate-600 mt-1">Contact support for early access.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
