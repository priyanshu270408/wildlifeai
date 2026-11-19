import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Species } from '../../types';
import { Shield, Search, Filter, ExternalLink, AlertTriangle, BookOpen } from 'lucide-react';

export const SpeciesGuide: React.FC = () => {
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  useEffect(() => {
    api.getSpecies().then(data => {
      setSpeciesList(data);
      if (data.length > 0) setSelectedSpecies(data[0]);
    }).catch(console.error);
  }, []);

  const filteredSpecies = speciesList.filter(s => {
    const matchesSearch = s.common_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.scientific_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-forest-emerald font-bold text-xs uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Taxonomic Intelligence Catalog</span>
        </div>
        <h1 className="text-3xl font-extrabold text-forest-deep tracking-tight">
          Wildlife Species Guide &amp; Behavioral Guidance
        </h1>
        <p className="text-xs text-gray-500 mt-1 max-w-2xl">
          Authoritative taxonomy integrated with IUCN Red List categories and Ministry of Environment conservation guidelines.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow border border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by common or scientific name (e.g. Elephant, Panthera, Bear)..."
            className="w-full pl-9 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-emerald"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'herbivore', 'carnivore', 'mammal', 'reptile'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                selectedCategory === cat
                  ? 'bg-forest text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: List on Left, Detailed Profile on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Species Cards */}
        <div className="lg:col-span-1 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredSpecies.map(sp => (
            <div
              key={sp.id}
              onClick={() => setSelectedSpecies(sp)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                selectedSpecies?.id === sp.id
                  ? 'border-forest-emerald bg-forest-light/20 shadow-md'
                  : 'border-gray-200 bg-white hover:border-forest-emerald/40'
              }`}
            >
              <div>
                <div className="font-bold text-sm text-forest-deep">{sp.common_name}</div>
                <div className="text-[11px] text-gray-500 italic">{sp.scientific_name}</div>
                <div className="text-[10px] text-forest-emerald uppercase font-semibold mt-1">
                  {sp.category}
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                sp.conservation_status === 'Endangered' || sp.conservation_status === 'Critically Endangered'
                  ? 'bg-red-100 text-red-800'
                  : sp.conservation_status === 'Vulnerable'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {sp.conservation_status}
              </span>
            </div>
          ))}
        </div>

        {/* Right: Detailed Species Profile */}
        <div className="lg:col-span-2">
          {selectedSpecies ? (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden space-y-6">
              {/* Species Image Header */}
              {selectedSpecies.image_url && (
                <div className="h-64 sm:h-72 w-full relative overflow-hidden bg-forest-deep">
                  <img
                    src={selectedSpecies.image_url}
                    alt={selectedSpecies.common_name}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-6 right-6 text-white">
                    <span className="bg-forest-emerald text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      IUCN: {selectedSpecies.conservation_status}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                      {selectedSpecies.common_name}
                    </h2>
                    <div className="text-forest-light italic text-sm">
                      {selectedSpecies.scientific_name}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8 space-y-6 pt-0">
                {/* Description */}
                <div>
                  <h3 className="font-bold text-forest-deep text-sm uppercase tracking-wider mb-2">
                    Ecological Profile &amp; Natural History
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {selectedSpecies.description}
                  </p>
                </div>

                {/* Identification Information */}
                {selectedSpecies.identification_information && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 text-xs mb-1">
                      Key Morphological Identifiers
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {selectedSpecies.identification_information}
                    </p>
                  </div>
                )}

                {/* Safety Guidance */}
                {selectedSpecies.safety_guidance && (
                  <div className="bg-forest-light/30 p-5 rounded-2xl border border-forest-emerald/30 space-y-2">
                    <div className="flex items-center gap-2 text-forest-deep font-bold text-xs uppercase tracking-wider">
                      <Shield className="w-4 h-4 text-forest-emerald" />
                      <span>Authorized Public Safety Guidance</span>
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed">
                      {selectedSpecies.safety_guidance}
                    </p>
                  </div>
                )}

                {/* Source & Provenance */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <div>
                    Source Authority: <span className="font-medium text-gray-600">{selectedSpecies.source_reference || 'IUCN / WII Registry'}</span>
                  </div>
                  <div>
                    Ethical Habitat Generalization Enforced
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl shadow text-center text-gray-500 text-xs">
              Select a species from the list to view its complete conservation profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
