import React from 'react';
import { Student } from '../types';

interface CertificatScolariteModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  academicYear: string;
}

export const CertificatScolariteModal: React.FC<CertificatScolariteModalProps> = ({
  isOpen,
  onClose,
  student,
  academicYear,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-[#f0eded] flex items-center justify-between bg-[#fcf9f8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c4c] text-[22px]">
              workspace_premium
            </span>
            <h2 className="text-[16px] font-bold text-[#1b1c1c]">
              Certificat de Scolarité Officiel
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8d7168] hover:text-[#1b1c1c]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Printable Official Document */}
        <div className="p-8 overflow-y-auto flex flex-col gap-6 text-[13px] bg-white">
          <div className="border-2 border-[#1b1c1c] p-8 rounded-lg relative bg-[#ffffff] shadow-sm">
            {/* National Header Bilingual */}
            <div className="flex justify-between items-start text-center text-[10px] uppercase font-bold border-b-2 border-black pb-4 mb-6 leading-tight">
              <div className="w-5/12">
                <span className="block font-black text-[10.5px]">RÉPUBLIQUE DU CAMEROUN</span>
                <span className="block text-[#594139] italic font-normal text-[9.5px]">Paix - Travail - Patrie</span>
                <span className="block mt-1 font-bold">MINISTÈRE DES ENSEIGNEMENTS SECONDAIRES</span>
                <span className="block text-[#4b5d8f]">DÉLÉGATION RÉGIONALE DU CENTRE</span>
                <span className="block font-black text-[#1b1c1c] text-[11px] mt-0.5">LYCÉE BILINGUE D'APPLICATION</span>
              </div>

              {/* School Emblem / Seal */}
              <div className="w-2/12 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-[#ff6b35] font-black text-[18px]">
                  <span className="material-symbols-outlined text-[28px]">school</span>
                </div>
                <span className="text-[8px] font-bold text-[#8d7168] mt-1">SOMA-MINESEC</span>
              </div>

              <div className="w-5/12">
                <span className="block font-black text-[10.5px]">REPUBLIC OF CAMEROON</span>
                <span className="block text-[#594139] italic font-normal text-[9.5px]">Peace - Work - Fatherland</span>
                <span className="block mt-1 font-bold">MINISTRY OF SECONDARY EDUCATION</span>
                <span className="block text-[#4b5d8f]">REGIONAL DELEGATION FOR THE CENTRE</span>
                <span className="block font-black text-[#1b1c1c] text-[11px] mt-0.5">GOVERNMENT BILINGUAL HIGH SCHOOL</span>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center my-6">
              <h1 className="text-[20px] font-black uppercase tracking-wider text-[#1b1c1c] inline-block border-b-2 border-black pb-1">
                CERTIFICAT DE SCOLARITÉ
              </h1>
              <p className="text-[11px] text-[#594139] mt-1 italic">
                N° {Math.floor(100 + Math.random() * 900)} / CS / LBA / {academicYear}
              </p>
            </div>

            {/* Certificate Body */}
            <div className="flex flex-col gap-4 text-[13.5px] leading-relaxed text-[#1b1c1c] text-justify my-6 font-serif">
              <p>
                Le Proviseur soussigné du Lycée Bilingue d'Application certifie par la présente que l'élève :
              </p>

              <div className="bg-[#f6f3f2]/60 p-4 rounded border border-[#eae7e7] flex flex-col gap-1.5 font-sans">
                <div className="flex items-center">
                  <span className="w-48 font-bold text-[#594139] text-[12px]">Nom et Prénom :</span>
                  <span className="font-extrabold text-[15px] uppercase tracking-wide text-[#1b1c1c]">
                    {student.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-48 font-bold text-[#594139] text-[12px]">Né(e) le :</span>
                  <span className="font-semibold">{student.dob} à {student.pob}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-48 font-bold text-[#594139] text-[12px]">Sexe :</span>
                  <span className="font-semibold">{student.gender === 'M' ? 'Masculin' : 'Féminin'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-48 font-bold text-[#594139] text-[12px]">Matricule National :</span>
                  <span className="font-mono font-bold text-[#006c4c]">{student.matricule}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-48 font-bold text-[#594139] text-[12px]">Classe Fréquentée :</span>
                  <span className="font-extrabold text-[#4b5d8f] text-[14px]">{student.className}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-48 font-bold text-[#594139] text-[12px]">Parent / Tuteur Légal :</span>
                  <span className="font-semibold">{student.parentName} ({student.parentPhone})</span>
                </div>
              </div>

              <p>
                Est régulièrement inscrit(e) et assidu(e) dans cet établissement pour l'année scolaire <strong>{academicYear}</strong>.
              </p>
              <p className="text-[12px] text-[#594139] italic">
                En foi de quoi le présent certificat lui est délivré pour servir et valoir ce que de droit.
              </p>
            </div>

            {/* Seal & Signatures */}
            <div className="mt-8 pt-6 border-t border-[#eae7e7] flex justify-between items-end">
              <div className="text-[11px] text-[#8d7168]">
                <span>Fait à Yaoundé, le {new Date().toLocaleDateString('fr-FR')}</span>
                <div className="mt-4 w-28 h-28 border border-dashed border-[#8d7168]/60 rounded-full flex items-center justify-center text-center p-2 text-[9px] uppercase font-bold text-[#8d7168]">
                  Cachet Rond de l'Établissement
                </div>
              </div>

              <div className="text-center flex flex-col items-center">
                <span className="text-[12px] font-bold text-[#1b1c1c]">Le Chef d'Établissement / Proviseur</span>
                <span className="text-[10px] text-[#8d7168] italic">(Nom, Signature & Sceau)</span>
                <div className="mt-6 font-serif italic text-[16px] font-black text-[#011848] border-b-2 border-black px-6 py-1">
                  Dr. ETOUNDI Pierre
                </div>
                <span className="text-[9.5px] font-mono text-[#8d7168] mt-1">PLEG Hors Échelle</span>
              </div>
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
              onClick={() => window.print()}
              className="px-5 py-2 rounded-lg bg-[#006c4c] text-white font-bold flex items-center gap-1.5 hover:brightness-105 shadow"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Imprimer le Certificat de Scolarité</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
