import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { translations } from '../../locales/translations';
import { api } from '../../services/api';
import { Species, Incident, GeographicalArea } from '../../types';
import { IntelligenceMap } from '../../components/maps/IntelligenceMap';
import {
  Shield, AlertTriangle, Sparkles, MapPin, Eye, Users,
  CheckCircle2, ArrowRight, Activity, FileSpreadsheet, HeartHandshake,
  Layers, Compass, Bell
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { language } = useAuth();
  const t = translations[language];

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [areas, setAreas] = useState<GeographicalArea[]>([]);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);

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
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-forest-deep text-white pt-16 pb-24 border-b border-forest">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1E8B61_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-emerald/20 border border-forest-emerald/40 text-forest-light text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-forest-emerald" />
            <span>AI Wildlife Intelligence &amp; Conflict Prevention</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            {t.hero.headline}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-forest-light/80 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subheading}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/citizen/report"
              className="w-full sm:w-auto px-6 py-3.5 bg-forest-emerald hover:bg-emerald-600 text-white font-bold rounded-2xl text-sm shadow-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <Shield className="w-4 h-4" />
              <span>{t.hero.reportCta}</span>
            </Link>
            <Link
              to="/map"
              className="w-full sm:w-auto px-6 py-3.5 bg-forest/80 hover:bg-forest text-white font-semibold rounded-2xl text-sm border border-forest-light/30 shadow transition flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-forest-light" />
              <span>{t.hero.exploreCta}</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10 border-t border-forest/60 text-left">
            <div>
              <div className="text-2xl font-extrabold text-white">9 Species</div>
              <div className="text-[11px] text-surface-muted">Native Wildlife Taxonomy</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-forest-light">340 ms</div>
              <div className="text-[11px] text-surface-muted">Vision Inference P95</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white">5 Corridors</div>
              <div className="text-[11px] text-surface-muted">Spatial Geofence Grids</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-forest-emerald">100% Verified</div>
              <div className="text-[11px] text-surface-muted">Official Officer Signoff</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM WE SOLVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-forest-emerald uppercase tracking-wider">The Conservation Challenge</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-deep tracking-tight">
            Bridging the Gap Between Habitats &amp; Settlements
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Rapid agricultural expansion and fragmented habitats trigger repeated encounters with elephants, leopards, and wild herbivores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-forest-deep text-base">Delayed Warnings</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Traditional telephone trees often warn rural residents hours after herds enter farmland, creating panic and dangerous confrontations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-forest-deep text-base">Misidentified Species</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Citizens and farmers often struggle to identify elusive carnivores in twilight or low light, leading to uncalibrated emergency responses.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-forest-deep text-base">Fragmented Geospatial Data</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Forest departments rarely have real-time visibility into historical repeat corridors, crop harvest overlaps, and active rapid response units.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FOUR-STAGE WORKFLOW */}
      <section className="bg-forest-light/40 py-16 border-y border-forest-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-forest-emerald uppercase tracking-wider">Connected Lifecycle</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-deep tracking-tight">
              How WILDSHIELD AI Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              A synchronized intelligence workflow connecting ground citizens to authorized rangers in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                name: "REPORT",
                desc: "Citizen or farmer submits sighting details and uploads photograph via mobile wizard.",
                icon: Shield
              },
              {
                step: "02",
                name: "ANALYSE",
                desc: "Computer Vision AI validates optical clarity, estimates species taxon, and calculates uncertainty.",
                icon: Sparkles
              },
              {
                step: "03",
                name: "ASSESS",
                desc: "Spatial XGBoost engine models density, time-decay, and harvest patterns to estimate area risk.",
                icon: Activity
              },
              {
                step: "04",
                name: "RESPOND",
                desc: "Forest Officer reviews verification queue, approves public advisory, and dispatches field team.",
                icon: Bell
              }
            ].map((st, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-3 relative overflow-hidden">
                <div className="text-3xl font-black text-forest-light/60 font-mono absolute top-4 right-4">
                  {st.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-forest-emerald text-white flex items-center justify-center">
                  <st.icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-forest-deep text-base">{st.name}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LIVE DEMONSTRATION INTELLIGENCE MAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-forest-emerald uppercase tracking-wider">Live Geospatial Intelligence</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-deep tracking-tight">
              Corridor Sighting &amp; Risk Overlay
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Interactive map displaying verified observations and explainable conflict risk zones.
            </p>
          </div>
          <Link
            to="/map"
            className="text-xs font-bold text-forest-emerald hover:underline flex items-center gap-1"
          >
            <span>Open Fullscreen Operational Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <IntelligenceMap
          incidents={incidents}
          areas={areas}
          speciesList={speciesList}
          height="520px"
        />
      </section>
    </div>
  );
};
