import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Incident, AnalyticsOverview, ResponseTeam } from '../../types';
import {
  Shield, CheckCircle, XCircle, AlertTriangle, Send, Users,
  MapPin, Clock, Search, Filter, RefreshCw, FileText, Sparkles
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [teams, setTeams] = useState<ResponseTeam[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Verification & Dispatch Modal States
  const [verifyModalOpen, setVerifyModalOpen] = useState<boolean>(false);
  const [verifyNotes, setVerifyNotes] = useState<string>('Verified by ground patrol footprint transect.');
  const [issueAlert, setIssueAlert] = useState<boolean>(true);
  const [alertTitle, setAlertTitle] = useState<string>('');
  const [alertDesc, setAlertDesc] = useState<string>('');

  const [assignModalOpen, setAssignModalOpen] = useState<boolean>(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [assignPriority, setAssignPriority] = useState<string>('high');
  const [assignInstructions, setAssignInstructions] = useState<string>('Deploy 4WD unit with acoustic sirens. Monitor herd direction without close approach.');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const loadData = () => {
    Promise.all([
      api.getIncidents(),
      api.getTeams(),
      api.getAnalyticsOverview()
    ]).then(([incs, tms, ov]) => {
      setIncidents(incs);
      setTeams(tms);
      if (tms.length > 0) setSelectedTeamId(tms[0].id);
      setOverview(ov);
    }).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredIncidents = incidents.filter(i => {
    if (filterStatus === 'all') return true;
    return i.verification_status === filterStatus;
  });

  const handleOpenVerify = (inc: Incident) => {
    setSelectedIncident(inc);
    setAlertTitle(`Verified Wildlife Sighting: ${inc.species_common_name || 'Wildlife'}`);
    setAlertDesc(`Range Officer verified presence near ${inc.approximate_location}. Local communities advised to maintain distance.`);
    setVerifyModalOpen(true);
  };

  const handleConfirmVerify = async () => {
    if (!selectedIncident) return;
    setIsProcessing(true);
    try {
      await api.verifyIncident(selectedIncident.id, {
        severity: selectedIncident.severity,
        notes: verifyNotes,
        issue_alert: issueAlert,
        alert_title: alertTitle,
        alert_description: alertDesc
      });
      setVerifyModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(`Verification error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenAssign = (inc: Incident) => {
    setSelectedIncident(inc);
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedIncident) return;
    setIsProcessing(true);
    try {
      await api.assignIncident(selectedIncident.id, {
        team_id: selectedTeamId,
        priority: assignPriority,
        instructions: assignInstructions
      });
      setAssignModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(`Dispatch error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Header */}
      <div className="bg-forest-deep rounded-3xl p-6 md:p-8 text-white shadow-xl border border-forest-emerald/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-forest-emerald text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            <span>Division Range Command Centre &bull; Authorized Officer Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Wildlife Conflict Incident Command
          </h1>
          <p className="text-xs md:text-sm text-surface-muted mt-1">
            Officer: {user?.full_name || 'Range Officer'} &bull; Northern Corridor Operational Jurisdiction
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 bg-forest hover:bg-forest-emerald text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* KPI Cards (Calculated from actual database records) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Incidents', value: overview?.total_incidents ?? '-', filter: 'all', color: 'text-white' },
          { label: 'Pending Review', value: overview?.pending_verification ?? '-', filter: 'submitted', color: 'text-risk-moderate' },
          { label: 'Verified Sightings', value: overview?.verified_incidents ?? '-', filter: 'verified', color: 'text-risk-low' },
          { label: 'Active Teams', value: overview?.active_responses ?? '-', filter: 'assigned', color: 'text-blue-400' },
          { label: 'High Risk Zones', value: overview?.high_risk_zones_count ?? '-', filter: 'all', color: 'text-risk-high' },
          { label: 'Resolved Cases', value: overview?.resolved_incidents ?? '-', filter: 'resolved', color: 'text-forest-light' },
        ].map((kpi, idx) => (
          <div
            key={idx}
            onClick={() => setFilterStatus(kpi.filter)}
            className={`p-4 rounded-2xl cursor-pointer transition border ${
              filterStatus === kpi.filter
                ? 'bg-forest-deep border-forest-emerald text-white shadow-lg'
                : 'bg-white border-gray-200 hover:border-forest-emerald/40'
            }`}
          >
            <div className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
              {kpi.label}
            </div>
            <div className={`text-2xl font-extrabold mt-1 ${filterStatus === kpi.filter ? 'text-forest-light' : 'text-forest-deep'}`}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Incident Management Queue */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-forest-deep text-lg">Operational Verification Queue</h3>
            <p className="text-xs text-gray-500">Review community reports, verify taxonomic identification, and issue advisories.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Filter Status:</span>
            {['all', 'submitted', 'verified'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  filterStatus === st
                    ? 'bg-forest text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st === 'submitted' ? 'Pending Review' : st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="p-3.5 font-bold">Incident ID / Date</th>
                <th className="p-3.5 font-bold">Species</th>
                <th className="p-3.5 font-bold">Location</th>
                <th className="p-3.5 font-bold">Severity</th>
                <th className="p-3.5 font-bold">Status</th>
                <th className="p-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No incidents matching current filter.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map(inc => (
                  <tr key={inc.id} className="hover:bg-gray-50 transition">
                    <td className="p-3.5 font-mono text-[11px]">
                      <div className="font-bold text-forest-deep">{inc.id.slice(0, 10)}...</div>
                      <div className="text-gray-400 text-[10px]">
                        {new Date(inc.event_timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-forest-deep">{inc.species_common_name || 'Unidentified'}</div>
                      <div className="text-gray-400 italic text-[10px]">{inc.species_scientific_name || ''}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-forest-emerald" />
                        <span>{inc.approximate_location}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        inc.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        inc.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        inc.verification_status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                        inc.verification_status === 'submitted' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {inc.verification_status === 'submitted' ? 'Pending Review' : inc.verification_status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {inc.verification_status === 'submitted' && (
                        <button
                          onClick={() => handleOpenVerify(inc)}
                          className="px-2.5 py-1 bg-forest-emerald text-white font-semibold rounded text-[11px] hover:bg-emerald-600 transition"
                        >
                          Verify & Alert
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenAssign(inc)}
                        className="px-2.5 py-1 bg-forest-deep text-white font-semibold rounded text-[11px] hover:bg-forest transition"
                      >
                        Dispatch Team
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VERIFICATION MODAL */}
      {verifyModalOpen && selectedIncident && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-forest-deep">
              Formal Officer Incident Verification
            </h3>
            <p className="text-xs text-gray-500">
              Verifying incident {selectedIncident.id.slice(0, 8)}... ({selectedIncident.species_common_name}).
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Field Verification Notes & Evidence
                </label>
                <textarea
                  rows={2}
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-forest-emerald focus:outline-none"
                ></textarea>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chkAlert"
                    checked={issueAlert}
                    onChange={(e) => setIssueAlert(e.target.checked)}
                    className="w-4 h-4 text-forest-emerald rounded"
                  />
                  <label htmlFor="chkAlert" className="text-xs font-bold text-forest-deep">
                    Publish Public Community Safety Advisory
                  </label>
                </div>

                {issueAlert && (
                  <div className="space-y-2 pt-2">
                    <input
                      type="text"
                      value={alertTitle}
                      onChange={(e) => setAlertTitle(e.target.value)}
                      placeholder="Advisory Title"
                      className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={alertDesc}
                      onChange={(e) => setAlertDesc(e.target.value)}
                      placeholder="Safety instructions for surrounding residents..."
                      className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none"
                    ></textarea>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVerify}
                disabled={isProcessing}
                className="px-5 py-2 bg-forest-emerald text-white rounded-xl text-xs font-bold hover:bg-emerald-600 shadow"
              >
                {isProcessing ? 'Verifying...' : 'Confirm Verification'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEAM ASSIGNMENT MODAL */}
      {assignModalOpen && selectedIncident && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-forest-deep">
              Dispatch Rapid Response Team
            </h3>
            <p className="text-xs text-gray-500">
              Assign specialized conflict management personnel to incident {selectedIncident.id.slice(0, 8)}...
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Select Unit
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-emerald"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.team_name} ({t.region}) - Status: {t.team_status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Priority Level
                </label>
                <select
                  value={assignPriority}
                  onChange={(e) => setAssignPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Immediate Dispatch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Operational Directives & Instructions
                </label>
                <textarea
                  rows={3}
                  value={assignInstructions}
                  onChange={(e) => setAssignInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl focus:outline-none"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                disabled={isProcessing}
                className="px-5 py-2 bg-forest text-white rounded-xl text-xs font-bold hover:bg-forest-deep shadow"
              >
                {isProcessing ? 'Dispatching...' : 'Dispatch Unit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
