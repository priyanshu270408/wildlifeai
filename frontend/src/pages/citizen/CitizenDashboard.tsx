import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Incident, Alert } from '../../types';
import {
  Shield, AlertTriangle, PlusCircle, CheckCircle, Clock,
  MapPin, Eye, BookOpen, Bell, ArrowRight
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [myIncidents, setMyIncidents] = useState<Incident[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      api.getIncidents(),
      api.getAlerts()
    ]).then(([incs, als]) => {
      setMyIncidents(incs);
      setAlerts(als);
    }).catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>;
      case 'submitted':
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> Under Review</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-forest-deep via-forest to-forest-emerald rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-forest-light text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4 text-forest-emerald" />
            <span>Community Conservation Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name || 'Community Resident'}
          </h1>
          <p className="text-xs md:text-sm text-forest-light/80 mt-1 max-w-xl">
            Location: {user?.general_location || 'Ramnagar Fringe Zone'} &bull; Stay vigilant and report any unusual wildlife encounters near settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/citizen/report"
            className="px-5 py-3 bg-white text-forest-deep rounded-2xl text-xs font-bold hover:bg-forest-light transition shadow-lg flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-forest-emerald" />
            <span>Report Wildlife Sighting</span>
          </Link>
          <Link
            to="/map"
            className="px-4 py-3 bg-forest-deep/60 border border-forest-light/30 text-white rounded-2xl text-xs font-semibold hover:bg-forest-deep transition flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-forest-light" />
            <span>View Map</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Reports & Tracking (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-forest-deep text-base">My Submitted Reports</h3>
                <p className="text-xs text-gray-500">Track verification and response status of your observations.</p>
              </div>
              <Link
                to="/citizen/report"
                className="text-xs font-semibold text-forest-emerald hover:underline flex items-center gap-1"
              >
                <span>New Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {myIncidents.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  You have not submitted any incident reports yet.
                </div>
              ) : (
                myIncidents.slice(0, 5).map(inc => (
                  <div key={inc.id} className="p-4 hover:bg-gray-50 transition flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-forest-deep">
                          {inc.species_common_name || 'Wildlife Sighting'}
                        </span>
                        {getStatusBadge(inc.verification_status)}
                        <span className="text-[10px] text-gray-400 font-mono">
                          ID: {inc.id.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-forest-emerald" />
                        <span>{inc.approximate_location}</span>
                      </div>
                      <p className="text-xs text-gray-500 italic line-clamp-1">
                        "{inc.description}"
                      </p>
                      <div className="text-[10px] text-gray-400">
                        {new Date(inc.event_timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        inc.severity === 'high' || inc.severity === 'critical'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {inc.severity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Safety Guidance Banner */}
          <div className="bg-forest-light/30 border border-forest-emerald/30 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-forest-emerald text-white flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-forest-deep text-sm mb-1">
                Seasonal Coexistence Safety Tips
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                During late autumn harvesting, wild elephants and boars often transit nocturnal water corridors. Avoid walking along canal trenches after dusk and ensure domestic livestock are secured in covered pens.
              </p>
              <Link
                to="/wildlife-safety"
                className="inline-block mt-2 text-xs font-semibold text-forest-emerald hover:underline"
              >
                Read Official Conservation Protocols &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Active Alerts (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="bg-forest-deep text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-forest-emerald" />
                <h3 className="font-bold text-xs uppercase tracking-wider">Verified Sector Advisories</h3>
              </div>
              <span className="bg-risk-critical text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {alerts.length} Active
              </span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500">
                  No critical alerts currently active for this sector.
                </div>
              ) : (
                alerts.map(al => (
                  <div key={al.id} className="p-4 hover:bg-gray-50 transition space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        al.severity === 'high' || al.severity === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {al.severity} Severity
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(al.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="font-bold text-forest-deep text-xs leading-snug">
                      {al.title}
                    </div>
                    <p className="text-[11px] text-gray-600 leading-snug">
                      {al.description}
                    </p>
                    <div className="text-[9px] text-forest-emerald font-semibold pt-1">
                      Issuing Authority: {al.issued_by_name || 'Forest Department Range Command'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
