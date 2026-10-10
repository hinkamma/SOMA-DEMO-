export type TeacherStatus = 'pleg' | 'vac' | 'pp' | 'chef';

export interface TeacherClass {
  name: string;
  isPP?: boolean; // Professeur Principal
  note?: string; // e.g. '(TD)'
}

export interface TimetableSlot {
  className: string;
  role?: string;
  subjectTitle: string;
  hoursPerWeek: number;
}

export interface EvaluationRecord {
  title: string;
  status: 'validated' | 'pending' | 'late';
  date?: string;
}

export interface Teacher {
  id: string;
  name: string;
  gender: 'M.' | 'Mme' | 'Dr.';
  matricule: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  initials: string;
  departmentId: 'info' | 'math' | 'phys' | 'svt' | 'lettres' | 'philo' | 'histoire' | 'anglais';
  departmentLabel: string;
  grade: string;
  status: TeacherStatus;
  isChefDept?: boolean;
  classes: TeacherClass[];
  assignedHours: number;
  quotaHours: number;
  quotaStatus: 'normal' | 'overtime' | 'under';
  quotaNote?: string;
  pedagogicalFollowUp: {
    notesT1Status: 'valid' | 'pending' | 'late';
    notesT1Label: string;
    textbookStatus: string;
    lastReminderSent?: string;
  };
  timetableSchedule: TimetableSlot[];
  evaluationJournal: EvaluationRecord[];
  seniorityYears: number;
}

export type NavScreenId =
  | 'tableau-de-bord'
  | 'corps-enseignant'
  | 'affectations-et-charges'
  | 'surveillance-discipline'
  | 'gestion-eleves'
  | 'frais-scolarite-apee'
  | 'intendance-finances'
  | 'infirmerie-sante'
  | 'classes-et-matieres'
  | 'emplois-du-temps'
  | 'validation-evaluations'
  | 'visas-cahiers-de-texte'
  | 'supervision-des-notes'
  | 'moyennes-et-conseils'
  | 'rapports-et-palmares'
  | 'parametres-pedagogiques';

export interface Student {
  id: string;
  name: string;
  matricule: string;
  className: string;
  gender: 'M' | 'F';
  dob: string;
  pob: string;
  status: 'Nouveau' | 'Ancien' | 'Redoublant';
  parentName: string;
  parentPhone: string;
  tuitionTotal: number;
  tuitionPaid: number;
  tuitionStatus: 'soldé' | 'partiel' | 'insolvable';
  conductScore: number; // Note de conduite sur 20
  unjustifiedAbsencesHours: number;
  sanctionsCount: number;
  bloodGroup?: string;
  photoUrl?: string;
}

export interface AbsenceRecord {
  id: string;
  studentName: string;
  matricule: string;
  className: string;
  date: string;
  hoursCount: number;
  motif: string;
  isJustified: boolean;
  ticketIssued: boolean;
  registeredBy: string;
}

export interface DisciplineSanction {
  id: string;
  studentName: string;
  matricule: string;
  className: string;
  date: string;
  motif: string;
  sanctionType: 'Avertissement' | 'Blâme' | 'Retenue 2h' | 'Exclusion 3 jours' | 'Conseil de discipline';
  status: 'Appliqué' | 'En attente' | 'Levé';
  issuedBy: string;
  pointsDeducted: number;
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  studentName: string;
  matricule: string;
  className: string;
  date: string;
  amount: number;
  paymentMethod: 'Orange Money' | 'MTN MoMo' | 'Espèces / Caisse' | 'Virement / Banque';
  installment: 'Tranche 1' | 'Tranche 2' | 'Solde Complet';
  cashierName: string;
}

export interface MedicalRecord {
  id: string;
  studentName: string;
  matricule: string;
  className: string;
  gender: 'M' | 'F';
  age: number;
  bloodGroup: string;
  condition: string;
  allergies: string;
  status: 'apte' | 'dispense_eps' | 'surveillance' | 'chronique';
  epsStatus: 'Apte' | 'Dispense Partielle' | 'Dispense Totale';
  lastVisitDate: string;
  lastDiagnosis: string;
  nurseAction: string;
  parentPhone: string;
  vaccinesUpdated: boolean;
}

export interface NurseConsultation {
  id: string;
  date: string;
  time: string;
  studentName: string;
  className: string;
  motif: string;
  treatment: string;
  decision: 'Retour en classe' | 'Repos infirmerie' | 'Évacuation hôpital' | 'Appel parents';
}

export interface NotificationItem {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  desc: string;
  time: string;
  read: boolean;
  actionText?: string;
}
