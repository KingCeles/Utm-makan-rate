import React from 'react';
import { User } from '../types';
import { LogOut, User as UserIcon, Utensils } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigateHome }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={onNavigateHome}>
            <div className="bg-rose-900 p-2 rounded-lg mr-3">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">UTM MakanRate</h1>
              <p className="text-xs text-gray-500 font-medium">Student Food Reviews</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user.isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                  <UserIcon className="h-4 w-4 mr-2 text-rose-800" />
                  {user.studentId}
                </div>
                <button
                  onClick={onLogout}
                  className="text-gray-500 hover:text-rose-700 transition-colors p-2"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-500 italic">Please Login</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};