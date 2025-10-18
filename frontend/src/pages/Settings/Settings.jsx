import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Save, Moon, Sun, Palette, Settings as SettingsIcon, Shield, Mail, Phone, Calendar, Check, Sparkles, ChevronRight, Eye, EyeOff, CheckCircle, LogOut, Crown, Camera, ArrowLeft, Activity, Info } from 'lucide-react';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

const Settings = () => {
  useScrollAnimation();
  const navigate = useNavigate();
  const { user, setAuth, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [profileData, setProfileData] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '', phone: user?.phone || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const initialData = { firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '', phone: user?.phone || '' };

  useEffect(() => { setHasChanges(JSON.stringify(profileData) !== JSON.stringify(initialData)); }, [profileData]);
  useEffect(() => {
    if (passwordData.newPassword) {
      let s = 0;
      if (passwordData.newPassword.length >= 6) s += 25;
      if (passwordData.newPassword.length >= 10) s += 25;
      if (/[A-Z]/.test(passwordData.newPassword)) s += 25;
      if (/[0-9]/.test(passwordData.newPassword)) s += 25;
      setPasswordStrength(s);
    } else setPasswordStrength(0);
  }, [passwordData.newPassword]);

  const tabs = [
    { id: 'account', label: 'Account', icon: User, desc: 'Personal info' },
    { id: 'security', label: 'Security', icon: Shield, desc: 'Password' },
    { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Theme' }
  ];

  const stats = [
    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A', icon: Calendar, color: 'blue' },
    { label: 'Email Status', value: 'Verified', icon: CheckCircle, color: 'green' },
    { label: 'Account Type', value: user?.role || 'Student', icon: Crown, color: 'purple' },
    { label: 'Last Active', value: 'Today', icon: Activity, color: 'pink' }
  ];

  const getStrengthColor = () => passwordStrength <= 25 ? 'bg-red-500' : passwordStrength <= 50 ? 'bg-yellow-500' : passwordStrength <= 75 ? 'bg-blue-500' : 'bg-green-500';
  const getStrengthText = () => passwordStrength <= 25 ? 'Weak' : passwordStrength <= 50 ? 'Fair' : passwordStrength <= 75 ? 'Good' : 'Strong';

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.updateProfile(profileData);
      setAuth(response.data.data, localStorage.getItem('token'));
      toast.success('✅ Profile updated successfully!');
      setHasChanges(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) return toast.error('Passwords do not match');
    if (passwordData.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      toast.success('🔒 Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-900/90 dark:via-purple-900/90 dark:to-pink-900/90">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay:'1s'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform"/>
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl border-2 border-white/20">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-6 h-6 text-white"/></div>
            </div>
            <div>
              <h1 className="text-5xl font-extrabold text-white mb-2">⚙️ Settings</h1>
              <p className="text-white/90 text-lg">Manage your account and preferences</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="currentColor" className="text-gray-50 dark:text-gray-900" d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,69.3C672,64,768,64,864,69.3C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s,i) => (
            <div key={s.label} className="scroll-animate group relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-700 hover:scale-105 overflow-hidden" style={{transitionDelay:`${i*50}ms`}}>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${s.color}-500/10 to-transparent rounded-full -mr-16 -mt-16`}></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-${s.color}-100 dark:bg-${s.color}-900/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <s.icon className={`w-5 h-5 text-${s.color}-600 dark:text-${s.color}-400`}/>
                  </div>
                  <Sparkles className={`w-4 h-4 text-${s.color}-500 opacity-0 group-hover:opacity-100 transition-opacity`}/>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{s.value}</div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="scroll-animate bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sticky top-8">
              <nav className="space-y-2">
                {tabs.map(t => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive?'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105':'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive?'bg-white/20':'bg-gray-100 dark:bg-gray-700'}`}>
                        <Icon className={`w-5 h-5 ${isActive?'animate-pulse':''}`}/>
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-bold text-sm">{t.label}</div>
                        <div className={`text-xs mt-0.5 ${isActive?'text-white/80':'text-gray-500 dark:text-gray-400'}`}>{t.desc}</div>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4"/>}
                    </button>
                  );
                })}
              </nav>
              <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">{user?.firstName} {user?.lastName}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</div>
                  </div>
                </div>
                <button onClick={() => { logout(); toast.success('Logged out'); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium">
                  <LogOut className="w-4 h-4"/>Sign Out
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="scroll-animate bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {activeTab==='account' && (
                <div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"><User className="w-6 h-6 text-white"/></div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">Account Information {hasChanges && <span className="text-xs font-normal px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">Unsaved</span>}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Update your personal details</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"><User className="w-4 h-4 text-blue-500"/>First Name <span className="text-red-500">*</span></label><input type="text" value={profileData.firstName} onChange={e=>setProfileData({...profileData,firstName:e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all" required/></div>
                      <div><label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"><User className="w-4 h-4 text-blue-500"/>Last Name <span className="text-red-500">*</span></label><input type="text" value={profileData.lastName} onChange={e=>setProfileData({...profileData,lastName:e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all" required/></div>
                    </div>
                    <div><label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"><Mail className="w-4 h-4 text-blue-500"/>Email <span className="text-red-500">*</span><span className="ml-auto text-xs font-normal px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3"/>Verified</span></label><input type="email" value={profileData.email} onChange={e=>setProfileData({...profileData,email:e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all" required/></div>
                    <div><label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"><Phone className="w-4 h-4 text-blue-500"/>Phone <span className="text-xs font-normal text-gray-500">(Optional)</span></label><input type="tel" value={profileData.phone} onChange={e=>setProfileData({...profileData,phone:e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all" placeholder="+1 (555) 123-4567"/></div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button type="button" onClick={()=>setProfileData(initialData)} disabled={!hasChanges} className="px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50">Reset</button>
                      <button type="submit" disabled={loading||!hasChanges} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 disabled:opacity-50 transition-all">{loading?<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Saving...</>:<><Save className="w-5 h-5"/>Save Changes<Sparkles className="w-4 h-4"/></>}</button>
                    </div>
                  </form>
                </div>
              )}
              {activeTab==='security' && (
                <div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"><Shield className="w-6 h-6 text-white"/></div>
                      <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Settings</h2><p className="text-gray-600 dark:text-gray-400 mt-1">Manage your password</p></div>
                    </div>
                  </div>
                  <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
                    <div><label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"><Lock className="w-4 h-4 text-purple-500"/>Current Password <span className="text-red-500">*</span></label><div className="relative"><input type={showPass.current?'text':'password'} value={passwordData.currentPassword} onChange={e=>setPasswordData({...passwordData,currentPassword:e.target.value})} className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all" required/><button type="button" onClick={()=>setShowPass({...showPass,current:!showPass.current})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{showPass.current?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}</button></div></div>
                    <div><label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"><Lock className="w-4 h-4 text-purple-500"/>New Password <span className="text-red-500">*</span></label><div className="relative"><input type={showPass.new?'text':'password'} value={passwordData.newPassword} onChange={e=>setPasswordData({...passwordData,newPassword:e.target.value})} className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all" required/><button type="button" onClick={()=>setShowPass({...showPass,new:!showPass.new})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{showPass.new?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}</button></div>{passwordData.newPassword && (<div className="mt-2"><div className="flex items-center justify-between text-xs mb-1"><span className="text-gray-600 dark:text-gray-400">Password Strength</span><span className={`font-semibold ${passwordStrength>75?'text-green-600':passwordStrength>50?'text-blue-600':passwordStrength>25?'text-yellow-600':'text-red-600'}`}>{getStrengthText()}</span></div><div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div className={`h-full ${getStrengthColor()} transition-all`} style={{width:`${passwordStrength}%`}}></div></div></div>)}</div>
                    <div><label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2"><Lock className="w-4 h-4 text-purple-500"/>Confirm Password <span className="text-red-500">*</span></label><div className="relative"><input type={showPass.confirm?'text':'password'} value={passwordData.confirmPassword} onChange={e=>setPasswordData({...passwordData,confirmPassword:e.target.value})} className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all" required/><button type="button" onClick={()=>setShowPass({...showPass,confirm:!showPass.confirm})} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{showPass.confirm?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}</button></div></div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4"><h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2"><Info className="w-4 h-4"/>Password Requirements:</h4><ul className="text-sm text-purple-800 dark:text-purple-400 space-y-1"><li className="flex items-center gap-2"><Check className="w-4 h-4"/>Minimum 6 characters</li><li className="flex items-center gap-2"><Check className="w-4 h-4"/>Must match confirmation</li></ul></div>
                    <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700"><button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 disabled:opacity-50 transition-all">{loading?<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Updating...</>:<><Lock className="w-5 h-5"/>Change Password<Sparkles className="w-4 h-4"/></>}</button></div>
                  </form>
                </div>
              )}
              {activeTab==='appearance' && (
                <div>
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg"><Palette className="w-6 h-6 text-white"/></div>
                      <div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Appearance Settings</h2><p className="text-gray-600 dark:text-gray-400 mt-1">Customize your theme</p></div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div><h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-yellow-500"/>Theme Preference</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button onClick={()=>theme==='dark'&&toggleTheme()} className={`p-8 rounded-2xl border-3 transition-all duration-300 hover:scale-105 ${theme==='light'?'border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 shadow-2xl scale-105':'border-gray-200 dark:border-gray-700 hover:shadow-xl'}`}><div className="flex flex-col items-center text-center"><div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${theme==='light'?'bg-gradient-to-br from-yellow-400 to-orange-400':'bg-gray-100 dark:bg-gray-700'}`}><Sun className="w-10 h-10 text-white"/></div><h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Light Mode</h4><p className="text-sm text-gray-600 dark:text-gray-400">Bright theme for daytime</p>{theme==='light' && <div className="mt-3 px-3 py-1 bg-yellow-600 text-white text-xs font-semibold rounded-full">Active ✓</div>}</div></button>
                      <button onClick={()=>theme==='light'&&toggleTheme()} className={`p-8 rounded-2xl border-3 transition-all duration-300 hover:scale-105 ${theme==='dark'?'border-purple-600 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 shadow-2xl scale-105':'border-gray-200 dark:border-gray-700 hover:shadow-xl'}`}><div className="flex flex-col items-center text-center"><div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${theme==='dark'?'bg-gradient-to-br from-purple-600 to-blue-600':'bg-gray-100 dark:bg-gray-700'}`}><Moon className="w-10 h-10 text-white"/></div><h4 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Dark Mode</h4><p className="text-sm text-gray-600 dark:text-gray-400">Easy on eyes at night</p>{theme==='dark' && <div className="mt-3 px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">Active ✓</div>}</div></button>
                    </div></div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"><div className="flex items-start gap-3"><Palette className="w-8 h-8 text-blue-600 dark:text-blue-400"/><div><h4 className="font-semibold text-gray-900 dark:text-white mb-1">Theme Persistence</h4><p className="text-sm text-gray-600 dark:text-gray-400">Your theme is saved automatically! 🎨✨</p></div></div></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
