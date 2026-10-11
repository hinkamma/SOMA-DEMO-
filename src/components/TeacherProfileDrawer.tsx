import React from 'react';
import { Teacher } from '../types';

interface TeacherProfileDrawerProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (teacher: Teacher) => void;
  onSendSms: (teacher: Teacher) => void;
  onOpenAppel?: (teacher: Teacher) => void;
}

export const TeacherProfileDrawer: React.FC<TeacherProfileDrawerProps> = ({
  teacher,
  isOpen,
  onClose,
  onEdit,
  onSendSms,
  onOpenAppel,
}) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform p-6 sm:p-8 animate-in slide-in-from-right duration-200">
        <div className="flex flex-col gap-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#f0eded]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4b5d8f] text-[24px]">
                badge
              </span>
              <span className="text-[18px] font-bold text-[#1b1c1c]">
                Fiche Enseignant & Attributions
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#8d7168] hover:text-[#1b1c1c] hover:bg-[#f0eded] transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>

          {/* Profile Head */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f6f3f2]">
            {teacher.avatarUrl ? (
              <img
                src={teacher.avatarUrl}
                alt={teacher.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('drawer-avatar-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }}
                className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-white shrink-0"
              />
            ) : null}
            <div
              id="drawer-avatar-fallback"
              className={`w-16 h-16 rounded-full bg-[#dae1ff] text-[#011848] text-[22px] flex items-center justify-center font-extrabold shrink-0 ${
                teacher.avatarUrl ? 'hidden' : ''
              }`}
            >
              {teacher.initials}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[20px] font-extrabold text-[#1b1c1c] truncate">
                  {teacher.name}
                </h3>
                {teacher.isChefDept && (
                  <span className="px-1.5 py-0.5 rounded bg-[#96f5ca] text-[#002115] text-[10px] font-bold">
                    Chef Dpt
                  </span>
                )}
              </div>
              <span className="text-[12.5px] text-[#4b5d8f] font-bold">
                {teacher.grade}
              </span>
              <span className="text-[11.5px] text-[#8d7168] mt-0.5">
                Matricule : {teacher.matricule} • Ancienneté : {teacher.seniorityYears} ans
              </span>
              <div className="flex items-center gap-3 mt-1.5 text-[11.5px] text-[#594139]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">mail</span>
                  {teacher.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  {teacher.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics inside Drawer */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-[#f6f3f2]">
              <span className="text-[11px] text-[#8d7168] uppercase font-bold tracking-wider">
                Classes
              </span>
              <p className="text-[18px] font-bold text-[#1b1c1c] mt-0.5">
                {teacher.classes.length} Groupes
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#f6f3f2]">
              <span className="text-[11px] text-[#8d7168] uppercase font-bold tracking-wider">
                Volume / Sem
              </span>
              <p className="text-[18px] font-bold text-[#006c4c] mt-0.5">
                {teacher.assignedHours} Heures
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[#f6f3f2]">
              <span className="text-[11px] text-[#8d7168] uppercase font-bold tracking-wider">
                Saisie Notes
              </span>
              <p
                className={`text-[18px] font-bold mt-0.5 ${
                  teacher.pedagogicalFollowUp.notesT1Status === 'valid'
                    ? 'text-[#006c4c]'
                    : teacher.pedagogicalFollowUp.notesT1Status === 'pending'
                    ? 'text-[#4b5d8f]'
                    : 'text-[#ba1a1a]'
                }`}
              >
                {teacher.pedagogicalFollowUp.notesT1Status === 'valid'
                  ? '100%'
                  : teacher.pedagogicalFollowUp.notesT1Status === 'pending'
                  ? 'Attente Visa'
                  : 'En Retard'}
              </p>
            </div>
          </div>

          {/* Timetable distribution preview */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] uppercase font-bold text-[#1b1c1c] tracking-wider">
              Répartition Horaire Détaillée (APC)
            </span>
            <div className="flex flex-col gap-2">
              {teacher.timetableSchedule.length > 0 ? (
                teacher.timetableSchedule.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#f6f3f2]"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13.5px] font-bold text-[#1b1c1c]">
                          {slot.className}
                        </span>
                        {slot.role && (
                          <span className="px-1.5 py-0.2 rounded bg-[#ffdbd0] text-[#832600] text-[9.5px] font-bold">
                            {slot.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[11.5px] text-[#8d7168]">
                        {slot.subjectTitle}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#dae1ff] text-[#011848] font-bold text-[11.5px]">
                      {slot.hoursPerWeek}h / sem
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg bg-[#f6f3f2] text-center text-[12px] text-[#8d7168]">
                  Aucun créneau horaire spécifique renseigné.
                </div>
              )}
            </div>
          </div>

          {/* Historical Notes Validation Status */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] uppercase font-bold text-[#1b1c1c] tracking-wider">
              Journal des Évaluations (Trimestre 1)
            </span>
            <div className="p-3 rounded-lg bg-[#f6f3f2] flex flex-col gap-2.5">
              {teacher.evaluationJournal.length > 0 ? (
                teacher.evaluationJournal.map((journal, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#1b1c1c]">
                        {journal.title}
                      </span>
                      {journal.date && (
                        <span className="text-[10.5px] text-[#8d7168]">{journal.date}</span>
                      )}
                    </div>
                    <span
                      className={`text-[11.5px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-full ${
                        journal.status === 'validated'
                          ? 'bg-[#96f5ca] text-[#002115]'
                          : journal.status === 'pending'
                          ? 'bg-[#dae1ff] text-[#011848]'
                          : 'bg-[#ffdad6] text-[#93000a]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {journal.status === 'validated'
                          ? 'check_circle'
                          : journal.status === 'pending'
                          ? 'pending_actions'
                          : 'warning'}
                      </span>
                      <span>
                        {journal.status === 'validated'
                          ? 'Validée'
                          : journal.status === 'pending'
                          ? 'En attente'
                          : 'En retard'}
                      </span>
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-[12px] text-[#8d7168]">
                  Aucune évaluation enregistrée pour ce trimestre.
                </span>
              )}
            </div>
          </div>

          {/* Pedagogical notes tracking detail */}
          <div className="p-3.5 rounded-xl border border-[#f0eded] bg-white flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-[#8d7168] uppercase tracking-wider">
              Suivi Pédagogique Actuel
            </span>
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-[#1b1c1c]">
                {teacher.pedagogicalFollowUp.textbookStatus}
              </span>
              <button
                onClick={() => onSendSms(teacher)}
                className="px-2.5 py-1 rounded-md bg-[#ff6b35] text-white text-[11px] font-bold hover:brightness-105 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">sms</span>
                <span>Relancer par SMS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-4 border-t border-[#f0eded] flex items-center justify-between gap-2.5 mt-6 flex-wrap">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-[#eae7e7] text-[#1b1c1c] text-[13px] font-bold hover:bg-[#e5e2e1] transition-all"
          >
            Fermer
          </button>

          <div className="flex items-center gap-2">
            {onOpenAppel && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAppel(teacher);
                }}
                className="px-4 py-2.5 rounded-lg bg-[#006c4c] text-white text-[13px] font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">checklist_rtl</span>
                <span>Faire l'Appel ({teacher.classes.length} classes)</span>
              </button>
            )}
            <button
              onClick={() => onEdit(teacher)}
              className="px-4 py-2.5 rounded-lg bg-[#4b5d8f] text-white text-[13px] font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
              <span>Modifier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
