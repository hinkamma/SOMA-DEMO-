import React, { useState } from 'react';
import { Teacher } from '../types';

interface ExportMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
}

export const ExportMenuModal: React.FC<ExportMenuModalProps> = ({
  isOpen,
  onClose,
  teachers,
}) => {
  const [exportType, setExportType] = useState<'xlsx' | 'pdf' | 'heures'>('xlsx');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadCsv = () => {
    // Generate CSV data for MINESEC report
    const headers = [
      'Matricule',
      'Nom Enseignant',
      'Département',
      'Grade MINESEC',
      'Statut',
      'Classes Affectées',
      'Volume Alloué (h)',
      'Quota Statutaire (h)',
      'Heures Supp',
      'Suivi Notes T1',
      'Téléphone',
    ];

    const rows = teachers.map((t) => [
      `"${t.matricule}"`,
      `"${t.name}"`,
      `"${t.departmentLabel}"`,
      `"${t.grade}"`,
      `"${t.status}"`,
      `"${t.classes.map((c) => c.name + (c.isPP ? ' [PP]' : '')).join('; ')}"`,
      t.assignedHours,
      t.quotaHours,
      t.assignedHours > t.quotaHours ? t.assignedHours - t.quotaHours : 0,
      `"${t.pedagogicalFollowUp.notesT1Label}"`,
      `"${t.phone}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Bordereau_MINESEC_Corps_Enseignant_2024_2025_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
    }, 1500);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#f0eded] bg-[#fcf9f8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4b5d8f] text-[22px]">
              file_download
            </span>
            <h2 className="text-[17px] font-bold text-[#1b1c1c]">
              Centre d'Exportation Officielle MINESEC
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#8d7168] hover:text-[#1b1c1c]">
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
              <h3 className="text-[16px] font-bold text-[#006c4c]">
                Fichier Généré & Téléchargé !
              </h3>
              <p className="text-[12px] text-[#594139]">
                Le bordereau conforme aux normes du Ministère des Enseignements Secondaires est prêt.
              </p>
            </div>
          ) : (
            <>
              <p className="text-[#594139] leading-relaxed">
                Sélectionnez le document administratif à exporter pour l'Inspection Pédagogique Régionale (IPR) ou la Délégation Départementale :
              </p>

              {/* Option 1 */}
              <div
                onClick={() => setExportType('xlsx')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  exportType === 'xlsx'
                    ? 'border-[#006c4c] bg-[#96f5ca]/10'
                    : 'border-[#f0eded] hover:bg-[#f6f3f2]'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#96f5ca] text-[#002115] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">table_chart</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] text-[#1b1c1c]">
                    Bordereau MINESEC (Format .XLSX / CSV)
                  </span>
                  <span className="text-[11.5px] text-[#8d7168]">
                    Registre complet des 48 enseignants avec matricules, classes, volumes horaires et statuts APC.
                  </span>
                </div>
              </div>

              {/* Option 2 */}
              <div
                onClick={() => setExportType('pdf')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  exportType === 'pdf'
                    ? 'border-[#ff6b35] bg-[#ffdbd0]/20'
                    : 'border-[#f0eded] hover:bg-[#f6f3f2]'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] text-[#1b1c1c]">
                    Répertoire Officiel du Censeur (.PDF Prêt à Imprimer)
                  </span>
                  <span className="text-[11.5px] text-[#8d7168]">
                    Mise en page ministérielle avec entête officiel, cachet de la Censure et zones de signature.
                  </span>
                </div>
              </div>

              {/* Option 3 */}
              <div
                onClick={() => setExportType('heures')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  exportType === 'heures'
                    ? 'border-[#4b5d8f] bg-[#dae1ff]/30'
                    : 'border-[#f0eded] hover:bg-[#f6f3f2]'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#dae1ff] text-[#011848] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">badge</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[14px] text-[#1b1c1c]">
                    États des Heures Complémentaires (Intendance)
                  </span>
                  <span className="text-[11.5px] text-[#8d7168]">
                    Décompte certifié des heures supplémentaires (ex: Mme NDONGO +2h, Mme ESSOMBA +1h) pour mandat financier.
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0eded]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold hover:bg-[#e5e2e1]"
                >
                  Annuler
                </button>
                {exportType === 'pdf' ? (
                  <button
                    onClick={handlePrintPdf}
                    className="px-5 py-2.5 rounded-lg bg-[#ba1a1a] text-white font-bold hover:brightness-110 flex items-center gap-1.5 shadow"
                  >
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    <span>Imprimer / Sauvegarder PDF</span>
                  </button>
                ) : (
                  <button
                    onClick={handleDownloadCsv}
                    className="px-5 py-2.5 rounded-lg bg-[#006c4c] text-white font-bold hover:brightness-110 flex items-center gap-1.5 shadow"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    <span>Télécharger le Fichier (.CSV/.XLSX)</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
