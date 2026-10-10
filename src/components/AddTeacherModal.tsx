import React, { useState } from 'react';
import { Teacher, TeacherStatus } from '../types';
import { DEPARTMENTS } from '../data/mockData';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeacher: (teacher: Teacher) => void;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isOpen,
  onClose,
  onAddTeacher,
}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'M.' | 'Mme' | 'Dr.'>('M.');
  const [matricule, setMatricule] = useState(`EN-2024-${Math.floor(1000 + Math.random() * 9000)}`);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('69');
  const [departmentId, setDepartmentId] = useState<any>('info');
  const [grade, setGrade] = useState('PLEG Titulaire (Échelon 1)');
  const [status, setStatus] = useState<TeacherStatus>('pleg');
  const [assignedHours, setAssignedHours] = useState(18);
  const [quotaHours, setQuotaHours] = useState(18);
  const [classesInput, setClassesInput] = useState('Tle C, 1ère C');
  const [isPP, setIsPP] = useState(false);
  const [seniorityYears, setSeniorityYears] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const classItems = classesInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
      .map((cls, idx) => ({
        name: cls,
        isPP: idx === 0 && isPP,
      }));

    const initials = name
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const selectedDept = DEPARTMENTS.find((d) => d.id === departmentId);
    const departmentLabel = selectedDept && selectedDept.id !== 'all' ? selectedDept.label : 'Informatique & TIC';

    const newTeacher: Teacher = {
      id: `t-${Date.now()}`,
      name: `${gender} ${name.trim()}`,
      gender,
      matricule,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@soma-edu.cm`,
      phone,
      initials,
      departmentId,
      departmentLabel,
      grade,
      status,
      classes: classItems.length > 0 ? classItems : [{ name: 'Tle C' }],
      assignedHours: Number(assignedHours),
      quotaHours: Number(quotaHours),
      quotaStatus:
        Number(assignedHours) > Number(quotaHours)
          ? 'overtime'
          : Number(assignedHours) < Number(quotaHours)
          ? 'under'
          : 'normal',
      quotaNote:
        Number(assignedHours) > Number(quotaHours)
          ? `+${Number(assignedHours) - Number(quotaHours)}h Sup`
          : 'Quota normal',
      pedagogicalFollowUp: {
        notesT1Status: 'valid',
        notesT1Label: 'Notes T1 validées',
        textbookStatus: 'Cahier de texte à jour',
      },
      timetableSchedule: classItems.map((c, i) => ({
        className: c.name,
        role: c.isPP ? 'Professeur Principal' : undefined,
        subjectTitle: `${departmentLabel} - Cours magistral & TP`,
        hoursPerWeek: Math.floor(assignedHours / (classItems.length || 1)),
      })),
      evaluationJournal: [
        { title: 'Évaluation Continue N°1', status: 'validated', date: 'Octobre 2024' },
      ],
      seniorityYears: Number(seniorityYears),
    };

    onAddTeacher(newTeacher);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#f0eded] bg-[#fcf9f8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff6b35] text-[22px]">
              person_add
            </span>
            <h2 className="text-[17px] font-bold text-[#1b1c1c]">
              Ajouter un Enseignant au Corps Pédagogique
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8d7168] hover:text-[#1b1c1c] rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4 text-[13px]">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
                Civilité
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] font-semibold focus:outline-none"
              >
                <option value="M.">M.</option>
                <option value="Mme">Mme</option>
                <option value="Dr.">Dr.</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
                Nom complet
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: TCHOKOMENI Roger"
                className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] placeholder:text-[#8d7168] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff6b35]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
                Matricule MINESEC
              </label>
              <input
                type="text"
                required
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
                Téléphone (SMS)
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="69X XX XX XX"
                className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
              Email Professionnel
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="r.tchokomeni@soma-edu.cm"
              className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
                Département
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value as any)}
                className="w-full h-10 px-2 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] font-semibold focus:outline-none"
              >
                {DEPARTMENTS.filter((d) => d.id !== 'all').map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
                Statut Statutaire
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 px-2 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] font-semibold focus:outline-none"
              >
                <option value="pleg">PLEG Titulaire</option>
                <option value="plep">PLETP Titulaire Technique</option>
                <option value="vac">Vacataire 2nd Cycle</option>
                <option value="chef">Chef de Département</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
              Grade & Échelon
            </label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Ex: PLEG Titulaire (Échelon 5)"
              className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
                Volume Alloué (h/sem)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={assignedHours}
                onChange={(e) => setAssignedHours(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
                Quota Statutaire (h)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={quotaHours}
                onChange={(e) => setQuotaHours(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
              Classes affectées (séparées par des virgules)
            </label>
            <input
              type="text"
              value={classesInput}
              onChange={(e) => setClassesInput(e.target.value)}
              placeholder="Tle C, 1ère C, 2nde C1"
              className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPP"
              checked={isPP}
              onChange={(e) => setIsPP(e.target.checked)}
              className="w-4 h-4 rounded text-[#ff6b35] focus:ring-0 cursor-pointer"
            />
            <label htmlFor="isPP" className="text-[12.5px] font-semibold text-[#1b1c1c] cursor-pointer">
              Désigner comme Professeur Principal (PP) sur la 1ère classe
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0eded]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold hover:bg-[#e5e2e1] transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#ff6b35] text-white font-bold hover:brightness-105 transition-all flex items-center gap-1.5 shadow"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>Enregistrer l'Enseignant</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
