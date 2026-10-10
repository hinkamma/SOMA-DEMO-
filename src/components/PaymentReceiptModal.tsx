import React from 'react';
import { PaymentReceipt } from '../types';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: PaymentReceipt | null;
  academicYear: string;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt,
  academicYear,
}) => {
  if (!isOpen || !receipt) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#f0eded] flex items-center justify-between bg-[#fcf9f8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c4c] text-[22px]">
              receipt_long
            </span>
            <h2 className="text-[16px] font-bold text-[#1b1c1c]">
              Quittance Officielle de Paiement (Reçu de Caisse)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8d7168] hover:text-[#1b1c1c]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-[12.5px]">
          <div className="border-2 border-[#1b1c1c] p-6 rounded-xl bg-[#fffefc] relative shadow-sm">
            {/* Top Bar */}
            <div className="flex justify-between items-start border-b border-[#eae7e7] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8d7168] block">
                  RÉPUBLIQUE DU CAMEROUN • MINESEC
                </span>
                <span className="text-[13px] font-black text-[#1b1c1c] block">
                  LYCÉE BILINGUE D'APPLICATION
                </span>
                <span className="text-[11px] text-[#4b5d8f] font-semibold block">
                  SERVICE DE L'INTENDANCE & BUREAU APEE
                </span>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded bg-[#006c4c] text-white text-[12px] font-black tracking-wider block font-mono">
                  {receipt.receiptNumber}
                </span>
                <span className="text-[10.5px] text-[#8d7168] block mt-1">
                  Année : {academicYear}
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center my-3 bg-[#f6f3f2] py-2 rounded-lg">
              <span className="text-[14px] font-black uppercase text-[#1b1c1c] tracking-wide">
                REÇU DE VERSEMENT SCOLARITÉ & CAISSE APEE
              </span>
            </div>

            {/* Student & Payment Details */}
            <div className="grid grid-cols-2 gap-3 my-4 text-[12px]">
              <div>
                <span className="text-[#8d7168] text-[10px] uppercase font-bold block">
                  Reçu de l'élève :
                </span>
                <span className="font-extrabold text-[#1b1c1c] text-[13px]">
                  {receipt.studentName}
                </span>
              </div>
              <div>
                <span className="text-[#8d7168] text-[10px] uppercase font-bold block">
                  Matricule & Classe :
                </span>
                <span className="font-bold text-[#4b5d8f]">
                  {receipt.matricule} • <span className="text-[#006c4c] font-black">{receipt.className}</span>
                </span>
              </div>
              <div>
                <span className="text-[#8d7168] text-[10px] uppercase font-bold block">
                  Date de versement :
                </span>
                <span className="font-semibold text-[#1b1c1c]">
                  {receipt.date}
                </span>
              </div>
              <div>
                <span className="text-[#8d7168] text-[10px] uppercase font-bold block">
                  Mode de règlement :
                </span>
                <span className="font-bold text-[#ff6b35]">
                  {receipt.paymentMethod}
                </span>
              </div>
              <div>
                <span className="text-[#8d7168] text-[10px] uppercase font-bold block">
                  Tranche / Échéance :
                </span>
                <span className="font-bold text-[#006c4c]">
                  {receipt.installment}
                </span>
              </div>
              <div>
                <span className="text-[#8d7168] text-[10px] uppercase font-bold block">
                  Agent de caisse :
                </span>
                <span className="font-semibold text-[#1b1c1c]">
                  {receipt.cashierName}
                </span>
              </div>
            </div>

            {/* Amount Box */}
            <div className="p-4 rounded-xl bg-[#96f5ca]/20 border border-[#96f5ca] flex items-center justify-between my-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#002115] block">
                  Montant Net Encaissé :
                </span>
                <span className="text-[24px] font-black font-mono text-[#006c4c]">
                  {receipt.amount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-[#006c4c] text-white text-[11px] font-bold uppercase">
                  Paiement Validé
                </span>
              </div>
            </div>

            {/* Bottom Signatures */}
            <div className="flex justify-between items-end pt-4 border-t border-[#eae7e7] mt-4 text-[11px]">
              <div>
                <span className="text-[#8d7168] block text-[10px]">Mention Parent / Élève :</span>
                <span className="italic">« Bon pour quittance »</span>
              </div>
              <div className="text-right">
                <span className="text-[#8d7168] block text-[10px]">Le Caissier / L'Économe APEE</span>
                <div className="font-serif italic font-bold text-[#011848] text-[13px] border-b border-black/40 inline-block px-3 mt-1">
                  M. NGONO Basile
                </div>
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
              <span>Imprimer le Reçu de Caisse</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
