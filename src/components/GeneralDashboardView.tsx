import React, { useState } from 'react';
import { Teacher, Student, AbsenceRecord, PaymentReceipt, MedicalRecord, NavScreenId } from '../types';

interface GeneralDashboardViewProps {
  teachers: Teacher[];
  students: Student[];
  absences: AbsenceRecord[];
  payments: PaymentReceipt[];
  medicalRecords: MedicalRecord[];
  academicYear: string;
  onNavigateScreen: (screen: NavScreenId) => void;
}

export const GeneralDashboardView: React.FC<GeneralDashboardViewProps> = ({
  teachers,
  students,
  absences,
  payments,
  medicalRecords,
  academicYear,
  onNavigateScreen,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'t1' | 't2' | 't3' | 'annee'>('t1');

  // Aggregated Metrics
  const totalStudents = 488;
  const boysCount = 258;
  const girlsCount = 230;
  const totalTeachers = teachers.length;
  const plegCount = teachers.filter((t) => t.status === 'pleg').length;
  const vacatairesCount = teachers.filter((t) => t.status === 'vac').length;

  const totalAbsenceHours = absences.reduce((acc, a) => acc + a.hoursCount, 0);
  const avgConduct = 17.8;

  const totalTuitionBudget = 24400000;
  const totalCollected = 20100000;
  const tuitionRate = ((totalCollected / totalTuitionBudget) * 100).toFixed(1);

  const lateTeachersCount = teachers.filter(
    (t) => t.pedagogicalFollowUp.notesT1Status === 'late'
  ).length;

  // Chart 1: Distribution of students by classes
  const classDistribution = [
    { name: 'Tle C', total: 42, boys: 26, girls: 16 },
    { name: 'Tle D', total: 56, boys: 28, girls: 28 },
    { name: 'Tle TI', total: 38, boys: 24, girls: 14 },
    { name: 'Tle A4', total: 52, boys: 20, girls: 32 },
    { name: '1ère C', total: 40, boys: 25, girls: 15 },
    { name: '1ère D1', total: 58, boys: 30, girls: 28 },
    { name: '1ère TI', total: 44, boys: 28, girls: 16 },
    { name: '1ère A4', total: 50, boys: 18, girls: 32 },
    { name: '2nde C1', total: 60, boys: 34, girls: 26 },
    { name: '2nde A4', total: 48, boys: 25, girls: 23 },
  ];

  // Chart 2: Department progress
  const departmentsStats = [
    { name: 'Informatique & TIC', progress: 100, teachers: 4, notesStatus: 'Validé' },
    { name: 'Mathématiques', progress: 98, teachers: 8, notesStatus: 'Validé' },
    { name: 'Sciences Physiques', progress: 94, teachers: 6, notesStatus: '1 retard' },
    { name: 'Anglais & Bilinguisme', progress: 95, teachers: 5, notesStatus: 'Validé' },
    { name: 'Histoire & Géographie', progress: 92, teachers: 5, notesStatus: 'Validé' },
    { name: 'SVT & Biologie', progress: 90, teachers: 6, notesStatus: '1 retard' },
    { name: 'Lettres & Français', progress: 88, teachers: 8, notesStatus: '1 retard' },
    { name: 'Philosophie', progress: 85, teachers: 4, notesStatus: '1 retard' },
  ];

  // Chart 3: Weekly absences
  const weeklyAbsences = [
    { day: 'Lundi', hours: 14, percent: 70 },
    { day: 'Mardi', hours: 8, percent: 40 },
    { day: 'Mercredi', hours: 6, percent: 30 },
    { day: 'Jeudi', hours: 11, percent: 55 },
    { day: 'Vendredi', hours: 18, percent: 90 },
    { day: 'Samedi', hours: 4, percent: 20 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner: Proviseur Direction Cockpit */}
      <div className="bg-gradient-to-r from-[#011848] via-[#0d2a6b] to-[#12285e] rounded-2xl text-white p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Glow decoration */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#ff6b35]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 -bottom-16 w-56 h-56 rounded-full bg-[#4b5d8f]/30 blur-2xl pointer-events-none"></div>

        <div className="flex flex-col gap-2 z-10 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ff6b35] text-white text-[10.5px] font-black uppercase tracking-widest shadow-sm">
              Direction Générale • Cabinet du Proviseur
            </span>
            <span className="text-white/60">•</span>
            <span className="text-[12px] text-white/80 font-bold">Lycée Bilingue d'Application</span>
          </div>

          <h1 className="text-[26px] sm:text-[32px] font-black tracking-tight leading-tight">
            Tableau de Bord Général de l'Établissement
          </h1>

          <p className="text-[13.5px] text-white/80 leading-relaxed">
            Supervision stratégique 360° : effectifs apprenants, pilotage pédagogique MINESEC, recettes et trésorerie APEE, assiduité et santé scolaire.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-[12px] text-white/90 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#96f5ca] animate-pulse"></span>
              Année Scolaire : {academicYear}
            </span>
            <span>•</span>
            <span>Régime : Approche Par Compétences (APC)</span>
            <span>•</span>
            <span className="text-[#96f5ca]">Session Trimestre 1 en clôture</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 z-10 w-full sm:w-auto shrink-0">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-xl bg-white text-[#011848] font-extrabold text-[12.5px] flex items-center justify-center gap-2 shadow-lg hover:bg-[#f6f3f2] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Imprimer Rapport Global</span>
          </button>
          <button
            onClick={() => alert("Génération du rapport annuel de performance MINESEC...")}
            className="px-5 py-2.5 rounded-xl bg-[#ff6b35] text-white font-extrabold text-[12.5px] flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Télécharger Synthèse MINESEC</span>
          </button>
        </div>
      </div>

      {/* 5 Core Pillars KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Card 1: Students */}
        <div
          onClick={() => onNavigateScreen('gestion-eleves')}
          className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm hover:border-[#ff6b35] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[10.5px] font-bold uppercase tracking-wider">Effectif Apprenants</span>
            <span className="material-symbols-outlined text-[20px] text-[#4b5d8f]">school</span>
          </div>
          <div className="my-2">
            <span className="text-[26px] font-black text-[#1b1c1c]">{totalStudents}</span>
            <p className="text-[11px] text-[#006c4c] font-bold">{boysCount} Garçons • {girlsCount} Filles</p>
          </div>
          <div className="pt-2 border-t border-[#f0eded] text-[10.5px] font-bold text-[#4b5d8f] flex items-center justify-between">
            <span>10 Classes</span>
            <span>Gérer &rarr;</span>
          </div>
        </div>

        {/* Card 2: Teachers */}
        <div
          onClick={() => onNavigateScreen('corps-enseignant')}
          className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm hover:border-[#ff6b35] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[10.5px] font-bold uppercase tracking-wider">Corps Enseignant</span>
            <span className="material-symbols-outlined text-[20px] text-[#ff6b35]">groups</span>
          </div>
          <div className="my-2">
            <span className="text-[26px] font-black text-[#1b1c1c]">{totalTeachers} Profs</span>
            <p className="text-[11px] text-[#006c4c] font-bold">{plegCount} PLEG • {vacatairesCount} Vacataires</p>
          </div>
          <div className="pt-2 border-t border-[#f0eded] text-[10.5px] font-bold text-[#ff6b35] flex items-center justify-between">
            <span>100% Pourvu</span>
            <span>Superviser &rarr;</span>
          </div>
        </div>

        {/* Card 3: Finance APEE */}
        <div
          onClick={() => onNavigateScreen('frais-scolarite-apee')}
          className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm hover:border-[#ff6b35] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[10.5px] font-bold uppercase tracking-wider">Caisse & APEE</span>
            <span className="material-symbols-outlined text-[20px] text-[#006c4c]">payments</span>
          </div>
          <div className="my-2">
            <span className="text-[26px] font-black text-[#006c4c] font-mono">{tuitionRate}%</span>
            <p className="text-[11px] text-[#594139] font-bold">20.1M / 24.4M FCFA</p>
          </div>
          <div className="pt-2 border-t border-[#f0eded] text-[10.5px] font-bold text-[#006c4c] flex items-center justify-between">
            <span>28 Insolvables</span>
            <span>Finances &rarr;</span>
          </div>
        </div>

        {/* Card 4: Discipline & Assiduité */}
        <div
          onClick={() => onNavigateScreen('surveillance-discipline')}
          className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm hover:border-[#ff6b35] transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[10.5px] font-bold uppercase tracking-wider">Climat & Discipline</span>
            <span className="material-symbols-outlined text-[20px] text-[#ba1a1a]">policy</span>
          </div>
          <div className="my-2">
            <span className="text-[26px] font-black text-[#1b1c1c]">{avgConduct} / 20</span>
            <p className="text-[11px] text-[#006c4c] font-bold">Assiduité : 96.4%</p>
          </div>
          <div className="pt-2 border-t border-[#f0eded] text-[10.5px] font-bold text-[#ba1a1a] flex items-center justify-between">
            <span>{totalAbsenceHours}h d'absence</span>
            <span>Surveillance &rarr;</span>
          </div>
        </div>

        {/* Card 5: Santé Scolaire */}
        <div
          onClick={() => onNavigateScreen('infirmerie-sante')}
          className="bg-white p-4 rounded-xl border border-[#f0eded] shadow-sm hover:border-[#ff6b35] transition-all cursor-pointer flex flex-col justify-between col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-[#8d7168]">
            <span className="text-[10.5px] font-bold uppercase tracking-wider">Santé & Infirmerie</span>
            <span className="material-symbols-outlined text-[20px] text-[#006c4c]">medical_services</span>
          </div>
          <div className="my-2">
            <span className="text-[26px] font-black text-[#1b1c1c]">{medicalRecords.length} Fiches</span>
            <p className="text-[11px] text-[#4b5d8f] font-bold">18 Dispensés EPS</p>
          </div>
          <div className="pt-2 border-t border-[#f0eded] text-[10.5px] font-bold text-[#006c4c] flex items-center justify-between">
            <span>0 Urgence</span>
            <span>Infirmerie &rarr;</span>
          </div>
        </div>
      </div>

      {/* Row of Detailed Graphical Histograms & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRAPH 1: HISTOGRAMME DES EFFECTIFS PAR CLASSE (GARÇONS vs FILLES) */}
        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eded]">
              <div>
                <h3 className="font-extrabold text-[16px] text-[#1b1c1c] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4b5d8f]">bar_chart</span>
                  <span>Histogramme des Effectifs par Niveau & Série</span>
                </h3>
                <p className="text-[12px] text-[#8d7168] mt-0.5">
                  Répartition comparative Garçons / Filles sur les 10 divisions du 2nd cycle.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#4b5d8f]"></span>
                  <span>Garçons ({boysCount})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#ff6b35]"></span>
                  <span>Filles ({girlsCount})</span>
                </span>
              </div>
            </div>

            {/* Custom Interactive SVG/Bar Histogram */}
            <div className="mt-6 flex items-end justify-between h-56 pt-6 px-2 bg-[#fcf9f8] rounded-xl border border-[#f0eded]">
              {classDistribution.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end flex-1 max-w-[48px]">
                  <span className="text-[10px] font-black text-[#1b1c1c] font-mono">
                    {item.total}
                  </span>
                  <div className="w-full flex items-end justify-center gap-0.5">
                    {/* Boy bar */}
                    <div
                      className="w-3.5 rounded-t bg-[#4b5d8f] transition-all hover:brightness-110"
                      style={{ height: `${(item.boys / 40) * 130}px` }}
                      title={`${item.name} - Garçons : ${item.boys}`}
                    ></div>
                    {/* Girl bar */}
                    <div
                      className="w-3.5 rounded-t bg-[#ff6b35] transition-all hover:brightness-110"
                      style={{ height: `${(item.girls / 40) * 130}px` }}
                      title={`${item.name} - Filles : ${item.girls}`}
                    ></div>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#594139] truncate w-full text-center">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f0eded] flex items-center justify-between text-[11.5px] text-[#8d7168]">
            <span>Capacité d'accueil globale : 98% occupée</span>
            <button
              onClick={() => onNavigateScreen('gestion-eleves')}
              className="text-[#4b5d8f] font-bold hover:underline"
            >
              Voir le Registre des Élèves &rarr;
            </button>
          </div>
        </div>

        {/* GRAPH 2: PROGRESSION PÉDAGOGIQUE & SAISIE DES NOTES PAR DÉPARTEMENT */}
        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eded]">
              <div>
                <h3 className="font-extrabold text-[16px] text-[#1b1c1c] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006c4c]">analytics</span>
                  <span>Avancement Pédagogique par Département APC</span>
                </h3>
                <p className="text-[12px] text-[#8d7168] mt-0.5">
                  Taux de couverture des programmes et validation des notes Trimestre 1.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold">
                Moyenne : 93.4%
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {departmentsStats.map((dept, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-bold text-[#1b1c1c] flex items-center gap-2">
                      <span>{dept.name}</span>
                      <span className="text-[10px] text-[#8d7168] font-normal">
                        ({dept.teachers} profs)
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          dept.notesStatus === 'Validé'
                            ? 'bg-[#96f5ca] text-[#002115]'
                            : 'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}
                      >
                        {dept.notesStatus}
                      </span>
                      <span className="font-mono font-black text-[#1b1c1c] text-[12.5px]">
                        {dept.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[#eae7e7] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        dept.progress >= 95
                          ? 'bg-[#006c4c]'
                          : dept.progress >= 90
                          ? 'bg-[#4b5d8f]'
                          : 'bg-[#ff6b35]'
                      }`}
                      style={{ width: `${dept.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f0eded] flex items-center justify-between text-[11.5px] text-[#8d7168]">
            <span className="text-[#ba1a1a] font-semibold">
              4 fiches de notes en attente de clôture
            </span>
            <button
              onClick={() => onNavigateScreen('supervision-des-notes')}
              className="text-[#006c4c] font-bold hover:underline"
            >
              Superviser les Notes &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Row 2 of Graphical Analytics: Finance & Assiduité */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GRAPH 3: HISTOGRAMME DU RECOUVREMENT DES FRAIS APEE PAR NIVEAU */}
        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-[15px] text-[#1b1c1c] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c4c]">point_of_sale</span>
              <span>Recouvrement APEE par Niveau</span>
            </h3>
            <p className="text-[11.5px] text-[#8d7168] mt-1">
              Pourcentage de scolarité collecté selon le cycle.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-[12px] font-bold mb-1">
                  <span>Classes de Terminale (C, D, TI, A4, F4)</span>
                  <span className="text-[#006c4c]">88.5% (8.4M F)</span>
                </div>
                <div className="w-full bg-[#eae7e7] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#006c4c] h-full" style={{ width: '88.5%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[12px] font-bold mb-1">
                  <span>Classes de 1ère (C, D1, TI, A4)</span>
                  <span className="text-[#4b5d8f]">81.2% (6.8M F)</span>
                </div>
                <div className="w-full bg-[#eae7e7] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#4b5d8f] h-full" style={{ width: '81.2%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[12px] font-bold mb-1">
                  <span>Classes de 2nde (C1, A4)</span>
                  <span className="text-[#ff6b35]">78.0% (4.9M F)</span>
                </div>
                <div className="w-full bg-[#eae7e7] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#ff6b35] h-full" style={{ width: '78.0%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f0eded] flex justify-between items-center text-[11.5px]">
            <span className="text-[#006c4c] font-black">Total : 20.1 M FCFA</span>
            <button
              onClick={() => onNavigateScreen('frais-scolarite-apee')}
              className="text-[#ff6b35] font-bold hover:underline"
            >
              Gérer la Caisse &rarr;
            </button>
          </div>
        </div>

        {/* GRAPH 4: HISTOGRAMME DES ABSENCES DE LA SEMAINE */}
        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-[15px] text-[#1b1c1c] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a]">date_range</span>
              <span>Baromètre Assiduité Hebdomadaire</span>
            </h3>
            <p className="text-[11.5px] text-[#8d7168] mt-1">
              Courbe d'absences signalées par jour (Lundi au Samedi).
            </p>

            <div className="mt-4 flex items-end justify-between h-36 pt-4 px-2 bg-[#fcf9f8] rounded-xl border border-[#f0eded]">
              {weeklyAbsences.map((w, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end flex-1">
                  <span className="text-[10px] font-mono font-bold text-[#1b1c1c]">
                    {w.hours}h
                  </span>
                  <div
                    className="w-5 rounded-t transition-all"
                    style={{
                      height: `${w.percent}px`,
                      backgroundColor: w.hours > 12 ? '#ba1a1a' : w.hours > 8 ? '#ff6b35' : '#006c4c',
                    }}
                  ></div>
                  <span className="text-[9.5px] font-bold text-[#594139]">{w.day.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f0eded] flex justify-between items-center text-[11.5px]">
            <span className="text-[#8d7168]">Assiduité moyenne : 96.4%</span>
            <button
              onClick={() => onNavigateScreen('surveillance-discipline')}
              className="text-[#ba1a1a] font-bold hover:underline"
            >
              Surveillance &rarr;
            </button>
          </div>
        </div>

        {/* GRAPH 5: CONTRÔLE STRATÉGIQUE & ALERTES DU CHEF D'ÉTABLISSEMENT */}
        <div className="bg-white rounded-xl shadow-sm border border-[#f0eded] p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-[15px] text-[#1b1c1c] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ff6b35]">priority_high</span>
              <span>Dossiers Urgents du Proviseur</span>
            </h3>
            <p className="text-[11.5px] text-[#8d7168] mt-1">
              Arbitrages et validations sous votre autorité directe.
            </p>

            <div className="mt-3 flex flex-col gap-2 text-[11.5px]">
              <div className="p-2.5 rounded-lg bg-[#ffdad6]/40 border border-[#ffdad6] flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#ba1a1a] shrink-0 mt-0.5">
                  warning
                </span>
                <div>
                  <span className="font-bold text-[#ba1a1a] block">Clôture des Notes T1</span>
                  <span className="text-[#594139]">4 enseignants en retard bloquent les moyennes.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#dae1ff]/40 border border-[#dae1ff] flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#011848] shrink-0 mt-0.5">
                  assignment
                </span>
                <div>
                  <span className="font-bold text-[#011848] block">Mandat Heures Complémentaires</span>
                  <span className="text-[#594139]">État de l'intendance prêt pour votre signature.</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#96f5ca]/40 border border-[#96f5ca] flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#006c4c] shrink-0 mt-0.5">
                  verified
                </span>
                <div>
                  <span className="font-bold text-[#006c4c] block">Inspection Régionale MINESEC</span>
                  <span className="text-[#594139]">Dossier IPR 2nd Cycle complet prêt à exporter.</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateScreen('intendance-finances')}
            className="mt-3 w-full py-2 rounded-lg bg-[#011848] text-white font-bold text-[11.5px] flex items-center justify-center gap-1 shadow-sm"
          >
            <span>Examiner les Mandats de l'Intendance</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
