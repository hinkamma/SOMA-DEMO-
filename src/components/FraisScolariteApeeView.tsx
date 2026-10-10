import React, { useState, useMemo } from 'react';
import { Student, PaymentReceipt } from '../types';
import { CLASSES_LIST } from '../data/mockData';
import { PaymentReceiptModal } from './PaymentReceiptModal';

interface FraisScolariteApeeViewProps {
  students: Student[];
  payments: PaymentReceipt[];
  academicYear: string;
  onAddPayment: (payment: PaymentReceipt, updatedStudent: Student) => void;
  onSendSmsRelance: (count: number) => void;
}

export const FraisScolariteApeeView: React.FC<FraisScolariteApeeViewProps> = ({
  students,
  payments,
  academicYear,
  onAddPayment,
  onSendSmsRelance,
}) => {
  const [activeTab, setActiveTab] = useState<'suivi' | 'recus' | 'insolvables'>('suivi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedTuitionStatus, setSelectedTuitionStatus] = useState('all');

  // Selected receipt for printing
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);

  // New payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [targetStudent, setTargetStudent] = useState<Student | null>(null);
  const [payAmount, setPayAmount] = useState<number>(20000);
  const [payMethod, setPayMethod] = useState<PaymentReceipt['paymentMethod']>('Orange Money');
  const [payInstallment, setPayInstallment] = useState<PaymentReceipt['installment']>('Tranche 1');

  // Filtered students for tuition
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = selectedClass === 'all' || s.className === selectedClass;
      const matchStatus =
        selectedTuitionStatus === 'all' || s.tuitionStatus === selectedTuitionStatus;
      return matchSearch && matchClass && matchStatus;
    });
  }, [students, searchQuery, selectedClass, selectedTuitionStatus]);

  // Insolvables list
  const insolvablesList = useMemo(() => {
    return students.filter((s) => s.tuitionStatus === 'insolvable' || s.tuitionStatus === 'partiel');
  }, [students]);

  // Financial calculations
  const totalBudget = 24400000; // Total 488 élèves x ~50 000 FCFA
  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0) + 19800000; // baseline school collection
  const totalRemaining = Math.max(0, totalBudget - totalCollected);
  const recoveryRate = ((totalCollected / totalBudget) * 100).toFixed(1);

  // Handle open payment modal for student
  const handleOpenPayment = (stu: Student) => {
    setTargetStudent(stu);
    const remaining = Math.max(0, stu.tuitionTotal - stu.tuitionPaid);
    setPayAmount(remaining > 0 ? remaining : 20000);
    setPayInstallment(stu.tuitionPaid === 0 ? 'Tranche 1' : 'Solde Complet');
    setShowPaymentModal(true);
  };

  // Submit payment
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudent) return;

    const newReceipt: PaymentReceipt = {
      id: `pay-${Date.now()}`,
      receiptNumber: `REC-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      studentName: targetStudent.name,
      matricule: targetStudent.matricule,
      className: targetStudent.className,
      date: new Date().toLocaleDateString('fr-FR'),
      amount: Number(payAmount),
      paymentMethod: payMethod,
      installment: payInstallment,
      cashierName: 'Intendant / Caisse APEE',
    };

    const newPaid = targetStudent.tuitionPaid + Number(payAmount);
    const newStatus: Student['tuitionStatus'] =
      newPaid >= targetStudent.tuitionTotal
        ? 'soldé'
        : newPaid > 0
        ? 'partiel'
        : 'insolvable';

    const updatedStudent: Student = {
      ...targetStudent,
      tuitionPaid: newPaid,
      tuitionStatus: newStatus,
    };

    onAddPayment(newReceipt, updatedStudent);
    setShowPaymentModal(false);
    setSelectedReceipt(newReceipt); // open printable receipt directly
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#96f5ca] text-[#002115] text-[11px] font-bold uppercase tracking-wide">
              Service Financier & Trésorerie APEE
            </span>
            <span className="text-[#8d7168]">•</span>
            <span className="text-[12px] text-[#4b5d8f] font-semibold">Exercice Budgétaire {academicYear}</span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c] tracking-tight">
            Frais de Scolarité & Caisse APEE
          </h1>
          <p className="text-[13.5px] text-[#594139]">
            Suivi des recouvrements, délivrance des quittances officielles, encaissements électroniques et gestion des relances pour insolvabilité.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const insolvablesCount = insolvablesList.filter((s) => s.tuitionStatus === 'insolvable').length;
              onSendSmsRelance(insolvablesCount);
            }}
            className="px-4 py-2.5 rounded-lg bg-[#ba1a1a] text-white text-[12.5px] font-bold flex items-center gap-1.5 shadow-sm hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[18px]">sms</span>
            <span>Relance SMS Insolvables</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[11px] font-bold uppercase">Budget Total Attendu</span>
            <span className="material-symbols-outlined text-[20px] text-[#011848]">account_balance</span>
          </div>
          <div className="mt-2">
            <span className="text-[24px] font-black text-[#1b1c1c] font-mono">
              {(totalBudget / 1000000).toFixed(1)} M FCFA
            </span>
            <p className="text-[11.5px] text-[#8d7168] font-semibold">488 élèves inscrits</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[11px] font-bold uppercase">Montant Encaissé (Recouvrement)</span>
            <span className="material-symbols-outlined text-[20px] text-[#006c4c]">payments</span>
          </div>
          <div className="mt-2">
            <span className="text-[24px] font-black text-[#006c4c] font-mono">
              {(totalCollected / 1000000).toFixed(1)} M FCFA
            </span>
            <p className="text-[11.5px] text-[#006c4c] font-bold">Taux effectif : {recoveryRate}%</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[11px] font-bold uppercase">Reste à Recouvrer</span>
            <span className="material-symbols-outlined text-[20px] text-[#ff6b35]">pending_actions</span>
          </div>
          <div className="mt-2">
            <span className="text-[24px] font-black text-[#ff6b35] font-mono">
              {(totalRemaining / 1000000).toFixed(1)} M FCFA
            </span>
            <p className="text-[11.5px] text-[#8d7168] font-semibold">Tranches 2 et reliquats</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[11px] font-bold uppercase">Élèves en Retard / Insolvables</span>
            <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">warning</span>
          </div>
          <div className="mt-2">
            <span className="text-[24px] font-black text-[#ba1a1a]">
              {insolvablesList.filter((s) => s.tuitionStatus === 'insolvable').length} élèves
            </span>
            <p className="text-[11.5px] text-[#ba1a1a] font-semibold">0 FCFA versé à ce jour</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#eae7e7] gap-2 overflow-x-auto text-[13px] font-bold">
        <button
          onClick={() => setActiveTab('suivi')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'suivi'
              ? 'border-[#ff6b35] text-[#ff6b35]'
              : 'border-transparent text-[#594139] hover:text-[#1b1c1c]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
          <span>Suivi des Paiements & Élèves ({filteredStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recus')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'recus'
              ? 'border-[#ff6b35] text-[#ff6b35]'
              : 'border-transparent text-[#594139] hover:text-[#1b1c1c]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Journal de Caisse & Quittances ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('insolvables')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'insolvables'
              ? 'border-[#ff6b35] text-[#ff6b35]'
              : 'border-transparent text-[#594139] hover:text-[#1b1c1c]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">notification_important</span>
          <span>Pôle des Insolvables & Relances ({insolvablesList.length})</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: SUIVI DES PAIEMENTS
          ======================================================== */}
      {activeTab === 'suivi' && (
        <div className="flex flex-col gap-4">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2 flex-1 w-full">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8d7168] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher élève, parent..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#f6f3f2] text-[12.5px] text-[#1b1c1c] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff6b35]"
                />
              </div>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="h-9 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[12px] text-[#1b1c1c] focus:outline-none"
              >
                <option value="all">Toutes les classes</option>
                {CLASSES_LIST.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedTuitionStatus}
                onChange={(e) => setSelectedTuitionStatus(e.target.value)}
                className="h-9 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[12px] text-[#1b1c1c] focus:outline-none"
              >
                <option value="all">Statut Paiement : Tous</option>
                <option value="soldé">Soldé (100%)</option>
                <option value="partiel">Partiel (Tranche 1)</option>
                <option value="insolvable">Insolvable (0 FCFA)</option>
              </select>
            </div>

            <div className="text-[12px] text-[#8d7168] font-semibold shrink-0">
              {filteredStudents.length} dossier(s) affiché(s)
            </div>
          </div>

          {/* Tuition Table */}
          <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr className="bg-[#f6f3f2] text-[#594139] uppercase text-[10.5px] font-extrabold tracking-wider border-b border-[#f0eded]">
                    <th className="py-3 px-4 font-bold">Élève & Matricule</th>
                    <th className="py-3 px-3 font-bold">Classe</th>
                    <th className="py-3 px-3 font-bold text-right">Frais Totaux</th>
                    <th className="py-3 px-3 font-bold text-right">Déjà Versé</th>
                    <th className="py-3 px-3 font-bold text-right">Reste Dû</th>
                    <th className="py-3 px-4 font-bold">Progression</th>
                    <th className="py-3 px-3 font-bold">Statut Caisse</th>
                    <th className="py-3 px-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eded] text-[#1b1c1c]">
                  {filteredStudents.map((s) => {
                    const remaining = Math.max(0, s.tuitionTotal - s.tuitionPaid);
                    const percent = Math.min(100, Math.round((s.tuitionPaid / s.tuitionTotal) * 100));

                    return (
                      <tr key={s.id} className="hover:bg-[#f6f3f2]/50">
                        <td className="py-3 px-4">
                          <span className="font-extrabold text-[13px] text-[#1b1c1c] block">
                            {s.name}
                          </span>
                          <span className="text-[10px] text-[#8d7168] font-mono">
                            {s.matricule} • Parent : {s.parentName}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-[#dae1ff] text-[#011848] text-[11px] font-bold">
                            {s.className}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold">
                          {s.tuitionTotal.toLocaleString('fr-FR')} F
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#006c4c]">
                          {s.tuitionPaid.toLocaleString('fr-FR')} F
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#ba1a1a]">
                          {remaining.toLocaleString('fr-FR')} F
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-28 flex flex-col gap-1">
                            <div className="flex justify-between text-[10px] font-bold">
                              <span>{percent}%</span>
                            </div>
                            <div className="w-full bg-[#eae7e7] h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  percent === 100
                                    ? 'bg-[#006c4c]'
                                    : percent > 0
                                    ? 'bg-[#ff6b35]'
                                    : 'bg-[#ba1a1a]'
                                }`}
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10.5px] font-bold uppercase ${
                              s.tuitionStatus === 'soldé'
                                ? 'bg-[#96f5ca] text-[#002115]'
                                : s.tuitionStatus === 'partiel'
                                ? 'bg-[#dae1ff] text-[#011848]'
                                : 'bg-[#ffdad6] text-[#ba1a1a]'
                            }`}
                          >
                            {s.tuitionStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {s.tuitionStatus !== 'soldé' ? (
                              <button
                                onClick={() => handleOpenPayment(s)}
                                className="px-2.5 py-1 rounded bg-[#ff6b35] hover:bg-[#e05624] text-white font-bold text-[11px] flex items-center gap-1 shadow-sm"
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  add_card
                                </span>
                                <span>Encaisser</span>
                              </button>
                            ) : (
                              <span className="text-[11px] font-bold text-[#006c4c] flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">
                                  check_circle
                                </span>
                                <span>Soldé</span>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: JOURNAL DE CAISSE & QUITTANCES
          ======================================================== */}
      {activeTab === 'recus' && (
        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#f0eded] bg-[#fcf9f8] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[14.5px] text-[#1b1c1c]">
                Registre Chronologique des Recouvrements (Caisse APEE & Intendance)
              </h3>
              <p className="text-[11.5px] text-[#8d7168]">
                Enregistrements authentifiés des transactions bancaires, mobiles et espèces.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#4b5d8f] text-[11.5px] font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimer Journal</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr className="bg-[#f6f3f2] text-[#594139] uppercase text-[10.5px] font-extrabold border-b border-[#f0eded]">
                  <th className="py-3 px-4 font-bold">N° Quittance</th>
                  <th className="py-3 px-3 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold">Élève & Matricule</th>
                  <th className="py-3 px-3 font-bold">Classe</th>
                  <th className="py-3 px-3 font-bold">Moyen de Règlement</th>
                  <th className="py-3 px-3 font-bold">Échéance</th>
                  <th className="py-3 px-3 font-bold text-right">Montant Encaissé</th>
                  <th className="py-3 px-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0eded] text-[#1b1c1c]">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#f6f3f2]/50">
                    <td className="py-3 px-4 font-mono font-bold text-[#006c4c]">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-3 text-[#8d7168] font-mono text-[11.5px]">
                      {p.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#1b1c1c] block">{p.studentName}</span>
                      <span className="text-[10px] text-[#8d7168] font-mono">{p.matricule}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#dae1ff] text-[#011848] text-[11px] font-bold">
                        {p.className}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#ff6b35]">
                      {p.paymentMethod}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#eae7e7] text-[#594139] text-[10.5px] font-bold">
                        {p.installment}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-[#006c4c] text-[13.5px]">
                      {p.amount.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="px-2.5 py-1 rounded bg-[#006c4c]/10 hover:bg-[#006c4c] text-[#006c4c] hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all"
                        title="Imprimer quittance officielle"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          receipt_long
                        </span>
                        <span>Quittance</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: PÔLE DES INSOLVABLES & RELANCES
          ======================================================== */}
      {activeTab === 'insolvables' && (
        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#f0eded] gap-3">
            <div>
              <h3 className="font-bold text-[16px] text-[#1b1c1c]">
                Liste Prioritaire de Recouvrement des Impayés
              </h3>
              <p className="text-[12px] text-[#8d7168]">
                Élèves n'ayant pas soldé la cotisation APEE et frais annexes pour le Trimestre 1.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("Génération des lettres d'avertissement de scolarité pour les familles...")}
                className="px-3.5 py-2 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#4b5d8f] text-[12px] font-bold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">mail</span>
                <span>Lettres de Rappel</span>
              </button>
              <button
                onClick={() => onSendSmsRelance(insolvablesList.length)}
                className="px-4 py-2 rounded-lg bg-[#ba1a1a] text-white text-[12px] font-bold flex items-center gap-1.5 shadow"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Diffuser Relance SMS Générale</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insolvablesList.map((s) => {
              const remaining = Math.max(0, s.tuitionTotal - s.tuitionPaid);

              return (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border border-[#ffdad6] bg-[#ffdad6]/15 flex flex-col justify-between gap-3 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-[#dae1ff] text-[#011848] text-[10.5px] font-bold">
                        {s.className}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[10.5px] font-black uppercase">
                        {s.tuitionStatus}
                      </span>
                    </div>
                    <h4 className="font-black text-[14.5px] text-[#1b1c1c] mt-2">
                      {s.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#8d7168]">{s.matricule}</span>

                    <div className="mt-3 p-2.5 rounded-lg bg-white/80 border border-[#eae7e7] text-[11.5px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#8d7168]">Versé :</span>
                        <span className="font-bold text-[#006c4c]">{s.tuitionPaid.toLocaleString('fr-FR')} F</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8d7168]">Reste dû :</span>
                        <span className="font-black text-[#ba1a1a]">{remaining.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="pt-1 border-t border-[#eae7e7] flex justify-between text-[11px]">
                        <span className="text-[#8d7168]">Contact parent :</span>
                        <span className="font-mono font-bold text-[#4b5d8f]">{s.parentPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenPayment(s)}
                      className="w-full py-1.5 rounded-lg bg-[#ff6b35] text-white text-[11.5px] font-bold flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[15px]">add_card</span>
                      <span>Encaisser Reliquat</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Receipt Modal */}
      <PaymentReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
        academicYear={academicYear}
      />

      {/* ENCAISSEMENT MODAL */}
      {showPaymentModal && targetStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#f0eded] bg-[#fcf9f8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c4c] text-[22px]">
                  payments
                </span>
                <h3 className="font-bold text-[16px] text-[#1b1c1c]">
                  Encaisser un Versement Scolarité / APEE
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 text-[#8d7168] hover:text-[#1b1c1c]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 flex flex-col gap-4 text-[13px]">
              <div className="p-3 rounded-lg bg-[#f6f3f2]">
                <span className="text-[11px] font-bold text-[#8d7168] uppercase block">
                  Élève Bénéficiaire :
                </span>
                <span className="font-black text-[14px] text-[#1b1c1c] block">
                  {targetStudent.name}
                </span>
                <span className="text-[11px] text-[#4b5d8f]">
                  Classe : {targetStudent.className} • Reste actuel à payer :{' '}
                  <strong className="text-[#ba1a1a]">
                    {(targetStudent.tuitionTotal - targetStudent.tuitionPaid).toLocaleString('fr-FR')} FCFA
                  </strong>
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                  Montant à encaisser (FCFA)
                </label>
                <input
                  type="number"
                  min="5000"
                  max="100000"
                  step="5000"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-lg bg-[#f6f3f2] text-[16px] font-mono font-black text-[#006c4c] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff6b35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Mode de règlement
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                  >
                    <option value="Orange Money">Orange Money</option>
                    <option value="MTN MoMo">MTN MoMo</option>
                    <option value="Espèces / Caisse">Espèces / Caisse</option>
                    <option value="Virement / Banque">Virement Bancaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Tranche / Libellé
                  </label>
                  <select
                    value={payInstallment}
                    onChange={(e) => setPayInstallment(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                  >
                    <option value="Tranche 1">Tranche 1</option>
                    <option value="Tranche 2">Tranche 2</option>
                    <option value="Solde Complet">Solde Complet</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#96f5ca]/20 border border-[#96f5ca] text-[11.5px] text-[#002115]">
                ✓ Une quittance numérotée avec reçu détachable et signature de l'économe sera générée automatiquement après validation.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0eded]">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold text-[12px]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#006c4c] text-white font-bold text-[12px] hover:brightness-105 shadow flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Valider & Générer Quittance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
