import React, { useState } from 'react';
import { Teacher } from '../types';

interface BatchSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lateTeachers: Teacher[];
  targetTeacher?: Teacher | null;
  onConfirmSend: (count: number) => void;
}

export const BatchSmsModal: React.FC<BatchSmsModalProps> = ({
  isOpen,
  onClose,
  lateTeachers,
  targetTeacher,
  onConfirmSend,
}) => {
  const isSingle = !!targetTeacher;
  const recipients = isSingle ? [targetTeacher] : lateTeachers;

  const [message, setMessage] = useState(
    "[SOMA MINESEC] Rappel officiel de la Censure Pédagogique : vos notes du Trimestre 1 sont attendues d'urgence pour validation avant le conseil de classe. Merci de régulariser la saisie sous 24h."
  );
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onConfirmSend(recipients.length);
        onClose();
      }, 1400);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#f0eded] bg-[#ffdad6]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">
              sms_failed
            </span>
            <h2 className="text-[17px] font-bold text-[#1b1c1c]">
              {isSingle
                ? `Relance Institutionnelle - ${targetTeacher.name}`
                : `Relance Groupée SMS (${recipients.length} Enseignants Ciblés)`}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#8d7168] hover:text-[#1b1c1c]">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 text-[13px]">
          {sentSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#96f5ca] text-[#002115] flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">check</span>
              </div>
              <h3 className="text-[18px] font-bold text-[#006c4c]">
                SMS Officiels Transmis avec Succès !
              </h3>
              <p className="text-[12px] text-[#594139] max-w-sm">
                Le relais GSM SOMA a expédié la relance aux {recipients.length} enseignants. Horodatage enregistré au registre de la Censure.
              </p>
            </div>
          ) : (
            <>
              {/* Target recipients */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold text-[#8d7168] uppercase tracking-wider">
                  Destinataires ({recipients.length})
                </span>
                <div className="max-h-36 overflow-y-auto flex flex-col gap-1.5 p-2 rounded-lg bg-[#f6f3f2]">
                  {recipients.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between text-[12px] py-1 px-2 rounded bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1b1c1c]">{t.name}</span>
                        <span className="text-[#8d7168]">({t.departmentLabel})</span>
                      </div>
                      <span className="font-mono text-[#ba1a1a] text-[11px] font-bold">
                        {t.phone}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message text area */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8d7168] uppercase tracking-wider">
                    Texte du message officiel SMS
                  </span>
                  <span className="text-[10px] text-[#8d7168]">
                    {message.length} caractères (1 SMS)
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] text-[12.5px] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff6b35] resize-none"
                />
              </div>

              {/* Notification info note */}
              <div className="p-3 rounded-lg bg-[#ffdad6]/40 text-[#93000a] text-[11.5px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>
                  Cet envoi est consigné dans le registre des diligences pédagogiques trimestrielles du MINESEC.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0eded]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold hover:bg-[#e5e2e1]"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className="px-5 py-2.5 rounded-lg bg-[#ba1a1a] text-white font-bold hover:brightness-110 flex items-center gap-2 shadow"
                >
                  {isSending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Transmission en cours...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Envoyer la relance ({recipients.length})</span>
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
