import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Incident, GeographicalArea, Species } from '../../types';
import { IntelligenceMap } from '../../components/maps/IntelligenceMap';
import { Shield, Layers, MapPin, Eye, AlertTriangle, Sparkles } from 'lucide-react';

export const MapPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [areas, setAreas] = useState<GeographicalArea[]>([]);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    Promise.all([
      api.getIncidents(),
      api.getRiskAreas(),
      api.getSpecies()
    ]).then(([incs, ars, sps]) => {
      setIncidents(incs);
      setAreas(ars);
      setSpeciesList(sps);
    }).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-forest-emerald font-bold text-xs uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Geospatial Intelligence Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-deep tracking-tight">
            Wildlife Sighting &amp; Conflict Risk Map
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time verified sightings combined with time-decayed conflict risk overlays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-forest-light text-forest-deep px-3 py-1 rounded-full text-xs font-semibold">
            {incidents.length} Sightings
          </span>
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
            {areas.length} Monitored Corridors
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Map (3 cols) */}
        <div className="lg:col-span-3">
          <IntelligenceMap
            incidents={incidents}
            areas={areas}
            speciesList={speciesList}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
            height="680px"
          />
        </div>

        {/* Selected Incident Drawer / Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5 space-y-4">
            <h3 className="font-bold text-forest-deep text-sm uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-forest-emerald" />
              <span>Sighting Details</span>
            </h3>

            {selectedIncident ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    selectedIncident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    selectedIncident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedIncident.severity} Severity
                  </span>
                  <h4 className="font-extrabold text-forest-deep text-base mt-1.5">
                    {selectedIncident.species_common_name || 'Wildlife Sighting'}
                  </h4>
                  <div className="text-[11px] text-gray-500 italic">
                    {selectedIncident.species_scientific_name || ''}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5 text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-forest-emerald" />
                    <span className="font-semibold">{selectedIncident.approximate_location}</span>
                  </div>
                  <div><strong>Count:</strong> {selectedIncident.animal_count} observed</div>
                  <div><strong>Behavior:</strong> {selectedIncident.observed_behavior || 'Normal'}</div>
                  <div><strong>Direction:</strong> {selectedIncident.direction_of_movement || 'Stationary'}</div>
                </div>

                {selectedIncident.description && (
                  <p className="text-gray-600 italic bg-forest-light/20 p-2.5 rounded-xl border border-forest-light">
                    "{selectedIncident.description}"
                  </p>
                )}

                <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-400">
                  Logged: {new Date(selectedIncident.event_timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-gray-500">
                Click on any animal marker on the map to inspect full observation details and verified evidence.
              </div>
            )}
          </div>

          {/* Ethical Wildlife Map Policy */}
          <div className="bg-forest-deep text-white p-4 rounded-2xl text-xs space-y-2 border border-forest-emerald/30">
            <div className="flex items-center gap-1.5 font-bold text-forest-light text-[11px] uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-forest-emerald" />
              <span>Spatial Privacy Protection</span>
            </div>
            <p className="text-[11px] text-surface-muted leading-relaxed">
              Public sighting coordinates are generalized to grid centroids to protect vulnerable wildlife from illegal poaching and human harassment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
