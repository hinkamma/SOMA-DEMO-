import React, { useState } from 'react';

interface InspectionDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InspectionDossierModal: React.FC<InspectionDossierModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#f0eded] bg-[#4b5d8f] text-white">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
            <div>
              <h2 className="text-[17px] font-bold">Dossier d'Inspection Pédagogique Régionale</h2>
              <span className="text-[11px] text-[#dae1ff] font-medium">
                Norme MINESEC Approche Par Compétences (APC) • Trimestre 1
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#dae1ff] hover:text-white">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 text-[13px]">
          {downloadSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#96f5ca] text-[#002115] flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">check</span>
              </div>
              <h3 className="text-[17px] font-bold text-[#006c4c]">
                Archive d'Inspection Téléchargée !
              </h3>
              <p className="text-[12px] text-[#594139]">
                Le package complet contenant les fiches de progression par objectifs d'apprentissage et les visas du Censeur a été généré.
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-[#dae1ff]/30 text-[#011848] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4b5d8f]">
                    Indice de Couverture Globale
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-[24px] font-black text-[#006c4c]">100%</span>
                    <span className="text-[12px] text-[#594139] font-medium">des programmes exécutés</span>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#96f5ca] text-[#002115] text-[11px] font-extrabold">
                  Visa Préfet / Censeur Validé
                </div>
              </div>

              <span className="text-[12px] font-bold text-[#1b1c1c] uppercase tracking-wider">
                Contenu du Dossier Numérique :
              </span>

              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-lg bg-[#f6f3f2] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#4b5d8f] text-[20px]">
                      description
                    </span>
                    <span className="font-semibold text-[#1b1c1c]">
                      Fiches de progression APC (Toutes matières 2nd Cycle)
                    </span>
                  </div>
                  <span className="text-[11.5px] font-bold text-[#006c4c]">48 fiches</span>
                </div>

                <div className="p-3 rounded-lg bg-[#f6f3f2] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#4b5d8f] text-[20px]">
                      fact_check
                    </span>
                    <span className="font-semibold text-[#1b1c1c]">
                      Synthèse des Visas des Cahiers de Texte (38 visés)
                    </span>
                  </div>
                  <span className="text-[11.5px] font-bold text-[#006c4c]">84.5%</span>
                </div>

                <div className="p-3 rounded-lg bg-[#f6f3f2] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#4b5d8f] text-[20px]">
                      assignment
                    </span>
                    <span className="font-semibold text-[#1b1c1c]">
                      Relevé récapitulatif des heures supplémentaires & quotas
                    </span>
                  </div>
                  <span className="text-[11.5px] font-bold text-[#006c4c]">Conforme</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0eded]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold hover:bg-[#e5e2e1]"
                >
                  Fermer
                </button>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="px-5 py-2.5 rounded-lg bg-[#ff6b35] text-white font-bold hover:brightness-105 flex items-center gap-2 shadow"
                >
                  {downloading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Compilation du dossier...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                      <span>Télécharger Dossier Complet (.ZIP)</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
