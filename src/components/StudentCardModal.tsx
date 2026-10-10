import React from 'react';
import { Student } from '../types';

interface StudentCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  academicYear: string;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({
  isOpen,
  onClose,
  student,
  academicYear,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-4 border-b border-[#f0eded] flex items-center justify-between bg-[#fcf9f8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4b5d8f] text-[22px]">
              badge
            </span>
            <h2 className="text-[16px] font-bold text-[#1b1c1c]">
              Carte d'Identité Scolaire (Badge Électronique)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8d7168] hover:text-[#1b1c1c]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Card Display Area */}
        <div className="p-6 overflow-y-auto flex flex-col items-center gap-6 bg-[#f6f3f2]">
          {/* RECTO */}
          <div className="w-[340px] sm:w-[400px] h-[220px] rounded-2xl bg-gradient-to-br from-[#011848] via-[#12285e] to-[#011848] text-white p-4 shadow-xl border-2 border-[#ff6b35]/40 flex flex-col justify-between relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-[#ff6b35]/15 blur-2xl pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-[#4b5d8f]/30 blur-xl pointer-events-none"></div>

            {/* Top Bar of the Badge */}
            <div className="flex items-center justify-between border-b border-white/20 pb-2 z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#ff6b35] flex items-center justify-center font-bold text-[14px] text-white">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                </div>
                <div className="leading-tight">
                  <span className="text-[11px] font-black tracking-wider block uppercase">
                    LYCÉE BILINGUE D'APPLICATION
                  </span>
                  <span className="text-[9px] text-white/70 block tracking-widest uppercase">
                    MINESEC • CAMEROUN
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#ff6b35] text-[10px] font-extrabold tracking-wide uppercase">
                {academicYear}
              </span>
            </div>

            {/* Main Center: Photo + Info */}
            <div className="flex items-center gap-4 my-auto z-10">
              {/* Photo box */}
              <div className="w-20 h-24 rounded-xl bg-white/10 border-2 border-white/40 flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {student.gender === 'M' ? (
                  <span className="material-symbols-outlined text-[48px] text-white/80">
                    face
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[48px] text-white/80">
                    face_3
                  </span>
                )}
                <span className="text-[8px] uppercase tracking-wider text-white/60">Élève</span>
              </div>

              {/* Identity details */}
              <div className="flex flex-col gap-0.5 min-w-0 text-[11px]">
                <span className="text-[9px] text-[#96f5ca] font-mono tracking-widest font-bold">
                  {student.matricule}
                </span>
                <span className="text-[13px] font-extrabold uppercase truncate leading-snug">
                  {student.name}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-white/20 font-bold text-[11px]">
                    Classe : {student.className}
                  </span>
                  {student.bloodGroup && (
                    <span className="px-1.5 py-0.5 rounded bg-[#ba1a1a] font-bold text-[10px]">
                      {student.bloodGroup}
                    </span>
                  )}
                </div>
                <span className="text-[9.5px] text-white/80 mt-1">
                  Né(e) le {student.dob} à {student.pob}
                </span>
              </div>
            </div>

            {/* Bottom Bar: Barcode & Security */}
            <div className="flex items-center justify-between pt-1 border-t border-white/20 z-10 text-[9px] text-white/70">
              <div className="font-mono tracking-widest text-[10px]">
                ||| | |||| || | ||||| | ||
              </div>
              <span className="uppercase font-semibold tracking-wide">
                Carte d'Élève Officielle
              </span>
            </div>
          </div>

          {/* VERSO PREVIEW */}
          <div className="w-[340px] sm:w-[400px] h-[220px] rounded-2xl bg-white text-[#1b1c1c] p-4 shadow-xl border border-[#eae7e7] flex flex-col justify-between text-[10px]">
            <div className="border-b border-[#eae7e7] pb-1 flex justify-between items-center">
              <span className="font-bold text-[#8d7168] uppercase text-[9px]">
                Consignes Générales & Sécurité
              </span>
              <span className="text-[#006c4c] font-black uppercase">Statut : Régulier</span>
            </div>

            <div className="space-y-1 text-[#594139] leading-tight text-[9.5px]">
              <p>• Cette carte est strictement personnelle et obligatoire pour accéder à l'enceinte de l'établissement et aux salles d'examens.</p>
              <p>• En cas de perte, aviser immédiatement le bureau de la Surveillance Générale.</p>
              <div className="bg-[#f6f3f2] p-2 rounded mt-1">
                <span className="font-bold block text-[#1b1c1c]">Contact d'Urgence / Tuteur Légal :</span>
                <span>{student.parentName} • <strong>{student.parentPhone}</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#eae7e7]">
              <div>
                <span className="text-[8px] text-[#8d7168] block">Signature de l'élève</span>
                <span className="italic font-serif text-[11px] font-bold">Approuvé</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-[#8d7168] block">Le Proviseur</span>
                <span className="italic font-serif font-bold text-[#011848] text-[11px]">Dr. ETOUNDI Pierre</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 w-full max-w-[400px]">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold hover:bg-[#e5e2e1] text-[12px]"
            >
              Fermer
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2 rounded-lg bg-[#4b5d8f] text-white font-bold flex items-center gap-1.5 hover:brightness-105 shadow text-[12px]"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Imprimer Carte Scolaire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
