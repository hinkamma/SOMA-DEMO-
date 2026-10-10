import React, { useState, useRef, useEffect } from 'react';
import { NotificationItem } from '../types';

interface HeaderProps {
  notifications: NotificationItem[];
  onOpenNotifications?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMobileMenu?: () => void;
  academicYear: string;
  onYearChange: (year: string) => void;
  onActionClick?: (notif: NotificationItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  notifications,
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
  academicYear,
  onYearChange,
  onActionClick,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#fcf9f8]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-[#f0eded]">
      {/* Left side: Hamburger (mobile), Year selector, Sync badge, Search bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-[#594139] hover:bg-[#eae7e7]"
            title="Menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        )}

        {/* Academic year */}
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border-0 shadow-[0_1px_3px_rgba(44,62,110,0.04)]">
          <span className="material-symbols-outlined text-[#4b5d8f] text-[18px]">
            event_available
          </span>
          <select
            value={academicYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="bg-transparent text-[12px] font-bold text-[#1b1c1c] focus:outline-none cursor-pointer"
          >
            <option value="2024-2025">2024 - 2025</option>
            <option value="2023-2024">2023 - 2024</option>
            <option value="2025-2026">2025 - 2026</option>
          </select>
        </div>

        {/* Sync badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#96f5ca] text-[#002115] text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#006c4c] animate-pulse"></span>
          <span>Sync en ligne</span>
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-xs sm:max-w-md hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8d7168] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher enseignant, classe, matière..."
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-white text-[#1b1c1c] placeholder:text-[#8d7168] text-[12.5px] focus:outline-none focus:ring-1 focus:ring-[#ff6b35] shadow-[0_1px_3px_rgba(44,62,110,0.04)]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8d7168] hover:text-[#1b1c1c]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right side: Notifications & User profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex items-center justify-center p-2 rounded-lg text-[#594139] hover:bg-[#eae7e7] transition-colors"
            title="Notifications Pédagogiques"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-[#ff6b35] text-white text-[10px] leading-none font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#f0eded] z-50 p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-[#f0eded]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[14px] text-[#1b1c1c]">Alertes Pédagogiques</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#dae1ff] text-[#011848] text-[10px] font-bold">
                    {unreadCount} urgentes
                  </span>
                </div>
                <span className="text-[11px] text-[#4b5d8f] cursor-pointer hover:underline">
                  Tout marquer lu
                </span>
              </div>

              <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-lg flex flex-col gap-1 transition-colors ${
                      item.type === 'urgent'
                        ? 'bg-[#ffdad6]/40 hover:bg-[#ffdad6]/60'
                        : item.type === 'warning'
                        ? 'bg-[#dae1ff]/30 hover:bg-[#dae1ff]/50'
                        : 'bg-[#f6f3f2] hover:bg-[#eae7e7]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-[12.5px] text-[#1b1c1c] leading-tight">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[#8d7168] whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[#594139] leading-snug">{item.desc}</p>
                    {item.actionText && (
                      <button
                        onClick={() => {
                          setNotifOpen(false);
                          if (onActionClick) onActionClick(item);
                        }}
                        className="mt-1 text-left text-[11px] font-bold text-[#ff6b35] hover:underline flex items-center gap-1"
                      >
                        <span>{item.actionText}</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 cursor-pointer hover:opacity-90"
          >
            <div className="flex flex-col text-right hidden lg:flex">
              <span className="text-[13px] font-bold text-[#1b1c1c] leading-snug">
                M. Alain NGUEMO
              </span>
              <span className="text-[11px] text-[#8d7168] leading-none">
                Censeur Pédagogique (2nd Cycle)
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#ab3500] flex items-center justify-center text-white shadow-sm ring-2 ring-[#ffdbd0]">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>

          {/* User profile dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-[#f0eded] z-50 p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#f0eded]">
                <div className="w-9 h-9 rounded-full bg-[#ab3500] text-white flex items-center justify-center font-bold">
                  AN
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[13px] text-[#1b1c1c]">Alain NGUEMO</span>
                  <span className="text-[10.5px] text-[#8d7168]">Matricule: CEN-2010-098</span>
                </div>
              </div>
              <div className="text-[11px] text-[#594139] flex flex-col gap-1 py-1">
                <div className="flex justify-between">
                  <span className="text-[#8d7168]">Grade MINESEC:</span>
                  <span className="font-bold">PLEG Hors Échelle</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8d7168]">Session:</span>
                  <span className="text-[#006c4c] font-bold">Connecté (IP Sécurisée)</span>
                </div>
              </div>
              <button
                onClick={() => setProfileOpen(false)}
                className="mt-1 w-full py-1.5 rounded-lg bg-[#f6f3f2] hover:bg-[#eae7e7] text-[12px] font-bold text-[#594139] flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Fermer le Terminal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
