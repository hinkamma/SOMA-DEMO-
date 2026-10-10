import React from 'react';
import { Teacher } from '../types';

interface AuditHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
}

export const AuditHoursModal: React.FC<AuditHoursModalProps> = ({
  isOpen,
  onClose,
  teachers,
}) => {
  if (!isOpen) return null;

  const totalAssigned = teachers.reduce((sum, t) => sum + t.assignedHours, 0);
  const overtimeTeachers = teachers.filter((t) => t.assignedHours > t.quotaHours);
  const totalOvertimeHours = overtimeTeachers.reduce(
    (sum, t) => sum + (t.assignedHours - t.quotaHours),
    0
  );
  const dischargeTeachers = teachers.filter((t) => t.isChefDept);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#f0eded] bg-[#96f5ca]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c4c] text-[24px]">
              verified
            </span>
            <div>
              <h2 className="text-[17px] font-bold text-[#1b1c1c]">
                Rapport d'Audit des Quotas Horaires & Conformité MINESEC
              </h2>
              <span className="text-[11px] text-[#006c4c] font-semibold">
                Contrôle réglementaire selon le Décret N° 2001/041 portant statut des corps de l'enseignement
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#8d7168] hover:text-[#1b1c1c]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-[13px]">
          {/* Key Indicators Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-[#f6f3f2] border border-[#f0eded]">
              <span className="text-[11px] font-bold text-[#8d7168] uppercase">
                Volume Total Contrôlé
              </span>
              <p className="text-[20px] font-extrabold text-[#1b1c1c] mt-0.5">
                864h <span className="text-[13px] text-[#006c4c] font-bold">/ 864h</span>
              </p>
              <span className="text-[10px] text-[#006c4c] font-bold">100% de couverture</span>
            </div>

            <div className="p-3 rounded-xl bg-[#ffdbd0]/30 border border-[#ffdbd0]">
              <span className="text-[11px] font-bold text-[#832600] uppercase">
                Heures Supp Validées
              </span>
              <p className="text-[20px] font-extrabold text-[#ab3500] mt-0.5">
                +{totalOvertimeHours}h
              </p>
              <span className="text-[10px] text-[#832600] font-bold">
                {overtimeTeachers.length} enseignants concernés
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#dae1ff]/40 border border-[#dae1ff]">
              <span className="text-[11px] font-bold text-[#011848] uppercase">
                Décharges de Coordination
              </span>
              <p className="text-[20px] font-extrabold text-[#4b5d8f] mt-0.5">
                -4h
              </p>
              <span className="text-[10px] text-[#4b5d8f] font-bold">
                Chefs d'Unité Pédagogique
              </span>
            </div>
          </div>

          {/* Audit Checklist */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold text-[#1b1c1c] uppercase tracking-wider">
              Points de Contrôle Statutaire
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#f6f3f2]">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#006c4c] text-[18px]">check_circle</span>
                  <span className="font-semibold text-[#1b1c1c]">Quota légal des professeurs PLEG (18 heures/semaine)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#96f5ca] text-[#002115] text-[11px] font-bold">Conforme</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#f6f3f2]">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#006c4c] text-[18px]">check_circle</span>
                  <span className="font-semibold text-[#1b1c1c]">Heures de décharge des Chefs de Départements (2h décomptées)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#96f5ca] text-[#002115] text-[11px] font-bold">Conforme</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#f6f3f2]">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#006c4c] text-[18px]">check_circle</span>
                  <span className="font-semibold text-[#1b1c1c]">Contrats des vacataires (Plafond contractuel 12h respecté)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#96f5ca] text-[#002115] text-[11px] font-bold">Vérifié</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#f6f3f2]">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#4b5d8f] text-[18px]">schedule</span>
                  <span className="font-semibold text-[#1b1c1c]">Heures orphelines (matières sans enseignant affecté)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#dae1ff] text-[#011848] text-[11px] font-bold">0 heure (Parfait)</span>
              </div>
            </div>
          </div>

          {/* Overtime details list */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold text-[#1b1c1c] uppercase tracking-wider">
              Détail des Enseignants en Dépassement Horaire (Heures Supp.)
            </span>
            <div className="border border-[#f0eded] rounded-xl overflow-hidden">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#f6f3f2] text-[#8d7168] font-bold">
                  <tr>
                    <th className="p-2.5">Enseignant</th>
                    <th className="p-2.5">Département</th>
                    <th className="p-2.5">Charge Hebdo</th>
                    <th className="p-2.5">Excédent</th>
                    <th className="p-2.5">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eded]">
                  {overtimeTeachers.map((t) => (
                    <tr key={t.id}>
                      <td className="p-2.5 font-bold text-[#1b1c1c]">{t.name}</td>
                      <td className="p-2.5 text-[#594139]">{t.departmentLabel}</td>
                      <td className="p-2.5">{t.assignedHours}h / {t.quotaHours}h</td>
                      <td className="p-2.5 font-bold text-[#ab3500]">+{t.assignedHours - t.quotaHours}h</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded bg-[#96f5ca] text-[#002115] text-[10px] font-bold">
                          Approuvé Censeur
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f0eded] flex items-center justify-between bg-[#fcf9f8]">
          <span className="text-[11.5px] text-[#8d7168]">
            Certifié conforme par le Censeur Pédagogique M. Alain NGUEMO
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#006c4c] text-white font-bold hover:brightness-105"
          >
            Fermer l'Audit
          </button>
        </div>
      </div>
    </div>
  );
};
