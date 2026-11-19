import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { translations } from '../../locales/translations';
import {
  Shield, Compass, AlertTriangle, FileText, BarChart3,
  Bell, Globe, Menu, X, CheckCircle, User
} from 'lucide-react';
import { api } from '../../services/api';
import { NotificationItem } from '../../types';

export const Navbar: React.FC = () => {
  const { user, role, language, setLanguage } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const location = useLocation();

  const t = translations[language];

  useEffect(() => {
    if (user) {
      api.getNotifications()
        .then(setNotifications)
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const markAllRead = async () => {
    for (const n of notifications.filter(n => !n.read_at)) {
      await api.markNotificationRead(n.id);
    }
    setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
  };

  // Role dashboard router path
  const getDashboardPath = () => {
    switch (role) {
      case 'officer': return '/officer/dashboard';
      case 'farmer': return '/farmer/dashboard';
      case 'researcher': return '/research/dashboard';
      case 'response_team': return '/response/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/citizen/dashboard';
    }
  };

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: getDashboardPath(), label: t.nav.dashboard },
    { to: '/citizen/report', label: t.nav.report },
    { to: '/map', label: t.nav.map },
    { to: '/wildlife-safety', label: t.nav.safety },
    { to: '/species', label: t.nav.species },
  ];

  return (
    <header className="sticky top-0 z-40 bg-forest text-white border-b border-forest-deep shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-forest-emerald flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight leading-none text-white">
              WILDSHIELD <span className="text-forest-light text-sm font-semibold">AI</span>
            </div>
            <div className="text-[10px] tracking-widest uppercase text-forest-light/70 font-mono mt-0.5">
              wildomang &bull; Predict. Protect. Prevent.
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-forest-deep text-white font-semibold'
                    : 'text-forest-light/90 hover:text-white hover:bg-forest-deep/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-forest-deep/80 hover:bg-forest-deep text-forest-light font-medium transition"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-forest-emerald" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-lg bg-forest-deep/80 hover:bg-forest-deep text-forest-light transition"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-risk-critical text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-surface-charcoal rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="bg-forest-deep text-white p-3 flex items-center justify-between">
                  <div className="font-semibold text-xs flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-forest-emerald" />
                    <span>Live Advisories & Alerts</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-forest-light hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-surface-muted">
                      No active advisories for your sector.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 text-xs hover:bg-gray-50 transition ${
                          !n.read_at ? 'bg-forest-light/20 font-medium' : ''
                        }`}
                      >
                        <div className="font-semibold text-forest-deep text-xs">
                          {n.title}
                        </div>
                        <div className="text-gray-600 text-[11px] mt-1 leading-snug">
                          {n.message}
                        </div>
                        <div className="text-[9px] text-gray-400 mt-1">
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Role Pill */}
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-forest-deep">
            <div className="w-7 h-7 rounded-full bg-forest-emerald/20 border border-forest-emerald flex items-center justify-center text-forest-light text-xs font-bold">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left text-xs">
              <div className="font-semibold leading-none text-white capitalize">
                {user?.full_name || 'Demo Citizen'}
              </div>
              <div className="text-[10px] text-forest-light/70 uppercase tracking-wider font-mono">
                {role}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-forest-light hover:text-white hover:bg-forest-deep"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-forest-deep border-t border-forest px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-forest-light hover:text-white hover:bg-forest"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
