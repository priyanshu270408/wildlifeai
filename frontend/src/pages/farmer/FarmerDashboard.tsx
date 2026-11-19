import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Incident, Alert, Species } from '../../types';
import {
  Shield, AlertTriangle, PlusCircle, Sprout, CheckCircle,
  Clock, MapPin, BarChart2, Bell, FileSpreadsheet
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Crop damage report modal state
  const [cropType, setCropType] = useState<string>('Maize (Corn)');
  const [areaAcres, setAreaAcres] = useState<number>(1.5);
  const [speciesId, setSpeciesId] = useState<string>('sp-wild-boar');
  const [farmLocation, setFarmLocation] = useState<string>('Plot 14, Wayanad Agro-Fringe Belt');
  const [damageDesc, setDamageDesc] = useState<string>('Sounder of wild boars uprooted 1.5 acres of newly seeded crops during nighttime hours.');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadData = () => {
    Promise.all([
      api.getIncidents(),
      api.getAlerts(),
      api.getSpecies()
    ]).then(([incs, als, sps]) => {
      setIncidents(incs.filter(i => i.incident_type === 'crop_damage' || i.reporter_id === user?.id));
      setAlerts(als);
      setSpeciesList(sps);
    }).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSubmitCropDamage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createIncident({
        incident_type: 'crop_damage',
        species_id: speciesId,
        description: `[Crop: ${cropType}, Area: ${areaAcres} Acres] ${damageDesc}`,
        latitude: 11.682,
        longitude: 76.331,
        approximate_location: farmLocation,
        severity: 'moderate',
        animal_count: 5,
        damage_details: { crop: cropType, acres: areaAcres },
        source_type: 'farmer_report',
        is_demo: true
      });
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Farmer Welcome Banner */}
      <div className="bg-gradient-to-r from-forest-deep via-forest to-emerald-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-forest-light text-xs font-semibold uppercase tracking-wider mb-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>Agricultural Conflict &amp; Crop Protection Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Farmer Field Portal &bull; {user?.full_name || 'Anand Patel'}
          </h1>
          <p className="text-xs md:text-sm text-forest-light/80 mt-1 max-w-xl">
            Location: {user?.general_location || 'Wayanad Tea & Pepper Sector'} &bull; Record agricultural damage, receive verified herd alerts, and maintain documented records for forest department verification.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-3 bg-white text-forest-deep rounded-2xl text-xs font-bold hover:bg-forest-light transition shadow-lg flex items-center gap-2 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-forest-emerald" />
          <span>Report Crop Damage</span>
        </button>
      </div>

      {/* Grid: Crop Damage History & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Crop Damage Reports Table (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-forest-deep text-base">Recorded Crop Damage Incidents</h3>
                <p className="text-xs text-gray-500">Official evidence trail for forest department verification.</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                {incidents.length} Records
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {incidents.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  No crop damage incidents recorded for this agricultural plot.
                </div>
              ) : (
                incidents.map(inc => (
                  <div key={inc.id} className="p-4 hover:bg-gray-50 transition flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-forest-deep">
                          {inc.species_common_name || 'Wild Herbivore'}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          {inc.verification_status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          ID: {inc.id.slice(0, 8)}...
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-forest-emerald" />
                        <span>{inc.approximate_location}</span>
                      </div>

                      <p className="text-xs text-gray-500 italic">
                        "{inc.description}"
                      </p>

                      <div className="text-[10px] text-gray-400">
                        Recorded: {new Date(inc.event_timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                        {inc.severity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Legal Compensation Disclaimer */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs text-gray-500 leading-relaxed">
            <strong>Notice on Agricultural Compensation:</strong> WILDSHIELD AI records, organizes, and verifies crop damage evidence with geospatial timestamps. Actual ex-gratia compensation and relief assessments remain under the exclusive jurisdiction of the State Forest Department and Revenue Authority.
          </div>
        </div>

        {/* Right: Verified Sector Alerts */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
            <div className="bg-forest-deep text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-forest-emerald" />
                <h3 className="font-bold text-xs uppercase tracking-wider">Nearby Farm Field Alerts</h3>
              </div>
              <span className="bg-risk-moderate text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {alerts.length} Active
              </span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[460px] overflow-y-auto">
              {alerts.map(al => (
                <div key={al.id} className="p-4 hover:bg-gray-50 transition space-y-1.5">
                  <div className="font-bold text-forest-deep text-xs leading-snug">
                    {al.title}
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    {al.description}
                  </p>
                  <div className="text-[9px] text-gray-400 pt-1">
                    Issued: {new Date(al.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CROP DAMAGE REPORTING MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-forest-deep flex items-center gap-2">
                <Sprout className="w-5 h-5 text-forest-emerald" />
                <span>Log Farmland Crop Damage</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCropDamage} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Crop Variety</label>
                <input
                  type="text"
                  required
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  placeholder="e.g. Maize, Paddy, Sugarcane, Pepper, Banana..."
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-emerald"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Affected Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Suspected Species</label>
                  <select
                    value={speciesId}
                    onChange={(e) => setSpeciesId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl focus:outline-none"
                  >
                    {speciesList.map(s => (
                      <option key={s.id} value={s.id}>{s.common_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Agricultural Location</label>
                <input
                  type="text"
                  required
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Damage Description</label>
                <textarea
                  rows={3}
                  required
                  value={damageDesc}
                  onChange={(e) => setDamageDesc(e.target.value)}
                  placeholder="Describe when damage occurred, fence breaches, or footprint evidence..."
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-gray-600 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-forest-emerald text-white rounded-xl font-bold hover:bg-emerald-600 shadow"
                >
                  {submitting ? 'Submitting...' : 'Save Official Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
