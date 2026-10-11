/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import {
  NavScreenId,
  Teacher,
  NotificationItem,
  Student,
  AbsenceRecord,
  DisciplineSanction,
  PaymentReceipt,
} from './types';
import {
  INITIAL_TEACHERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_STUDENTS,
  INITIAL_ABSENCES,
  INITIAL_SANCTIONS,
  INITIAL_PAYMENTS,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CorpsEnseignantView } from './components/CorpsEnseignantView';
import { SecondaryViews } from './components/SecondaryViews';
import { TeacherProfileDrawer } from './components/TeacherProfileDrawer';
import { AddTeacherModal } from './components/AddTeacherModal';
import { AdjustAssignmentModal } from './components/AdjustAssignmentModal';
import { BatchSmsModal } from './components/BatchSmsModal';
import { ExportMenuModal } from './components/ExportMenuModal';
import { AuditHoursModal } from './components/AuditHoursModal';
import { InspectionDossierModal } from './components/InspectionDossierModal';
import { EmargementModal } from './components/EmargementModal';
import { FaireAppelModal } from './components/FaireAppelModal';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center p-6 text-[#1b1c1c]">
          <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-xl border border-[#f0eded] text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <h2 className="text-[18px] font-bold text-[#1b1c1c]">Une erreur est survenue</h2>
            <p className="text-[13px] text-[#594139]">
              L'application a rencontré un incident passager. Cliquez ci-dessous pour recharger l'interface.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-2 px-5 py-2.5 rounded-lg bg-[#ff6b35] text-white font-bold text-[13px] hover:brightness-105 shadow"
            >
              Recharger SOMA Éducation
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<NavScreenId>('tableau-de-bord');
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [absences, setAbsences] = useState<AbsenceRecord[]>(INITIAL_ABSENCES);
  const [sanctions, setSanctions] = useState<DisciplineSanction[]>(INITIAL_SANCTIONS);
  const [payments, setPayments] = useState<PaymentReceipt[]>(INITIAL_PAYMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals & Drawers state
  const [drawerTeacher, setDrawerTeacher] = useState<Teacher | null>(null);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isBatchSmsOpen, setIsBatchSmsOpen] = useState(false);
  const [smsTargetTeacher, setSmsTargetTeacher] = useState<Teacher | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isEmargementModalOpen, setIsEmargementModalOpen] = useState(false);
  const [isGlobalAppelOpen, setIsGlobalAppelOpen] = useState(false);
  const [globalAppelTeacherId, setGlobalAppelTeacherId] = useState<string | undefined>(undefined);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Add new teacher
  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);
    showToast(`L'enseignant ${newTeacher.name} a été enregistré avec succès dans le corps pédagogique !`);
  };

  // Save adjusted assignments
  const handleSaveAdjustedTeacher = (updated: Teacher) => {
    setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    if (drawerTeacher && drawerTeacher.id === updated.id) {
      setDrawerTeacher(updated);
    }
    showToast(`Les attributions et charges de ${updated.name} ont été mises à jour.`);
  };

  // Add new student
  const handleAddStudent = (newStu: Student) => {
    setStudents((prev) => [newStu, ...prev]);
    showToast(`L'élève ${newStu.name} (${newStu.className}) a été inscrit au répertoire officiel.`);
  };

  // Add new absence
  const handleAddAbsence = (newAbs: AbsenceRecord) => {
    setAbsences((prev) => [newAbs, ...prev]);
    if (!newAbs.isJustified) {
      setStudents((prev) =>
        prev.map((s) =>
          s.name.toLowerCase() === newAbs.studentName.toLowerCase() || s.matricule === newAbs.matricule
            ? {
                ...s,
                unjustifiedAbsencesHours: s.unjustifiedAbsencesHours + newAbs.hoursCount,
                conductScore: Math.max(0, s.conductScore - (newAbs.hoursCount * 0.2)),
              }
            : s
        )
      );
    }
    showToast(`Absence de ${newAbs.studentName} (${newAbs.hoursCount}h) enregistrée.`);
  };

  // Add discipline sanction
  const handleAddSanction = (newSanc: DisciplineSanction) => {
    setSanctions((prev) => [newSanc, ...prev]);
    setStudents((prev) =>
      prev.map((s) =>
        s.name.toLowerCase() === newSanc.studentName.toLowerCase() || s.matricule === newSanc.matricule
          ? {
              ...s,
              sanctionsCount: s.sanctionsCount + 1,
              conductScore: Math.max(0, s.conductScore - newSanc.pointsDeducted),
            }
          : s
      )
    );
    showToast(`Sanction « ${newSanc.sanctionType} » appliquée pour ${newSanc.studentName} (-${newSanc.pointsDeducted} pts).`);
  };

  // Toggle absence justification
  const handleToggleJustified = (absId: string) => {
    setAbsences((prev) =>
      prev.map((a) => {
        if (a.id === absId) {
          const nextJustified = !a.isJustified;
          setStudents((stuPrev) =>
            stuPrev.map((s) =>
              s.name.toLowerCase() === a.studentName.toLowerCase() || s.matricule === a.matricule
                ? {
                    ...s,
                    unjustifiedAbsencesHours: nextJustified
                      ? Math.max(0, s.unjustifiedAbsencesHours - a.hoursCount)
                      : s.unjustifiedAbsencesHours + a.hoursCount,
                    conductScore: nextJustified
                      ? Math.min(20, s.conductScore + a.hoursCount * 0.2)
                      : Math.max(0, s.conductScore - a.hoursCount * 0.2),
                  }
                : s
            )
          );
          return { ...a, isJustified: nextJustified };
        }
        return a;
      })
    );
    showToast('Statut de l’absence actualisé.');
  };

  // Add tuition payment
  const handleAddPayment = (newPayment: PaymentReceipt, updatedStudent: Student) => {
    setPayments((prev) => [newPayment, ...prev]);
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    showToast(`Versement de ${newPayment.amount.toLocaleString('fr-FR')} FCFA validé pour ${updatedStudent.name}.`);
  };

  // Send SMS Relance
  const handleSendSmsRelance = (count: number) => {
    showToast(`${count} SMS de mise en demeure pour impayés de scolarité transmis aux parents.`);
  };

  // Batch or individual SMS confirm
  const handleConfirmSmsSend = (count: number) => {
    showToast(`${count} SMS de relance ministérielle transmis avec succès.`);
  };

  // Open roll call modal for teacher (with strictly their assigned classes)
  const handleOpenAppelForTeacher = (targetTeacher?: Teacher) => {
    setGlobalAppelTeacherId(targetTeacher ? targetTeacher.id : undefined);
    setIsGlobalAppelOpen(true);
  };

  // Process batch roll call results
  const handleBatchAppel = (data: {
    teacher: Teacher;
    className: string;
    subject: string;
    date: string;
    timeSlot: string;
    durationHours: number;
    courseTopic: string;
    notifyParents: boolean;
    records: {
      student: Student;
      status: 'present' | 'absent' | 'retard' | 'infirmerie';
      motif: string;
      lateMinutes?: number;
    }[];
  }) => {
    const newAbsences: AbsenceRecord[] = [];
    let absentsCount = 0;
    let retardsCount = 0;

    data.records.forEach((rec, idx) => {
      if (rec.status === 'absent') {
        absentsCount++;
        newAbsences.push({
          id: `abs-${Date.now()}-${idx}`,
          studentName: rec.student.name,
          matricule: rec.student.matricule,
          className: data.className,
          date: data.date,
          hoursCount: data.durationHours,
          motif: rec.motif || `Absence non motivée constatée à l’appel (${data.subject}, ${data.timeSlot})`,
          isJustified: false,
          ticketIssued: false,
          registeredBy: `${data.teacher.name} (Professeur)`,
        });
      } else if (rec.status === 'retard') {
        retardsCount++;
        newAbsences.push({
          id: `retard-${Date.now()}-${idx}`,
          studentName: rec.student.name,
          matricule: rec.student.matricule,
          className: data.className,
          date: data.date,
          hoursCount: 1,
          motif: `Retard de ${rec.lateMinutes || 15} min au cours de ${data.subject} (${data.timeSlot})`,
          isJustified: false,
          ticketIssued: false,
          registeredBy: `${data.teacher.name} (Professeur)`,
        });
      }
    });

    if (newAbsences.length > 0) {
      setAbsences((prev) => [...newAbsences, ...prev]);

      setStudents((prev) =>
        prev.map((s) => {
          const matchAbs = newAbsences.find(
            (a) => a.studentName.toLowerCase() === s.name.toLowerCase() || a.matricule === s.matricule
          );
          if (matchAbs) {
            return {
              ...s,
              unjustifiedAbsencesHours: s.unjustifiedAbsencesHours + matchAbs.hoursCount,
              conductScore: Math.max(0, s.conductScore - matchAbs.hoursCount * 0.2),
            };
          }
          return s;
        })
      );
    }

    const notifText =
      data.notifyParents && absentsCount > 0
        ? ` • ${absentsCount} notification(s) envoyée(s) aux parents`
        : '';

    showToast(
      `Appel de ${data.className} validé par ${data.teacher.name} (${absentsCount} absent(s), ${retardsCount} retard(s))${notifText}.`
    );
  };

  // Notification action click
  const handleNotificationAction = (notif: NotificationItem) => {
    if (notif.id === 'notif-1') {
      // 4 late teachers
      setCurrentScreen('corps-enseignant');
      setIsBatchSmsOpen(true);
      setSmsTargetTeacher(null);
    } else if (notif.id === 'notif-2') {
      setCurrentScreen('validation-evaluations');
    } else {
      setCurrentScreen('corps-enseignant');
      setIsInspectionModalOpen(true);
    }
  };

  const lateTeachers = teachers.filter((t) => t.pedagogicalFollowUp.notesT1Status === 'late');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c] flex font-sans">
        {/* Toast Notification Bar */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1b1c1c] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <span className="material-symbols-outlined text-[#96f5ca] text-[20px]">
              check_circle
            </span>
            <span className="text-[13px] font-semibold">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/60 hover:text-white p-0.5 ml-2"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Main Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onOpenAppel={() => handleOpenAppelForTeacher()}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
          {/* Top Header */}
          <Header
            notifications={notifications}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            academicYear={academicYear}
            onYearChange={setAcademicYear}
            onOpenMobileMenu={() => setMobileSidebarOpen(true)}
            onActionClick={handleNotificationAction}
            onOpenAppel={() => handleOpenAppelForTeacher()}
            onMarkAllNotificationsRead={() => {
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
              showToast('Toutes les alertes ont été marquées comme lues.');
            }}
          />

          {/* Page Content Body */}
          <main className="relative w-full pt-20 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto flex-1">
            {currentScreen === 'corps-enseignant' ? (
              <CorpsEnseignantView
                teachers={teachers}
                searchQuery={searchQuery}
                onSelectTeacher={(t) => setDrawerTeacher(t)}
                onEditTeacher={(t) => setEditTeacher(t)}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onOpenExportModal={() => setIsExportModalOpen(true)}
                onOpenBatchSms={(target) => {
                  setSmsTargetTeacher(target || null);
                  setIsBatchSmsOpen(true);
                }}
                onOpenAuditModal={() => setIsAuditModalOpen(true)}
                onOpenInspectionModal={() => setIsInspectionModalOpen(true)}
                onOpenEmargementModal={() => setIsEmargementModalOpen(true)}
                onOpenAppel={handleOpenAppelForTeacher}
              />
            ) : (
              <SecondaryViews
                currentScreen={currentScreen}
                teachers={teachers}
                students={students}
                absences={absences}
                sanctions={sanctions}
                payments={payments}
                academicYear={academicYear}
                onNavigateScreen={(screen) => setCurrentScreen(screen)}
                onNavigateToTeacher={() => setCurrentScreen('corps-enseignant')}
                onOpenTeacherDetail={(t) => setDrawerTeacher(t)}
                onAddStudent={handleAddStudent}
                onAddAbsence={handleAddAbsence}
                onAddSanction={handleAddSanction}
                onToggleJustified={handleToggleJustified}
                onAddPayment={handleAddPayment}
                onSendSmsRelance={handleSendSmsRelance}
                onValidateAppelBatch={handleBatchAppel}
              />
            )}
          </main>
        </div>

        {/* Slide-over Profile Drawer */}
        <TeacherProfileDrawer
          teacher={drawerTeacher}
          isOpen={!!drawerTeacher}
          onClose={() => setDrawerTeacher(null)}
          onEdit={(t) => {
            setDrawerTeacher(null);
            setEditTeacher(t);
          }}
          onSendSms={(t) => {
            setSmsTargetTeacher(t);
            setIsBatchSmsOpen(true);
          }}
          onOpenAppel={handleOpenAppelForTeacher}
        />

        {/* Add Teacher Modal */}
        <AddTeacherModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddTeacher={handleAddTeacher}
        />

        {/* Adjust Assignment Modal */}
        <AdjustAssignmentModal
          teacher={editTeacher}
          isOpen={!!editTeacher}
          onClose={() => setEditTeacher(null)}
          onSave={handleSaveAdjustedTeacher}
        />

        {/* Batch SMS Relance Modal */}
        <BatchSmsModal
          isOpen={isBatchSmsOpen}
          onClose={() => {
            setIsBatchSmsOpen(false);
            setSmsTargetTeacher(null);
          }}
          lateTeachers={lateTeachers}
          targetTeacher={smsTargetTeacher}
          onConfirmSend={handleConfirmSmsSend}
        />

        {/* Export Menu Modal */}
        <ExportMenuModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          teachers={teachers}
        />

        {/* Quotas & Hours Audit Modal */}
        <AuditHoursModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          teachers={teachers}
        />

        {/* MINESEC Complete Inspection Dossier Modal */}
        <InspectionDossierModal
          isOpen={isInspectionModalOpen}
          onClose={() => setIsInspectionModalOpen(false)}
        />

        {/* Fiches d'Émargement Modal */}
        <EmargementModal
          isOpen={isEmargementModalOpen}
          onClose={() => setIsEmargementModalOpen(false)}
          teachers={teachers}
        />

        {/* Modal Faire l'Appel de Cours (Enseignant - restreint exclusivement à ses classes affectées) */}
        <FaireAppelModal
          isOpen={isGlobalAppelOpen}
          onClose={() => {
            setIsGlobalAppelOpen(false);
            setGlobalAppelTeacherId(undefined);
          }}
          teachers={teachers}
          students={students}
          initialTeacherId={globalAppelTeacherId}
          onValidateAppel={handleBatchAppel}
        />
      </div>
    </ErrorBoundary>
  );
}
