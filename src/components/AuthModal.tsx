import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  UserCheck, 
  Building2, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Sparkles, 
  Key, 
  LogOut, 
  Lock, 
  Mail, 
  User, 
  Shield, 
  Download,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { 
  SaaSUser, 
  UserRole, 
  SubscriptionPlanId, 
  OrganizationEntity, 
  SubscriptionStatus 
} from '../types/portfolio.ts';
import { 
  INITIAL_USERS, 
  PortfolioService, 
  SUBSCRIPTION_PLANS, 
  FREEMIUM_SUBSCRIPTION 
} from '../services/portfolioService.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SaaSUser;
  onLogin: (user: SaaSUser) => void;
  onRegister: (user: SaaSUser, entity: OrganizationEntity, planId: SubscriptionPlanId) => void;
  onLogout: () => void;
  subscription: SubscriptionStatus;
  onOpenPricing: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onRegister,
  onLogout,
  subscription,
  onOpenPricing
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'PROFILE'>('LOGIN');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpTitle, setSignUpTitle] = useState('Senior Financial Accountant');
  const [signUpRole, setSignUpRole] = useState<UserRole>('PREPARER');
  const [signUpCompany, setSignUpCompany] = useState('');
  const [signUpCurrency, setSignUpCurrency] = useState('USD');
  const [signUpPlan, setSignUpPlan] = useState<SubscriptionPlanId>('FREEMIUM');
  const [formError, setFormError] = useState<string | null>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Profile Edit State
  const [editTitle, setEditTitle] = useState(currentUser.title);
  const [is2FAEnabled, setIs2FAEnabled] = useState(currentUser.twoFactorEnabled ?? true);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (demoUser: SaaSUser) => {
    onLogin(demoUser);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim()) {
      setLoginError('Please enter your work email.');
      return;
    }

    // Match with existing or demo users
    const matchedUser = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (matchedUser) {
      onLogin(matchedUser);
      onClose();
    } else {
      // Create user session for any valid email
      const customUser: SaaSUser = {
        id: `usr-${Date.now()}`,
        name: loginEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: loginEmail.trim(),
        role: 'REVIEWER',
        title: 'Finance Manager',
        avatarColor: 'bg-indigo-600',
        planId: 'FREEMIUM',
        companyName: 'Private Enterprise'
      };
      onLogin(customUser);
      onClose();
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!signUpName.trim()) {
      setFormError('Full name is required.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setFormError('A valid corporate email is required.');
      return;
    }
    if (signUpPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    const companyName = signUpCompany.trim() || 'My Organization';
    const newEntity: OrganizationEntity = {
      id: `ent-${Date.now()}`,
      name: companyName,
      legalEntityCode: `ORG-${Math.floor(100 + Math.random() * 900)}`,
      country: 'Global Jurisdiction',
      currency: signUpCurrency,
      fiscalYearEnd: '12-31',
      taxId: `TAX-${Math.floor(100000 + Math.random() * 900000)}`
    };

    const newUser: SaaSUser = {
      id: `usr-${Date.now()}`,
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      role: signUpRole,
      title: signUpTitle.trim() || 'Financial Analyst',
      avatarColor: 'bg-blue-600',
      companyName,
      planId: signUpPlan,
      twoFactorEnabled: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onRegister(newUser, newEntity, signUpPlan);
    onClose();
  };

  const handleUpdateProfile = () => {
    const updatedUser: SaaSUser = {
      ...currentUser,
      title: editTitle,
      twoFactorEnabled: is2FAEnabled
    };
    PortfolioService.saveCurrentUser(updatedUser);
    setProfileSuccessMsg('Profile updated successfully.');
    setTimeout(() => setProfileSuccessMsg(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-[#0F172A] text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">FINOSUTRA SaaS</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {subscription.planId === 'FREEMIUM' ? 'FREEMIUM STARTER' : subscription.planName}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Institutional IFRS 16 Authentication &amp; User Profile Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Segment Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-5 pt-3 gap-2">
          <button
            onClick={() => setMode('LOGIN')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              mode === 'LOGIN'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => setMode('SIGNUP')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              mode === 'SIGNUP'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account (Freemium)</span>
          </button>

          <button
            onClick={() => setMode('PROFILE')}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              mode === 'PROFILE'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Active Profile &amp; Security</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: LOG IN */}
          {mode === 'LOGIN' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Sign in to your Finosutra Account</h3>
                <p className="text-xs text-slate-500">
                  Access your organization leases, amortisation schedules, and group reporting workpapers.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. elena.rostova@acmeglobal.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password reset link sent to registered email.');
                      }}
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Finosutra</span>
                </button>
              </form>

              {/* Quick Persona Switcher for Instant Testing */}
              <div className="border-t border-slate-200 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Or 1-Click Sign In (Instant Role Demo):
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Simulated Auth</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INITIAL_USERS.map((usr) => (
                    <button
                      key={usr.id}
                      onClick={() => handleQuickLogin(usr)}
                      className={`text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition cursor-pointer flex items-center gap-2.5 ${
                        currentUser.id === usr.id ? 'bg-blue-50 border-blue-400' : 'bg-white'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 ${usr.avatarColor}`}>
                        {usr.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {usr.name.split(',')[0]}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {usr.role.replace(/_/g, ' ')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIGN UP / CREATE ACCOUNT (FREEMIUM) */}
          {mode === 'SIGNUP' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Create your Finosutra Account</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Freemium Tier Included
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Instant free access forever. Manage up to 3 leases, generate IFRS 16 journals, and export Excel models with no credit card required.
                </p>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Foster, CPA"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Corporate Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@yourfirm.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password (min 6 chars) *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Create password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Job Title / Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Finance Controller"
                      value={signUpTitle}
                      onChange={(e) => setSignUpTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Foster Advisory Group"
                      value={signUpCompany}
                      onChange={(e) => setSignUpCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Role
                    </label>
                    <select
                      value={signUpRole}
                      onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="PREPARER">Preparer (Calculates &amp; drafts)</option>
                      <option value="REVIEWER">Reviewer (Controller &amp; Approver)</option>
                      <option value="EXTERNAL_AUDITOR">External Auditor (Read-only workpapers)</option>
                      <option value="ADMIN">Workspace Admin (Full governance)</option>
                    </select>
                  </div>
                </div>

                {/* Plan Selection Box */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Choose Starting Plan:</span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPricing();
                      }}
                      className="text-blue-600 hover:underline text-[11px]"
                    >
                      View Feature Comparison →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSignUpPlan('FREEMIUM')}
                      className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                        signUpPlan === 'FREEMIUM'
                          ? 'bg-white border-blue-600 ring-1 ring-blue-600 shadow-xs'
                          : 'bg-white/60 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Freemium Starter</span>
                        <span className="font-bold text-xs text-emerald-600">$0 Free</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Up to 3 active leases, 1 entity, full amortization &amp; Excel.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignUpPlan('CORPORATE')}
                      className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                        signUpPlan === 'CORPORATE'
                          ? 'bg-white border-blue-600 ring-1 ring-blue-600 shadow-xs'
                          : 'bg-white/60 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Corporate Trial</span>
                        <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">14-Day Free</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        75 leases, multi-currency, note disclosures, 10 team seats.
                      </p>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account &amp; Launch Workspace</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: USER PROFILE & SECURITY */}
          {mode === 'PROFILE' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${currentUser.avatarColor}`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{currentUser.name}</h3>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {currentUser.role.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {subscription.planId === 'FREEMIUM' ? 'FREEMIUM STARTER' : subscription.planName}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>

              {profileSuccessMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              {/* Editable Profile Fields */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Profile Details
                </h4>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Job Title / Organizational Position
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Two-Factor Authentication (2FA)</div>
                    <div className="text-[11px] text-slate-500">Require TOTP authenticator code on sign-in</div>
                  </div>
                  <button
                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                      is2FAEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {is2FAEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <button
                  onClick={handleUpdateProfile}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>

              {/* Active Plan Quota Summary */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Subscription &amp; Quota
                  </h4>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPricing();
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Upgrade Plan →
                  </button>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Tier:</span>
                    <span className="font-bold text-slate-900">
                      {subscription.planId === 'FREEMIUM' ? 'Freemium Starter ($0)' : subscription.planName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Leases Quota:</span>
                    <span className="font-mono font-semibold text-blue-600">
                      {subscription.leasesUsed} / {subscription.leasesMax === -1 ? 'Unlimited' : subscription.leasesMax} Contracts
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">User Seats:</span>
                    <span className="font-mono font-semibold text-indigo-600">
                      {subscription.seatsUsed} / {subscription.seatsMax} Seats
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
