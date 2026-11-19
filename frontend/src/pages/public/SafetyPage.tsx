import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { translations } from '../../locales/translations';
import { Shield, AlertTriangle, CheckCircle, XCircle, Heart, Phone, ExternalLink } from 'lucide-react';

export const SafetyPage: React.FC = () => {
  const { language } = useAuth();
  const t = translations[language].safety;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-emerald/20 text-forest-deep text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-forest-emerald" />
          <span>Conservation Protocols</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-deep tracking-tight">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Asian Elephant Safety Protocols */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-forest-light text-forest-deep flex items-center justify-center font-bold text-xl">
            🐘
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-forest-deep">
              {t.elephantTitle}
            </h2>
            <p className="text-xs text-gray-500">Elephas maximus &bull; Project Elephant Ministry Guidelines</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Recommended Do's</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-700">
              {t.elephantTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">&bull;</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 bg-red-50/50 p-5 rounded-2xl border border-red-100">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
              <XCircle className="w-4 h-4 text-red-600" />
              <span>Strictly Prohibited Don'ts</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">&bull;</span>
                <span>Never attempt to take selfies or close photos within 50 meters.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">&bull;</span>
                <span>Never throw stones, firecrackers, or provoke foraging herds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">&bull;</span>
                <span>Never attempt to cross in front of a lone bull or a mother with calf.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">&bull;</span>
                <span>Do not surround or corner animals into narrow village alleys.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Carnivore Encounters (Leopards / Tigers) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xl">
            🐆
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-forest-deep">
              {t.leopardTitle}
            </h2>
            <p className="text-xs text-gray-500">Panthera pardus &amp; Panthera tigris &bull; WII Carnivore Guidelines</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Defensive Action Protocols</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-700">
              {t.leopardTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold mt-0.5">&bull;</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 bg-red-50/50 p-5 rounded-2xl border border-red-100">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
              <XCircle className="w-4 h-4 text-red-600" />
              <span>Dangerous Mistakes to Avoid</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">&bull;</span>
                <span>Never run or turn your back; big cats are visual pursuit predators.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">&bull;</span>
                <span>Never crouch, bend down, or sit in tall grass (mistaken for prey).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">&bull;</span>
                <span>Do not leave domestic dogs or calves tied outside without roofs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold mt-0.5">&bull;</span>
                <span>Avoid letting children walk to schools unaccompanied at dawn/dusk.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Department Helpline Notice */}
      <div className="bg-forest-deep text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-forest-emerald/30">
        <div className="space-y-2 text-center sm:text-left">
          <div className="font-extrabold text-lg text-white">Need Urgent Forest Ranger Dispatch?</div>
          <p className="text-xs text-surface-muted max-w-lg">
            If dangerous wildlife has entered a classroom, residential compound, or injured human life, contact the Central Forest Control Room immediately.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="tel:1926"
            className="px-6 py-3 bg-risk-critical hover:bg-red-600 text-white rounded-2xl text-xs font-bold shadow-lg flex items-center gap-2 transition"
          >
            <Phone className="w-4 h-4" />
            <span>Emergency Toll-Free: 1926</span>
          </a>
        </div>
      </div>
    </div>
  );
};
