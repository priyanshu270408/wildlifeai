import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import { Incident, GeographicalArea, Species } from '../../types';
import { Shield, AlertTriangle, Eye, Layers, Filter, CheckCircle2, MapPin } from 'lucide-react';

// Custom Map Marker Icons using SVG Data URIs
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-wildlife-marker',
    html: `
      <div style="
        background-color: ${color};
        color: white;
        border: 2px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        font-size: 11px;
        font-weight: bold;
      ">
        ${label}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

interface IntelligenceMapProps {
  incidents: Incident[];
  areas: GeographicalArea[];
  speciesList: Species[];
  selectedIncident?: Incident | null;
  onSelectIncident?: (incident: Incident) => void;
  height?: string;
}

export const IntelligenceMap: React.FC<IntelligenceMapProps> = ({
  incidents,
  areas,
  speciesList,
  selectedIncident,
  onSelectIncident,
  height = '600px'
}) => {
  const [filterSpecies, setFilterSpecies] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showRiskZones, setShowRiskZones] = useState<boolean>(true);

  // Default coordinate center (Corbett / Northern Wildlife corridor)
  const defaultCenter: [number, number] = [29.512, 79.125];

  // Filtering
  const filteredIncidents = incidents.filter(inc => {
    if (filterSpecies !== 'all' && inc.species_id !== filterSpecies) return false;
    if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && inc.verification_status !== filterStatus) return false;
    return true;
  });

  const getMarkerColor = (severity: string, status: string) => {
    if (status === 'submitted') return '#6B7280'; // neutral gray for unverified
    switch (severity) {
      case 'critical': return '#EF4444';
      case 'high': return '#F97316';
      case 'moderate': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const getAreaRiskColor = (category: string) => {
    switch (category) {
      case 'HIGH': return '#EF4444';
      case 'MODERATE': return '#F59E0B';
      default: return '#10B981';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Top Filter Bar */}
      <div className="bg-forest-deep text-white p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-semibold">
          <Layers className="w-4 h-4 text-forest-emerald" />
          <span>Interactive Conflict Intelligence Map</span>
          <span className="bg-forest-emerald/30 text-forest-light px-2 py-0.5 rounded text-[11px]">
            {filteredIncidents.length} Sightings Displayed
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Species Filter */}
          <select
            value={filterSpecies}
            onChange={(e) => setFilterSpecies(e.target.value)}
            className="bg-forest text-white border border-forest-light/30 rounded px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="all">All Species</option>
            {speciesList.map(s => (
              <option key={s.id} value={s.id}>{s.common_name}</option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-forest text-white border border-forest-light/30 rounded px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>

          {/* Verification Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-forest text-white border border-forest-light/30 rounded px-2.5 py-1 text-xs focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="submitted">Pending Review</option>
          </select>

          {/* Risk Overlay Toggle */}
          <button
            onClick={() => setShowRiskZones(!showRiskZones)}
            className={`px-2.5 py-1 rounded text-xs transition font-medium flex items-center gap-1 ${
              showRiskZones ? 'bg-forest-emerald text-white' : 'bg-forest text-surface-muted'
            }`}
          >
            <span>Risk Zones</span>
          </button>
        </div>
      </div>

      {/* Map View */}
      <div style={{ height, width: '100%', position: 'relative' }}>
        <MapContainer
          center={defaultCenter}
          zoom={8}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Explainable Conflict Risk Zones Overlay */}
          {showRiskZones && areas.map(area => {
            const riskColor = getAreaRiskColor(area.risk_category);
            return (
              <Circle
                key={area.id}
                center={[area.latitude, area.longitude]}
                radius={8000} // 8km risk radius
                pathOptions={{
                  color: riskColor,
                  fillColor: riskColor,
                  fillOpacity: area.risk_category === 'HIGH' ? 0.28 : 0.16,
                  weight: 2,
                  dashArray: '4, 6'
                }}
              >
                <Popup>
                  <div className="p-2 text-xs">
                    <div className="font-bold text-forest-deep text-sm mb-1">{area.name}</div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="font-semibold text-gray-700">Area Type:</span>
                      <span className="capitalize">{area.area_type.replace('_', ' ')}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded border border-gray-200 mb-2">
                      <div className="font-semibold text-[11px] text-gray-800">
                        Risk Level: <span style={{ color: riskColor }} className="font-bold">{area.risk_category}</span> (Score: {area.risk_score})
                      </div>
                      <div className="text-[10px] text-gray-500">Forecast: {area.forecast_window}</div>
                    </div>
                    {area.contributing_factors?.primary_factors && (
                      <div className="text-[11px] text-gray-600 mb-2">
                        <div className="font-semibold text-gray-700 mb-0.5">Contributing Indicators:</div>
                        <ul className="list-disc pl-3 space-y-0.5">
                          {area.contributing_factors.primary_factors.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {area.contributing_factors?.recommended_action && (
                      <div className="bg-forest-light/30 p-1.5 rounded text-[10px] text-forest-deep font-medium">
                        Advisory: {area.contributing_factors.recommended_action}
                      </div>
                    )}
                  </div>
                </Popup>
              </Circle>
            );
          })}

          {/* Sighting Markers */}
          {filteredIncidents.map(inc => {
            const markerColor = getMarkerColor(inc.severity, inc.verification_status);
            const firstLetter = inc.species_common_name ? inc.species_common_name.charAt(0) : 'W';
            const icon = createCustomIcon(markerColor, firstLetter);

            return (
              <Marker
                key={inc.id}
                position={[inc.latitude, inc.longitude]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectIncident && onSelectIncident(inc),
                }}
              >
                <Popup>
                  <div className="p-1.5 text-xs max-w-[260px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-forest-deep text-sm">
                        {inc.species_common_name || 'Wildlife Sighting'}
                      </span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white"
                        style={{ backgroundColor: markerColor }}
                      >
                        {inc.severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 italic mb-1.5">
                      {inc.species_scientific_name || ''}
                    </div>

                    <div className="text-[11px] text-gray-700 space-y-1 mb-2">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-forest-emerald mt-0.5 flex-shrink-0" />
                        <span>{inc.approximate_location}</span>
                      </div>
                      <div><strong>Type:</strong> {inc.incident_type.replace('_', ' ')}</div>
                      <div><strong>Count:</strong> {inc.animal_count} observed</div>
                      <div><strong>Status:</strong> {inc.verification_status.toUpperCase()}</div>
                    </div>

                    {inc.description && (
                      <p className="text-[11px] text-gray-600 bg-gray-50 p-1.5 rounded border border-gray-100 mb-2">
                        "{inc.description}"
                      </p>
                    )}

                    <div className="text-[9px] text-gray-400">
                      Reported: {new Date(inc.event_timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Accessible Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 text-xs z-[1000] pointer-events-auto">
          <div className="font-bold text-forest-deep mb-1.5 text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-forest-emerald" />
            <span>Map Intelligence Legend</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-risk-critical"></span>
              <span>Critical Severity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-risk-high"></span>
              <span>High Severity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-risk-moderate"></span>
              <span>Moderate Severity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-risk-low"></span>
              <span>Low Severity</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2 pt-1 border-t border-gray-100">
              <span className="w-3 h-3 rounded-full border border-dashed border-risk-high bg-risk-high/20"></span>
              <span>Explainable Conflict Risk Zone (Radius 8km)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
