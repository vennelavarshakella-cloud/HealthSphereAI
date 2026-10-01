/**
 * HealthSphere AI - Navigation & Accessibility Bar
 */

import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Users,
  Sparkles,
  ShieldAlert,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Type,
  Bell,
  User as UserIcon,
  Menu,
  X,
  Database,
  Pill,
  Apple,
  Brain,
  Smile,
  LogOut,
  ChevronDown,
  Info,
  MessageSquare,
} from 'lucide-react';
import { User, NotificationItem, ElderAccessibilityConfig } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  elderConfig: ElderAccessibilityConfig;
  onToggleLargeFont: () => void;
  onToggleHighContrast: () => void;
  onToggleSpeech: () => void;
  isSpeaking: boolean;
  onStopSpeech: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
  notifications,
  onMarkNotificationRead,
  elderConfig,
  onToggleLargeFont,
  onToggleHighContrast,
  onToggleSpeech,
  isSpeaking,
  onStopSpeech,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const navLinks = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'n8n-chat', label: 'n8n Chat', icon: MessageSquare, badge: 'AI' },
    { id: 'ai-guardian', label: 'AI Guardian', icon: Sparkles, badge: 'AI' },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'womens-wellness', label: "Women's Health", icon: Smile },
    { id: 'mental-wellness', label: 'Mental Care', icon: Brain },
    { id: 'elder-care', label: 'Elder Care', icon: Heart, highlight: true },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'medicines', label: 'Medications', icon: Pill },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'emergency', label: 'Emergency SOS', icon: ShieldAlert, urgent: true },
    { id: 'admin', label: 'Admin & DB', icon: Database },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      {/* Top Elder Care & SDG 3 Banner */}
      <div className="bg-linear-to-r from-sky-900 via-indigo-900 to-teal-900 text-white text-xs px-4 py-1.5 flex flex-wrap justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-400/30">
            UN SDG Goal 3: Good Health & Well-Being
          </span>
          <span className="hidden md:inline text-sky-200">
            Preventive Clinical AI • 24/7 Guardian Assistance
          </span>
        </div>

        {/* Accessibility Tools for Elderly & Visually Impaired */}
        <div className="flex items-center gap-3">
          <span className="text-slate-300 text-[11px] font-medium hidden sm:inline">Accessibility:</span>
          <button
            onClick={onToggleLargeFont}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition ${
              elderConfig.largeFont
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-slate-100'
            }`}
            title="Toggle Larger Text size for elders"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{elderConfig.largeFont ? 'Large A+' : 'Font A'}</span>
          </button>

          <button
            onClick={onToggleHighContrast}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition ${
              elderConfig.highContrast
                ? 'bg-yellow-400 text-black font-bold'
                : 'bg-white/10 hover:bg-white/20 text-slate-100'
            }`}
            title="Toggle High Contrast Mode"
          >
            {elderConfig.highContrast ? <Sun className="w-3.5 h-3.5 text-black" /> : <Moon className="w-3.5 h-3.5" />}
            <span>Contrast</span>
          </button>

          <button
            onClick={isSpeaking ? onStopSpeech : onToggleSpeech}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse font-bold'
                : 'bg-white/10 hover:bg-white/20 text-slate-100'
            }`}
            title="Voice screen reader aloud"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-sky-600 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-linear-to-r from-sky-950 via-blue-900 to-teal-900 bg-clip-text text-transparent">
                  HealthSphere
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Smart Preventive Healthcare
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;

              if (link.urgent) {
                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm hover:shadow-red-500/30 transition animate-bounce"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>SOS 911</span>
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1 py-0.2 rounded font-bold">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Notifications, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Emergency button for mobile & tablet */}
            <button
              onClick={() => onNavigate('emergency')}
              className="xl:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-xs"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <span className="font-bold text-slate-800 text-sm">Health Alerts & Reminders</span>
                    <span className="text-xs text-sky-600 font-medium">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No new notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => onMarkNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl text-xs cursor-pointer transition ${
                            n.is_read ? 'bg-slate-50 text-slate-500' : 'bg-sky-50/70 border border-sky-100 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{n.title}</span>
                            {!n.is_read && <span className="w-2 h-2 rounded-full bg-sky-500"></span>}
                          </div>
                          <p className="mt-1 text-slate-600 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.created_at}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.full_name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-semibold text-slate-800 truncate max-w-[100px]">
                      {currentUser.full_name}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize">{currentUser.role}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{currentUser.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded">
                        {currentUser.role}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>User Profile & Health ID</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('family');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Family Member Profiles</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Database className="w-3.5 h-3.5 text-slate-400" />
                      <span>Database Inspector</span>
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm hover:shadow-sky-500/20 transition flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In / Demo</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium text-left transition ${
                    isActive
                      ? 'bg-sky-600 text-white font-bold'
                      : link.urgent
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-600'}`} />
                  <span className="truncate">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="text-[11px] text-slate-500 mb-2 font-medium">Quick Links & Information:</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onNavigate('about');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-sky-700 underline font-medium px-2 py-1"
              >
                About SDG 3
              </button>
              <button
                onClick={() => {
                  onNavigate('services');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-sky-700 underline font-medium px-2 py-1"
              >
                All 18 Services
              </button>
              <button
                onClick={() => {
                  onNavigate('contact');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-sky-700 underline font-medium px-2 py-1"
              >
                Help & Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
