import React from 'react';
import { Shield, HeartHandshake, AlertCircle, ExternalLink, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-deep text-surface border-t border-forest/60 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-forest-emerald flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base">WILDSHIELD AI</span>
            </div>
            <p className="text-xs text-surface-muted leading-relaxed">
              AI-Powered Wildlife Intelligence, Conflict Prevention & Conservation Management Ecosystem (wildomang).
            </p>
            <div className="text-[11px] text-forest-light font-mono">
              Tagline: Predict. Protect. Prevent.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">Platform Core</div>
            <ul className="space-y-1.5 text-surface-muted">
              <li><a href="/citizen/report" className="hover:text-forest-light transition">Citizen Incident Wizard</a></li>
              <li><a href="/map" className="hover:text-forest-light transition">Interactive Risk Map</a></li>
              <li><a href="/officer/dashboard" className="hover:text-forest-light transition">Forest Officer Command</a></li>
              <li><a href="/wildlife-safety" className="hover:text-forest-light transition">Safety Advisories & Guidelines</a></li>
              <li><a href="/species" className="hover:text-forest-light transition">Taxonomy Intelligence</a></li>
            </ul>
          </div>

          {/* Conservation Data Sources */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px]">Scientific Data Sources</div>
            <ul className="space-y-1.5 text-surface-muted">
              <li className="flex items-center gap-1">
                <span>GBIF Occurrence Registry</span>
                <ExternalLink className="w-3 h-3 text-forest-light" />
              </li>
              <li className="flex items-center gap-1">
                <span>MoEFCC Project Elephant & Tiger</span>
                <ExternalLink className="w-3 h-3 text-forest-light" />
              </li>
              <li className="flex items-center gap-1">
                <span>Wildlife Institute of India (WII)</span>
                <ExternalLink className="w-3 h-3 text-forest-light" />
              </li>
              <li className="flex items-center gap-1">
                <span>IUCN Red List Spatial Baselines</span>
                <ExternalLink className="w-3 h-3 text-forest-light" />
              </li>
            </ul>
          </div>

          {/* Ethical AI & Legal Warning */}
          <div className="space-y-2 text-xs bg-forest/40 p-4 rounded-xl border border-forest/80">
            <div className="flex items-center gap-1.5 text-forest-light font-semibold text-[11px] uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-risk-moderate" />
              <span>Responsible Conservation</span>
            </div>
            <p className="text-[11px] text-surface-muted leading-relaxed">
              WILDSHIELD AI safeguards communities and animals. Precise GPS coordinates of critically endangered species are generalized to prevent illegal tracking or disturbance. Never approach or confront wild animals.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-forest/50 flex flex-col sm:flex-row items-center justify-between text-xs text-surface-muted gap-3">
          <div>
            &copy; 2026 WILDSHIELD AI (wildomang). All rights reserved. Open Conservation Technology.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>&bull;</span>
            <span>Terms of Service</span>
            <span>&bull;</span>
            <span>Safety Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
