import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';

interface AdjustAssignmentModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Teacher) => void;
}

export const AdjustAssignmentModal: React.FC<AdjustAssignmentModalProps> = ({
  teacher,
  isOpen,
  onClose,
  onSave,
}) => {
  const [assignedHours, setAssignedHours] = useState(18);
  const [quotaHours, setQuotaHours] = useState(18);
  const [classesString, setClassesString] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    if (teacher) {
      setAssignedHours(teacher.assignedHours);
      setQuotaHours(teacher.quotaHours);
      setClassesString(teacher.classes.map((c) => c.name + (c.isPP ? ' (PP)' : '')).join(', '));
      setGrade(teacher.grade);
    }
  }, [teacher]);

  if (!isOpen || !teacher) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedClasses = classesString
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const isPP = item.includes('(PP)');
        const name = item.replace('(PP)', '').trim();
        return { name, isPP };
      });

    const isOvertime = assignedHours > quotaHours;
    const isUnder = assignedHours < quotaHours;

    const updated: Teacher = {
      ...teacher,
      grade,
      assignedHours: Number(assignedHours),
      quotaHours: Number(quotaHours),
      classes: parsedClasses.length > 0 ? parsedClasses : teacher.classes,
      quotaStatus: isOvertime ? 'overtime' : isUnder ? 'under' : 'normal',
      quotaNote: isOvertime
        ? `+${assignedHours - quotaHours}h Sup`
        : isUnder
        ? `-${quotaHours - assignedHours}h`
        : 'Quota normal',
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-[#f0eded] bg-[#fcf9f8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4b5d8f] text-[22px]">
              edit_calendar
            </span>
            <h2 className="text-[16px] font-bold text-[#1b1c1c]">
              Ajuster Affectations & Charges
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#8d7168] hover:text-[#1b1c1c]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4 text-[13px]">
          <div className="p-3 rounded-lg bg-[#f6f3f2] flex items-center justify-between">
            <span className="font-bold text-[#1b1c1c]">{teacher.name}</span>
            <span className="text-[11.5px] text-[#4b5d8f] font-semibold">{teacher.departmentLabel}</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
              Grade & Échelon
            </label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
                Volume Hebdo (h)
              </label>
              <input
                type="number"
                min="0"
                max="35"
                value={assignedHours}
                onChange={(e) => setAssignedHours(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
                Quota Statutaire (h)
              </label>
              <input
                type="number"
                min="0"
                max="35"
                value={quotaHours}
                onChange={(e) => setQuotaHours(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#8d7168] uppercase tracking-wider mb-1">
              Classes affectées (Ajoutez (PP) pour prof principal)
            </label>
            <input
              type="text"
              value={classesString}
              onChange={(e) => setClassesString(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
            />
            <span className="text-[10.5px] text-[#8d7168] mt-1 block">
              Exemple : Tle TI (PP), Tle F4, 1ère TI
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[#dae1ff]/40 text-[#011848] text-[11.5px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>
              La modification sera répercutée sur le bordereau officiel MINESEC et l'état des heures complémentaires.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0eded]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold hover:bg-[#e5e2e1]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#4b5d8f] text-white font-bold hover:brightness-110 shadow"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
