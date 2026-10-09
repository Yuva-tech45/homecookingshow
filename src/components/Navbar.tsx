import React, { useState } from 'react';
import { Search, Menu, X, UtensilsCrossed, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onSearchClick: () => void;
  onPlanClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick, onPlanClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signIn, signOut } = useAuth();

  const navLinks = [
    { label: 'Discover', href: '#discover' },
    { label: 'Recipe Collection', href: '#recipes' },
    { label: 'Kitchen Planner', href: '#companion' },
    { label: 'Community', href: '#community' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#281914]/95 backdrop-blur-md border-b border-[#68472F]/30 text-[#FFFDF8] transition-colors shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          
          {/* Zone 1: Confident Video-Inspired Brand Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2.5 group whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1B52A] rounded-md py-1"
          >
            <span className="w-9 h-9 rounded-lg bg-[#E1B52A] text-[#281914] flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-[#281914]" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-black tracking-tight text-[#FFFDF8] leading-none">
                HomeCooking<span className="text-[#E1B52A]">Show</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-[#E1B52A]/80 font-display mt-0.5">
                Indian Kitchen
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[15px] font-semibold text-[#F8F2E8]/80">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="hover:text-[#FFFDF8] transition-colors whitespace-nowrap shrink-0 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#E1B52A] hover:after:w-full after:transition-all after:duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Auth */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onSearchClick}
              type="button"
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-[#F8F2E8] bg-[#3D261E]/80 border border-[#68472F]/50 rounded-lg hover:border-[#E1B52A] hover:bg-[#3D261E] transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1B52A] whitespace-nowrap shrink-0 cursor-pointer"
              aria-label="Search recipes"
            >
              <Search className="w-4 h-4 text-[#E1B52A]" />
              <span>Search recipes</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#F8F2E8]/60 bg-[#281914] border border-[#68472F]/40 rounded">
                ⌘K
              </kbd>
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#68472F]/40">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full border-2 border-[#E1B52A] object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#3D261E] text-[#E1B52A] flex items-center justify-center font-bold text-xs border border-[#68472F]">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <span className="text-xs font-bold text-[#FFFDF8] max-w-[100px] truncate hidden xl:inline">
                  {user.displayName?.split(' ')[0]}
                </span>
                <button
                  onClick={signOut}
                  type="button"
                  title="Sign Out"
                  className="p-1.5 text-[#F8F2E8]/60 hover:text-[#FFFDF8] hover:bg-[#3D261E] rounded-md transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                type="button"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#281914] bg-[#E1B52A] hover:bg-[#CCA21E] rounded-lg transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFFDF8] cursor-pointer whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onSearchClick}
              type="button"
              className="p-2 text-[#FFFDF8] hover:bg-[#3D261E] rounded-lg focus-visible:ring-2 focus-visible:ring-[#E1B52A]"
              aria-label="Search recipes"
            >
              <Search className="w-5 h-5 text-[#E1B52A]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 text-[#FFFDF8] hover:bg-[#3D261E] rounded-lg focus-visible:ring-2 focus-visible:ring-[#E1B52A]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#68472F]/30 bg-[#281914] px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-base font-semibold text-[#F8F2E8] hover:text-[#E1B52A] py-2 border-b border-[#68472F]/20"
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="pt-2 space-y-3">
            {user ? (
              <div className="flex items-center justify-between p-3 bg-[#3D261E] rounded-xl border border-[#68472F]/40">
                <div className="flex items-center gap-2.5">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full border border-[#E1B52A]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#281914] text-[#E1B52A] flex items-center justify-center font-bold text-xs">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-[#FFFDF8]">{user.displayName}</p>
                    <p className="text-[10px] text-[#F8F2E8]/60 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  type="button"
                  className="text-xs text-[#E1B52A] hover:text-white px-2 py-1 rounded border border-[#68472F]/40"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                type="button"
                className="w-full py-2.5 px-4 bg-[#E1B52A] text-[#281914] font-bold rounded-lg text-center shadow-xs flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Google</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onPlanClick();
              }}
              type="button"
              className="w-full py-2.5 px-4 bg-[#3D261E] text-[#FFFDF8] border border-[#68472F]/40 font-semibold rounded-lg text-center"
            >
              Open Kitchen Planner
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
