import React, { useState } from 'react';
import {
  Teacher,
  NavScreenId,
  MedicalRecord,
  NurseConsultation,
  Student,
  AbsenceRecord,
  DisciplineSanction,
  PaymentReceipt,
} from '../types';
import { CLASSES_LIST, INITIAL_MEDICAL_RECORDS, INITIAL_NURSE_CONSULTATIONS } from '../data/mockData';
import { GeneralDashboardView } from './GeneralDashboardView';
import { SurveillanceDisciplineView } from './SurveillanceDisciplineView';
import { GestionElevesView } from './GestionElevesView';
import { FraisScolariteApeeView } from './FraisScolariteApeeView';

interface SecondaryViewsProps {
  currentScreen: NavScreenId;
  teachers: Teacher[];
  students: Student[];
  absences: AbsenceRecord[];
  sanctions: DisciplineSanction[];
  payments: PaymentReceipt[];
  academicYear: string;
  onNavigateScreen: (screen: NavScreenId) => void;
  onNavigateToTeacher: () => void;
  onOpenTeacherDetail: (t: Teacher) => void;
  onAddStudent: (stu: Student) => void;
  onAddAbsence: (abs: AbsenceRecord) => void;
  onAddSanction: (sanc: DisciplineSanction) => void;
  onToggleJustified: (absId: string) => void;
  onAddPayment: (payment: PaymentReceipt, updatedStudent: Student) => void;
  onSendSmsRelance: (count: number) => void;
  onValidateAppelBatch?: (data: any) => void;
}

export const SecondaryViews: React.FC<SecondaryViewsProps> = ({
  currentScreen,
  teachers,
  students,
  absences,
  sanctions,
  payments,
  academicYear,
  onNavigateScreen,
  onNavigateToTeacher,
  onOpenTeacherDetail,
  onAddStudent,
  onAddAbsence,
  onAddSanction,
  onToggleJustified,
  onAddPayment,
  onSendSmsRelance,
  onValidateAppelBatch,
}) => {
  // Medical & Infirmerie State
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(INITIAL_MEDICAL_RECORDS);
  const [consultations, setConsultations] = useState<NurseConsultation[]>(INITIAL_NURSE_CONSULTATIONS);
  const [nurseTab, setNurseTab] = useState<'dossiers' | 'consultations' | 'dispenses' | 'pharmacie'>('dossiers');
  const [medSearch, setMedSearch] = useState('');
  const [medClassFilter, setMedClassFilter] = useState('all');
  const [medStatusFilter, setMedStatusFilter] = useState('all');
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showAddConsultModal, setShowAddConsultModal] = useState(false);

  // Form states for new medical record
  const [newMedStudent, setNewMedStudent] = useState('');
  const [newMedClass, setNewMedClass] = useState('Terminale C');
  const [newMedCondition, setNewMedCondition] = useState('');
  const [newMedAllergies, setNewMedAllergies] = useState('Aucune');
  const [newMedBlood, setNewMedBlood] = useState('O+');
  const [newMedStatus, setNewMedStatus] = useState<'apte' | 'dispense_eps' | 'surveillance' | 'chronique'>('surveillance');
  const [newMedEps, setNewMedEps] = useState<'Apte' | 'Dispense Partielle' | 'Dispense Totale'>('Dispense Partielle');
  const [newMedParentPhone, setNewMedParentPhone] = useState('69');

  // Form states for new consultation
  const [newConsultStudent, setNewConsultStudent] = useState('');
  const [newConsultClass, setNewConsultClass] = useState('Terminale C');
  const [newConsultMotif, setNewConsultMotif] = useState('');
  const [newConsultTreatment, setNewConsultTreatment] = useState('');
  const [newConsultDecision, setNewConsultDecision] = useState<'Retour en classe' | 'Repos infirmerie' | 'Évacuation hôpital' | 'Appel parents'>('Retour en classe');

  /* =========================================================
     1. TABLEAU DE BORD VIEW
     ========================================================= */
  if (currentScreen === 'tableau-de-bord') {
    return (
      <GeneralDashboardView
        teachers={teachers}
        students={students}
        absences={absences}
        payments={payments}
        medicalRecords={medicalRecords}
        academicYear={academicYear}
        onNavigateScreen={onNavigateScreen}
      />
    );
  }

  /* =========================================================
     SURVEILLANCE GÉNÉRALE & DISCIPLINE
     ========================================================= */
  if (currentScreen === 'surveillance-discipline') {
    return (
      <SurveillanceDisciplineView
        teachers={teachers}
        students={students}
        absences={absences}
        sanctions={sanctions}
        onAddAbsence={onAddAbsence}
        onAddSanction={onAddSanction}
        onToggleJustified={onToggleJustified}
        onValidateAppelBatch={onValidateAppelBatch}
      />
    );
  }

  /* =========================================================
     GESTION DES ÉLÈVES & INSCRIPTIONS
     ========================================================= */
  if (currentScreen === 'gestion-eleves') {
    return (
      <GestionElevesView
        students={students}
        academicYear={academicYear}
        onAddStudent={onAddStudent}
      />
    );
  }

  /* =========================================================
     FRAIS DE SCOLARITÉ & CAISSE APEE
     ========================================================= */
  if (currentScreen === 'frais-scolarite-apee') {
    return (
      <FraisScolariteApeeView
        students={students}
        payments={payments}
        academicYear={academicYear}
        onAddPayment={onAddPayment}
        onSendSmsRelance={onSendSmsRelance}
      />
    );
  }



  /* =========================================================
     2. AFFECTATIONS & CHARGES VIEW
     ========================================================= */
  if (currentScreen === 'affectations-et-charges') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold uppercase">
              Affectations & Charges Horaires
            </span>
            <span className="text-[#8d7168]">•</span>
            <span className="text-[12px] text-[#4b5d8f] font-semibold">Répartition Pédagogique 2nd Cycle</span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c]">
            Matrice des Volumes Horaires & Affectations
          </h1>
          <p className="text-[13.5px] text-[#594139]">
            Contrôle des quotas réglementaires des enseignants, attributions des classes et heures supplémentaires déclarées.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] overflow-hidden">
          <div className="p-4 border-b border-[#f0eded] flex items-center justify-between">
            <span className="font-bold text-[14px] text-[#1b1c1c]">
              Registre des 48 Enseignants et Répartition de Charge
            </span>
            <button
              onClick={onNavigateToTeacher}
              className="px-3 py-1.5 rounded-lg bg-[#ff6b35] text-white text-[12px] font-bold flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Gérer les Enseignants</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead className="bg-[#f6f3f2] text-[#594139] uppercase text-[11px] font-extrabold">
                <tr>
                  <th className="py-3 px-4">Professeur</th>
                  <th className="py-3 px-4">Discipline</th>
                  <th className="py-3 px-4">Statut Statutaire</th>
                  <th className="py-3 px-4">Classes Attribuées</th>
                  <th className="py-3 px-4">Charge / Quota</th>
                  <th className="py-3 px-4">Écart Horaire</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0eded]">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-[#f6f3f2]/50">
                    <td className="py-3 px-4 font-bold text-[#1b1c1c]">{t.name}</td>
                    <td className="py-3 px-4 text-[#594139]">{t.departmentLabel}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#dae1ff] text-[#011848] text-[10.5px] font-bold">
                        {t.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {t.classes.map((c, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-[#eae7e7] text-[10px] font-semibold">
                            {c.name} {c.isPP ? '(PP)' : ''}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold">{t.assignedHours}h / {t.quotaHours}h</td>
                    <td className="py-3 px-4">
                      {t.assignedHours > t.quotaHours ? (
                        <span className="text-[#ff6b35] font-bold">+{t.assignedHours - t.quotaHours}h (Sup)</span>
                      ) : t.assignedHours < t.quotaHours ? (
                        <span className="text-[#8d7168] font-bold">-{t.quotaHours - t.assignedHours}h (Décharge)</span>
                      ) : (
                        <span className="text-[#006c4c] font-bold">0h (Normal)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onOpenTeacherDetail(t)}
                        className="text-[#4b5d8f] hover:underline font-bold text-[12px]"
                      >
                        Voir Fiche
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     3. INTENDANCE & HEURES SUPPLÉMENTAIRES (FINANCES)
     ========================================================= */
  if (currentScreen === 'intendance-finances') {
    const overtimeRate = 2500; // FCFA / heure PLEG
    const vacataireRate = 2000; // FCFA / heure Vacataire
    const weeksInMonth = 4;

    const teachersWithFinancials = teachers
      .filter((t) => t.assignedHours > t.quotaHours || t.status === 'vac')
      .map((t) => {
        const isVac = t.status === 'vac';
        const rate = isVac ? vacataireRate : overtimeRate;
        const billableHoursPerWeek = isVac ? t.assignedHours : t.assignedHours - t.quotaHours;
        const monthlyHours = billableHoursPerWeek * weeksInMonth;
        const grossAmount = monthlyHours * rate;
        const taxRate = 0.055; // Retenue d'acompte 5.5%
        const taxAmount = Math.round(grossAmount * taxRate);
        const netAmount = grossAmount - taxAmount;

        return {
          ...t,
          rate,
          billableHoursPerWeek,
          monthlyHours,
          grossAmount,
          taxAmount,
          netAmount,
        };
      });

    const totalGross = teachersWithFinancials.reduce((sum, t) => sum + t.grossAmount, 0);
    const totalTax = teachersWithFinancials.reduce((sum, t) => sum + t.taxAmount, 0);
    const totalNet = teachersWithFinancials.reduce((sum, t) => sum + t.netAmount, 0);
    const totalHours = teachersWithFinancials.reduce((sum, t) => sum + t.monthlyHours, 0);

    return (
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold uppercase">
              Service de l'Intendance & Gestion Financière
            </span>
            <span className="text-[#8d7168]">•</span>
            <span className="text-[12px] text-[#4b5d8f] font-semibold">Période : Novembre 2024</span>
            <span className="text-[#8d7168]">•</span>
            <span className="text-[#006c4c] text-[12px] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#006c4c]"></span>
              Visas Censure Validés (Service Fait)
            </span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c]">
            Gestion de l'Intendance & Heures Complémentaires
          </h1>
          <p className="text-[13.5px] text-[#594139] max-w-4xl">
            Liquidation financière des heures supplémentaires (PLEG/PLETP) et vacations selon les arrêtés interministériels MINESEC/MINFI. Contrôle de conformité avant émission du mandat de paiement scolaire.
          </p>
        </div>

        {/* 4 Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#8d7168] tracking-wider">
                  Masse Financière Nette
                </span>
                <p className="text-[24px] font-black text-[#1b1c1c] mt-1">
                  {totalNet.toLocaleString('fr-FR')} <span className="text-[13px] font-bold text-[#4b5d8f]">FCFA</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#dae1ff] text-[#011848] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f0eded] text-[11.5px] text-[#006c4c] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>Crédit budgétaire disponible</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#8d7168] tracking-wider">
                  Volume Heures Liquidées
                </span>
                <p className="text-[24px] font-black text-[#006c4c] mt-1">
                  {totalHours} <span className="text-[13px] font-bold text-[#8d7168]">heures / mois</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#96f5ca] text-[#002115] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">timer</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f0eded] text-[11.5px] text-[#594139] flex justify-between">
              <span>{teachersWithFinancials.filter((t) => t.status === 'vac').length} Vacataires</span>
              <span>{teachersWithFinancials.filter((t) => t.status !== 'vac').length} Titulaires</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#8d7168] tracking-wider">
                  Taux Statutaire PLEG
                </span>
                <p className="text-[24px] font-black text-[#ff6b35] mt-1">
                  2 500 <span className="text-[13px] font-bold text-[#8d7168]">FCFA / h</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ffdbd0] text-[#ab3500] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">price_change</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f0eded] text-[11.5px] text-[#8d7168]">
              Vacataires : 2 000 FCFA / h
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#8d7168] tracking-wider">
                  Statut du Mandat
                </span>
                <p className="text-[17px] font-extrabold text-[#006c4c] mt-1">
                  Prêt au Décaissement
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#96f5ca] text-[#002115] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">receipt</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f0eded] text-[11.5px] text-[#4b5d8f] font-semibold">
              Visa Censeur + Visa Intendant requis
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-[#8d7168] uppercase">Période de mandat :</span>
            <select className="h-10 px-3 rounded-lg bg-[#f6f3f2] font-bold text-[#1b1c1c] text-[13px] focus:outline-none">
              <option>Novembre 2024 (En cours de liquidation)</option>
              <option>Octobre 2024 (Soldé)</option>
              <option>Bilan Clôture Trimestre 1</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => window.print()}
              className="px-3.5 h-10 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#4b5d8f] text-[12.5px] font-bold flex items-center gap-1.5 transition-all border border-[#f0eded]"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Imprimer Mandat (.PDF)</span>
            </button>

            <button
              onClick={() => {
                const csvHeaders = ['Matricule', 'Nom Enseignant', 'Statut', 'Heures Mensuelles', 'Taux Horaire', 'Montant Brut', 'Retenue TSR', 'Net A Payer'];
                const csvRows = teachersWithFinancials.map(t => [
                  `"${t.matricule}"`,
                  `"${t.name}"`,
                  `"${t.status === 'vac' ? 'Vacataire' : 'Titulaire Heures Supp'}"`,
                  t.monthlyHours,
                  t.rate,
                  t.grossAmount,
                  t.taxAmount,
                  t.netAmount
                ]);
                const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [csvHeaders.join(';'), ...csvRows.map(r => r.join(';'))].join('\n');
                const link = document.createElement('a');
                link.href = encodeURI(csvContent);
                link.download = `Mandat_Intendance_Heures_Supp_Novembre_2024.csv`;
                link.click();
              }}
              className="px-3.5 h-10 rounded-lg bg-[#006c4c] text-white text-[12.5px] font-bold flex items-center gap-1.5 hover:brightness-105 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">table_chart</span>
              <span>Bordereau Bancaire (.CSV/.XLSX)</span>
            </button>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] overflow-hidden">
          <div className="p-4 border-b border-[#f0eded] bg-[#fcf9f8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4b5d8f] text-[20px]">account_balance</span>
              <span className="font-bold text-[14px] text-[#1b1c1c]">
                État Nominatif de Liquidation des Heures Complémentaires & Vacations
              </span>
            </div>
            <span className="text-[11.5px] text-[#8d7168]">
              {teachersWithFinancials.length} bénéficiaires enregistrés
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px] border-collapse">
              <thead>
                <tr className="bg-[#f6f3f2] text-[#594139] uppercase text-[10.5px] font-extrabold tracking-wider border-b border-[#f0eded]">
                  <th className="py-3 px-4 font-bold">Enseignant & Matricule</th>
                  <th className="py-3 px-3 font-bold">Statut / Grade</th>
                  <th className="py-3 px-3 font-bold text-center">Vol. Hebdo</th>
                  <th className="py-3 px-3 font-bold text-center">Heures / Mois</th>
                  <th className="py-3 px-3 font-bold text-right">Taux / h</th>
                  <th className="py-3 px-3 font-bold text-right">Montant Brut</th>
                  <th className="py-3 px-3 font-bold text-right">TSR (5.5%)</th>
                  <th className="py-3 px-4 font-bold text-right">Net à Percevoir</th>
                  <th className="py-3 px-4 text-center font-bold">Attestation Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0eded] text-[#1b1c1c]">
                {teachersWithFinancials.map((t) => (
                  <tr key={t.id} className="hover:bg-[#f6f3f2]/60">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[13px] text-[#1b1c1c]">{t.name}</span>
                        <span className="text-[10.5px] text-[#8d7168] font-mono">{t.matricule} • {t.departmentLabel}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                          t.status === 'vac'
                            ? 'bg-[#eae7e7] text-[#594139]'
                            : 'bg-[#ffdbd0] text-[#832600]'
                        }`}
                      >
                        {t.status === 'vac' ? 'Vacataire Forfait' : 'Titulaire Heures Supp'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold">
                      {t.assignedHours}h <span className="text-[10.5px] text-[#8d7168]">({t.billableHoursPerWeek}h comp)</span>
                    </td>
                    <td className="py-3 px-3 text-center font-extrabold text-[#006c4c]">
                      {t.monthlyHours}h
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#594139]">
                      {t.rate.toLocaleString('fr-FR')} F
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#1b1c1c]">
                      {t.grossAmount.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#ba1a1a]">
                      -{t.taxAmount.toLocaleString('fr-FR')} F
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-[#006c4c] text-[13.5px]">
                      {t.netAmount.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#96f5ca] text-[#002115] text-[10.5px] font-bold">
                        <span className="material-symbols-outlined text-[13px]">verified</span>
                        Visé Censure
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#f6f3f2] font-bold text-[13px] border-t-2 border-[#f0eded]">
                <tr>
                  <td colSpan={3} className="py-3 px-4 uppercase text-[#8d7168]">
                    Totaux Généraux Mensuels :
                  </td>
                  <td className="py-3 px-3 text-center text-[#006c4c] font-black">
                    {totalHours}h
                  </td>
                  <td></td>
                  <td className="py-3 px-3 text-right text-[#1b1c1c] font-black">
                    {totalGross.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="py-3 px-3 text-right text-[#ba1a1a]">
                    -{totalTax.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="py-3 px-4 text-right text-[#006c4c] font-black text-[15px]">
                    {totalNet.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="py-3 px-4 text-center text-[11px] text-[#006c4c]">
                    Prêt pour signature
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Validation stamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[#f0eded] bg-white flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-[#8d7168]">
                Attestation du Censeur Pédagogique
              </span>
              <p className="text-[12.5px] text-[#594139] mt-1">
                "Je soussigné, M. Alain NGUEMO, Censeur, certifie exacts les volumes d'heures supplémentaires consignés ci-dessus après vérification des cahiers d'émargement et d'appels."
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f0eded] flex items-center justify-between text-[11.5px]">
              <span className="text-[#006c4c] font-bold">✓ Service fait certifié</span>
              <span className="text-[#8d7168]">Le 10 Novembre 2024</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#f0eded] bg-white flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-[#8d7168]">
                Visa de l'Intendant / Économe
              </span>
              <p className="text-[12.5px] text-[#594139] mt-1">
                "Liquidation vérifiée conformément aux disponibilités de la ligne budgétaire 'Vacations et Heures Supplémentaires'. Mandat prêt pour émargement des enseignants."
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f0eded] flex items-center justify-between text-[11.5px]">
              <span className="text-[#4b5d8f] font-bold">✓ Mandat N° 2024/INT-11</span>
              <span className="text-[#8d7168]">L'Intendant du Lycée</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     4. INFIRMERIE & SANTÉ SCOLAIRE (ÉLÈVES & ÉTUDIANTS)
     ========================================================= */
  if (currentScreen === 'infirmerie-sante') {
    const handleAddRecordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMedStudent.trim()) return;

      const newRecord: MedicalRecord = {
        id: `med-${Date.now()}`,
        studentName: newMedStudent.trim(),
        matricule: `EL-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        className: newMedClass,
        gender: 'M',
        age: 16,
        bloodGroup: newMedBlood,
        condition: newMedCondition || 'Contrôle médical systématique',
        allergies: newMedAllergies || 'Aucune',
        status: newMedStatus,
        epsStatus: newMedEps,
        lastVisitDate: 'Aujourd’hui',
        lastDiagnosis: newMedCondition || 'Bilan de santé scolaire annuel',
        nurseAction: 'Enregistrement au registre médical • Dossier actualisé',
        parentPhone: newMedParentPhone,
        vaccinesUpdated: true,
      };

      setMedicalRecords([newRecord, ...medicalRecords]);
      setShowAddMedModal(false);
      setNewMedStudent('');
      setNewMedCondition('');
      alert(`Fiche médicale enregistrée avec succès pour l'élève ${newRecord.studentName} (${newRecord.className}).`);
    };

    const handleAddConsultSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newConsultStudent.trim()) return;

      const newConsult: NurseConsultation = {
        id: `c-${Date.now()}`,
        date: new Date().toLocaleDateString('fr-FR'),
        time: `${new Date().getHours()}h${String(new Date().getMinutes()).padStart(2, '0')}`,
        studentName: newConsultStudent.trim(),
        className: newConsultClass,
        motif: newConsultMotif || 'Malaise général en cours',
        treatment: newConsultTreatment || 'Prise de constantes • Repos au lit d’infirmerie',
        decision: newConsultDecision,
      };

      setConsultations([newConsult, ...consultations]);
      setShowAddConsultModal(false);
      setNewConsultStudent('');
      setNewConsultMotif('');
      setNewConsultTreatment('');
      alert(`Passage à l'infirmerie consigné au registre pour ${newConsult.studentName}.`);
    };

    // Filter logic for medical records
    const filteredRecords = medicalRecords.filter((rec) => {
      const q = medSearch.trim().toLowerCase();
      if (q) {
        const matchName = rec.studentName.toLowerCase().includes(q);
        const matchMat = rec.matricule.toLowerCase().includes(q);
        const matchCond = rec.condition.toLowerCase().includes(q);
        const matchClass = rec.className.toLowerCase().includes(q);
        if (!matchName && !matchMat && !matchCond && !matchClass) return false;
      }
      if (medClassFilter !== 'all' && rec.className !== medClassFilter) return false;
      if (medStatusFilter !== 'all') {
        if (medStatusFilter === 'dispense' && rec.status !== 'dispense_eps') return false;
        if (medStatusFilter === 'surveillance' && rec.status !== 'surveillance') return false;
        if (medStatusFilter === 'chronique' && rec.status !== 'chronique') return false;
        if (medStatusFilter === 'apte' && rec.status !== 'apte') return false;
      }
      return true;
    });

    const totalDispenses = medicalRecords.filter((m) => m.status === 'dispense_eps').length;
    const totalSurveillance = medicalRecords.filter((m) => m.status === 'surveillance' || m.status === 'chronique').length;

    return (
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#96f5ca] text-[#002115] text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[15px]">medical_services</span>
                Service Médico-Scolaire • Infirmerie
              </span>
              <span className="text-[#8d7168]">•</span>
              <span className="text-[12px] text-[#4b5d8f] font-semibold">Année Scolaire 2024 - 2025</span>
              <span className="text-[#8d7168]">•</span>
              <span className="text-[#006c4c] text-[12px] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#006c4c]"></span>
                Permanence Infirmière Ouverte
              </span>
            </div>

            <h1 className="text-[26px] sm:text-[28px] font-extrabold text-[#1b1c1c] tracking-tight">
              Gestion de l'Infirmerie & Santé des Élèves
            </h1>

            <p className="text-[13.5px] text-[#594139] max-w-3xl leading-relaxed">
              Enregistrement des états de santé des apprenants, gestion des fiches d'aptitude et dispenses officielles d'Éducation Physique et Sportive (EPS), signalement des affections chroniques et registre quotidien des soins d'urgence.
            </p>
          </div>

          {/* Nurse Strategic Actions */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setShowAddConsultModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-lg bg-white text-[#4b5d8f] text-[13px] font-bold shadow-sm hover:bg-[#eae7e7]/60 transition-all border border-[#f0eded]"
            >
              <span className="material-symbols-outlined text-[18px]">emergency</span>
              <span>Nouveau Soin / Consultation</span>
            </button>

            <button
              onClick={() => setShowAddMedModal(true)}
              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg bg-[#ff6b35] text-white text-[13px] font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Déclarer État de Santé Élève</span>
            </button>
          </div>
        </div>

        {/* 4 Health Bento KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#8d7168] tracking-wider">
                  Dossiers Médicaux Suivis
                </span>
                <p className="text-[28px] font-black text-[#1b1c1c] mt-1">
                  {medicalRecords.length} <span className="text-[13px] font-bold text-[#8d7168]">fiches</span>
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#dae1ff] text-[#011848] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">folder_shared</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f0eded] text-[11.5px] text-[#594139] flex justify-between">
              <span>Population scolaire 2nd cycle</span>
              <span className="text-[#006c4c] font-bold">100% recensés</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#8d7168] tracking-wider">
                  Dispenses EPS Validées
                </span>
                <p className="text-[28px] font-black text-[#ba1a1a] mt-1">
                  {totalDispenses} <span className="text-[13px] font-bold text-[#8d7168]">inaptitudes</span>
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">sports_handball</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f0eded] text-[11.5px] text-[#ba1a1a] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>Transmises aux profs d'EPS</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#8d7168] tracking-wider">
                  Élèves à Vigilance Particulière
                </span>
                <p className="text-[28px] font-black text-[#ab3500] mt-1">
                  {totalSurveillance} <span className="text-[13px] font-bold text-[#8d7168]">cas</span>
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#ffdbd0] text-[#ab3500] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">warning_amber</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f0eded] text-[11.5px] text-[#8d7168]">
              Asthme, Drépanocytose, Allergies sévères
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#8d7168] tracking-wider">
                  Consultations du Mois
                </span>
                <p className="text-[28px] font-black text-[#006c4c] mt-1">
                  {consultations.length} <span className="text-[13px] font-bold text-[#8d7168]">passages</span>
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#96f5ca] text-[#002115] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f0eded] text-[11.5px] text-[#006c4c] font-semibold">
              Registre officiel à jour
            </div>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#f0eded]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setNurseTab('dossiers')}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-1.5 ${
                  nurseTab === 'dossiers'
                    ? 'bg-[#ff6b35] text-white shadow-sm'
                    : 'bg-[#f6f3f2] text-[#594139] hover:bg-[#eae7e7]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
                <span>Fiches Médicales des Élèves ({medicalRecords.length})</span>
              </button>

              <button
                onClick={() => setNurseTab('consultations')}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-1.5 ${
                  nurseTab === 'consultations'
                    ? 'bg-[#ff6b35] text-white shadow-sm'
                    : 'bg-[#f6f3f2] text-[#594139] hover:bg-[#eae7e7]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span>Registre Quotidien des Soins ({consultations.length})</span>
              </button>

              <button
                onClick={() => setNurseTab('dispenses')}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-1.5 ${
                  nurseTab === 'dispenses'
                    ? 'bg-[#ff6b35] text-white shadow-sm'
                    : 'bg-[#f6f3f2] text-[#594139] hover:bg-[#eae7e7]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">sports_kabaddi</span>
                <span>Dispenses d'EPS ({totalDispenses})</span>
              </button>

              <button
                onClick={() => setNurseTab('pharmacie')}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-bold transition-all flex items-center gap-1.5 ${
                  nurseTab === 'pharmacie'
                    ? 'bg-[#ff6b35] text-white shadow-sm'
                    : 'bg-[#f6f3f2] text-[#594139] hover:bg-[#eae7e7]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">medication</span>
                <span>Pharmacie & Équipements</span>
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#4b5d8f] text-[12px] font-bold flex items-center gap-1 border border-[#f0eded]"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimer État Sanitaire</span>
            </button>
          </div>

          {/* Filters for medical dossiers */}
          {nurseTab === 'dossiers' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8d7168] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={medSearch}
                  onChange={(e) => setMedSearch(e.target.value)}
                  placeholder="Rechercher élève, matricule, affection, allergie..."
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#f6f3f2] text-[12.5px] text-[#1b1c1c] placeholder:text-[#8d7168] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff6b35]"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={medClassFilter}
                  onChange={(e) => setMedClassFilter(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[12px] text-[#1b1c1c] focus:outline-none"
                >
                  <option value="all">Classe : Toutes</option>
                  <option value="Terminale C">Terminale C</option>
                  <option value="Terminale D">Terminale D</option>
                  <option value="Terminale TI">Terminale TI</option>
                  <option value="Terminale A4">Terminale A4</option>
                  <option value="1ère C">1ère C</option>
                  <option value="1ère D1">1ère D1</option>
                  <option value="2nde C1">2nde C1</option>
                </select>

                <select
                  value={medStatusFilter}
                  onChange={(e) => setMedStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[12px] text-[#1b1c1c] focus:outline-none"
                >
                  <option value="all">Statut : Tous</option>
                  <option value="dispense">Dispense EPS</option>
                  <option value="surveillance">Sous Surveillance</option>
                  <option value="chronique">Affection Chronique</option>
                  <option value="apte">Apte RAS</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: DOSSIERS MÉDICAUX */}
        {nurseTab === 'dossiers' && (
          <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr className="bg-[#f6f3f2] text-[#594139] uppercase text-[10.5px] font-extrabold tracking-wider border-b border-[#f0eded]">
                    <th className="py-3 px-4 font-bold">Élève & Matricule</th>
                    <th className="py-3 px-3 font-bold">Classe</th>
                    <th className="py-3 px-3 font-bold text-center">Groupe Sang.</th>
                    <th className="py-3 px-4 font-bold">État / Affection Déclarée</th>
                    <th className="py-3 px-3 font-bold">Aptitude EPS</th>
                    <th className="py-3 px-4 font-bold">Prise en Charge / Conduite</th>
                    <th className="py-3 px-3 font-bold">Urgences Parents</th>
                    <th className="py-3 px-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eded] text-[#1b1c1c]">
                  {filteredRecords.map((m) => (
                    <tr key={m.id} className="hover:bg-[#f6f3f2]/60">
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[13px] text-[#1b1c1c]">
                            {m.studentName}
                          </span>
                          <span className="text-[10.5px] text-[#8d7168] font-mono">
                            {m.matricule} • {m.age} ans
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#dae1ff] text-[#011848] text-[11px] font-bold">
                          {m.className}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-bold text-[11px]">
                          {m.bloodGroup}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1b1c1c]">{m.condition}</span>
                          {m.allergies && m.allergies !== 'Aucune' && (
                            <span className="text-[11px] text-[#ba1a1a] font-semibold">
                              Allergie : {m.allergies}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            m.epsStatus.includes('Dispense')
                              ? 'bg-[#ffdad6] text-[#ba1a1a]'
                              : 'bg-[#96f5ca] text-[#002115]'
                          }`}
                        >
                          {m.epsStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[11.5px] text-[#594139] max-w-xs leading-snug">
                          {m.nurseAction}
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11.5px] text-[#4b5d8f] font-semibold">
                          {m.parentPhone}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() =>
                            alert(`Fiche médicale complète de ${m.studentName} :\n- Pathologie : ${m.condition}\n- Allergies : ${m.allergies}\n- Groupe sanguin : ${m.bloodGroup}\n- Statut EPS : ${m.epsStatus}\n- Contact parents : ${m.parentPhone}`)
                          }
                          className="p-1 text-[#4b5d8f] hover:text-[#1b1c1c]"
                          title="Voir fiche complète"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: REGISTRE DES CONSULTATIONS */}
        {nurseTab === 'consultations' && (
          <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] overflow-hidden">
            <div className="p-4 border-b border-[#f0eded] bg-[#fcf9f8] flex items-center justify-between">
              <span className="font-bold text-[14px] text-[#1b1c1c]">
                Cahier des Entrées & Soins Administrés à l'Infirmerie
              </span>
              <button
                onClick={() => setShowAddConsultModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#ff6b35] text-white text-[11.5px] font-bold"
              >
                + Ajouter une entrée
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px] border-collapse">
                <thead>
                  <tr className="bg-[#f6f3f2] text-[#594139] uppercase text-[10.5px] font-extrabold border-b border-[#f0eded]">
                    <th className="py-3 px-4 font-bold">Date & Heure</th>
                    <th className="py-3 px-4 font-bold">Élève & Classe</th>
                    <th className="py-3 px-4 font-bold">Motif de Consultation / Symptômes</th>
                    <th className="py-3 px-4 font-bold">Traitement & Soins Administrés</th>
                    <th className="py-3 px-4 font-bold">Décision Infirmière</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0eded] text-[#1b1c1c]">
                  {consultations.map((c) => (
                    <tr key={c.id} className="hover:bg-[#f6f3f2]/50">
                      <td className="py-3 px-4 font-mono text-[11.5px] text-[#8d7168]">
                        {c.date} • {c.time}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#1b1c1c] block">{c.studentName}</span>
                        <span className="text-[11px] text-[#4b5d8f]">{c.className}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#1b1c1c]">{c.motif}</td>
                      <td className="py-3 px-4 text-[#594139]">{c.treatment}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            c.decision === 'Retour en classe'
                              ? 'bg-[#96f5ca] text-[#002115]'
                              : c.decision === 'Repos infirmerie'
                              ? 'bg-[#dae1ff] text-[#011848]'
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}
                        >
                          {c.decision}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DISPENSES EPS */}
        {nurseTab === 'dispenses' && (
          <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eded]">
              <div>
                <h3 className="font-bold text-[16px] text-[#1b1c1c]">
                  Relevé des Inaptitudes et Dispenses d'Éducation Physique (EPS)
                </h3>
                <p className="text-[12px] text-[#8d7168]">
                  Certificats médicaux homologués par le Service de Santé Scolaire et transmis à la Censure.
                </p>
              </div>
              <button
                onClick={() => alert("Bordereau officiel de dispense EPS transmis à la Censure et aux professeurs d'EPS.")}
                className="px-4 py-2 rounded-lg bg-[#006c4c] text-white text-[12px] font-bold shadow-sm"
              >
                Transmettre Bordereau au Censeur
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {medicalRecords
                .filter((m) => m.status === 'dispense_eps')
                .map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-xl border border-[#ffdad6] bg-[#ffdad6]/20 flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-[14px] text-[#1b1c1c] block">
                          {d.studentName}
                        </span>
                        <span className="text-[11.5px] text-[#4b5d8f] font-semibold">
                          Classe : {d.className} • Matricule : {d.matricule}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[10.5px] font-bold">
                        {d.epsStatus}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#594139]">
                      <p><strong>Diagnostic :</strong> {d.condition}</p>
                      <p><strong>Conduite :</strong> {d.nurseAction}</p>
                    </div>
                    <div className="pt-2 border-t border-[#ffdad6]/60 flex items-center justify-between text-[11px] text-[#8d7168]">
                      <span>Certificat médical déposé le {d.lastVisitDate}</span>
                      <span className="text-[#006c4c] font-bold">✓ Homologué Infirmière</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: PHARMACIE */}
        {nurseTab === 'pharmacie' && (
          <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-5 flex flex-col gap-4">
            <h3 className="font-bold text-[16px] text-[#1b1c1c]">
              Inventaire de la Trousse d'Urgence & Matériel de Soins
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#f0eded]">
                <span className="text-[11px] font-bold uppercase text-[#8d7168]">Antalgiques & Antipyrétiques</span>
                <p className="text-[18px] font-bold text-[#1b1c1c] mt-1">Paracétamol 500mg/1g</p>
                <span className="text-[11px] text-[#006c4c] font-bold">Stock satisfaisant (8 boîtes)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#f0eded]">
                <span className="text-[11px] font-bold uppercase text-[#8d7168]">Urgences Respiratoires</span>
                <p className="text-[18px] font-bold text-[#1b1c1c] mt-1">Aérosols Salbutamol (Ventoline)</p>
                <span className="text-[11px] text-[#006c4c] font-bold">2 flacons neufs en réserve</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f6f3f2] border border-[#f0eded]">
                <span className="text-[11px] font-bold uppercase text-[#8d7168]">Pansements & Traumatologie</span>
                <p className="text-[18px] font-bold text-[#1b1c1c] mt-1">Bétadine, compresses, bandes</p>
                <span className="text-[11px] text-[#006c4c] font-bold">Kit complet opérationnel</span>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: DÉCLARER ÉTAT DE SANTÉ ÉLÈVE */}
        {showAddMedModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-5 border-b border-[#f0eded] bg-[#fcf9f8]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ff6b35] text-[22px]">
                    medical_services
                  </span>
                  <h2 className="text-[16px] font-bold text-[#1b1c1c]">
                    Déclarer l'État de Santé d'un Élève
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddMedModal(false)}
                  className="p-1 text-[#8d7168] hover:text-[#1b1c1c]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddRecordSubmit} className="p-6 overflow-y-auto flex flex-col gap-4 text-[13px]">
                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Nom & Prénom de l'élève
                  </label>
                  <input
                    type="text"
                    required
                    value={newMedStudent}
                    onChange={(e) => setNewMedStudent(e.target.value)}
                    placeholder="Ex: TCHANA Michelle Marie"
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff6b35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                      Classe
                    </label>
                    <select
                      value={newMedClass}
                      onChange={(e) => setNewMedClass(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                    >
                      {CLASSES_LIST.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                      Groupe Sanguin
                    </label>
                    <select
                      value={newMedBlood}
                      onChange={(e) => setNewMedBlood(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Affection / Pathologie déclarée
                  </label>
                  <input
                    type="text"
                    required
                    value={newMedCondition}
                    onChange={(e) => setNewMedCondition(e.target.value)}
                    placeholder="Ex: Asthme d'effort, Drépanocytose, Cardiaque, Lunettes..."
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff6b35]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Allergies connues (Médicaments, aliments, piqûres)
                  </label>
                  <input
                    type="text"
                    value={newMedAllergies}
                    onChange={(e) => setNewMedAllergies(e.target.value)}
                    placeholder="Ex: Pénicilline, Arachides, Poussière..."
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#ff6b35]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                      Statut de Suivi
                    </label>
                    <select
                      value={newMedStatus}
                      onChange={(e) => setNewMedStatus(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                    >
                      <option value="surveillance">Sous Surveillance</option>
                      <option value="dispense_eps">Dispense EPS</option>
                      <option value="chronique">Affection Chronique</option>
                      <option value="apte">Apte Ordinaire</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                      Aptitude Sportive EPS
                    </label>
                    <select
                      value={newMedEps}
                      onChange={(e) => setNewMedEps(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                    >
                      <option value="Apte">Apte</option>
                      <option value="Dispense Partielle">Dispense Partielle</option>
                      <option value="Dispense Totale">Dispense Totale</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Téléphone des Parents (Urgence)
                  </label>
                  <input
                    type="text"
                    required
                    value={newMedParentPhone}
                    onChange={(e) => setNewMedParentPhone(e.target.value)}
                    placeholder="69X XX XX XX"
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0eded]">
                  <button
                    type="button"
                    onClick={() => setShowAddMedModal(false)}
                    className="px-4 py-2 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold hover:bg-[#e5e2e1]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#ff6b35] text-white font-bold hover:brightness-105 shadow"
                  >
                    Enregistrer la Fiche
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: NOUVELLE CONSULTATION / PASSAGE */}
        {showAddConsultModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-5 border-b border-[#f0eded] bg-[#fcf9f8]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4b5d8f] text-[22px]">
                    emergency
                  </span>
                  <h2 className="text-[16px] font-bold text-[#1b1c1c]">
                    Enregistrer un Passage à l'Infirmerie
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddConsultModal(false)}
                  className="p-1 text-[#8d7168] hover:text-[#1b1c1c]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddConsultSubmit} className="p-6 overflow-y-auto flex flex-col gap-4 text-[13px]">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                      Nom de l'élève
                    </label>
                    <input
                      type="text"
                      required
                      value={newConsultStudent}
                      onChange={(e) => setNewConsultStudent(e.target.value)}
                      placeholder="Nom de l'élève..."
                      className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                      Classe
                    </label>
                    <select
                      value={newConsultClass}
                      onChange={(e) => setNewConsultClass(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                    >
                      {CLASSES_LIST.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Motif de Consultation / Symptômes constatés
                  </label>
                  <input
                    type="text"
                    required
                    value={newConsultMotif}
                    onChange={(e) => setNewConsultMotif(e.target.value)}
                    placeholder="Ex: Malaise en cours de Maths, blessure EPS, céphalées fébriles..."
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Soins & Traitement administré
                  </label>
                  <textarea
                    rows={2}
                    value={newConsultTreatment}
                    onChange={(e) => setNewConsultTreatment(e.target.value)}
                    placeholder="Ex: Paracétamol 500mg, repos 30 min, pansement désinfectant Bétadine..."
                    className="w-full p-3 rounded-lg bg-[#f6f3f2] text-[#1b1c1c] focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8d7168] uppercase mb-1">
                    Décision de l'Infirmière
                  </label>
                  <select
                    value={newConsultDecision}
                    onChange={(e) => setNewConsultDecision(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg bg-[#f6f3f2] font-semibold text-[#1b1c1c] focus:outline-none"
                  >
                    <option value="Retour en classe">Retour en classe (Élève rétabli)</option>
                    <option value="Repos infirmerie">Repos en chambre d'infirmerie</option>
                    <option value="Appel parents">Appel téléphonique des parents</option>
                    <option value="Évacuation hôpital">Évacuation d'urgence (Hôpital / CMA)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0eded]">
                  <button
                    type="button"
                    onClick={() => setShowAddConsultModal(false)}
                    className="px-4 py-2 rounded-lg bg-[#eae7e7] text-[#1b1c1c] font-bold hover:bg-[#e5e2e1]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#4b5d8f] text-white font-bold hover:brightness-110 shadow"
                  >
                    Consigner au Registre
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
     5. CLASSES & MATIÈRES VIEW
     ========================================================= */
  if (currentScreen === 'classes-et-matieres') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold uppercase">
              Structure Académique
            </span>
            <span className="text-[#8d7168]">•</span>
            <span className="text-[12px] text-[#4b5d8f] font-semibold">Secondaire & Technique</span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c]">
            Répertoire des Classes & Matières APC
          </h1>
          <p className="text-[13.5px] text-[#594139]">
            Effectifs des élèves par division, professeurs principaux désignés et volumes hebdomadaires requis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLASSES_LIST.map((cls) => (
            <div
              key={cls.id}
              className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[17px] font-extrabold text-[#1b1c1c]">{cls.name}</h3>
                  <span className="text-[11.5px] text-[#4b5d8f] font-semibold">{cls.stream}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold">
                  {cls.headcount} élèves
                </span>
              </div>

              <div className="flex flex-col gap-1.5 text-[12px] text-[#594139] py-2 border-y border-[#f0eded]">
                <div className="flex justify-between">
                  <span className="text-[#8d7168]">Professeur Principal (PP) :</span>
                  <span className="font-bold text-[#1b1c1c]">{cls.pp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8d7168]">Volume hebdomadaire :</span>
                  <span className="font-bold text-[#006c4c]">{cls.hoursTotal}h / semaine</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11.5px] text-[#8d7168]">
                <span>12 disciplines dispensées</span>
                <span className="text-[#006c4c] font-bold">✓ Équipe complète</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     4. EMPLOIS DU TEMPS VIEW
     ========================================================= */
  if (currentScreen === 'emplois-du-temps') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold uppercase">
              Grilles Pédagogiques
            </span>
            <span className="text-[#8d7168]">•</span>
            <span className="text-[12px] text-[#4b5d8f] font-semibold">Semaine Type 2024-2025</span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c]">
            Emplois du Temps Hebdomadaires
          </h1>
          <p className="text-[13.5px] text-[#594139]">
            Visualisation des créneaux de cours par classe et occupation des salles spécialisées (Laboratoires, Salles Info).
          </p>
        </div>

        {/* Schedule grid preview */}
        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#8d7168] uppercase">Classe sélectionnée :</span>
              <select className="px-3 py-1.5 rounded-lg bg-[#f6f3f2] font-bold text-[#1b1c1c] text-[13px]">
                <option>Terminale TI (Technologies de l'Info)</option>
                <option>Terminale C (Scientifique)</option>
                <option>Terminale D (SVT)</option>
                <option>Terminale A4 (Littéraire)</option>
              </select>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-[#4b5d8f] text-[12px] font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimer Grille Hebdo</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-[12px]">
              <thead>
                <tr className="bg-[#f6f3f2] text-[#1b1c1c] font-bold uppercase text-[11px]">
                  <th className="p-3 border border-[#f0eded]">Horaires</th>
                  <th className="p-3 border border-[#f0eded]">Lundi</th>
                  <th className="p-3 border border-[#f0eded]">Mardi</th>
                  <th className="p-3 border border-[#f0eded]">Mercredi</th>
                  <th className="p-3 border border-[#f0eded]">Jeudi</th>
                  <th className="p-3 border border-[#f0eded]">Vendredi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2.5 font-bold border border-[#f0eded] bg-[#fcf9f8]">07h30 - 09h30</td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#dae1ff]/30">
                    <span className="font-bold block text-[#011848]">Informatique & Algorithmique</span>
                    <span className="text-[10px] text-[#4b5d8f]">M. TOURE Moussa (Labo 1)</span>
                  </td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#96f5ca]/20">
                    <span className="font-bold block text-[#002115]">Mathématiques</span>
                    <span className="text-[10px] text-[#006c4c]">Mme NDONGO Jeanne</span>
                  </td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#ffdbd0]/30">
                    <span className="font-bold block text-[#832600]">Sciences Physiques</span>
                    <span className="text-[10px] text-[#ab3500]">M. EKWALLA Jean</span>
                  </td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#dae1ff]/30">
                    <span className="font-bold block text-[#011848]">Bases de Données (TP)</span>
                    <span className="text-[10px] text-[#4b5d8f]">M. TOURE Moussa</span>
                  </td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#f6f3f2]">
                    <span className="font-bold block text-[#1b1c1c]">Philosophie</span>
                    <span className="text-[10px] text-[#8d7168]">M. KAMGA Patrick</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-[#f0eded] bg-[#fcf9f8]">09h45 - 11h45</td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#96f5ca]/20">
                    <span className="font-bold block text-[#002115]">Mathématiques (Analyse)</span>
                    <span className="text-[10px] text-[#006c4c]">Mme NDONGO Jeanne</span>
                  </td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#f6f3f2]">
                    <span className="font-bold block text-[#1b1c1c]">Anglais Technique</span>
                    <span className="text-[10px] text-[#8d7168]">Mme TIENTCHEU Carine</span>
                  </td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#dae1ff]/30">
                    <span className="font-bold block text-[#011848]">Systèmes & Réseaux</span>
                    <span className="text-[10px] text-[#4b5d8f]">M. TOURE Moussa</span>
                  </td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#f6f3f2]">
                    <span className="font-bold block text-[#1b1c1c]">Français & Communication</span>
                    <span className="text-[10px] text-[#8d7168]">Mme ESSOMBA</span>
                  </td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#96f5ca]/20">
                    <span className="font-bold block text-[#002115]">SVT & Écologie</span>
                    <span className="text-[10px] text-[#006c4c]">Dr. FOTSO Emmanuel</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-bold border border-[#f0eded] bg-[#eae7e7] text-[10px]" colSpan={6}>
                    PAUSE DE MIDI (11h45 - 12h30)
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold border border-[#f0eded] bg-[#fcf9f8]">12h30 - 15h30</td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#f6f3f2]">
                    <span className="font-bold block text-[#1b1c1c]">Histoire-Géographie</span>
                    <span className="text-[10px] text-[#8d7168]">M. BIYA Armand</span>
                  </td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#dae1ff]/30">
                    <span className="font-bold block text-[#011848]">Programmation Web / BD</span>
                    <span className="text-[10px] text-[#4b5d8f]">M. TOURE Moussa</span>
                  </td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#96f5ca]/20">
                    <span className="font-bold block text-[#002115]">Éducation Civique (ECM)</span>
                    <span className="text-[10px] text-[#006c4c]">M. BIYA Armand</span>
                  </td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#ffdbd0]/30">
                    <span className="font-bold block text-[#832600]">TP Électricité & Physique</span>
                    <span className="text-[10px] text-[#ab3500]">M. EKWALLA Jean</span>
                  </td>
                  <td className="p-2.5 border border-[#f0eded] bg-[#f6f3f2]">
                    <span className="font-bold block text-[#1b1c1c]">EPS / Sport</span>
                    <span className="text-[10px] text-[#8d7168]">Stade Omnisports</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     5. VALIDATION ÉVALUATIONS VIEW
     ========================================================= */
  if (currentScreen === 'validation-evaluations') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-bold uppercase">
              3 Épreuves en attente de visa
            </span>
            <span className="text-[#8d7168]">•</span>
            <span className="text-[12px] text-[#4b5d8f] font-semibold">Devoirs Harmonisés T1</span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c]">
            Validation & Visa des Épreuves Pédagogiques
          </h1>
          <p className="text-[13.5px] text-[#594139]">
            Examen de conformité des sujets avec le référentiel des compétences MINESEC et barèmes de notation.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#dae1ff] text-[#011848] flex items-center justify-center font-bold">
                PH
              </div>
              <div>
                <h3 className="font-bold text-[14.5px] text-[#1b1c1c]">
                  Sciences Physiques & Chimie - Terminale D (Épreuve Harmonisée N°1)
                </h3>
                <span className="text-[12px] text-[#8d7168]">
                  Proposée par M. EKWALLA Jean • Soumise le 12/11/2024
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-[12px] font-bold text-[#4b5d8f]">
                Examiner le sujet
              </button>
              <button className="px-3.5 py-1.5 rounded-lg bg-[#006c4c] text-white text-[12px] font-bold hover:brightness-105 shadow-sm">
                Apposer le Visa
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#dae1ff] text-[#011848] flex items-center justify-center font-bold">
                EN
              </div>
              <div>
                <h3 className="font-bold text-[14.5px] text-[#1b1c1c]">
                  English Language - 1ère TI & C (Written & Oral Comprehension)
                </h3>
                <span className="text-[12px] text-[#8d7168]">
                  Proposée par Mme TIENTCHEU Carine • Soumise le 13/11/2024
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-[12px] font-bold text-[#4b5d8f]">
                Examiner le sujet
              </button>
              <button className="px-3.5 py-1.5 rounded-lg bg-[#006c4c] text-white text-[12px] font-bold hover:brightness-105 shadow-sm">
                Apposer le Visa
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#dae1ff] text-[#011848] flex items-center justify-center font-bold">
                PH
              </div>
              <div>
                <h3 className="font-bold text-[14.5px] text-[#1b1c1c]">
                  Philosophie - Terminale A4 (Dissertation & Commentaire de Texte)
                </h3>
                <span className="text-[12px] text-[#8d7168]">
                  Proposée par M. KAMGA Patrick • Soumise le 14/11/2024
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-[12px] font-bold text-[#4b5d8f]">
                Examiner le sujet
              </button>
              <button className="px-3.5 py-1.5 rounded-lg bg-[#006c4c] text-white text-[12px] font-bold hover:brightness-105 shadow-sm">
                Apposer le Visa
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     6. VISAS CAHIERS DE TEXTE VIEW
     ========================================================= */
  if (currentScreen === 'visas-cahiers-de-texte') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold uppercase">
              12 Visas en cours cette quinzaine
            </span>
            <span className="text-[#8d7168]">•</span>
            <span className="text-[12px] text-[#4b5d8f] font-semibold">APC & Projets Pédagogiques</span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c]">
            Visas Hebdomadaires des Cahiers de Texte
          </h1>
          <p className="text-[13.5px] text-[#594139]">
            Contrôle de la conformité du remplissage des cahiers de textes physiques et numériques par les enseignants.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0eded]">
            <span className="font-bold text-[14px] text-[#1b1c1c]">
              Progression Pédagogique Globale : 84.5% des cours programmés exécutés
            </span>
            <span className="text-[12px] text-[#006c4c] font-bold">38 visés / 48</span>
          </div>

          <div className="flex flex-col gap-2">
            {teachers.slice(0, 6).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#f6f3f2] text-[12.5px]"
              >
                <div>
                  <span className="font-bold text-[#1b1c1c] block">{t.name}</span>
                  <span className="text-[#8d7168]">
                    {t.departmentLabel} • Classes : {t.classes.map((c) => c.name).join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11.5px] text-[#006c4c] font-bold">
                    {t.pedagogicalFollowUp.textbookStatus}
                  </span>
                  <button className="px-3 py-1 rounded-lg bg-[#4b5d8f] text-white text-[11px] font-bold">
                    Viser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     7. SUPERVISION DES NOTES VIEW
     ========================================================= */
  if (currentScreen === 'supervision-des-notes') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#96f5ca] text-[#002115] text-[11px] font-bold uppercase">
              Taux de saisie : 91.6%
            </span>
            <span className="text-[#8d7168]">•</span>
            <span className="text-[12px] text-[#4b5d8f] font-semibold">Trimestre 1 (Clôture)</span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c]">
            Supervision & Contrôle de Saisie des Notes
          </h1>
          <p className="text-[13.5px] text-[#594139]">
            Suivi en temps réel du dépôt des notes de contrôles continus et devoirs harmonisés avant édition des bulletins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-[15px] text-[#1b1c1c]">
              État des 4 Enseignants en Retard de Saisie
            </h3>
            <p className="text-[12px] text-[#8d7168]">
              Ces fiches bloquent le calcul des moyennes générales de Terminale et 1ère.
            </p>
            <div className="flex flex-col gap-2 mt-1">
              {teachers
                .filter((t) => t.pedagogicalFollowUp.notesT1Status === 'late')
                .map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-lg bg-[#ffdad6]/30 flex items-center justify-between text-[12px]"
                  >
                    <div>
                      <span className="font-bold text-[#ba1a1a] block">{t.name}</span>
                      <span className="text-[#594139]">{t.departmentLabel} • {t.pedagogicalFollowUp.notesT1Label}</span>
                    </div>
                    <span className="text-[#ba1a1a] font-bold text-[11px]">
                      {t.phone}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-[15px] text-[#1b1c1c]">
                Calendrier des Conseils de Classe
              </h3>
              <p className="text-[12px] text-[#8d7168] mt-1">
                Ouverture des délibérations à compter du lundi 18 novembre 2024.
              </p>
              <div className="mt-3 flex flex-col gap-2 text-[12px]">
                <div className="p-2.5 rounded-lg bg-[#f6f3f2] flex justify-between">
                  <span className="font-bold">Terminale C & D</span>
                  <span className="text-[#006c4c] font-semibold">Lundi 18 Nov • 14h00</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#f6f3f2] flex justify-between">
                  <span className="font-bold">Terminale TI & F4</span>
                  <span className="text-[#006c4c] font-semibold">Mardi 19 Nov • 14h00</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#f6f3f2] flex justify-between">
                  <span className="font-bold">Classes de 1ère</span>
                  <span className="text-[#4b5d8f] font-semibold">Mercredi 20 Nov • 14h00</span>
                </div>
              </div>
            </div>
            <button
              onClick={onNavigateToTeacher}
              className="mt-4 w-full py-2.5 rounded-lg bg-[#ff6b35] text-white text-[12.5px] font-bold shadow-sm"
            >
              Voir le Répertoire des Enseignants
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     8. MOYENNES & CONSEILS VIEW
     ========================================================= */
  if (currentScreen === 'moyennes-et-conseils') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold uppercase">
              Délibérations Officielles
            </span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c]">
            Moyennes, Délibérations & Conseils de Classe
          </h1>
          <p className="text-[13.5px] text-[#594139]">
            Traitement des moyennes trimestrielles selon les coefficients officiels MINESEC et attribution des distinctions.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-5 flex flex-col gap-4">
          <span className="font-bold text-[15px] text-[#1b1c1c]">
            Synthèse Préparatoire aux Conseils (Trimestre 1)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-[#96f5ca]/20 border border-[#96f5ca]">
              <span className="text-[11px] font-bold text-[#002115] uppercase">Moyenne Générale Estimée</span>
              <p className="text-[24px] font-black text-[#006c4c] mt-1">12.45 / 20</p>
              <span className="text-[11px] text-[#006c4c] font-semibold">+0.6 pt vs T1 2023</span>
            </div>
            <div className="p-4 rounded-xl bg-[#dae1ff]/30 border border-[#dae1ff]">
              <span className="text-[11px] font-bold text-[#011848] uppercase">Taux de Réussite (&ge;10/20)</span>
              <p className="text-[24px] font-black text-[#4b5d8f] mt-1">74.2%</p>
              <span className="text-[11px] text-[#4b5d8f] font-semibold">362 élèves sur 488</span>
            </div>
            <div className="p-4 rounded-xl bg-[#ffdbd0]/30 border border-[#ffdbd0]">
              <span className="text-[11px] font-bold text-[#832600] uppercase">Tableau d'Honneur</span>
              <p className="text-[24px] font-black text-[#ab3500] mt-1">84 Élèves</p>
              <span className="text-[11px] text-[#ab3500] font-semibold">Moyenne &ge; 14/20</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     9. RAPPORTS & PALMARÈS VIEW
     ========================================================= */
  if (currentScreen === 'rapports-et-palmares') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold uppercase">
              Rapports Institutionnels
            </span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c]">
            Rapports Pédagogiques & Palmarès Trimestriel
          </h1>
          <p className="text-[13.5px] text-[#594139]">
            Documents de synthèse à destination de la Délégation Départementale et Régionale du MINESEC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-[15px] text-[#1b1c1c]">
                Palmarès d'Excellence du 2nd Cycle (T1)
              </h3>
              <p className="text-[12px] text-[#8d7168] mt-1">
                Liste des majors de promotion par série (C, D, TI, A4).
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="mt-4 px-4 py-2 rounded-lg bg-[#4b5d8f] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Imprimer le Palmarès Officiel</span>
            </button>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#f0eded] shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-[15px] text-[#1b1c1c]">
                Rapport Statistique Global MINESEC
              </h3>
              <p className="text-[12px] text-[#8d7168] mt-1">
                Rapport d'activité trimestriel du Censeur avec taux de couverture des cours et fiches d'assiduité.
              </p>
            </div>
            <button
              onClick={() => alert("Génération du rapport statistique MINESEC en cours...")}
              className="mt-4 px-4 py-2 rounded-lg bg-[#006c4c] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Générer le Rapport Statistique (.PDF)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     10. PARAMÈTRES PÉDAGOGIQUES VIEW
     ========================================================= */
  if (currentScreen === 'parametres-pedagogiques') {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold uppercase">
              Configuration de la Censure
            </span>
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1b1c1c]">
            Paramètres Pédagogiques & Coefficients
          </h1>
          <p className="text-[13.5px] text-[#594139]">
            Configuration des grilles de coefficients APC, plafonds horaires statutaires et règles de décharge ministérielle.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-5 flex flex-col gap-4 text-[13px]">
          <div className="p-3.5 rounded-lg bg-[#f6f3f2] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#1b1c1c] block">Année Scolaire en Cours</span>
              <span className="text-[11.5px] text-[#8d7168]">Découpage en 3 trimestres et 6 séquences harmonisées</span>
            </div>
            <span className="font-bold text-[#4b5d8f]">2024 - 2025</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#f6f3f2] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#1b1c1c] block">Quota Horaire Statutaire PLEG (Professeur Certifié)</span>
              <span className="text-[11.5px] text-[#8d7168]">Volume hebdomadaire réglementaire avant heures supplémentaires</span>
            </div>
            <span className="font-bold text-[#006c4c]">18 heures / semaine</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#f6f3f2] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#1b1c1c] block">Décharge pour Chef de Département</span>
              <span className="text-[11.5px] text-[#8d7168]">Crédit d'heures accordé pour animation et coordination</span>
            </div>
            <span className="font-bold text-[#006c4c]">2 heures / semaine</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#f6f3f2] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#1b1c1c] block">Plafond Forfaitaire Vacataires</span>
              <span className="text-[11.5px] text-[#8d7168]">Volume maximal pour enseignants d'appoint</span>
            </div>
            <span className="font-bold text-[#4b5d8f]">12 heures / semaine</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
