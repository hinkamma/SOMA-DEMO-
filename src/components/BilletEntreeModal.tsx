import React from 'react';
import { AbsenceRecord } from '../types';

interface BilletEntreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  absence: AbsenceRecord | null;
}

export const BilletEntreeModal: React.FC<BilletEntreeModalProps> = ({
  isOpen,
  onClose,
  absence,
}) => {
  if (!isOpen || !absence) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-[#f0eded] flex items-center justify-between bg-[#fcf9f8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff6b35] text-[22px]">
              confirmation_number
            </span>
            <h2 className="text-[16px] font-bold text-[#1b1c1c]">
              Billet d'Entrée & Autorisation de Cours
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8d7168] hover:text-[#1b1c1c]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Official Printable Ticket */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-[13px]">
          <div className="border-2 border-dashed border-[#1b1c1c]/30 rounded-xl p-5 bg-[#fffdfa] relative">
            {/* Header Stamp */}
            <div className="text-center border-b border-[#eae7e7] pb-3 mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8d7168] block">
                RÉPUBLIQUE DU CAMEROUN • MINESEC
              </span>
              <span className="text-[12px] font-black text-[#1b1c1c] block">
                SURVEILLANCE GÉNÉRALE DU 2ND CYCLE
              </span>
              <span className="text-[15px] font-black tracking-wide text-[#ff6b35] block mt-1 uppercase">
                BILLET D'ENTRÉE EN CLASSE N° {absence.id.toUpperCase()}
              </span>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div>
                <span className="text-[#8d7168] text-[10.5px] uppercase font-bold block">
                  Nom de l'Élève :
                </span>
                <span className="font-extrabold text-[#1b1c1c] text-[13.5px]">
                  {absence.studentName}
                </span>
              </div>
              <div>
                <span className="text-[#8d7168] text-[10.5px] uppercase font-bold block">
                  Matricule / Classe :
                </span>
                <span className="font-bold text-[#4b5d8f]">
                  {absence.matricule} • <span className="text-[#006c4c] font-black">{absence.className}</span>
                </span>
              </div>
              <div>
                <span className="text-[#8d7168] text-[10.5px] uppercase font-bold block">
                  Date de la reprise :
                </span>
                <span className="font-semibold text-[#1b1c1c]">
                  {absence.date} (Ce jour)
                </span>
              </div>
              <div>
                <span className="text-[#8d7168] text-[10.5px] uppercase font-bold block">
                  Heures à rattraper :
                </span>
                <span className="font-bold text-[#ba1a1a]">
                  {absence.hoursCount} heure(s)
                </span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-[#f6f3f2] text-[11.5px]">
              <span className="text-[#8d7168] font-bold block uppercase text-[10px]">
                Motif consigné au registre :
              </span>
              <p className="text-[#1b1c1c] font-medium italic mt-0.5">
                « {absence.motif} »
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] pt-3 border-t border-[#eae7e7]">
              <div>
                <span className="text-[#8d7168] block">Statut du billet :</span>
                <span
                  className={`font-black uppercase ${
                    absence.isJustified ? 'text-[#006c4c]' : 'text-[#ba1a1a]'
                  }`}
                >
                  {absence.isJustified ? '✓ Absence Régularisée' : '⚠ Non Justifiée (Sous Réserve)'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#8d7168] block text-[10px]">Visa du Surveillant Général</span>
                <div className="font-serif italic font-bold text-[#011848] text-[12px] border-b border-black/40 inline-block px-2">
                  {absence.registeredBy}
                </div>
              </div>
            </div>

            {/* Note for Teacher */}
            <div className="mt-3 pt-2 text-center text-[10px] text-[#8d7168] border-t border-dashed border-[#eae7e7]">
              * Billet à remettre impérativement au professeur de cours dès l'entrée en salle.
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold hover:bg-[#e5e2e1]"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                window.print();
              }}
              className="px-5 py-2 rounded-lg bg-[#ff6b35] text-white font-bold flex items-center gap-1.5 hover:brightness-105 shadow"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Imprimer le Billet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
