import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { CLASSES_LIST } from '../data/mockData';
import { CertificatScolariteModal } from './CertificatScolariteModal';
import { StudentCardModal } from './StudentCardModal';

interface GestionElevesViewProps {
  students: Student[];
  academicYear: string;
  onAddStudent: (stu: Student) => void;
}

export const GestionElevesView: React.FC<GestionElevesViewProps> = ({
  students,
  academicYear,
  onAddStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals for Certificat & Card
  const [certificatStudent, setCertificatStudent] = useState<Student | null>(null);
  const [cardStudent, setCardStudent] = useState<Student | null>(null);
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);

  // Add student modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStuName, setNewStuName] = useState('');
  const [newStuGender, setNewStuGender] = useState<'M' | 'F'>('M');
  const [newStuClass, setNewStuClass] = useState('Terminale C');
  const [newStuDob, setNewStuDob] = useState('15/05/2007');
  const [newStuPob, setNewStuPob] = useState('Yaoundé');
  const [newStuStatus, setNewStuStatus] = useState<'Nouveau' | 'Ancien' | 'Redoublant'>('Nouveau');
  const [newStuParentName, setNewStuParentName] = useState('');
  const [newStuParentPhone, setNewStuParentPhone] = useState('69');
  const [newStuBlood, setNewStuBlood] = useState('O+');

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = selectedClass === 'all' || s.className === selectedClass;
      const matchGender = selectedGender === 'all' || s.gender === selectedGender;
      const matchStatus = selectedStatus === 'all' || s.status === selectedStatus;
      return matchSearch && matchClass && matchGender && matchStatus;
    });
  }, [students, searchQuery, selectedClass, selectedGender, selectedStatus]);

  // Metrics
  const totalCount = 488; // Total establishment 2nd cycle
  const currentShown = students.length;
  const boysCount = Math.round(totalCount * 0.53);
  const girlsCount = totalCount - boysCount;

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStuName.trim()) return;

    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      name: newStuName.trim(),
      matricule: `EL-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      className: newStuClass,
      gender: newStuGender,
      dob: newStuDob,
      pob: newStuPob,
      status: newStuStatus,
      parentName: newStuParentName || 'Tuteur Légal',
      parentPhone: newStuParentPhone,
      tuitionTotal: newStuClass.includes('TI') || newStuClass.includes('F4') ? 55000 : 50000,
      tuitionPaid: 0,
      tuitionStatus: 'insolvable',
      conductScore: 20.0,
      unjustifiedAbsencesHours: 0,
      sanctionsCount: 0,
      bloodGroup: newStuBlood,
    };

    onAddStudent(newStudent);
    setShowAddModal(false);
    setNewStuName('');
    setNewStuParentName('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold uppercase tracking-wide">
              Bureau des Inscriptions & Scolarité
            </span>
            <span className="text-[#8d7168]">•</span>
            <span className="text-[12px] text-[#4b5d8f] font-semibold">Registre Matricule MINESEC</span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c] tracking-tight">
            Gestion des Élèves & Inscriptions
          </h1>
          <p className="text-[13.5px] text-[#594139]">
            Répertoire nominatif des apprenants, délivrance des certificats de scolarité, cartes d'identité et dossiers scolaires.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#4b5d8f] text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Imprimer Registre</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-lg bg-[#ff6b35] text-white text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Inscrire un Élève</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[11px] font-bold uppercase">Effectif Global 2nd Cycle</span>
            <span className="material-symbols-outlined text-[20px] text-[#011848]">groups</span>
          </div>
          <div className="mt-2">
            <span className="text-[28px] font-black text-[#1b1c1c]">{totalCount} Élèves</span>
            <p className="text-[11.5px] text-[#006c4c] font-semibold">100% enregistrés au MINESEC</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[11px] font-bold uppercase">Répartition Garçons / Filles</span>
            <span className="material-symbols-outlined text-[20px] text-[#4b5d8f]">wc</span>
          </div>
          <div className="mt-2">
            <span className="text-[28px] font-black text-[#4b5d8f]">{boysCount} G / {girlsCount} F</span>
            <p className="text-[11.5px] text-[#8d7168] font-semibold">Ratio équilibré (53% / 47%)</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[11px] font-bold uppercase">Nouveaux Inscrits</span>
            <span className="material-symbols-outlined text-[20px] text-[#ff6b35]">how_to_reg</span>
          </div>
          <div className="mt-2">
            <span className="text-[28px] font-black text-[#ff6b35]">112 Élèves</span>
            <p className="text-[11.5px] text-[#8d7168] font-semibold">Recrutement 2nde & transferts</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[11px] font-bold uppercase">Cartes Scolaires Émises</span>
            <span className="material-symbols-outlined text-[20px] text-[#006c4c]">badge</span>
          </div>
          <div className="mt-2">
            <span className="text-[28px] font-black text-[#006c4c]">462 / 488</span>
            <p className="text-[11.5px] text-[#006c4c] font-semibold">94.7% de badges distribués</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 flex-1 w-full">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8d7168] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher élève, matricule, parent..."
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
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="h-9 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[12px] text-[#1b1c1c] focus:outline-none"
          >
            <option value="all">Sexe : Tous</option>
            <option value="M">Masculin (G)</option>
            <option value="F">Féminin (F)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[12px] text-[#1b1c1c] focus:outline-none"
          >
            <option value="all">Statut Inscription : Tous</option>
            <option value="Nouveau">Nouveaux</option>
            <option value="Ancien">Anciens</option>
            <option value="Redoublant">Redoublants</option>
          </select>
        </div>

        <div className="text-[12px] text-[#8d7168] font-semibold shrink-0">
          {filteredStudents.length} élève(s) affiché(s)
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px] border-collapse">
            <thead>
              <tr className="bg-[#f6f3f2] text-[#594139] uppercase text-[10.5px] font-extrabold tracking-wider border-b border-[#f0eded]">
                <th className="py-3 px-4 font-bold">Élève & Identité</th>
                <th className="py-3 px-3 font-bold">Matricule MINESEC</th>
                <th className="py-3 px-3 font-bold">Classe</th>
                <th className="py-3 px-3 font-bold">Statut</th>
                <th className="py-3 px-4 font-bold">Tuteur Légal & Contact</th>
                <th className="py-3 px-3 font-bold text-center">Conduite</th>
                <th className="py-3 px-3 font-bold">Scolarité</th>
                <th className="py-3 px-4 text-right font-bold">Actions Officielles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eded] text-[#1b1c1c]">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-[#f6f3f2]/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#dae1ff] text-[#011848] flex items-center justify-center font-bold text-[12px] shrink-0">
                        {s.gender === 'M' ? 'G' : 'F'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-[13px] text-[#1b1c1c]">
                          {s.name}
                        </span>
                        <span className="text-[10.5px] text-[#8d7168]">
                          Né(e) le {s.dob} • {s.pob}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-[#4b5d8f] text-[11.5px]">
                      {s.matricule}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#dae1ff] text-[#011848] text-[11px] font-bold">
                      {s.className}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                        s.status === 'Nouveau'
                          ? 'bg-[#96f5ca] text-[#002115]'
                          : s.status === 'Redoublant'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#eae7e7] text-[#594139]'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#1b1c1c]">{s.parentName}</span>
                      <span className="text-[11px] font-mono text-[#8d7168]">{s.parentPhone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-black text-[13px] ${
                        s.conductScore >= 16 ? 'text-[#006c4c]' : 'text-[#ba1a1a]'
                      }`}
                    >
                      {s.conductScore.toFixed(1)}/20
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10.5px] font-bold uppercase ${
                        s.tuitionStatus === 'soldé'
                          ? 'bg-[#96f5ca] text-[#002115]'
                          : s.tuitionStatus === 'partiel'
                          ? 'bg-[#dae1ff] text-[#011848]'
                          : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}
                    >
                      {s.tuitionStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Certificat button */}
                      <button
                        onClick={() => setCertificatStudent(s)}
                        className="px-2.5 py-1 rounded bg-[#006c4c]/10 hover:bg-[#006c4c] text-[#006c4c] hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                        title="Délivrer certificat de scolarité officiel"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          workspace_premium
                        </span>
                        <span>Certificat</span>
                      </button>

                      {/* Carte scolaire button */}
                      <button
                        onClick={() => setCardStudent(s)}
                        className="px-2.5 py-1 rounded bg-[#4b5d8f]/10 hover:bg-[#4b5d8f] text-[#4b5d8f] hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                        title="Générer carte d'identité scolaire"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          badge
                        </span>
                        <span>Carte</span>
                      </button>

                      {/* Detail button */}
                      <button
                        onClick={() => setDetailStudent(s)}
                        className="p-1 rounded text-[#8d7168] hover:text-[#1b1c1c] hover:bg-[#eae7e7]"
                        title="Consulter fiche détaillée"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          visibility
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificat de Scolarite Modal */}
      <CertificatScolariteModal
        isOpen={!!certificatStudent}
        onClose={() => setCertificatStudent(null)}
        student={certificatStudent}
        academicYear={academicYear}
      />

      {/* Student Card Modal */}
      <StudentCardModal
        isOpen={!!cardStudent}
        onClose={() => setCardStudent(null)}
        student={cardStudent}
        academicYear={academicYear}
      />

      {/* Fiche Élève Modal */}
      {detailStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#f0eded] bg-[#fcf9f8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff6b35] text-[22px]">
                  folder_shared
                </span>
                <h3 className="font-bold text-[16px] text-[#1b1c1c]">
                  Fiche Individuelle de l'Élève
                </h3>
              </div>
              <button
                onClick={() => setDetailStudent(null)}
                className="p-1 text-[#8d7168] hover:text-[#1b1c1c]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-[13px]">
              <div className="flex items-center gap-4 pb-4 border-b border-[#f0eded]">
                <div className="w-16 h-16 rounded-2xl bg-[#ff6b35] text-white flex items-center justify-center font-bold text-[24px]">
                  {detailStudent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-[16px] text-[#1b1c1c]">
                    {detailStudent.name}
                  </h4>
                  <span className="font-mono text-[12px] text-[#4b5d8f] font-bold block">
                    Matricule : {detailStudent.matricule}
                  </span>
                  <span className="text-[11.5px] text-[#8d7168]">
                    Classe : <strong>{detailStudent.className}</strong> • Né(e) le {detailStudent.dob} ({detailStudent.pob})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div className="p-3 rounded-lg bg-[#f6f3f2]">
                  <span className="text-[#8d7168] text-[10.5px] uppercase font-bold block">
                    Scolarité APEE
                  </span>
                  <span className="font-bold text-[#1b1c1c] text-[13px] block mt-0.5">
                    {detailStudent.tuitionPaid.toLocaleString('fr-FR')} / {detailStudent.tuitionTotal.toLocaleString('fr-FR')} F
                  </span>
                  <span className="text-[11px] font-semibold text-[#006c4c] uppercase">
                    Statut : {detailStudent.tuitionStatus}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#f6f3f2]">
                  <span className="text-[#8d7168] text-[10.5px] uppercase font-bold block">
                    Conduite & Assiduité
                  </span>
                  <span className="font-bold text-[#1b1c1c] text-[13px] block mt-0.5">
                    {detailStudent.conductScore.toFixed(1)} / 20
                  </span>
                  <span className="text-[11px] font-semibold text-[#ba1a1a]">
                    {detailStudent.unjustifiedAbsencesHours}h non justifiées
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-[#f0eded]">
                <span className="text-[11px] font-bold text-[#8d7168] uppercase block mb-1">
                  Responsable Légal / Contact Famille
                </span>
                <span className="font-bold text-[#1b1c1c] block">{detailStudent.parentName}</span>
                <span className="text-[#4b5d8f] font-mono font-bold">{detailStudent.parentPhone}</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0eded]">
                <button
                  onClick={() => {
                    setCertificatStudent(detailStudent);
                    setDetailStudent(null);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-[#006c4c] text-white text-[12px] font-bold flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                  <span>Certificat Scolarité</span>
                </button>
                <button
                  onClick={() => {
                    setCardStudent(detailStudent);
                    setDetailStudent(null);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-[#4b5d8f] text-white text-[12px] font-bold flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">badge</span>
                  <span>Carte Scolaire</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INSCRIRE UN ÉLÈVE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[#f0eded] bg-[#fcf9f8] flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#1b1c1c] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff6b35]">person_add</span>
                <span>Inscrire un Nouvel Élève au Répertoire</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-[#8d7168] hover:text-[#1b1c1c]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 overflow-y-auto flex flex-col gap-4 text-[13px]">
              <div>
                <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                  Nom et Prénom de l'élève
                </label>
                <input
                  type="text"
                  required
                  value={newStuName}
                  onChange={(e) => setNewStuName(e.target.value)}
                  placeholder="Ex: NKOUMOU Boris Daniel..."
                  className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff6b35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Sexe
                  </label>
                  <select
                    value={newStuGender}
                    onChange={(e) => setNewStuGender(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Classe d'affectation
                  </label>
                  <select
                    value={newStuClass}
                    onChange={(e) => setNewStuClass(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                  >
                    {CLASSES_LIST.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="text"
                    value={newStuDob}
                    onChange={(e) => setNewStuDob(e.target.value)}
                    placeholder="JJ/MM/AAAA"
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Lieu de naissance
                  </label>
                  <input
                    type="text"
                    value={newStuPob}
                    onChange={(e) => setNewStuPob(e.target.value)}
                    placeholder="Ex: Yaoundé"
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Statut
                  </label>
                  <select
                    value={newStuStatus}
                    onChange={(e) => setNewStuStatus(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                  >
                    <option value="Nouveau">Nouveau</option>
                    <option value="Ancien">Ancien</option>
                    <option value="Redoublant">Redoublant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Groupe Sanguin
                  </label>
                  <select
                    value={newStuBlood}
                    onChange={(e) => setNewStuBlood(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                  Nom du Parent / Tuteur Légal
                </label>
                <input
                  type="text"
                  required
                  value={newStuParentName}
                  onChange={(e) => setNewStuParentName(e.target.value)}
                  placeholder="Ex: M. NKOUMOU Thomas"
                  className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                  Téléphone des Parents (Urgence & Notifications SMS)
                </label>
                <input
                  type="text"
                  required
                  value={newStuParentPhone}
                  onChange={(e) => setNewStuParentPhone(e.target.value)}
                  placeholder="69X XX XX XX"
                  className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0eded]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold text-[12px]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#ff6b35] text-white font-bold text-[12px] hover:brightness-105 shadow"
                >
                  Valider l'Inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
