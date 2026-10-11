import React, { useState, useMemo, useEffect } from 'react';
import { Teacher, Student, AbsenceRecord } from '../types';

interface FaireAppelModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  students: Student[];
  initialTeacherId?: string;
  onValidateAppel: (data: {
    teacher: Teacher;
    className: string;
    subject: string;
    date: string;
    timeSlot: string;
    durationHours: number;
    courseTopic: string;
    notifyParents: boolean;
    records: {
      student: Student;
      status: 'present' | 'absent' | 'retard' | 'infirmerie';
      motif: string;
      lateMinutes?: number;
    }[];
  }) => void;
}

// Helper to normalize class names for loose matching
export function normalizeClassName(clsName: string): string {
  if (!clsName) return '';
  const clean = clsName
    .replace(/\s*\([^)]*\)/g, '') // remove parentheses like (TD), (Génie Civil)
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  // Normalize Terminale abbreviations
  if (clean.startsWith('tle ') || clean === 'tle-c' || clean === 'tle-d' || clean === 'tle-ti' || clean === 'tle-a4' || clean === 'tle-f4') {
    return clean.replace(/^tle[\s-]/, 'terminale ');
  }
  if (clean === '1ere-c' || clean === '1ere c') return '1ère c';
  if (clean === '1ere-d1' || clean === '1ere d1') return '1ère d1';
  if (clean === '1ere-d2' || clean === '1ere d2') return '1ère d2';
  if (clean === '1ere-ti' || clean === '1ere ti') return '1ère ti';
  if (clean === '1ere-a4' || clean === '1ere a4') return '1ère a4';
  if (clean === '2nde-c1' || clean === '2nde c1') return '2nde c1';
  if (clean === '2nde-a4' || clean === '2nde a4') return '2nde a4';

  return clean;
}

const TIME_SLOTS = [
  { id: 'h1', label: '07h30 - 09h30 (2 heures)', hours: 2 },
  { id: 'h2', label: '09h45 - 11h45 (2 heures)', hours: 2 },
  { id: 'h3', label: '12h00 - 13h00 (1 heure)', hours: 1 },
  { id: 'h4', label: '13h00 - 15h00 (2 heures)', hours: 2 },
  { id: 'h5', label: '15h15 - 17h15 (2 heures)', hours: 2 },
];

export const FaireAppelModal: React.FC<FaireAppelModalProps> = ({
  isOpen,
  onClose,
  teachers,
  students,
  initialTeacherId,
  onValidateAppel,
}) => {
  // Selected teacher
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    initialTeacherId || (teachers[0] ? teachers[0].id : '')
  );

  useEffect(() => {
    if (initialTeacherId) {
      setSelectedTeacherId(initialTeacherId);
    } else if (teachers.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(teachers[0].id);
    }
  }, [initialTeacherId, teachers]);

  const currentTeacher = useMemo(() => {
    return teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
  }, [teachers, selectedTeacherId]);

  // STRICT REQUIREMENT: The teacher only sees the classes they are assigned to!
  const assignedClasses = useMemo(() => {
    if (!currentTeacher || !currentTeacher.classes) return [];
    return currentTeacher.classes;
  }, [currentTeacher]);

  // Selected class must be one of the assigned classes
  const [selectedClassRaw, setSelectedClassRaw] = useState<string>('');

  useEffect(() => {
    if (assignedClasses.length > 0) {
      setSelectedClassRaw(assignedClasses[0].name);
    } else {
      setSelectedClassRaw('');
    }
  }, [assignedClasses]);

  // Session details
  const [selectedSlotId, setSelectedSlotId] = useState<string>('h1');
  const [subjectTitle, setSubjectTitle] = useState<string>('');
  const [courseTopic, setCourseTopic] = useState<string>('');
  const [notifyParents, setNotifyParents] = useState<boolean>(true);
  const [certifyVisa, setCertifyVisa] = useState<boolean>(true);

  // Sync subject title with teacher's department or timetable schedule
  useEffect(() => {
    if (currentTeacher) {
      const timetableMatch = currentTeacher.timetableSchedule?.find((slot) => {
        return (
          normalizeClassName(slot.className) ===
          normalizeClassName(selectedClassRaw)
        );
      });
      if (timetableMatch) {
        setSubjectTitle(timetableMatch.subjectTitle);
      } else {
        setSubjectTitle(currentTeacher.departmentLabel);
      }
    }
  }, [currentTeacher, selectedClassRaw]);

  // Roll call attendance states per student: 'present' | 'absent' | 'retard' | 'infirmerie'
  const [attendanceMap, setAttendanceMap] = useState<
    Record<
      string,
      {
        status: 'present' | 'absent' | 'retard' | 'infirmerie';
        motif: string;
        lateMinutes: number;
      }
    >
  >({});

  // Filter students for the selected class (loose matching to support Tle C vs Terminale C)
  const studentsInClass = useMemo(() => {
    if (!selectedClassRaw) return [];
    const targetNorm = normalizeClassName(selectedClassRaw);
    return students.filter((s) => {
      const sNorm = normalizeClassName(s.className);
      return sNorm === targetNorm || s.className.toLowerCase() === selectedClassRaw.toLowerCase();
    });
  }, [students, selectedClassRaw]);

  // Reset or initialize attendance when studentsInClass changes
  useEffect(() => {
    const initMap: Record<
      string,
      {
        status: 'present' | 'absent' | 'retard' | 'infirmerie';
        motif: string;
        lateMinutes: number;
      }
    > = {};

    studentsInClass.forEach((st) => {
      initMap[st.id] = {
        status: 'present',
        motif: '',
        lateMinutes: 10,
      };
    });

    setAttendanceMap(initMap);
  }, [studentsInClass]);

  // Toggle status for a student
  const handleSetStatus = (
    studentId: string,
    status: 'present' | 'absent' | 'retard' | 'infirmerie'
  ) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        motif:
          status === 'absent'
            ? prev[studentId]?.motif || 'Absence non justifiée constatée à l’appel en classe'
            : status === 'infirmerie'
            ? 'Évacué vers l’infirmerie scolaire'
            : prev[studentId]?.motif || '',
      },
    }));
  };

  // Change motif for a student
  const handleSetMotif = (studentId: string, motif: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        motif,
      },
    }));
  };

  // Change late minutes
  const handleSetLateMinutes = (studentId: string, minutes: number) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        lateMinutes: minutes,
      },
    }));
  };

  // Quick action: all present
  const handleMarkAllPresent = () => {
    const nextMap: typeof attendanceMap = {};
    studentsInClass.forEach((st) => {
      nextMap[st.id] = {
        status: 'present',
        motif: '',
        lateMinutes: 10,
      };
    });
    setAttendanceMap(nextMap);
  };

  // Metrics
  const totalCount = studentsInClass.length;
  const presentCount = Object.values(attendanceMap).filter((v) => v.status === 'present').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v.status === 'absent').length;
  const retardCount = Object.values(attendanceMap).filter((v) => v.status === 'retard').length;
  const infirmerieCount = Object.values(attendanceMap).filter((v) => v.status === 'infirmerie').length;

  const currentSlot = TIME_SLOTS.find((s) => s.id === selectedSlotId) || TIME_SLOTS[0];

  // Validation submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeacher || !selectedClassRaw) return;

    const records = studentsInClass.map((st) => {
      const att = attendanceMap[st.id] || {
        status: 'present',
        motif: '',
        lateMinutes: 10,
      };
      return {
        student: st,
        status: att.status,
        motif: att.motif,
        lateMinutes: att.status === 'retard' ? att.lateMinutes : undefined,
      };
    });

    onValidateAppel({
      teacher: currentTeacher,
      className: selectedClassRaw,
      subject: subjectTitle || currentTeacher.departmentLabel,
      date: new Date().toLocaleDateString('fr-FR'),
      timeSlot: currentSlot.label,
      durationHours: currentSlot.hours,
      courseTopic: courseTopic || 'Séance pédagogique réglementaire',
      notifyParents,
      records,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#f0eded] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#011848] via-[#0b2866] to-[#1c3f8f] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#ff6b35] border border-white/15">
              <span className="material-symbols-outlined text-[24px]">checklist_rtl</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#96f5ca]">
                  Appel en Classe Numérique
                </span>
                <span className="text-white/40">•</span>
                <span className="text-[11px] text-white/80 font-mono">
                  {new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <h2 className="text-[19px] sm:text-[21px] font-black tracking-tight leading-snug">
                Feuille d'Appel Pédagogique du Cours
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Fermer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          {/* STEP 1 & 2 BANNER: TEACHER SELECTION & STRICT RESTRICTION OF CLASSES */}
          <div className="p-4 sm:p-5 bg-[#f6f3f2] border-b border-[#f0eded] flex flex-col gap-4">
            {/* Teacher selector and notice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Teacher selector */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#594139] mb-1">
                  Enseignant Titulaire du Cours :
                </label>
                <div className="relative">
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full h-11 px-3 pl-10 pr-8 rounded-xl bg-white text-[#1b1c1c] text-[13px] font-bold border border-[#f0eded] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {t.departmentLabel} ({t.grade})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5d8f] text-[20px]">
                    person
                  </span>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8d7168] pointer-events-none text-[18px]">
                    arrow_drop_down
                  </span>
                </div>
              </div>

              {/* Class selection: STRICTLY RESTRICTED TO THIS TEACHER'S ASSIGNED CLASSES */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-extrabold uppercase text-[#594139]">
                    Classe de l'Heure (Vos Affectations Exclusives) :
                  </label>
                  <span className="text-[10.5px] font-bold text-[#006c4c] bg-[#96f5ca]/60 px-2 py-0.2 rounded-full">
                    {assignedClasses.length} classe(s) affectée(s)
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={selectedClassRaw}
                    onChange={(e) => setSelectedClassRaw(e.target.value)}
                    className="w-full h-11 px-3 pl-10 pr-8 rounded-xl bg-white text-[#1b1c1c] text-[13px] font-bold border border-[#f0eded] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  >
                    {assignedClasses.map((cls, idx) => (
                      <option key={idx} value={cls.name}>
                        {cls.name} {cls.isPP ? '★ Professeur Principal' : ''} {cls.note || ''}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#ff6b35] text-[20px]">
                    class
                  </span>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8d7168] pointer-events-none text-[18px]">
                    arrow_drop_down
                  </span>
                </div>
              </div>
            </div>

            {/* Informational reassurance banner: explains why only assigned classes are shown */}
            <div className="p-3 rounded-xl bg-[#dae1ff]/40 border border-[#dae1ff] flex items-start gap-2.5 text-[12px] text-[#011848]">
              <span className="material-symbols-outlined text-[#011848] text-[18px] shrink-0 mt-0.5">
                verified_user
              </span>
              <div className="flex-1">
                <span className="font-bold">Filtre d'affectation strict actif : </span>
                <span>
                  L'enseignant <strong className="underline">{currentTeacher?.name}</strong> ne
                  voit ici que <strong>la liste de ses propres classes attribuées</strong> (
                  {assignedClasses.map((c) => c.name).join(', ')}). Les autres classes de
                  l'établissement sont masquées pour garantir que l'appel ne soit fait que par le
                  professeur habilité.
                </span>
              </div>
            </div>

            {/* Course period, subject, and topic */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                  Créneau Horaire :
                </label>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#f0eded] text-[12px] font-semibold text-[#1b1c1c] focus:outline-none"
                >
                  {TIME_SLOTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                  Matière Enseignée :
                </label>
                <input
                  type="text"
                  value={subjectTitle}
                  onChange={(e) => setSubjectTitle(e.target.value)}
                  placeholder="Matière..."
                  className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#f0eded] text-[12px] font-semibold text-[#1b1c1c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                  Thème / Chapitre du jour :
                </label>
                <input
                  type="text"
                  value={courseTopic}
                  onChange={(e) => setCourseTopic(e.target.value)}
                  placeholder="ex: Chapitre 4 : Intégrales et Aires"
                  className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#f0eded] text-[12px] font-semibold text-[#1b1c1c] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ATTENDANCE SHEET SECTION */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col gap-3">
            {/* Quick summary & actions bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f0eded]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-extrabold text-[#1b1c1c]">
                  Classe : <span className="text-[#ff6b35]">{selectedClassRaw}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#eae7e7] text-[11px] font-bold text-[#594139]">
                  Effectif inscrit : {totalCount} élève(s)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#96f5ca] text-[11px] font-bold text-[#002115]">
                  {presentCount} Présent(s)
                </span>
                {absentCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[11px] font-bold text-[#ba1a1a]">
                    {absentCount} Absent(s)
                  </span>
                )}
                {retardCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#ffdbd0] text-[11px] font-bold text-[#ab3500]">
                    {retardCount} Retard(s)
                  </span>
                )}
                {infirmerieCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#dae1ff] text-[11px] font-bold text-[#011848]">
                    {infirmerieCount} Infirmerie
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="px-3 py-1.5 rounded-lg bg-[#96f5ca]/60 text-[#002115] hover:bg-[#96f5ca] text-[12px] font-bold flex items-center gap-1 transition-colors border border-[#006c4c]/20"
                >
                  <span className="material-symbols-outlined text-[16px]">done_all</span>
                  <span>Tout marquer Présent</span>
                </button>
              </div>
            </div>

            {/* Students list */}
            {studentsInClass.length === 0 ? (
              <div className="p-8 text-center bg-[#f6f3f2] rounded-xl flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[36px] text-[#8d7168]">
                  person_search
                </span>
                <span className="font-bold text-[14px] text-[#1b1c1c]">
                  Aucun élève actuellement synchronisé pour {selectedClassRaw}
                </span>
                <p className="text-[12px] text-[#594139] max-w-sm">
                  Les listes d'inscriptions pour cette classe sont en cours de consolidation par le
                  bureau des inscriptions.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#f0eded] border border-[#f0eded] rounded-xl overflow-hidden bg-white shadow-sm">
                {studentsInClass.map((st, index) => {
                  const state = attendanceMap[st.id] || {
                    status: 'present',
                    motif: '',
                    lateMinutes: 10,
                  };

                  return (
                    <div
                      key={st.id}
                      className={`p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        state.status === 'absent'
                          ? 'bg-[#ffdad6]/25'
                          : state.status === 'retard'
                          ? 'bg-[#ffdbd0]/20'
                          : state.status === 'infirmerie'
                          ? 'bg-[#dae1ff]/20'
                          : 'hover:bg-[#f6f3f2]/60'
                      }`}
                    >
                      {/* Left: Student Identity */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-6 text-center text-[11px] font-mono font-bold text-[#8d7168]">
                          {index + 1}
                        </span>

                        <div className="w-9 h-9 rounded-full bg-[#dae1ff] text-[#011848] font-bold text-[12px] flex items-center justify-center shrink-0">
                          {st.name
                            .split(' ')
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join('')}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[13.5px] text-[#1b1c1c] leading-tight truncate">
                              {st.name}
                            </span>
                            <span className="text-[10.5px] font-mono text-[#8d7168] bg-[#eae7e7] px-1.5 py-0.2 rounded">
                              {st.matricule}
                            </span>
                            {st.bloodGroup && (
                              <span className="text-[10px] font-bold text-[#ba1a1a] bg-[#ffdad6]/60 px-1.5 py-0.2 rounded">
                                {st.bloodGroup}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-[#594139] mt-0.5">
                            <span>Conduite : {st.conductScore}/20</span>
                            <span>•</span>
                            <span>Parent : {st.parentPhone}</span>
                            {st.unjustifiedAbsencesHours > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-[#ba1a1a] font-bold">
                                  {st.unjustifiedAbsencesHours}h cumulées
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Roll call action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleSetStatus(st.id, 'present')}
                          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all ${
                            state.status === 'present'
                              ? 'bg-[#006c4c] text-white shadow-sm ring-2 ring-[#96f5ca]'
                              : 'bg-[#f6f3f2] text-[#594139] hover:bg-[#eae7e7]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          <span>Présent</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetStatus(st.id, 'absent')}
                          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all ${
                            state.status === 'absent'
                              ? 'bg-[#ba1a1a] text-white shadow-sm ring-2 ring-[#ffdad6]'
                              : 'bg-[#f6f3f2] text-[#594139] hover:bg-[#eae7e7]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          <span>Absent</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetStatus(st.id, 'retard')}
                          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all ${
                            state.status === 'retard'
                              ? 'bg-[#ab3500] text-white shadow-sm ring-2 ring-[#ffdbd0]'
                              : 'bg-[#f6f3f2] text-[#594139] hover:bg-[#eae7e7]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          <span>Retard</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetStatus(st.id, 'infirmerie')}
                          title="Passé à l'infirmerie"
                          className={`px-2.5 py-1.5 rounded-lg text-[12px] font-bold flex items-center gap-1 transition-all ${
                            state.status === 'infirmerie'
                              ? 'bg-[#011848] text-white shadow-sm ring-2 ring-[#dae1ff]'
                              : 'bg-[#f6f3f2] text-[#594139] hover:bg-[#eae7e7]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">medical_services</span>
                          <span className="hidden sm:inline">Infirmerie</span>
                        </button>
                      </div>

                      {/* Extra details when marked Absent or Late */}
                      {(state.status === 'absent' || state.status === 'retard') && (
                        <div className="w-full sm:w-auto mt-2 sm:mt-0 sm:basis-full flex items-center gap-2 pl-9">
                          {state.status === 'retard' && (
                            <div className="flex items-center gap-1">
                              <span className="text-[11px] font-bold text-[#ab3500]">Retard :</span>
                              <select
                                value={state.lateMinutes}
                                onChange={(e) =>
                                  handleSetLateMinutes(st.id, Number(e.target.value))
                                }
                                className="h-7 px-2 rounded bg-white border border-[#f0eded] text-[11px] font-bold text-[#ab3500]"
                              >
                                <option value={5}>5 min</option>
                                <option value={10}>10 min</option>
                                <option value={15}>15 min</option>
                                <option value={20}>20 min</option>
                                <option value={30}>30 min</option>
                                <option value={45}>45 min</option>
                              </select>
                            </div>
                          )}

                          <input
                            type="text"
                            value={state.motif}
                            onChange={(e) => handleSetMotif(st.id, e.target.value)}
                            placeholder={
                              state.status === 'absent'
                                ? 'Motif de l’absence constaté...'
                                : 'Motif du retard...'
                            }
                            className="flex-1 h-7 px-2.5 rounded bg-white border border-[#f0eded] text-[11.5px] text-[#1b1c1c] focus:outline-none focus:ring-1 focus:ring-[#ff6b35]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FOOTER & SUBMISSION OPTIONS */}
          <div className="p-4 sm:p-5 bg-[#f6f3f2] border-t border-[#f0eded] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            {/* Checkbox options */}
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
              <label className="flex items-center gap-2 cursor-pointer text-[12px] font-semibold text-[#1b1c1c]">
                <input
                  type="checkbox"
                  checked={notifyParents}
                  onChange={(e) => setNotifyParents(e.target.checked)}
                  className="rounded text-[#ff6b35] focus:ring-[#ff6b35] h-4 w-4"
                />
                <span>Notifier immédiatement les parents des absents par SMS / Mobile</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[12px] font-semibold text-[#1b1c1c]">
                <input
                  type="checkbox"
                  checked={certifyVisa}
                  onChange={(e) => setCertifyVisa(e.target.checked)}
                  className="rounded text-[#ff6b35] focus:ring-[#ff6b35] h-4 w-4"
                />
                <span>
                  Émarger automatiquement la séance pour le compte de{' '}
                  <strong>{currentTeacher?.name}</strong> ({currentSlot.hours}h)
                </span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#f0eded] text-[#594139] hover:bg-[#eae7e7] text-[13px] font-bold transition-all"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={studentsInClass.length === 0}
                className="px-6 py-2.5 rounded-xl bg-[#ff6b35] text-white hover:brightness-105 active:scale-95 text-[13px] font-extrabold flex items-center gap-2 shadow-lg shadow-[#ff6b35]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[19px]">send</span>
                <span>Valider l'Appel ({absentCount} absent(s))</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
