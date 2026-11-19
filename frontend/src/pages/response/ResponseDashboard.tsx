import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Incident } from '../../types';
import { Shield, MapPin, CheckCircle, Navigation, Clock, AlertCircle } from 'lucide-react';

export const ResponseDashboard: React.FC = () => {
  const [assignedIncidents, setAssignedIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>('Elephant herd safely redirected across corridor into reserve forest with bio-acoustic sirens.');

  useEffect(() => {
    api.getIncidents({ verification_status: 'verified' }).then(incs => {
      // Filter incidents that are assigned or active
      setAssignedIncidents(incs.filter(i => i.workflow_status === 'assigned' || i.severity === 'high'));
    }).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Response Team Banner */}
      <div className="bg-forest-deep rounded-3xl p-6 md:p-8 text-white shadow-xl border border-forest-emerald/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-forest-emerald text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            <span>Field Rapid Conflict Response Unit (RCRT-1)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Tactical Incident Dispatch &amp; Operations
          </h1>
          <p className="text-xs md:text-sm text-surface-muted mt-1">
            Sector 2 Northern Fringe Patrol &bull; Authorized Tranquilization &amp; Crowd Dispersion Gear Active
          </p>
        </div>

        <div className="bg-forest px-4 py-2 rounded-2xl border border-forest-emerald/40 text-xs text-forest-light font-semibold">
          Unit Status: DISPATCH READY
        </div>
      </div>

      {/* Assigned Operations List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-forest-deep text-lg">Assigned Incidents</h3>
          {assignedIncidents.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow text-center text-xs text-gray-500">
              No active field dispatches assigned at this moment.
            </div>
          ) : (
            assignedIncidents.map(inc => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`bg-white p-6 rounded-2xl shadow border-2 cursor-pointer transition space-y-3 ${
                  selectedIncident?.id === inc.id
                    ? 'border-forest-emerald bg-forest-light/10 shadow-lg'
                    : 'border-gray-200 hover:border-forest-emerald/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base text-forest-deep">
                    {inc.species_common_name || 'Wildlife Sighting'}
                  </span>
                  <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {inc.severity} Priority
                  </span>
                </div>

                <div className="text-xs text-gray-600 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-forest-emerald flex-shrink-0" />
                  <span className="font-semibold">{inc.approximate_location}</span>
                </div>

                <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  "{inc.description}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-100">
                  <div>Count: {inc.animal_count} animal(s)</div>
                  <div>Status: {inc.workflow_status.toUpperCase()}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tactical Actions Panel */}
        <div>
          {selectedIncident ? (
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 space-y-4">
              <h3 className="font-bold text-forest-deep text-base">Field Tactical Action</h3>
              <p className="text-xs text-gray-500">
                Update progress for incident {selectedIncident.id.slice(0, 8)}...
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Update Status</label>
                  <select className="w-full px-3 py-2 border rounded-xl focus:outline-none">
                    <option>En Route to Sector</option>
                    <option>On-Site Perimeter Secured</option>
                    <option>Herd Redirection in Progress</option>
                    <option>Incident Successfully Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Resolution Summary Notes</label>
                  <textarea
                    rows={4}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none"
                  ></textarea>
                </div>

                <button
                  onClick={() => alert('Field status and resolution notes updated successfully in operational log.')}
                  className="w-full py-2.5 bg-forest-emerald text-white rounded-xl font-bold hover:bg-emerald-600 shadow transition"
                >
                  Submit Operational Update
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow border border-gray-200 text-center text-xs text-gray-500">
              Select an incident from the assigned list to record on-site tactical updates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
