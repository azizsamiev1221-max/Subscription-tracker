import React, { useState } from 'react';
import { Card } from './Card';
import { UserProfile } from '../App';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleModeToggle = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
        if (!email || !password || !name) {
            setError("Please fill in all fields.");
            return;
        }
        // In a real app, you'd check if the user already exists.
        // For this demo, we'll just overwrite.
        const newUser: UserProfile = {
            name,
            email,
            // In a real app, never store plain text passwords!
            // This is just for demonstration purposes.
            address: 'Not set',
            phone: 'Not set'
        };
        localStorage.setItem('user_credentials', JSON.stringify({email, password}));
        localStorage.setItem('user_profile', JSON.stringify(newUser));
        onLogin(newUser);

    } else { // Login mode
        const storedCredentialsRaw = localStorage.getItem('user_credentials');
        if (!storedCredentialsRaw) {
            setError("No account found. Please sign up.");
            return;
        }
        const storedCredentials = JSON.parse(storedCredentialsRaw);
        if (storedCredentials.email === email && storedCredentials.password === password) {
            const storedProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');
            onLogin(storedProfile);
        } else {
            setError("Invalid email or password.");
        }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-gray-900 p-4">
        <div className="flex-grow flex items-center justify-center">
            <div className="max-w-sm w-full">
                <Card>
                <div className="flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 7L12 12M12 22V12M22 7L12 12M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h1 className="ml-3 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                    SubScribe
                    </h1>
                </div>
                <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2">
                    {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
                </h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
                    {mode === 'login' ? 'Sign in to manage your subscriptions.' : 'Get started by creating your account.'}
                </p>
                <form onSubmit={handleSubmit}>
                    {mode === 'signup' && (
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Alex Doe"
                            required
                        />
                    </div>
                    )}
                    <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="you@example.com"
                        required
                    />
                    </div>
                    <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="••••••••"
                        required
                    />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                    <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
                    >
                    {mode === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={handleModeToggle} className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            {mode === 'login' ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </Card>
            </div>
      </div>
    </div>
  );
};

export default LoginScreen;