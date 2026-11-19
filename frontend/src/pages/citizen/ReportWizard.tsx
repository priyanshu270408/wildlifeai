import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { translations } from '../../locales/translations';
import { api } from '../../services/api';
import { Species, VisionAnalysisResult } from '../../types';
import {
  Camera, Upload, MapPin, AlertTriangle, CheckCircle,
  ArrowRight, ArrowLeft, Shield, Eye, HelpCircle, Sparkles
} from 'lucide-react';

export const ReportWizard: React.FC = () => {
  const { language } = useAuth();
  const navigate = useNavigate();
  const t = translations[language].reporting;

  const [step, setStep] = useState<number>(1);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [submittedId, setSubmittedId] = useState<string>('');

  // Form State
  const [incidentType, setIncidentType] = useState<string>('wildlife_sighting');
  const [speciesId, setSpeciesId] = useState<string>('sp-elephant');
  const [approxLocation, setApproxLocation] = useState<string>('Ramnagar Buffer Corridor, Sector 3');
  const [latitude, setLatitude] = useState<number>(29.518);
  const [longitude, setLongitude] = useState<number>(79.132);
  const [severity, setSeverity] = useState<string>('high');
  const [animalCount, setAnimalCount] = useState<number>(1);
  const [observedBehavior, setObservedBehavior] = useState<string>('Calm foraging along canal path');
  const [directionOfMovement, setDirectionOfMovement] = useState<string>('North toward deep forest');
  const [injuriesReported, setInjuriesReported] = useState<boolean>(false);
  const [damageReported, setDamageReported] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('Observed large adult elephant grazing approximately 70 meters from boundary wall.');

  // Image & AI State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<VisionAnalysisResult | null>(null);

  useEffect(() => {
    api.getSpecies().then(setSpeciesList).catch(console.error);
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));

      // Trigger Computer Vision AI Pipeline
      setAiAnalyzing(true);
      try {
        const result = await api.analyzeImage(file, speciesId);
        setAiResult(result);
        if (result.predicted_species_id) {
          setSpeciesId(result.predicted_species_id);
        }
      } catch (err) {
        console.warn('AI Vision scan error:', err);
      } finally {
        setAiAnalyzing(false);
      }
    }
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setApproxLocation(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable:', err);
        }
      );
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        incident_type: incidentType,
        species_id: speciesId,
        description,
        event_timestamp: new Date().toISOString(),
        latitude,
        longitude,
        approximate_location: approxLocation,
        location_accuracy: 'exact_gps',
        severity,
        animal_count: Number(animalCount),
        observed_behavior: observedBehavior,
        direction_of_movement: directionOfMovement,
        injuries_reported: injuriesReported,
        damage_details: damageReported ? { crop_affected: 'Maize/Paddy', area_acres: 0.5 } : null,
        is_demo: true
      };

      const res = await api.createIncident(payload);
      setSubmittedId(res.id);
      setSubmissionSuccess(true);
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-white p-8 rounded-2xl shadow-xl border border-gray-200 text-center">
        <div className="w-16 h-16 bg-forest-emerald/20 text-forest-emerald rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-forest-deep mb-2">Report Successfully Submitted</h2>
        <div className="inline-block bg-forest-light/40 text-forest-deep px-3 py-1 rounded-full text-xs font-mono font-semibold mb-4">
          Incident ID: {submittedId}
        </div>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Your observation has been securely logged and forwarded to the Forest Officer Command Centre. An authorized officer will verify the report.
        </p>

        <div className="bg-gray-50 p-4 rounded-xl text-left border border-gray-100 text-xs space-y-2 mb-6">
          <div className="font-semibold text-gray-700">Incident Tracking Status:</div>
          <div className="flex items-center gap-2 text-forest-emerald font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-emerald animate-ping"></span>
            <span>Status: SUBMITTED (Awaiting Officer Verification)</span>
          </div>
          <div className="text-gray-500">
            Location: {approxLocation} &bull; Severity: {severity.toUpperCase()}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/citizen/dashboard')}
            className="px-5 py-2.5 bg-forest text-white rounded-xl text-xs font-semibold hover:bg-forest-deep transition"
          >
            Go to My Dashboard
          </button>
          <button
            onClick={() => {
              setSubmissionSuccess(false);
              setStep(1);
            }}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition"
          >
            Submit Another Sighting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      {/* Wizard Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-forest-emerald font-semibold text-xs uppercase tracking-wider mb-1">
          <Shield className="w-4 h-4" />
          <span>WILDSHIELD AI Official Incident Dispatch</span>
        </div>
        <h1 className="text-2xl font-extrabold text-forest-deep tracking-tight">
          {t.title}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Step {step} of 6 &bull; Timely reports enable early warnings and save community and wildlife lives.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-forest-emerald h-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
        {/* STEP 1: CATEGORY */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-forest-deep text-lg">{t.step1}</h3>
            <p className="text-xs text-gray-500">Select the nature of the encounter or sighting.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'wildlife_sighting', label: 'Wildlife Sighting', desc: 'Direct observation in habitat or fringe' },
                { id: 'animal_near_settlement', label: 'Animal Near Residential Area', desc: 'Within 200m of houses or school' },
                { id: 'crop_damage', label: 'Farmland Crop Damage', desc: 'Depredation of agricultural fields' },
                { id: 'human_wildlife_encounter', label: 'Close Encounter', desc: 'Surprise close-quarters interaction' },
                { id: 'injured_wildlife', label: 'Injured or Trapped Wildlife', desc: 'Snared, wounded, or stranded animal' },
                { id: 'road_crossing', label: 'Highway Road Crossing', desc: 'Wildlife crossing vehicular transit artery' }
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setIncidentType(opt.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    incidentType === opt.id
                      ? 'border-forest-emerald bg-forest-light/20 text-forest-deep shadow'
                      : 'border-gray-200 hover:border-forest-emerald/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold text-sm">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SPECIES */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-forest-deep text-lg">{t.step2}</h3>
            <p className="text-xs text-gray-500">Select the observed species if identifiable, or choose unknown.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {speciesList.map(sp => (
                <div
                  key={sp.id}
                  onClick={() => setSpeciesId(sp.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition text-center ${
                    speciesId === sp.id
                      ? 'border-forest-emerald bg-forest-light/30 shadow'
                      : 'border-gray-200 hover:border-forest-emerald/40'
                  }`}
                >
                  <div className="font-bold text-xs text-forest-deep">{sp.common_name}</div>
                  <div className="text-[10px] text-gray-500 italic mt-0.5">{sp.scientific_name}</div>
                  <div className="mt-1 text-[9px] font-semibold text-forest-emerald uppercase">{sp.conservation_status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-forest-deep text-lg">{t.step3}</h3>
            <p className="text-xs text-gray-500">Provide the sighting location or approximate area.</p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  General Location Description
                </label>
                <input
                  type="text"
                  value={approxLocation}
                  onChange={(e) => setApproxLocation(e.target.value)}
                  placeholder={t.locationPlaceholder}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-emerald"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="px-4 py-2 bg-forest-deep text-white rounded-xl text-xs font-medium hover:bg-forest transition flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-forest-emerald" />
                  <span>Use Device Geolocation</span>
                </button>
                <span className="text-xs text-gray-500">
                  Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PHOTOGRAPH & AI SCAN */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-forest-deep text-lg">{t.step4}</h3>
            <p className="text-xs text-gray-500">
              Upload a photograph if safely captured. Our Computer Vision AI will analyze morphological features.
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-forest-emerald transition bg-gray-50">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Uploaded Sighting"
                    className="max-h-56 mx-auto rounded-xl object-contain shadow"
                  />
                  <div className="text-xs text-gray-600 font-medium">
                    {imageFile?.name} ({(imageFile!.size / 1024).toFixed(1)} KB)
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-forest-emerald/10 text-forest-emerald rounded-full flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <label className="cursor-pointer font-semibold text-xs text-forest-deep hover:underline">
                    <span>Click to browse or upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-gray-400">JPG, PNG, WebP up to 10MB</p>
                </div>
              )}
            </div>

            {/* AI Vision Results Display */}
            {aiAnalyzing && (
              <div className="bg-forest-light/30 p-4 rounded-xl border border-forest-emerald/30 flex items-center gap-3 text-xs text-forest-deep animate-pulse">
                <Sparkles className="w-5 h-5 text-forest-emerald animate-spin" />
                <span>{t.aiAnalyzing}</span>
              </div>
            )}

            {aiResult && !aiAnalyzing && (
              <div className="bg-forest-deep text-white p-4 rounded-xl shadow-lg border border-forest-emerald/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-forest-light">
                    <Sparkles className="w-4 h-4 text-forest-emerald" />
                    <span>WildShield-Vision-TaxonNet Prediction</span>
                  </div>
                  <span className="bg-forest-emerald text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {aiResult.confidence_tier} Confidence
                  </span>
                </div>

                <div className="text-base font-extrabold text-white">
                  {aiResult.predicted_species_name}
                </div>
                <div className="text-xs text-forest-light/80">
                  Confidence Score: {(aiResult.confidence * 100).toFixed(1)}% &bull; Latency: {aiResult.inference_time_ms}ms
                </div>
                <p className="text-xs text-surface-muted italic">
                  "{aiResult.explanation}"
                </p>

                <div className="pt-2 border-t border-forest text-[10px] text-forest-light/70">
                  {t.uncertaintyNote}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: OBSERVATIONS */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-bold text-forest-deep text-lg">{t.step5}</h3>
            <p className="text-xs text-gray-500">Provide behavioral and impact details to help forest rangers assess priority.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.animalCountLabel}
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={animalCount}
                  onChange={(e) => setAnimalCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-emerald"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Estimated Severity Tier
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-emerald"
                >
                  <option value="low">Low (Far from settlement)</option>
                  <option value="moderate">Moderate (Adjacent to agricultural fields)</option>
                  <option value="high">High (Within 100m of residences)</option>
                  <option value="critical">Critical (Immediate danger or injury risk)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t.behaviorLabel}
                </label>
                <input
                  type="text"
                  value={observedBehavior}
                  onChange={(e) => setObservedBehavior(e.target.value)}
                  placeholder="e.g. Grazing peacefully, aggressive posturing, seeking water..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-emerald"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.descPlaceholder}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-emerald"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="injuries"
                  checked={injuriesReported}
                  onChange={(e) => setInjuriesReported(e.target.checked)}
                  className="w-4 h-4 text-forest-emerald rounded"
                />
                <label htmlFor="injuries" className="text-xs text-gray-700 font-medium">
                  {t.injuriesLabel}
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="damage"
                  checked={damageReported}
                  onChange={(e) => setDamageReported(e.target.checked)}
                  className="w-4 h-4 text-forest-emerald rounded"
                />
                <label htmlFor="damage" className="text-xs text-gray-700 font-medium">
                  {t.damageLabel}
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW & SUBMIT */}
        {step === 6 && (
          <div className="space-y-4">
            <h3 className="font-bold text-forest-deep text-lg">{t.step6}</h3>
            <p className="text-xs text-gray-500">Please review all report parameters before final persistence.</p>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Category:</span>
                <span className="font-semibold text-gray-800 capitalize">{incidentType.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Species:</span>
                <span className="font-semibold text-forest-deep">{speciesList.find(s => s.id === speciesId)?.common_name || speciesId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Location:</span>
                <span className="font-semibold text-gray-800">{approxLocation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Count & Severity:</span>
                <span className="font-semibold text-gray-800">{animalCount} animal(s) &bull; {severity.toUpperCase()}</span>
              </div>
              <div className="py-1">
                <span className="text-gray-500">Description:</span>
                <p className="font-medium text-gray-800 mt-0.5">"{description}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : <div></div>}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-forest text-white rounded-xl text-xs font-semibold hover:bg-forest-deep flex items-center gap-1.5 transition"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-forest-emerald text-white rounded-xl text-xs font-bold hover:bg-emerald-600 flex items-center gap-2 shadow-lg transition"
            >
              {isSubmitting ? (
                <span>Submitting Official Record...</span>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>{t.submitBtn}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
