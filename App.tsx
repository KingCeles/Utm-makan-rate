import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { RestaurantDetail } from './pages/RestaurantDetail';
import { Restaurant, User, Review } from './types';
import { Utensils, Mail, Lock, User as UserIcon, CheckCircle } from 'lucide-react';
import { AiChat } from './components/AiChat';

// Mock Initial Data
const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Arca Meranti Cafe',
    description: 'A bustling student hub offering a variety of local Malay dishes and affordable mixed rice.',
    cuisine: ['Malay', 'Mixed Rice', 'Halal'],
    location: 'Kolej Tun Dr Ismail (KTDI)',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    reviews: [
      { id: 'r1', restaurantId: '1', userId: 'A19EC0001', rating: 4, comment: 'The nasi lemak here is legendary! Cheap and good.', isAnonymous: true, timestamp: Date.now() - 1000000, sentiment: 'positive' }
    ],
    averageRating: 4,
  },
  {
    id: '2',
    name: "Scholar's Inn",
    description: 'A cozy spot for western food and coffee. Great place to study or have a discussion.',
    cuisine: ['Western', 'Coffee', 'Dessert'],
    location: 'UTM Residensi',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    reviews: [],
    averageRating: 0,
  },
  {
    id: '3',
    name: 'Bamboo Cafe',
    description: 'Famous for its spicy dishes and open-air environment right next to the forest.',
    cuisine: ['Spicy', 'Thai', 'Budget'],
    location: 'Lingkaran Ilmu',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    reviews: [],
    averageRating: 0,
  }
];

const ADMIN_USER = {
  studentId: 'ADMIN',
  email: 'admin@utm.my',
  password: 'admin123',
  role: 'admin' as const,
  isVerified: true
};

const App: React.FC = () => {
  // --- STATE ---
  const [user, setUser] = useState<User>({ studentId: '', email: '', role: 'student', isLoggedIn: false, isVerified: false });
  
  // Auth State
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | 'VERIFY'>('LOGIN');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Data State
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem('utm-makanrate-data');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANTS;
  });

  const [view, setView] = useState<'HOME' | 'DETAILS' | 'AUTH'>('AUTH');
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(null);

  // --- EFFECTS ---

  // Persistence for restaurants
  useEffect(() => {
    localStorage.setItem('utm-makanrate-data', JSON.stringify(restaurants));
  }, [restaurants]);

  // Seed Admin & Persistence for Users (Simulated Backend)
  useEffect(() => {
    const savedUsers = localStorage.getItem('utm-makanrate-users');
    let users = savedUsers ? JSON.parse(savedUsers) : [];
    
    // Ensure admin exists
    if (!users.find((u: any) => u.email === ADMIN_USER.email)) {
      users.push(ADMIN_USER);
      localStorage.setItem('utm-makanrate-users', JSON.stringify(users));
    }
  }, []);

  // --- HANDLERS ---

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    const savedUsers = JSON.parse(localStorage.getItem('utm-makanrate-users') || '[]');
    
    if (savedUsers.find((u: any) => u.email === regEmail)) {
      setAuthError('Email already registered.');
      return;
    }
    
    if (savedUsers.find((u: any) => u.studentId === regStudentId)) {
      setAuthError('Student ID already registered.');
      return;
    }

    // Save temp user with verified=false
    const newUser = {
      studentId: regStudentId.toUpperCase(),
      email: regEmail,
      password: regPassword,
      role: 'student',
      isVerified: false
    };

    savedUsers.push(newUser);
    localStorage.setItem('utm-makanrate-users', JSON.stringify(savedUsers));
    
    // Move to verification
    setAuthMode('VERIFY');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Mock Verification Code Check
    if (verificationCode !== '123456') {
      setAuthError('Invalid verification code. (Hint: use 123456)');
      return;
    }

    // Update user in DB
    const savedUsers = JSON.parse(localStorage.getItem('utm-makanrate-users') || '[]');
    const userIndex = savedUsers.findIndex((u: any) => u.email === regEmail);
    
    if (userIndex !== -1) {
      savedUsers[userIndex].isVerified = true;
      localStorage.setItem('utm-makanrate-users', JSON.stringify(savedUsers));
      alert("Account verified! You can now log in.");
      setAuthMode('LOGIN');
      // Pre-fill login
      setLoginEmail(regEmail);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    const savedUsers = JSON.parse(localStorage.getItem('utm-makanrate-users') || '[]');
    const foundUser = savedUsers.find((u: any) => u.email === loginEmail && u.password === loginPassword);

    if (!foundUser) {
      setAuthError('Invalid email or password.');
      return;
    }

    if (!foundUser.isVerified) {
      setAuthError('Please verify your email first.');
      // Optionally could allow them to jump to verify, but simple flow for now
      return;
    }

    setUser({
      studentId: foundUser.studentId,
      email: foundUser.email,
      role: foundUser.role,
      isLoggedIn: true,
      isVerified: true
    });
    setView('HOME');
  };

  const handleLogout = () => {
    setUser({ studentId: '', email: '', role: 'student', isLoggedIn: false, isVerified: false });
    setView('AUTH');
    setAuthMode('LOGIN');
    setLoginEmail('');
    setLoginPassword('');
    setAuthError('');
  };

  // Navigation Handlers
  const handleRestaurantClick = (id: string) => {
    setActiveRestaurantId(id);
    setView('DETAILS');
  };

  const handleBackToHome = () => {
    setActiveRestaurantId(null);
    setView('HOME');
  };

  // Data Handlers
  const handleAddRestaurant = (newRestaurant: Restaurant) => {
    setRestaurants(prev => [newRestaurant, ...prev]);
  };

  const handleAddReview = (rating: number, comment: string, isAnonymous: boolean, sentiment: 'positive' | 'neutral' | 'negative') => {
    if (!activeRestaurantId) return;

    const newReview: Review = {
      id: Date.now().toString(),
      restaurantId: activeRestaurantId,
      userId: user.studentId,
      rating,
      comment,
      isAnonymous,
      timestamp: Date.now(),
      sentiment
    };

    setRestaurants(prevRestaurants => {
      return prevRestaurants.map(r => {
        if (r.id === activeRestaurantId) {
          const updatedReviews = [...r.reviews, newReview];
          const totalRating = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0);
          const avgRating = totalRating / updatedReviews.length;
          return { ...r, reviews: updatedReviews, averageRating: avgRating };
        }
        return r;
      });
    });
  };

  // Views Logic
  const activeRestaurant = restaurants.find(r => r.id === activeRestaurantId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* AUTH SCREENS */}
      {!user.isLoggedIn && view === 'AUTH' && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-rose-900 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
            <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
               <Utensils className="h-8 w-8 text-rose-800" />
            </div>
            <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-2">UTM MakanRate</h1>
            
            {/* Login View */}
            {authMode === 'LOGIN' && (
              <>
                <p className="text-center text-gray-500 mb-8">Login to your account.</p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input type="email" required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" placeholder="student@graduate.utm.my" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                     <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input type="password" required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                     </div>
                  </div>
                  {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
                  <button type="submit" className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">Login</button>
                </form>
                <div className="mt-6 text-center text-sm">
                   Don't have an account? <button onClick={() => setAuthMode('REGISTER')} className="text-rose-600 font-semibold hover:underline">Register</button>
                </div>
                <div className="mt-2 text-center text-xs text-gray-400">
                  Tip: Admin use admin@utm.my / admin123
                </div>
              </>
            )}

            {/* Register View */}
            {authMode === 'REGISTER' && (
               <>
                <p className="text-center text-gray-500 mb-6">Create a student account.</p>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                     <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input type="text" required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" placeholder="A19EC0000" value={regStudentId} onChange={e => setRegStudentId(e.target.value)} />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input type="email" required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" placeholder="student@graduate.utm.my" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                     <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input type="password" required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none" placeholder="Create a password" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                     </div>
                  </div>
                  {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
                  <button type="submit" className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">Sign Up</button>
                </form>
                <div className="mt-6 text-center text-sm">
                   Already have an account? <button onClick={() => setAuthMode('LOGIN')} className="text-rose-600 font-semibold hover:underline">Login</button>
                </div>
               </>
            )}

            {/* Verify View */}
            {authMode === 'VERIFY' && (
              <>
                 <div className="flex justify-center mb-4">
                   <Mail className="h-12 w-12 text-rose-500" />
                 </div>
                 <h2 className="text-center text-xl font-bold text-gray-900 mb-2">Check your Email</h2>
                 <p className="text-center text-gray-500 mb-6 text-sm">We sent a verification code to <strong>{regEmail}</strong>.</p>
                 <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                      <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-center tracking-widest text-xl" placeholder="123456" maxLength={6} value={verificationCode} onChange={e => setVerificationCode(e.target.value)} />
                      <p className="text-xs text-gray-400 mt-2 text-center">Use code <strong>123456</strong> for this demo.</p>
                    </div>
                    {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg flex items-center justify-center">
                       <CheckCircle className="h-5 w-5 mr-2" /> Verify & Continue
                    </button>
                 </form>
                 <button onClick={() => setAuthMode('REGISTER')} className="w-full mt-4 text-gray-500 text-sm hover:text-gray-900">Back</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main App */}
      {user.isLoggedIn && (
        <>
          <Navbar 
            user={user} 
            onLogout={handleLogout} 
            onNavigateHome={handleBackToHome} 
          />
          
          <main className="flex-grow">
            {view === 'HOME' && (
              <Home 
                restaurants={restaurants} 
                currentUser={user}
                onRestaurantClick={handleRestaurantClick}
                onAddRestaurant={handleAddRestaurant}
              />
            )}
            
            {view === 'DETAILS' && activeRestaurant && (
              <RestaurantDetail 
                restaurant={activeRestaurant} 
                onBack={handleBackToHome}
                onAddReview={handleAddReview}
              />
            )}
          </main>

          {/* AI Chat Assistant - accessible from anywhere in the logged-in app */}
          <AiChat restaurants={restaurants} />
          
          <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} UTM MakanRate. Made for students.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
