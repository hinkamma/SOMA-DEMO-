import React, { useState, useMemo } from 'react';
import { Teacher } from '../types';
import { DEPARTMENTS, STATUS_OPTIONS, CHARGE_OPTIONS } from '../data/mockData';

interface CorpsEnseignantViewProps {
  teachers: Teacher[];
  searchQuery: string;
  onSelectTeacher: (teacher: Teacher) => void;
  onEditTeacher: (teacher: Teacher) => void;
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  onOpenBatchSms: (target?: Teacher) => void;
  onOpenAuditModal: () => void;
  onOpenInspectionModal: () => void;
  onOpenEmargementModal: () => void;
  onOpenAppel?: (teacher: Teacher) => void;
}

export const CorpsEnseignantView: React.FC<CorpsEnseignantViewProps> = ({
  teachers,
  searchQuery,
  onSelectTeacher,
  onEditTeacher,
  onOpenAddModal,
  onOpenExportModal,
  onOpenBatchSms,
  onOpenAuditModal,
  onOpenInspectionModal,
  onOpenEmargementModal,
  onOpenAppel,
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCharge, setSelectedCharge] = useState('all');
  const [quickFilter, setQuickFilter] = useState<'all' | 'late' | 'pp' | 'overtime'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const pageSize = 6;

  // Filter logic
  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      // Global header search query + local search query
      const query = (searchQuery || localSearch).trim().toLowerCase();
      if (query) {
        const matchesName = teacher.name.toLowerCase().includes(query);
        const matchesMatricule = teacher.matricule.toLowerCase().includes(query);
        const matchesDept = teacher.departmentLabel.toLowerCase().includes(query);
        const matchesClass = teacher.classes.some((c) => c.name.toLowerCase().includes(query));
        const matchesEmail = teacher.email.toLowerCase().includes(query);
        if (!matchesName && !matchesMatricule && !matchesDept && !matchesClass && !matchesEmail) {
          return false;
        }
      }

      // Department filter
      if (selectedDept !== 'all' && teacher.departmentId !== selectedDept) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'pleg' && teacher.status !== 'pleg') return false;
        if (selectedStatus === 'vac' && teacher.status !== 'vac') return false;
        if (selectedStatus === 'chef' && !teacher.isChefDept) return false;
        if (selectedStatus === 'pp' && !teacher.classes.some((c) => c.isPP)) return false;
      }

      // Charge filter
      if (selectedCharge !== 'all') {
        if (selectedCharge === 'normal' && teacher.quotaStatus !== 'normal') return false;
        if (selectedCharge === 'over' && teacher.quotaStatus !== 'overtime') return false;
        if (selectedCharge === 'under' && teacher.quotaStatus !== 'under') return false;
      }

      // Quick filter pill
      if (quickFilter === 'late') {
        return teacher.pedagogicalFollowUp.notesT1Status === 'late';
      }
      if (quickFilter === 'pp') {
        return teacher.classes.some((c) => c.isPP);
      }
      if (quickFilter === 'overtime') {
        return teacher.assignedHours > teacher.quotaHours;
      }

      return true;
    });
  }, [teachers, searchQuery, localSearch, selectedDept, selectedStatus, selectedCharge, quickFilter]);

  const totalPages = Math.ceil(filteredTeachers.length / pageSize) || 1;
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetFilters = () => {
    setLocalSearch('');
    setSelectedDept('all');
    setSelectedStatus('all');
    setSelectedCharge('all');
    setQuickFilter('all');
    setCurrentPage(1);
  };

  // Quick stats
  const lateCount = teachers.filter((t) => t.pedagogicalFollowUp.notesT1Status === 'late').length;
  const ppCount = teachers.filter((t) => t.classes.some((c) => c.isPP)).length;
  const overtimeCount = teachers.filter((t) => t.assignedHours > t.quotaHours).length;

  return (
    <div className="flex flex-col w-full gap-6">
      {/* PAGE HEADER & STRATEGIC ACTIONS */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-extrabold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[15px]">school</span>
              Secondaire & Technique
            </span>
            <span className="text-[#8d7168] text-[11px] font-bold">•</span>
            <span className="text-[#4b5d8f] text-[12px] font-semibold">Année 2024 - 2025</span>
            <span className="text-[#8d7168] text-[11px] font-bold">•</span>
            <span className="text-[#006c4c] text-[12px] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#006c4c]"></span>
              {teachers.length} Professeurs Actifs
            </span>
          </div>

          <h1 className="text-[26px] sm:text-[28px] font-extrabold text-[#1b1c1c] tracking-tight">
            Gestion & Répertoire du Corps Enseignant
          </h1>

          <p className="text-[13.5px] text-[#594139] max-w-3xl leading-relaxed">
            Supervision académique, affectations pédagogiques aux programmes APC (Approche Par
            Compétences), suivi des volumes horaires hebdomadaires et contrôle du visa des notes.
          </p>
        </div>

        {/* Quick Action Hub */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0 relative">
          <button
            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-lg bg-white text-[#4b5d8f] text-[13.5px] font-bold shadow-sm hover:bg-[#eae7e7]/60 transition-all border border-[#f0eded]"
          >
            <span className="material-symbols-outlined text-[19px]">file_download</span>
            <span>Exporter Liste (Excel / MINESEC)</span>
            <span className="material-symbols-outlined text-[16px] text-[#8d7168]">expand_more</span>
          </button>

          {/* Dropdown export options */}
          {exportDropdownOpen && (
            <div className="absolute top-12 left-0 sm:left-auto sm:right-40 z-30 w-72 bg-white rounded-xl shadow-xl border border-[#f0eded] p-1.5 flex flex-col gap-1">
              <button
                onClick={() => {
                  setExportDropdownOpen(false);
                  onOpenExportModal();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#f6f3f2] text-[12.5px] text-[#1b1c1c] text-left transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-[#006c4c] text-[20px]">
                  table_chart
                </span>
                <span>Bordereau MINESEC (Format .XLSX)</span>
              </button>
              <button
                onClick={() => {
                  setExportDropdownOpen(false);
                  onOpenExportModal();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#f6f3f2] text-[12.5px] text-[#1b1c1c] text-left transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">
                  picture_as_pdf
                </span>
                <span>Répertoire Officiel du Censeur (.PDF)</span>
              </button>
              <button
                onClick={() => {
                  setExportDropdownOpen(false);
                  onOpenExportModal();
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#f6f3f2] text-[12.5px] text-[#1b1c1c] text-left transition-colors font-semibold"
              >
                <span className="material-symbols-outlined text-[#4b5d8f] text-[20px]">
                  badge
                </span>
                <span>États des Heures Complémentaires</span>
              </button>
            </div>
          )}

          {onOpenAppel && (
            <button
              onClick={() => onOpenAppel(teachers[0])}
              className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-lg bg-[#006c4c] text-white text-[13px] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
              title="L'enseignant effectue l'appel numérique pour ses classes affectées"
            >
              <span className="material-symbols-outlined text-[19px]">checklist_rtl</span>
              <span>📋 Faire l'Appel de Cours</span>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg bg-[#ff6b35] text-white text-[13.5px] font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>Ajouter un Enseignant</span>
          </button>
        </div>
      </div>

      {/* KPI SYNTHESIS BAR (4 BENTO CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="relative bg-white p-5 rounded-xl shadow-sm border border-[#f0eded] overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-bold text-[#8d7168] tracking-wider">
                Effectif Pédagogique
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[32px] font-extrabold text-[#1b1c1c] leading-none">
                  {teachers.length}
                </span>
                <span className="text-[12.5px] text-[#594139] font-semibold">enseignants</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#dae1ff] text-[#011848] flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">groups</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#f0eded]/60 flex items-center justify-between text-[11.5px]">
            <span className="text-[#594139]">
              {teachers.filter((t) => t.status !== 'vac').length} Titulaires •{' '}
              {teachers.filter((t) => t.status === 'vac').length} Vacataires
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#96f5ca] text-[#002115] font-bold">
              +2 T1
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="relative bg-white p-5 rounded-xl shadow-sm border border-[#f0eded] overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-bold text-[#8d7168] tracking-wider">
                Volume Horaire Alloué
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[32px] font-extrabold text-[#1b1c1c] leading-none">
                  864<span className="text-[20px] font-bold">h</span>
                </span>
                <span className="text-[12.5px] text-[#006c4c] font-bold">/ 864h</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#96f5ca] text-[#002115] flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">timelapse</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#f0eded]/60 flex items-center justify-between text-[11.5px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006c4c]"></span>
              <span className="text-[#006c4c] font-bold">100% Couverture</span>
            </div>
            <span className="text-[#8d7168]">0h orpheline</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="relative bg-white p-5 rounded-xl shadow-sm border border-[#f0eded] overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-bold text-[#8d7168] tracking-wider">
                Cahiers de Texte & APC
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[32px] font-extrabold text-[#1b1c1c] leading-none">
                  84.5<span className="text-[20px] font-bold">%</span>
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#b3c5fe] text-[#3f5182] flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">menu_book</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#f0eded]/60 flex flex-col gap-1 text-[11.5px]">
            <div className="w-full bg-[#eae7e7] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#4b5d8f] h-full rounded-full" style={{ width: '84.5%' }}></div>
            </div>
            <span className="text-[#594139] flex justify-between mt-0.5">
              <span>Progression pédagogique</span>
              <span className="font-bold text-[#4b5d8f]">38 visés / 48</span>
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="relative bg-white p-5 rounded-xl shadow-sm border border-[#f0eded] overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-bold text-[#8d7168] tracking-wider">
                Notes Trimestre 1
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-[32px] font-extrabold text-[#006c4c] leading-none">
                  91.6<span className="text-[20px] font-bold">%</span>
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">assignment_late</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#f0eded]/60 flex items-center justify-between text-[11.5px]">
            <span className="text-[#1b1c1c] font-semibold">{teachers.length - lateCount} à jour</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-bold">
              {lateCount} en retard
            </span>
          </div>
        </div>
      </div>

      {/* ADVANCED FILTERS BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#f0eded] flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Live Search */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8d7168] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Rechercher par nom, matricule (ex: EN-2019), discipline ou classe..."
              className="w-full h-11 pl-10 pr-4 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] placeholder:text-[#8d7168] text-[13px] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff6b35] shadow-inner"
            />
          </div>

          {/* Quick Dropdown Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Département */}
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 px-3 pr-8 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] text-[12.5px] font-bold focus:outline-none cursor-pointer appearance-none"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.label}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#8d7168] pointer-events-none text-[18px]">
                arrow_drop_down
              </span>
            </div>

            {/* Statut / Grade */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 px-3 pr-8 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] text-[12.5px] font-bold focus:outline-none cursor-pointer appearance-none"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#8d7168] pointer-events-none text-[18px]">
                arrow_drop_down
              </span>
            </div>

            {/* Charge Horaire */}
            <div className="relative">
              <select
                value={selectedCharge}
                onChange={(e) => {
                  setSelectedCharge(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 px-3 pr-8 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] text-[12.5px] font-bold focus:outline-none cursor-pointer appearance-none"
              >
                {CHARGE_OPTIONS.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.label}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[#8d7168] pointer-events-none text-[18px]">
                arrow_drop_down
              </span>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              title="Réinitialiser les filtres"
              className="h-11 px-3 rounded-lg text-[#8d7168] hover:text-[#1b1c1c] hover:bg-[#eae7e7] transition-all flex items-center gap-1 text-[12px] font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
              <span>Effacer</span>
            </button>
          </div>
        </div>

        {/* Active filter chips tabs */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-[#f0eded]/60">
          <span className="text-[11px] text-[#8d7168] uppercase font-bold tracking-wider mr-1">
            Filtres rapides :
          </span>
          <button
            onClick={() => {
              setQuickFilter('all');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-[11.5px] font-bold transition-all ${
              quickFilter === 'all'
                ? 'bg-[#dae1ff] text-[#011848]'
                : 'bg-[#f6f3f2] text-[#594139] hover:bg-[#eae7e7]'
            }`}
          >
            Tous ({teachers.length})
          </button>
          <button
            onClick={() => {
              setQuickFilter('late');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-[11.5px] font-bold transition-all ${
              quickFilter === 'late'
                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                : 'bg-[#f6f3f2] text-[#594139] hover:bg-[#eae7e7]'
            }`}
          >
            En retard de notes ({lateCount})
          </button>
          <button
            onClick={() => {
              setQuickFilter('pp');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-[11.5px] font-bold transition-all ${
              quickFilter === 'pp'
                ? 'bg-[#dae1ff] text-[#011848]'
                : 'bg-[#f6f3f2] text-[#594139] hover:bg-[#eae7e7]'
            }`}
          >
            Professeurs Principaux ({ppCount})
          </button>
          <button
            onClick={() => {
              setQuickFilter('overtime');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-full text-[11.5px] font-bold transition-all ${
              quickFilter === 'overtime'
                ? 'bg-[#ffdbd0] text-[#832600]'
                : 'bg-[#f6f3f2] text-[#594139] hover:bg-[#eae7e7]'
            }`}
          >
            Heures Complémentaires ({overtimeCount})
          </button>
        </div>
      </div>

      {/* TEACHERS DATA TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f6f3f2] text-[#594139] uppercase text-[11px] font-extrabold tracking-wider border-b border-[#f0eded]">
                <th className="py-3.5 px-6 font-bold">Enseignant & Contact</th>
                <th className="py-3.5 px-4 font-bold">Département & Grade</th>
                <th className="py-3.5 px-4 font-bold">Classes Affectées</th>
                <th className="py-3.5 px-4 font-bold">Charge Hebdomadaire</th>
                <th className="py-3.5 px-4 font-bold">Suivi Pédagogique</th>
                <th className="py-3.5 px-6 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#1b1c1c] divide-y divide-[#f0eded]/60">
              {paginatedTeachers.length > 0 ? (
                paginatedTeachers.map((t) => {
                  const isLate = t.pedagogicalFollowUp.notesT1Status === 'late';
                  const isOvertime = t.assignedHours > t.quotaHours;

                  return (
                    <tr
                      key={t.id}
                      className={`transition-colors ${
                        isLate
                          ? 'bg-[#ffdad6]/20 hover:bg-[#ffdad6]/30'
                          : 'hover:bg-[#f6f3f2]/70 bg-white'
                      }`}
                    >
                      {/* Teacher & Contact */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative shrink-0">
                            {t.avatarUrl ? (
                              <img
                                src={t.avatarUrl}
                                alt={t.name}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const fallback = document.getElementById(`fallback-${t.id}`);
                                  if (fallback) fallback.classList.remove('hidden');
                                }}
                                className="w-11 h-11 rounded-full object-cover shadow-sm ring-1 ring-black/5"
                              />
                            ) : null}
                            <div
                              id={`fallback-${t.id}`}
                              className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-[14px] ${
                                t.avatarUrl ? 'hidden' : ''
                              } ${
                                isLate
                                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                  : t.isChefDept
                                  ? 'bg-[#4b5d8f] text-white'
                                  : 'bg-[#dae1ff] text-[#011848]'
                              }`}
                            >
                              {t.initials}
                            </div>
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                                isLate ? 'bg-[#ba1a1a]' : 'bg-[#006c4c]'
                              }`}
                              title={isLate ? 'Retard signalé' : 'Actif sur SOMA'}
                            ></span>
                          </div>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[14px] text-[#1b1c1c] truncate">
                                {t.name}
                              </span>
                              {t.status === 'vac' && (
                                <span className="px-1.5 py-0.2 rounded bg-[#eae7e7] text-[#594139] text-[9.5px] font-bold">
                                  VAC
                                </span>
                              )}
                              {t.isChefDept && (
                                <span className="px-1.5 py-0.2 rounded bg-[#96f5ca] text-[#002115] text-[9.5px] font-bold">
                                  Chef Dpt
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#8d7168] font-mono font-bold">
                              MAT: {t.matricule}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 text-[11.5px] text-[#594139]">
                              <span className="flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[13px]">mail</span>
                                {t.email}
                              </span>
                              <span className="text-[#8d7168]">•</span>
                              <span>{t.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department & Grade */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13.5px] font-bold text-[#1b1c1c]">
                            {t.departmentLabel}
                          </span>
                          <span className="text-[11.5px] text-[#4b5d8f] font-semibold">
                            {t.grade}
                          </span>
                        </div>
                      </td>

                      {/* Assigned Classes */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                          {t.classes.map((cls, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1 ${
                                cls.isPP
                                  ? 'bg-[#dae1ff] text-[#011848]'
                                  : 'bg-[#eae7e7] text-[#594139]'
                              }`}
                            >
                              <span>{cls.name}</span>
                              {cls.isPP && (
                                <span
                                  className="px-1 py-0.2 rounded bg-[#ff6b35] text-white text-[9px] font-extrabold"
                                  title="Professeur Principal"
                                >
                                  PP
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Weekly Hours Load */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 w-36">
                          <div className="flex items-center justify-between text-[11.5px]">
                            <span className="font-bold text-[#1b1c1c]">
                              {t.assignedHours}h / {t.quotaHours}h
                            </span>
                            <span
                              className={`font-bold ${
                                isOvertime
                                  ? 'text-[#ff6b35]'
                                  : t.quotaStatus === 'under'
                                  ? 'text-[#8d7168]'
                                  : 'text-[#006c4c]'
                              }`}
                            >
                              {isOvertime
                                ? `+${t.assignedHours - t.quotaHours}h Sup`
                                : t.status === 'vac'
                                ? '100% Contrat'
                                : '100%'}
                            </span>
                          </div>
                          <div className="w-full bg-[#eae7e7] h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isOvertime
                                  ? 'bg-[#ff6b35]'
                                  : t.status === 'vac'
                                  ? 'bg-[#4b5d8f]'
                                  : 'bg-[#006c4c]'
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (t.assignedHours / t.quotaHours) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <span
                            className={`text-[10.5px] font-semibold ${
                              isOvertime ? 'text-[#ff6b35]' : 'text-[#8d7168]'
                            }`}
                          >
                            {t.quotaNote || 'Quota normal'}
                          </span>
                        </div>
                      </td>

                      {/* Pedagogical Follow-up */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold w-fit ${
                              t.pedagogicalFollowUp.notesT1Status === 'valid'
                                ? 'bg-[#96f5ca] text-[#002115]'
                                : t.pedagogicalFollowUp.notesT1Status === 'pending'
                                ? 'bg-[#dae1ff] text-[#011848]'
                                : 'bg-[#ffdad6] text-[#ba1a1a]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {t.pedagogicalFollowUp.notesT1Status === 'valid'
                                ? 'check_circle'
                                : t.pedagogicalFollowUp.notesT1Status === 'pending'
                                ? 'pending_actions'
                                : 'warning'}
                            </span>
                            <span>{t.pedagogicalFollowUp.notesT1Label}</span>
                          </span>
                          <span
                            className={`text-[11px] ${
                              isLate ? 'text-[#ba1a1a] font-semibold' : 'text-[#8d7168]'
                            }`}
                          >
                            {t.pedagogicalFollowUp.textbookStatus}
                          </span>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onOpenAppel && (
                            <button
                              onClick={() => onOpenAppel(t)}
                              title={`Faire l'appel pour ${t.name} (ses classes affectées)`}
                              className="px-2.5 py-1 rounded-lg bg-[#006c4c]/10 text-[#006c4c] hover:bg-[#006c4c] hover:text-white transition-all text-[11px] font-bold flex items-center gap-1 mr-1"
                            >
                              <span className="material-symbols-outlined text-[15px]">how_to_reg</span>
                              <span>Appel</span>
                            </button>
                          )}
                          {isLate && (
                            <button
                              onClick={() => onOpenBatchSms(t)}
                              className="px-2.5 py-1.5 rounded-lg bg-[#ba1a1a] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm hover:brightness-110 transition-all mr-1"
                            >
                              <span className="material-symbols-outlined text-[15px]">sms</span>
                              <span>Relancer</span>
                            </button>
                          )}
                          <button
                            onClick={() => onSelectTeacher(t)}
                            title="Fiche Pédagogique"
                            className="p-1.5 rounded-lg text-[#4b5d8f] hover:bg-[#eae7e7] transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              visibility
                            </span>
                          </button>
                          <button
                            onClick={() => onEditTeacher(t)}
                            title="Ajuster Affectations"
                            className="p-1.5 rounded-lg text-[#4b5d8f] hover:bg-[#eae7e7] transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              edit_calendar
                            </span>
                          </button>
                          <button
                            onClick={() => onOpenBatchSms(t)}
                            title="Envoyer notification SMS"
                            className="p-1.5 rounded-lg text-[#8d7168] hover:text-[#ff6b35] hover:bg-[#eae7e7] transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              send_time_extension
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8d7168]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[36px]">search_off</span>
                      <p className="text-[14px] font-bold text-[#1b1c1c]">
                        Aucun enseignant trouvé pour ces critères de recherche
                      </p>
                      <button
                        onClick={resetFilters}
                        className="text-[12px] font-bold text-[#ff6b35] hover:underline"
                      >
                        Réinitialiser tous les filtres
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination & Summary */}
        <div className="bg-[#f6f3f2] px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-[#594139] border-t border-[#f0eded]">
          <span>
            Affichage de{' '}
            <strong>
              {filteredTeachers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} à{' '}
              {Math.min(currentPage * pageSize, filteredTeachers.length)}
            </strong>{' '}
            sur <strong>{teachers.length}</strong> enseignants enregistrés
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-white text-[#8d7168] hover:text-[#1b1c1c] disabled:opacity-40 border border-[#f0eded]"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              if (totalPages > 5 && p > 3 && p < totalPages) {
                if (p === 4) {
                  return (
                    <span key={p} className="px-1 text-[#8d7168]">
                      ...
                    </span>
                  );
                }
                return null;
              }
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-all border ${
                    currentPage === p
                      ? 'bg-[#ff6b35] text-white border-[#ff6b35]'
                      : 'bg-white text-[#1b1c1c] border-[#f0eded] hover:bg-[#eae7e7]'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-white text-[#1b1c1c] hover:bg-[#eae7e7] disabled:opacity-40 border border-[#f0eded]"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM CONTROL BAR: BATCH ACTIONS & MINESEC PEDAGOGICAL COMPLIANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Batch Actions Box */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-[#f0eded] flex flex-col justify-between gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4b5d8f] text-[22px]">bolt</span>
                <span className="text-[17px] text-[#1b1c1c] font-bold">
                  Actions Groupées du Censeur
                </span>
              </div>
              <p className="text-[13px] text-[#594139] mt-0.5">
                Opérations directes sur l'ensemble de l'équipe pédagogique du 2nd Cycle.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold">
              Période T1 Clôture
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Action 1 */}
            <button
              onClick={() => onOpenBatchSms()}
              className="p-3.5 rounded-lg bg-[#f6f3f2] hover:bg-[#ffdad6]/40 text-left transition-all flex flex-col gap-1 group border border-transparent hover:border-[#ffdad6]"
            >
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">
                  sms_failed
                </span>
                <span className="text-[#ba1a1a] font-bold text-[11.5px] group-hover:translate-x-0.5 transition-transform">
                  {lateCount} ciblés →
                </span>
              </div>
              <span className="text-[13px] text-[#1b1c1c] font-bold">Relancer retardataires</span>
              <span className="text-[11.5px] text-[#8d7168]">
                SMS groupé aux {lateCount} profs en retard de notes
              </span>
            </button>

            {/* Action 2 */}
            <button
              onClick={onOpenEmargementModal}
              className="p-3.5 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-left transition-all flex flex-col gap-1 group border border-transparent hover:border-[#eae7e7]"
            >
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[#4b5d8f] text-[20px]">
                  receipt_long
                </span>
                <span className="text-[#4b5d8f] font-bold text-[11.5px] group-hover:translate-x-0.5 transition-transform">
                  Générer →
                </span>
              </div>
              <span className="text-[13px] text-[#1b1c1c] font-bold">Fiches d'Émargement</span>
              <span className="text-[11.5px] text-[#8d7168]">
                Cahiers d'appels mensuels imprimables
              </span>
            </button>

            {/* Action 3 */}
            <button
              onClick={onOpenAuditModal}
              className="p-3.5 rounded-lg bg-[#f6f3f2] hover:bg-[#96f5ca]/30 text-left transition-all flex flex-col gap-1 group border border-transparent hover:border-[#96f5ca]"
            >
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[#006c4c] text-[20px]">
                  verified
                </span>
                <span className="text-[#006c4c] font-bold text-[11.5px] group-hover:translate-x-0.5 transition-transform">
                  Contrôle →
                </span>
              </div>
              <span className="text-[13px] text-[#1b1c1c] font-bold">Audit Quotas Horaires</span>
              <span className="text-[11.5px] text-[#8d7168]">
                Validation des heures sup & conformités
              </span>
            </button>
          </div>
        </div>

        {/* Official MINESEC Inspection Widget */}
        <div className="bg-[#4b5d8f] text-white p-5 rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 blur-xl pointer-events-none"></div>
          <div className="flex flex-col gap-1 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[10.5px] font-extrabold uppercase">
                Norme MINESEC APC
              </span>
              <span className="material-symbols-outlined text-[#b3c5fe] text-[20px]">
                verified_user
              </span>
            </div>
            <h2 className="text-[17px] font-bold mt-2">Visa Trimestriel du Préfet</h2>
            <p className="text-[12px] text-[#dae1ff] leading-relaxed">
              Le taux de couverture globale atteint 100%. Les fiches de progression par objectifs
              d'apprentissage sont téléchargeables pour l'Inspection Pédagogique Régionale (IPR).
            </p>
          </div>
          <div className="mt-4 pt-1 relative z-10">
            <button
              onClick={onOpenInspectionModal}
              className="w-full py-2.5 px-4 rounded-lg bg-[#ff6b35] text-white text-[13px] font-bold shadow hover:brightness-105 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
              <span>Dossier Inspection Complète</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
