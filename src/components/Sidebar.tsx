import React from 'react';
import { NavScreenId } from '../types';

interface SidebarProps {
  currentScreen: NavScreenId;
  onNavigate: (screen: NavScreenId) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenAppel?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  mobileOpen = false,
  onCloseMobile,
  onOpenAppel,
}) => {
  const handleNav = (screen: NavScreenId) => {
    onNavigate(screen);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo & Header */}
          <div className="p-6 flex flex-col gap-1 border-b border-[#f0eded]/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ff6b35] to-[#ab3500] flex items-center justify-center text-white shadow-sm ring-1 ring-black/5 shrink-0">
                  <span className="material-symbols-outlined text-[22px]">school</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[17px] font-bold text-[#1b1c1c] leading-tight tracking-tight">
                    SOMA
                  </span>
                  <span className="text-[11px] font-bold text-[#4b5d8f] tracking-widest uppercase">
                    ÉDUCATION
                  </span>
                </div>
              </div>
              {onCloseMobile && (
                <button
                  onClick={onCloseMobile}
                  className="lg:hidden p-1 text-[#8d7168] hover:text-[#1b1c1c]"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>

            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-extrabold tracking-wide uppercase">
                Espace Censeur / Préfet
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-3 flex flex-col gap-1 text-[14px]">
            {/* Section 1 */}
            <div className="pt-2 pb-1">
              <span className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8d7168]">
                Direction & Pilotage
              </span>
            </div>
            <button
              onClick={() => handleNav('tableau-de-bord')}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'tableau-de-bord'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                <span className="font-semibold text-[13.5px]">Tableau de bord Général</span>
              </div>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  currentScreen === 'tableau-de-bord'
                    ? 'bg-white text-[#ff6b35]'
                    : 'bg-[#dae1ff] text-[#011848]'
                }`}
              >
                Proviseur
              </span>
            </button>

            {/* Section 2: Pédagogie & Personnel */}
            <div className="pt-3 pb-1">
              <span className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8d7168]">
                Pédagogie & Personnel
              </span>
            </div>
            <button
              onClick={() => handleNav('corps-enseignant')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'corps-enseignant'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">groups</span>
              <span className="font-semibold text-[13.5px]">Corps Enseignant</span>
            </button>
            <button
              onClick={() => handleNav('affectations-et-charges')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'affectations-et-charges'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">assignment_ind</span>
              <span className="font-semibold text-[13.5px]">Affectations & Charges</span>
            </button>

            {/* Section 3: Vie Scolaire & Discipline */}
            <div className="pt-3 pb-1">
              <span className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8d7168]">
                Vie Scolaire & Discipline
              </span>
            </div>
            {onOpenAppel && (
              <button
                onClick={() => {
                  onOpenAppel();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg bg-[#006c4c]/10 hover:bg-[#006c4c] text-[#006c4c] hover:text-white transition-all font-bold group mb-1"
                title="L'enseignant fait l'appel en classe (classes affectées uniquement)"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-[#006c4c] group-hover:text-white">
                    checklist_rtl
                  </span>
                  <span className="text-[13px]">Faire l'Appel de Cours</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-extrabold bg-[#006c4c] text-white group-hover:bg-white group-hover:text-[#006c4c]">
                  PROFS
                </span>
              </button>
            )}
            <button
              onClick={() => handleNav('surveillance-discipline')}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'surveillance-discipline'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px]">policy</span>
                <span className="font-semibold text-[13.5px]">Surveillance & Discipline</span>
              </div>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  currentScreen === 'surveillance-discipline'
                    ? 'bg-white text-[#ff6b35]'
                    : 'bg-[#ffdad6] text-[#ba1a1a]'
                }`}
              >
                14 Abs.
              </span>
            </button>
            <button
              onClick={() => handleNav('gestion-eleves')}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'gestion-eleves'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px]">school</span>
                <span className="font-semibold text-[13.5px]">Gestion des Élèves</span>
              </div>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  currentScreen === 'gestion-eleves'
                    ? 'bg-white text-[#ff6b35]'
                    : 'bg-[#dae1ff] text-[#011848]'
                }`}
              >
                488
              </span>
            </button>

            {/* Section 4: Intendance & Finances */}
            <div className="pt-3 pb-1">
              <span className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8d7168]">
                Intendance & Finances
              </span>
            </div>
            <button
              onClick={() => handleNav('frais-scolarite-apee')}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'frais-scolarite-apee'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                <span className="font-semibold text-[13.5px]">Frais Scolarité & APEE</span>
              </div>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  currentScreen === 'frais-scolarite-apee'
                    ? 'bg-white text-[#ff6b35]'
                    : 'bg-[#96f5ca] text-[#002115]'
                }`}
              >
                82%
              </span>
            </button>
            <button
              onClick={() => handleNav('intendance-finances')}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'intendance-finances'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                <span className="font-semibold text-[13.5px]">Intendance & Heures Supp</span>
              </div>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  currentScreen === 'intendance-finances'
                    ? 'bg-white text-[#ff6b35]'
                    : 'bg-[#dae1ff] text-[#011848]'
                }`}
              >
                Paie
              </span>
            </button>

            {/* Section 5: Santé & Médico-Social */}
            <div className="pt-3 pb-1">
              <span className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8d7168]">
                Santé & Médico-Social
              </span>
            </div>
            <button
              onClick={() => handleNav('infirmerie-sante')}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'infirmerie-sante'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px]">medical_services</span>
                <span className="font-semibold text-[13.5px]">Infirmerie & Santé</span>
              </div>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  currentScreen === 'infirmerie-sante'
                    ? 'bg-white text-[#ff6b35]'
                    : 'bg-[#96f5ca] text-[#002115]'
                }`}
              >
                Infirmière
              </span>
            </button>

            {/* Section 3 */}
            <div className="pt-3 pb-1">
              <span className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8d7168]">
                Structure Académique
              </span>
            </div>
            <button
              onClick={() => handleNav('classes-et-matieres')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'classes-et-matieres'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">domain</span>
              <span className="font-semibold text-[13.5px]">Classes & Matières</span>
            </button>
            <button
              onClick={() => handleNav('emplois-du-temps')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'emplois-du-temps'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              <span className="font-semibold text-[13.5px]">Emplois du Temps</span>
            </button>

            {/* Section 4 */}
            <div className="pt-3 pb-1">
              <span className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8d7168]">
                Suivi & Contrôle
              </span>
            </div>
            <button
              onClick={() => handleNav('validation-evaluations')}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'validation-evaluations'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px]">fact_check</span>
                <span className="font-semibold text-[13.5px]">Validation Évaluations</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-bold">
                3
              </span>
            </button>
            <button
              onClick={() => handleNav('visas-cahiers-de-texte')}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'visas-cahiers-de-texte'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px]">menu_book</span>
                <span className="font-semibold text-[13.5px]">Visas Cahiers de Texte</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#dae1ff] text-[#011848] text-[11px] font-bold">
                12
              </span>
            </button>

            {/* Section 5 */}
            <div className="pt-3 pb-1">
              <span className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8d7168]">
                Notation & Délibérations
              </span>
            </div>
            <button
              onClick={() => handleNav('supervision-des-notes')}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'supervision-des-notes'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px]">analytics</span>
                <span className="font-semibold text-[13.5px]">Supervision des Notes</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#96f5ca] text-[#002115] text-[11px] font-bold">
                88%
              </span>
            </button>
            <button
              onClick={() => handleNav('moyennes-et-conseils')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'moyennes-et-conseils'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              <span className="font-semibold text-[13.5px]">Moyennes & Conseils</span>
            </button>

            {/* Section 6 */}
            <div className="pt-3 pb-1">
              <span className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-[#8d7168]">
                Outils & Configuration
              </span>
            </div>
            <button
              onClick={() => handleNav('rapports-et-palmares')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'rapports-et-palmares'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">military_tech</span>
              <span className="font-semibold text-[13.5px]">Rapports & Palmarès</span>
            </button>
            <button
              onClick={() => handleNav('parametres-pedagogiques')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
                currentScreen === 'parametres-pedagogiques'
                  ? 'bg-[#ff6b35] text-white font-bold shadow-sm'
                  : 'text-[#594139] hover:bg-[#eae7e7]/60 hover:text-[#1b1c1c]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="font-semibold text-[13.5px]">Paramètres Pédagogiques</span>
            </button>
          </nav>
        </div>

        {/* Footer info badge */}
        <div className="p-4 mt-4 border-t border-[#f0eded]">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#f6f3f2] text-[#594139]">
            <span className="material-symbols-outlined text-[#006c4c] text-[18px]">lock</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#1b1c1c] leading-tight">
                Terminal Pédagogique
              </span>
              <span className="text-[10px] text-[#8d7168] font-medium">Session Sécurisée MINESEC</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
