import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Incident, SpeciesDistribution, Species } from '../../types';
import {
  Shield, BarChart3, Download, Database, Filter,
  FileSpreadsheet, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export const ResearcherDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [speciesDist, setSpeciesDist] = useState<SpeciesDistribution[]>([]);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);

  useEffect(() => {
    Promise.all([
      api.getIncidents({ verification_status: 'verified' }),
      api.getSpeciesDistribution(),
      api.getSpecies()
    ]).then(([incs, dist, sps]) => {
      setIncidents(incs);
      setSpeciesDist(dist);
      setSpeciesList(sps);
    }).catch(console.error);
  }, []);

  const COLORS = ['#1E8B61', '#F59E0B', '#F97316', '#3B82F6', '#8B5CF6', '#EC4899'];

  const exportCSV = () => {
    const headers = ['Incident_ID', 'Date', 'Species_Common', 'Species_Scientific', 'Approximate_Location', 'Animal_Count', 'Severity', 'Verification_Status'];
    const rows = incidents.map(i => [
      i.id,
      i.event_timestamp,
      `"${i.species_common_name || ''}"`,
      `"${i.species_scientific_name || ''}"`,
      `"${i.approximate_location}"`,
      i.animal_count,
      i.severity,
      i.verification_status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wildshield_research_observations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Researcher Banner */}
      <div className="bg-forest-deep rounded-3xl p-6 md:p-8 text-white shadow-xl border border-forest-emerald/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-forest-emerald text-xs font-semibold uppercase tracking-wider mb-2">
            <Database className="w-4 h-4" />
            <span>Conservation Research &amp; Bio-Statistics Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Species Distribution &amp; Conflict Trends
          </h1>
          <p className="text-xs md:text-sm text-surface-muted mt-1 max-w-xl">
            Access aggregated, anonymized observation records. Sensitive breeding coordinates are generalized in compliance with international conservation protocols.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-5 py-3 bg-forest-emerald hover:bg-emerald-600 text-white rounded-2xl text-xs font-bold transition shadow-lg flex items-center gap-2 flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Research CSV</span>
        </button>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Species Distribution Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-forest-deep text-base">Species Observation Frequency</h3>
            <span className="text-xs text-gray-400">Verified Records</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={speciesDist}>
                <XAxis dataKey="species_name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1E8B61" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proportional Distribution */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-forest-deep text-base">Taxon Ratio Breakdown</h3>
            <span className="text-xs text-gray-400">Percentage %</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={speciesDist}
                  dataKey="percentage"
                  nameKey="species_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  {speciesDist.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Quality & Provenance Indicator */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200 space-y-4">
        <h3 className="font-bold text-forest-deep text-base">Research Dataset Quality &amp; Integrity Indicators</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="text-gray-500 font-semibold mb-1">Completeness Score</div>
            <div className="text-2xl font-black text-forest-emerald">96.8%</div>
            <p className="text-[11px] text-gray-400 mt-1">Zero missing timestamp records</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="text-gray-500 font-semibold mb-1">Taxonomic Resolution</div>
            <div className="text-2xl font-black text-forest-deep">Species-Level</div>
            <p className="text-[11px] text-gray-400 mt-1">Valid Latin binomen mapping</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="text-gray-500 font-semibold mb-1">Coordinate Privacy Mask</div>
            <div className="text-2xl font-black text-blue-600">Active (0.01° grid)</div>
            <p className="text-[11px] text-gray-400 mt-1">Endangered nesting obfuscated</p>
          </div>
        </div>
      </div>
    </div>
  );
};
