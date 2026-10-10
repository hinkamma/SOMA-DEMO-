import React, { useState, useMemo } from 'react';
import { AbsenceRecord, DisciplineSanction, Student } from '../types';
import { CLASSES_LIST } from '../data/mockData';
import { BilletEntreeModal } from './BilletEntreeModal';

interface SurveillanceDisciplineViewProps {
  students: Student[];
  absences: AbsenceRecord[];
  sanctions: DisciplineSanction[];
  onAddAbsence: (abs: AbsenceRecord) => void;
  onAddSanction: (sanc: DisciplineSanction) => void;
  onToggleJustified: (absId: string) => void;
}

export const SurveillanceDisciplineView: React.FC<SurveillanceDisciplineViewProps> = ({
  students,
  absences,
  sanctions,
  onAddAbsence,
  onAddSanction,
  onToggleJustified,
}) => {
  const [activeTab, setActiveTab] = useState<'absences' | 'conduite' | 'billets' | 'stats'>('absences');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [filterJustified, setFilterJustified] = useState<'all' | 'justified' | 'unjustified'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected absence for printing ticket
  const [selectedAbsenceForTicket, setSelectedAbsenceForTicket] = useState<AbsenceRecord | null>(null);

  // New absence modal state
  const [showAddAbsenceModal, setShowAddAbsenceModal] = useState(false);
  const [newAbsStudent, setNewAbsStudent] = useState('');
  const [newAbsClass, setNewAbsClass] = useState('Terminale C');
  const [newAbsHours, setNewAbsHours] = useState(2);
  const [newAbsMotif, setNewAbsMotif] = useState('');
  const [newAbsJustified, setNewAbsJustified] = useState(false);

  // New sanction modal state
  const [showAddSanctionModal, setShowAddSanctionModal] = useState(false);
  const [newSancStudent, setNewSancStudent] = useState('');
  const [newSancClass, setNewSancClass] = useState('Terminale C');
  const [newSancType, setNewSancType] = useState<DisciplineSanction['sanctionType']>('Avertissement');
  const [newSancMotif, setNewSancMotif] = useState('');

  // Filtered absences
  const filteredAbsences = useMemo(() => {
    return absences.filter((a) => {
      const matchClass = selectedClass === 'all' || a.className === selectedClass;
      const matchSearch =
        a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.matricule.toLowerCase().includes(searchQuery.toLowerCase());
      const matchJustified =
        filterJustified === 'all' ||
        (filterJustified === 'justified' && a.isJustified) ||
        (filterJustified === 'unjustified' && !a.isJustified);
      return matchClass && matchSearch && matchJustified;
    });
  }, [absences, selectedClass, searchQuery, filterJustified]);

  // Handle add absence
  const handleCreateAbsence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAbsStudent.trim()) return;

    const matchedStudent = students.find(
      (s) => s.name.toLowerCase() === newAbsStudent.trim().toLowerCase()
    );

    const newRec: AbsenceRecord = {
      id: `abs-${Date.now()}`,
      studentName: newAbsStudent.trim(),
      matricule: matchedStudent?.matricule || `EL-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      className: newAbsClass,
      date: new Date().toLocaleDateString('fr-FR'),
      hoursCount: Number(newAbsHours),
      motif: newAbsMotif || 'Absence non motivée constatée à l’appel',
      isJustified: newAbsJustified,
      ticketIssued: false,
      registeredBy: 'Surveillant Général (2nd Cycle)',
    };

    onAddAbsence(newRec);
    setShowAddAbsenceModal(false);
    setNewAbsStudent('');
    setNewAbsMotif('');
    setNewAbsHours(2);
  };

  // Handle add sanction
  const handleCreateSanction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSancStudent.trim()) return;

    const matchedStudent = students.find(
      (s) => s.name.toLowerCase() === newSancStudent.trim().toLowerCase()
    );

    const pointMap: Record<DisciplineSanction['sanctionType'], number> = {
      Avertissement: 1,
      Blâme: 2,
      'Retenue 2h': 3,
      'Exclusion 3 jours': 5,
      'Conseil de discipline': 8,
    };

    const newSanc: DisciplineSanction = {
      id: `sanc-${Date.now()}`,
      studentName: newSancStudent.trim(),
      matricule: matchedStudent?.matricule || `EL-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      className: newSancClass,
      date: new Date().toLocaleDateString('fr-FR'),
      motif: newSancMotif || 'Manquement grave au règlement intérieur de l’établissement',
      sanctionType: newSancType,
      status: 'Appliqué',
      issuedBy: 'Surveillant Général',
      pointsDeducted: pointMap[newSancType],
    };

    onAddSanction(newSanc);
    setShowAddSanctionModal(false);
    setNewSancStudent('');
    setNewSancMotif('');
  };

  // Metrics
  const totalAbsenceHours = absences.reduce((acc, curr) => acc + curr.hoursCount, 0);
  const unjustifiedCount = absences.filter((a) => !a.isJustified).length;
  const justifiedCount = absences.filter((a) => a.isJustified).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold uppercase tracking-wide">
              Service de la Surveillance Générale
            </span>
            <span className="text-[#8d7168]">•</span>
            <span className="text-[12px] text-[#4b5d8f] font-semibold">MINESEC 2nd Cycle</span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c] tracking-tight">
            Surveillance Générale & Discipline Scolaire
          </h1>
          <p className="text-[13.5px] text-[#594139]">
            Gestion des appels quotidiens, régularisation des absences, émission des billets d'entrée et notes de conduite sur 20.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddAbsenceModal(true)}
            className="px-4 py-2.5 rounded-lg bg-[#ff6b35] text-white text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105"
          >
            <span className="material-symbols-outlined text-[18px]">event_busy</span>
            <span>+ Déclarer une Absence</span>
          </button>
          <button
            onClick={() => setShowAddSanctionModal(true)}
            className="px-4 py-2.5 rounded-lg bg-[#011848] text-white text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            <span>+ Infliger Sanction</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[11px] font-bold uppercase">Heures d'Absence Cumulées</span>
            <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">schedule</span>
          </div>
          <div className="mt-2">
            <span className="text-[28px] font-black text-[#1b1c1c]">{totalAbsenceHours} h</span>
            <p className="text-[11.5px] text-[#8d7168] font-semibold">Consignées ce trimestre</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[11px] font-bold uppercase">Absences Non Justifiées</span>
            <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">warning</span>
          </div>
          <div className="mt-2">
            <span className="text-[28px] font-black text-[#ba1a1a]">{unjustifiedCount} cas</span>
            <p className="text-[11.5px] text-[#ba1a1a] font-semibold">Exigent convocation parents</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[11px] font-bold uppercase">Absences Régularisées</span>
            <span className="material-symbols-outlined text-[20px] text-[#006c4c]">task_alt</span>
          </div>
          <div className="mt-2">
            <span className="text-[28px] font-black text-[#006c4c]">{justifiedCount} justifiées</span>
            <p className="text-[11.5px] text-[#006c4c] font-semibold">Billets d'entrée délivrés</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[11px] font-bold uppercase">Taux d'Assiduité Global</span>
            <span className="material-symbols-outlined text-[20px] text-[#4b5d8f]">verified_user</span>
          </div>
          <div className="mt-2">
            <span className="text-[28px] font-black text-[#4b5d8f]">96.4 %</span>
            <p className="text-[11.5px] text-[#006c4c] font-semibold">+1.2% vs semaine passée</p>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-[#eae7e7] gap-2 overflow-x-auto text-[13px] font-bold">
        <button
          onClick={() => setActiveTab('absences')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'absences'
              ? 'border-[#ff6b35] text-[#ff6b35]'
              : 'border-transparent text-[#594139] hover:text-[#1b1c1c]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
          <span>Pointage des Absences & Retards ({absences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('conduite')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'conduite'
              ? 'border-[#ff6b35] text-[#ff6b35]'
              : 'border-transparent text-[#594139] hover:text-[#1b1c1c]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">military_tech</span>
          <span>Notes de Conduite & Sanctions ({sanctions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('billets')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'billets'
              ? 'border-[#ff6b35] text-[#ff6b35]'
              : 'border-transparent text-[#594139] hover:text-[#1b1c1c]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
          <span>Billets d'Entrée & Autorisations</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'stats'
              ? 'border-[#ff6b35] text-[#ff6b35]'
              : 'border-transparent text-[#594139] hover:text-[#1b1c1c]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">query_stats</span>
          <span>Statistiques Disciplinaires</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: POINTAGE DES ABSENCES & RETARDS
          ======================================================== */}
      {activeTab === 'absences' && (
        <div className="flex flex-col gap-4">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 w-full md:w-auto flex-1">
              <div className="relative flex-1 max-w-sm">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8d7168] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher élève ou matricule..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#f6f3f2] text-[12.5px] text-[#1b1c1c] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff6b35]"
                />
              </div>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="h-9 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[12px] text-[#1b1c1c] focus:outline-none"
              >
                <option value="all">Toutes les classes</option>
                {CLASSES_LIST.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={filterJustified}
                onChange={(e) => setFilterJustified(e.target.value as any)}
                className="h-9 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[12px] text-[#1b1c1c] focus:outline-none"
              >
                <option value="all">Statut : Tous</option>
                <option value="justified">Justifiées</option>
                <option value="unjustified">Non Justifiées</option>
              </select>
            </div>

            <div className="text-[12px] text-[#8d7168] font-semibold shrink-0">
              Affichage de {filteredAbsences.length} enregistrement(s)
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr className="bg-[#f6f3f2] text-[#594139] uppercase text-[10.5px] font-extrabold tracking-wider border-b border-[#f0eded]">
                    <th className="py-3 px-4 font-bold">Date & Heure</th>
                    <th className="py-3 px-4 font-bold">Élève & Matricule</th>
                    <th className="py-3 px-3 font-bold">Classe</th>
                    <th className="py-3 px-3 font-bold text-center">Volume</th>
                    <th className="py-3 px-4 font-bold">Motif Constaté</th>
                    <th className="py-3 px-3 font-bold">Statut Justification</th>
                    <th className="py-3 px-3 font-bold">Agent Déclarant</th>
                    <th className="py-3 px-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eded] text-[#1b1c1c]">
                  {filteredAbsences.map((a) => (
                    <tr key={a.id} className="hover:bg-[#f6f3f2]/50">
                      <td className="py-3 px-4 font-mono text-[11.5px] text-[#8d7168]">
                        {a.date}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#1b1c1c] block">{a.studentName}</span>
                        <span className="text-[10.5px] text-[#8d7168] font-mono">{a.matricule}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#dae1ff] text-[#011848] text-[11px] font-bold">
                          {a.className}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-extrabold text-[#ba1a1a]">{a.hoursCount} h</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[#594139] max-w-xs block leading-snug">{a.motif}</span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onToggleJustified(a.id)}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 transition-transform active:scale-95 ${
                            a.isJustified
                              ? 'bg-[#96f5ca] text-[#002115]'
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}
                          title="Cliquer pour basculer justifié / non justifié"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {a.isJustified ? 'check_circle' : 'cancel'}
                          </span>
                          <span>{a.isJustified ? 'Justifiée' : 'Non Justifiée'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-[#8d7168]">
                        {a.registeredBy}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedAbsenceForTicket(a)}
                            className="px-2.5 py-1 rounded bg-[#ff6b35]/10 hover:bg-[#ff6b35] text-[#ff6b35] hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                            title="Générer billet d'entrée officiel"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              confirmation_number
                            </span>
                            <span>Billet</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: NOTES DE CONDUITE & SANCTIONS
          ======================================================== */}
      {activeTab === 'conduite' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Student Conduct Scoreboard */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-[#f0eded] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#f0eded] bg-[#fcf9f8] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[14px] text-[#1b1c1c]">
                  Baromètre des Notes de Conduite (Barème MINESEC sur 20)
                </h3>
                <p className="text-[11.5px] text-[#8d7168]">
                  Note initiale de 20/20 avec déductions réglementaires pour absences et fautes.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#96f5ca] text-[#002115] text-[11px] font-bold">
                Moyenne : 17.8 / 20
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr className="bg-[#f6f3f2] text-[#594139] uppercase text-[10.5px] font-extrabold border-b border-[#f0eded]">
                    <th className="py-3 px-4 font-bold">Élève & Matricule</th>
                    <th className="py-3 px-3 font-bold">Classe</th>
                    <th className="py-3 px-3 font-bold text-center">Abs. Non Just.</th>
                    <th className="py-3 px-3 font-bold text-center">Sanctions</th>
                    <th className="py-3 px-3 font-bold text-center">Note Conduite</th>
                    <th className="py-3 px-4 font-bold">Appréciation Ministérielle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eded] text-[#1b1c1c]">
                  {students.map((s) => {
                    const isCritique = s.conductScore < 14;
                    const isMoyen = s.conductScore >= 14 && s.conductScore < 17;
                    return (
                      <tr key={s.id} className="hover:bg-[#f6f3f2]/50">
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#1b1c1c] block">{s.name}</span>
                          <span className="text-[10px] text-[#8d7168] font-mono">{s.matricule}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-[#dae1ff] text-[#011848] text-[11px] font-bold">
                            {s.className}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-bold">
                          {s.unjustifiedAbsencesHours > 0 ? (
                            <span className="text-[#ba1a1a]">{s.unjustifiedAbsencesHours} h</span>
                          ) : (
                            <span className="text-[#006c4c]">0 h</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {s.sanctionsCount > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-bold text-[10.5px]">
                              {s.sanctionsCount}
                            </span>
                          ) : (
                            <span className="text-[#8d7168] text-[11px]">0</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`font-black text-[14px] ${
                              isCritique
                                ? 'text-[#ba1a1a]'
                                : isMoyen
                                ? 'text-[#ff6b35]'
                                : 'text-[#006c4c]'
                            }`}
                          >
                            {s.conductScore.toFixed(1)} / 20
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {isCritique ? (
                            <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[10.5px] font-bold">
                              Très Mauvaise • Convocation
                            </span>
                          ) : isMoyen ? (
                            <span className="px-2 py-0.5 rounded bg-[#ffdbd0] text-[#832600] text-[10.5px] font-bold">
                              Passable • À surveiller
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-[#96f5ca] text-[#002115] text-[10.5px] font-bold">
                              Très Bonne Conduite (T.B)
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Col: Sanctions Log */}
          <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eded]">
              <div>
                <h3 className="font-bold text-[15px] text-[#1b1c1c]">
                  Registre des Sanctions
                </h3>
                <p className="text-[11.5px] text-[#8d7168]">
                  Historique des avertissements et blâmes.
                </p>
              </div>
              <button
                onClick={() => setShowAddSanctionModal(true)}
                className="px-2.5 py-1 rounded bg-[#011848] text-white text-[11px] font-bold"
              >
                + Ajouter
              </button>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px]">
              {sanctions.map((sanc) => (
                <div
                  key={sanc.id}
                  className="p-3.5 rounded-xl border border-[#ffdad6] bg-[#ffdad6]/15 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[13px] text-[#1b1c1c]">
                      {sanc.studentName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] font-black text-[10.5px]">
                      {sanc.sanctionType} (-{sanc.pointsDeducted} pts)
                    </span>
                  </div>
                  <span className="text-[11px] text-[#4b5d8f] font-semibold">
                    Classe : {sanc.className} • Le {sanc.date}
                  </span>
                  <p className="text-[11.5px] text-[#594139] italic">
                    « {sanc.motif} »
                  </p>
                  <div className="pt-2 border-t border-[#eae7e7] flex justify-between items-center text-[10.5px] text-[#8d7168]">
                    <span>Émis par : {sanc.issuedBy}</span>
                    <span className="font-bold text-[#006c4c]">✓ {sanc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: BILLETS D'ENTRÉE & AUTORISATIONS
          ======================================================== */}
      {activeTab === 'billets' && (
        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0eded]">
            <div>
              <h3 className="font-bold text-[16px] text-[#1b1c1c]">
                Centre d'Émission des Billets d'Entrée & de Reprise de Cours
              </h3>
              <p className="text-[12px] text-[#8d7168]">
                Tout élève ayant manqué un cours doit obligatoirement présenter un billet signé par la Surveillance Générale pour réintégrer la salle.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {absences.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl border border-[#eae7e7] bg-[#fffefc] flex flex-col justify-between gap-3 shadow-sm hover:border-[#ff6b35] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-[#dae1ff] text-[#011848] text-[10.5px] font-bold">
                      {a.className}
                    </span>
                    <span className="text-[10.5px] font-mono text-[#8d7168]">{a.date}</span>
                  </div>
                  <h4 className="font-bold text-[14px] text-[#1b1c1c] mt-2">
                    {a.studentName}
                  </h4>
                  <span className="text-[11px] font-mono text-[#4b5d8f]">{a.matricule}</span>
                  <p className="text-[11.5px] text-[#594139] mt-2 line-clamp-2">
                    {a.motif}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#f0eded] flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold ${
                      a.isJustified ? 'text-[#006c4c]' : 'text-[#ba1a1a]'
                    }`}
                  >
                    {a.isJustified ? '✓ Justifiée' : '⚠ Non Justifiée'}
                  </span>
                  <button
                    onClick={() => setSelectedAbsenceForTicket(a)}
                    className="px-3 py-1.5 rounded-lg bg-[#ff6b35] text-white text-[11px] font-bold flex items-center gap-1 shadow-sm hover:brightness-105"
                  >
                    <span className="material-symbols-outlined text-[15px]">print</span>
                    <span>Imprimer Billet</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: STATISTIQUES DISCIPLINAIRES
          ======================================================== */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-5 flex flex-col gap-4">
            <h3 className="font-bold text-[15px] text-[#1b1c1c] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ff6b35]">leaderboard</span>
              <span>Histogramme Hebdomadaire des Absences (Par Jour)</span>
            </h3>
            <p className="text-[12px] text-[#8d7168]">
              Volume horaire d'absence enregistré du lundi au samedi.
            </p>

            {/* Custom SVG / Visual Histogram */}
            <div className="flex items-end justify-between h-48 pt-6 px-4 bg-[#fcf9f8] rounded-xl border border-[#f0eded]">
              {[
                { day: 'Lun', hours: 14, color: '#4b5d8f' },
                { day: 'Mar', hours: 8, color: '#4b5d8f' },
                { day: 'Mer', hours: 6, color: '#006c4c' },
                { day: 'Jeu', hours: 11, color: '#4b5d8f' },
                { day: 'Ven', hours: 18, color: '#ff6b35' },
                { day: 'Sam', hours: 4, color: '#006c4c' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-black font-mono text-[#1b1c1c]">
                    {item.hours}h
                  </span>
                  <div
                    className="w-10 rounded-t-lg transition-all"
                    style={{
                      height: `${(item.hours / 20) * 110}px`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                  <span className="text-[11px] font-bold text-[#594139]">{item.day}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#8d7168] pt-2">
              <span>Pic d'absence constaté : Vendredi après-midi</span>
              <span className="text-[#006c4c] font-bold">Assiduité max : Mercredi</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-[15px] text-[#1b1c1c] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c4c]">workspace_premium</span>
                <span>Palmarès d'Assiduité par Classe (2nd Cycle)</span>
              </h3>
              <p className="text-[12px] text-[#8d7168] mt-1">
                Classement selon le pourcentage de présence effective.
              </p>

              <div className="mt-4 flex flex-col gap-2.5 text-[12.5px]">
                {[
                  { name: 'Terminale C', rate: 99.2, status: 'Exemplaire', color: '#006c4c' },
                  { name: 'Terminale D', rate: 98.4, status: 'Très Bon', color: '#006c4c' },
                  { name: '1ère D1', rate: 97.1, status: 'Bon', color: '#4b5d8f' },
                  { name: 'Terminale TI', rate: 95.8, status: 'Satisfaisant', color: '#4b5d8f' },
                  { name: '1ère A4', rate: 94.2, status: 'Moyen', color: '#ff6b35' },
                  { name: '2nde C1', rate: 91.5, status: 'Sous Vigilance', color: '#ba1a1a' },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-[#f6f3f2] flex items-center justify-between"
                  >
                    <span className="font-bold text-[#1b1c1c]">{c.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[13px]" style={{ color: c.color }}>
                        {c.rate}%
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          backgroundColor: `${c.color}15`,
                          color: c.color,
                        }}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => alert("Rapport de discipline mensuel transmis au Proviseur et au Conseil de Direction.")}
              className="mt-4 w-full py-2.5 rounded-lg bg-[#011848] text-white text-[12px] font-bold flex items-center justify-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Transmettre Rapport de Discipline au Proviseur</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Billet d'entrée */}
      <BilletEntreeModal
        isOpen={!!selectedAbsenceForTicket}
        onClose={() => setSelectedAbsenceForTicket(null)}
        absence={selectedAbsenceForTicket}
      />

      {/* MODAL: AJOUTER UNE ABSENCE */}
      {showAddAbsenceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#f0eded] bg-[#fcf9f8] flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#1b1c1c] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff6b35]">event_busy</span>
                <span>Déclarer une Absence / Retard</span>
              </h2>
              <button
                onClick={() => setShowAddAbsenceModal(false)}
                className="p-1 text-[#8d7168] hover:text-[#1b1c1c]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAbsence} className="p-6 flex flex-col gap-4 text-[13px]">
              <div>
                <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                  Nom de l'élève
                </label>
                <input
                  type="text"
                  required
                  value={newAbsStudent}
                  onChange={(e) => setNewAbsStudent(e.target.value)}
                  placeholder="Ex: FOTSO Junior Bryan..."
                  className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff6b35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Classe
                  </label>
                  <select
                    value={newAbsClass}
                    onChange={(e) => setNewAbsClass(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                  >
                    {CLASSES_LIST.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Nombre d'heures
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newAbsHours}
                    onChange={(e) => setNewAbsHours(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                  Motif consigné
                </label>
                <input
                  type="text"
                  value={newAbsMotif}
                  onChange={(e) => setNewAbsMotif(e.target.value)}
                  placeholder="Ex: Absence constatée cours de Maths, panne de transport..."
                  className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="justifiedCheck"
                  checked={newAbsJustified}
                  onChange={(e) => setNewAbsJustified(e.target.checked)}
                  className="w-4 h-4 text-[#006c4c] rounded focus:ring-0"
                />
                <label htmlFor="justifiedCheck" className="text-[12px] font-bold text-[#1b1c1c] cursor-pointer">
                  Absence déjà justifiée avec motif valable ou certificat
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0eded]">
                <button
                  type="button"
                  onClick={() => setShowAddAbsenceModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold text-[12px]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#ff6b35] text-white font-bold text-[12px] hover:brightness-105 shadow"
                >
                  Enregistrer l'Absence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INFLIGER UNE SANCTION */}
      {showAddSanctionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#f0eded] bg-[#fcf9f8] flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#1b1c1c] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#011848]">gavel</span>
                <span>Infliger une Sanction Disciplinaire</span>
              </h2>
              <button
                onClick={() => setShowAddSanctionModal(false)}
                className="p-1 text-[#8d7168] hover:text-[#1b1c1c]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSanction} className="p-6 flex flex-col gap-4 text-[13px]">
              <div>
                <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                  Nom de l'élève sanctionné
                </label>
                <input
                  type="text"
                  required
                  value={newSancStudent}
                  onChange={(e) => setNewSancStudent(e.target.value)}
                  placeholder="Ex: DJOMOU Frank Stéphane..."
                  className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Classe
                  </label>
                  <select
                    value={newSancClass}
                    onChange={(e) => setNewSancClass(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                  >
                    {CLASSES_LIST.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Type de Sanction
                  </label>
                  <select
                    value={newSancType}
                    onChange={(e) => setNewSancType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                  >
                    <option value="Avertissement">Avertissement (-1 pt)</option>
                    <option value="Blâme">Blâme (-2 pts)</option>
                    <option value="Retenue 2h">Retenue 2h (-3 pts)</option>
                    <option value="Exclusion 3 jours">Exclusion 3j (-5 pts)</option>
                    <option value="Conseil de discipline">Conseil Discipline (-8 pts)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                  Motif / Circonstances de l'infraction
                </label>
                <textarea
                  rows={2}
                  required
                  value={newSancMotif}
                  onChange={(e) => setNewSancMotif(e.target.value)}
                  placeholder="Ex: Manquement aux consignes d'atelier, indiscipline caractérisée..."
                  className="w-full p-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0eded]">
                <button
                  type="button"
                  onClick={() => setShowAddSanctionModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold text-[12px]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#011848] text-white font-bold text-[12px] hover:brightness-110 shadow"
                >
                  Consigner la Sanction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
