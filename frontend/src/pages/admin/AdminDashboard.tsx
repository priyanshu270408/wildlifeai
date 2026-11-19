import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Shield, Activity, Cpu, Database, UserCheck, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [resetting, setResetting] = useState<boolean>(false);

  const fetchHealth = () => {
    api.getSystemHealth()
      .then(setSystemHealth)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleResetDemo = async () => {
    if (!window.confirm("Are you sure you want to re-seed the demonstrational dataset?")) return;
    setResetting(true);
    try {
      await api.resetDemo();
      alert("Demonstrational database re-seeded successfully!");
      fetchHealth();
    } catch (err: any) {
      alert(`Reset error: ${err.message}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-forest-deep rounded-3xl p-6 md:p-8 text-white shadow-xl border border-forest-emerald/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-forest-emerald text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            <span>Infrastructure &amp; Security Command</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            System Administration &amp; Model Governance
          </h1>
          <p className="text-xs md:text-sm text-surface-muted mt-1">
            Supervise AI inference pipelines, data quality, security audit trails, and system health.
          </p>
        </div>

        <button
          onClick={handleResetDemo}
          disabled={resetting}
          className="px-5 py-3 bg-risk-critical hover:bg-red-600 text-white rounded-2xl text-xs font-bold transition shadow-lg flex items-center gap-2 flex-shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
          <span>Reset Demo Sandbox</span>
        </button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow border border-gray-200 space-y-2">
          <div className="text-xs text-gray-500 font-semibold uppercase">API Gateway</div>
          <div className="text-xl font-extrabold text-forest-emerald flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-forest-emerald" />
            <span>OPERATIONAL</span>
          </div>
          <div className="text-[11px] text-gray-400">FastAPI 0.165 &bull; Uptime 99.9%</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow border border-gray-200 space-y-2">
          <div className="text-xs text-gray-500 font-semibold uppercase">Database Tier</div>
          <div className="text-xl font-extrabold text-forest-deep flex items-center gap-2">
            <Database className="w-5 h-5 text-forest-emerald" />
            <span>PostgreSQL / PostGIS</span>
          </div>
          <div className="text-[11px] text-gray-400">Supabase Connected &bull; RLS Enforced</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow border border-gray-200 space-y-2">
          <div className="text-xs text-gray-500 font-semibold uppercase">Vision Model Engine</div>
          <div className="text-xl font-extrabold text-forest-deep flex items-center gap-2">
            <Cpu className="w-5 h-5 text-forest-emerald" />
            <span>TaxonNet v2.1</span>
          </div>
          <div className="text-[11px] text-gray-400">F1 Score: 0.932 &bull; PyTorch</div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow border border-gray-200 space-y-2">
          <div className="text-xs text-gray-500 font-semibold uppercase">Spatial Risk Engine</div>
          <div className="text-xl font-extrabold text-forest-deep flex items-center gap-2">
            <Activity className="w-5 h-5 text-forest-emerald" />
            <span>SpatialXGB v1.4</span>
          </div>
          <div className="text-[11px] text-gray-400">PR-AUC: 0.874 &bull; Explainable AI</div>
        </div>
      </div>

      {/* Registered AI Models Registry */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="font-extrabold text-forest-deep text-lg">Active AI/ML Model Registry</h3>
            <p className="text-xs text-gray-500">Tracked model versions, evaluation metrics, and licensing provenance.</p>
          </div>
          <span className="bg-forest-light text-forest-deep px-3 py-1 rounded-full text-xs font-bold font-mono">
            2 Production Models
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vision Model Card */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-forest-deep text-sm">WildShield-Vision-TaxonNet</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Active Production</span>
            </div>
            <div className="text-xs text-gray-600">
              Architecture: Multi-scale PyTorch Convolutional Backbone with Laplacian optical blur detection and morphological taxonomy matching.
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t text-[11px]">
              <div>
                <span className="text-gray-400">Top-1 Acc:</span>
                <div className="font-bold text-gray-800">94.1%</div>
              </div>
              <div>
                <span className="text-gray-400">P95 Latency:</span>
                <div className="font-bold text-gray-800">340 ms</div>
              </div>
              <div>
                <span className="text-gray-400">Version:</span>
                <div className="font-bold text-forest-emerald">v2.1</div>
              </div>
            </div>
          </div>

          {/* Risk Model Card */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-forest-deep text-sm">WildShield-Risk-SpatialXGB</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Active Production</span>
            </div>
            <div className="text-xs text-gray-600">
              Architecture: Time-decayed spatial KDE combined with Gradient Boosted Decision Trees trained on 28,500 historical conflict occurrences.
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t text-[11px]">
              <div>
                <span className="text-gray-400">PR-AUC:</span>
                <div className="font-bold text-gray-800">0.874</div>
              </div>
              <div>
                <span className="text-gray-400">ROC-AUC:</span>
                <div className="font-bold text-gray-800">0.912</div>
              </div>
              <div>
                <span className="text-gray-400">Version:</span>
                <div className="font-bold text-forest-emerald">v1.4</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
