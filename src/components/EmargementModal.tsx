import React, { useState } from 'react';
import { Teacher } from '../types';

interface EmargementModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
}

export const EmargementModal: React.FC<EmargementModalProps> = ({
  isOpen,
  onClose,
  teachers,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('Novembre 2024');
  const [selectedCycle, setSelectedCycle] = useState('Secondaire & Technique (2nd Cycle)');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#f0eded] bg-[#fcf9f8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4b5d8f] text-[22px]">
              receipt_long
            </span>
            <div>
              <h2 className="text-[17px] font-bold text-[#1b1c1c]">
                Cahiers d'Appels & Fiches d'Émargement Mensuelles
              </h2>
              <span className="text-[11px] text-[#8d7168]">
                Registre officiel de présence pour le visa de la Censure et l'Intendance
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#8d7168] hover:text-[#1b1c1c]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4 text-[13px]">
          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                Mois d'émargement
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] text-[12.5px]"
              >
                <option value="Octobre 2024">Octobre 2024</option>
                <option value="Novembre 2024">Novembre 2024 (En cours)</option>
                <option value="Décembre 2024">Décembre 2024</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                Cycle & Section
              </label>
              <select
                value={selectedCycle}
                onChange={(e) => setSelectedCycle(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] text-[12.5px]"
              >
                <option value="Secondaire & Technique (2nd Cycle)">
                  Secondaire & Technique (2nd Cycle)
                </option>
                <option value="Classes Terminales uniquement">Classes Terminales uniquement</option>
              </select>
            </div>
          </div>

          {/* Printable Sheet Preview */}
          <div className="p-5 rounded-xl border border-[#f0eded] bg-white flex flex-col gap-4 shadow-sm print:border-none print:shadow-none">
            {/* Sheet Title */}
            <div className="text-center flex flex-col gap-0.5 border-b pb-3 border-[#f0eded]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#4b5d8f]">
                RÉPUBLIQUE DU CAMEROUN • MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES
              </span>
              <h3 className="text-[16px] font-black text-[#1b1c1c]">
                FICHE RÉCAPITULATIVE D'ÉMARGEMENT DU CORPS ENSEIGNANT
              </h3>
              <span className="text-[12px] text-[#594139] font-medium">
                Période : {selectedMonth} • 2nd Cycle Enseignement Général & Technique
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11.5px] border-collapse border border-[#f0eded]">
                <thead className="bg-[#f6f3f2] text-[#1b1c1c] font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2 border border-[#f0eded]">N°</th>
                    <th className="p-2 border border-[#f0eded]">Enseignant</th>
                    <th className="p-2 border border-[#f0eded]">Discipline</th>
                    <th className="p-2 border border-[#f0eded]">Classes</th>
                    <th className="p-2 border border-[#f0eded] text-center">Vol. Hebdo</th>
                    <th className="p-2 border border-[#f0eded] text-center">Heures Effectuées</th>
                    <th className="p-2 border border-[#f0eded] text-center">Signature Enseignant</th>
                    <th className="p-2 border border-[#f0eded] text-center">Visa Censeur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eded]">
                  {teachers.slice(0, 8).map((t, index) => (
                    <tr key={t.id} className="hover:bg-[#f6f3f2]/40">
                      <td className="p-2 border border-[#f0eded] font-mono text-center">
                        {index + 1}
                      </td>
                      <td className="p-2 border border-[#f0eded] font-bold">{t.name}</td>
                      <td className="p-2 border border-[#f0eded]">{t.departmentLabel}</td>
                      <td className="p-2 border border-[#f0eded]">
                        {t.classes.map((c) => c.name).join(', ')}
                      </td>
                      <td className="p-2 border border-[#f0eded] text-center font-bold">
                        {t.assignedHours}h
                      </td>
                      <td className="p-2 border border-[#f0eded] text-center text-[#006c4c] font-bold">
                        {t.assignedHours * 4}h
                      </td>
                      <td className="p-2 border border-[#f0eded] text-center text-[#8d7168] italic">
                        [Émargé]
                      </td>
                      <td className="p-2 border border-[#f0eded] text-center text-[#006c4c] font-bold">
                        ✓ Visé
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-end pt-3 text-[11px] text-[#594139]">
              <div>
                <p>Arrêté à la date du 10 Novembre 2024</p>
                <p className="font-semibold">Le Chef de Travaux / Intendant</p>
              </div>
              <div className="text-right">
                <p>Le Censeur Pédagogique (2nd Cycle)</p>
                <p className="font-extrabold text-[#1b1c1c]">M. Alain NGUEMO (PLEG)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f0eded] flex items-center justify-between bg-[#fcf9f8]">
          <span className="text-[11.5px] text-[#8d7168]">
            Prêt pour l'impression en format A4 paysage réglementaire.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold hover:bg-[#e5e2e1]"
            >
              Fermer
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-lg bg-[#4b5d8f] text-white font-bold hover:brightness-110 flex items-center gap-1.5 shadow"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Imprimer le Cahier d'Émargement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
