import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { UserCircleIcon, PencilIcon, LinkIcon, SaveIcon, XCircleIcon, LogoutIcon } from './icons/AppIcons';
import { 
    AppStoreIcon, NetflixIcon, GoogleDriveIcon, TradingViewIcon,
    TelegramIcon, VkIcon, AdobeIcon, ChatGptIcon, YoutubeIcon
} from './icons/ServiceIcons';
import { UserProfile } from '../App';

interface Connection {
  name: string;
  icon: React.ReactElement;
  url: string;
  connected: boolean;
  email?: string;
}

interface ProfileProps {
  user: UserProfile;
  onUserChange: (user: UserProfile) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUserChange, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const initialConnections: Connection[] = [
    { name: 'Google (Mail, Drive)', icon: <GoogleDriveIcon />, url: 'https://myaccount.google.com/subscriptions', connected: true, email: user.email },
    { name: 'Apple App Store', icon: <AppStoreIcon />, url: 'https://apps.apple.com/account/subscriptions', connected: true, email: 'alex.doe.icloud@apple.com' },
    { name: 'Netflix', icon: <NetflixIcon />, url: 'https://www.netflix.com/YourAccount', connected: false },
    { name: 'YouTube', icon: <YoutubeIcon />, url: 'https://www.youtube.com/paid_memberships', connected: false },
    { name: 'Adobe', icon: <AdobeIcon />, url: 'https://account.adobe.com/plans', connected: true, email: user.email },
    { name: 'ChatGPT', icon: <ChatGptIcon />, url: 'https://platform.openai.com/account/billing/overview', connected: false },
    { name: 'TradingView', icon: <TradingViewIcon />, url: 'https://www.tradingview.com/gopro/#account', connected: false },
    { name: 'Telegram', icon: <TelegramIcon />, url: 'https://telegram.org/premium', connected: false },
    { name: 'VK', icon: <VkIcon />, url: 'https://vk.com/settings?act=payments', connected: false },
  ];

  const [connections, setConnections] = useState<Connection[]>(initialConnections);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUserChange(formData);
    localStorage.setItem('user_profile', JSON.stringify(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const handleToggleConnection = (serviceName: string) => {
    setConnections(prevConnections =>
      prevConnections.map(conn =>
        conn.name === serviceName
          ? { ...conn, connected: !conn.connected, email: !conn.connected ? user.email : undefined }
          : conn
      )
    );
  };

  const renderInfoField = (label: string, value: string, name: keyof UserProfile, type: string = 'text') => (
    <div>
        <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">{label}</label>
        {isEditing ? (
            <input 
                type={type}
                name={name}
                value={value}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
        ) : (
            <p className="mt-1 text-slate-800 dark:text-slate-100">{value}</p>
        )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <UserCircleIcon className="w-24 h-24 text-slate-300 dark:text-slate-600" />
             {isEditing && (
                <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-slate-700 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-full shadow-md hover:bg-slate-100 dark:hover:bg-slate-600 transition">
                    <PencilIcon className="w-4 h-4" />
                </button>
            )}
          </div>
          <div className="flex-grow space-y-4">
            {renderInfoField('Full Name', formData.name, 'name')}
            {renderInfoField('Email Address', formData.email, 'email', 'email')}
          </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {renderInfoField('Address', formData.address, 'address')}
            {renderInfoField('Phone Number', formData.phone, 'phone', 'tel')}
        </div>
        <div className="mt-6 flex justify-between items-center">
             <button onClick={onLogout} className="flex items-center gap-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 py-2 px-4">
                <LogoutIcon className="w-5 h-5" /> Logout
            </button>
            <div className="flex space-x-3">
                {isEditing ? (
                    <>
                        <button onClick={handleCancel} className="flex items-center gap-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 py-2 px-4">
                            <XCircleIcon className="w-5 h-5" /> Cancel
                        </button>
                        <button onClick={handleSave} className="inline-flex items-center gap-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 py-2 px-4">
                            <SaveIcon className="w-5 h-5" /> Save Changes
                        </button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 py-2 px-4">
                        <PencilIcon className="w-5 h-5" /> Edit Profile
                    </button>
                )}
            </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-4">Connected Services</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Connect your accounts to automatically import and track your subscriptions.
        </p>
        <div className="space-y-3">
          {connections.map(conn => (
            <div key={conn.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-100/50 dark:bg-slate-700/50 rounded-lg gap-4">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-4 flex items-center justify-center">{conn.icon}</div>
                <div>
                    <a href={conn.url} target="_blank" rel="noopener noreferrer" className="font-medium text-slate-800 dark:text-slate-100 hover:underline">{conn.name}</a>
                    {conn.connected && conn.email && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">{conn.email}</p>
                    )}
                </div>
              </div>
               <div className="flex items-center gap-4 self-end sm:self-center">
                 <div className="flex items-center gap-2 text-sm">
                    <span className={`h-2 w-2 rounded-full ${conn.connected ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                    <span className={`font-medium ${conn.connected ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {conn.connected ? 'Connected' : 'Not Connected'}
                    </span>
                </div>
              {conn.connected ? (
                 <button 
                    onClick={() => handleToggleConnection(conn.name)}
                    className="inline-flex items-center gap-2 text-sm font-medium rounded-md text-slate-600 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-600/50 hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 py-1.5 px-3"
                >
                  <XCircleIcon className="w-4 h-4" />
                  Disconnect
                </button>
              ) : (
                <button 
                    onClick={() => handleToggleConnection(conn.name)}
                    className="inline-flex items-center gap-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 py-1.5 px-3 transition-transform transform hover:scale-105"
                >
                  <LinkIcon className="w-4 h-4" />
                  Connect
                </button>
              )}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
       <Card>
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-4">Frequently Asked Questions (FAQ)</h3>
        <div className="space-y-4">
            <details className="p-3 rounded-lg bg-slate-100/50 dark:bg-slate-700/50 transition-colors">
                <summary className="font-medium text-slate-800 dark:text-slate-100 cursor-pointer list-none flex justify-between items-center">
                    How is my data stored?
                    <span className="text-slate-500 dark:text-slate-400 transform transition-transform duration-200 details-arrow">&#9654;</span>
                </summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Your subscription data is stored securely in your browser's local storage. It never leaves your device, ensuring your privacy.
                </p>
            </details>
             <details className="p-3 rounded-lg bg-slate-100/50 dark:bg-slate-700/50 transition-colors">
                <summary className="font-medium text-slate-800 dark:text-slate-100 cursor-pointer list-none flex justify-between items-center">
                    How are currency conversions calculated?
                    <span className="text-slate-500 dark:text-slate-400 transform transition-transform duration-200 details-arrow">&#9654;</span>
                </summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    We use a set of exchange rates with USD as a base currency to provide estimates of your total spending. These rates are for informational purposes.
                </p>
            </details>
             <details className="p-3 rounded-lg bg-slate-100/50 dark:bg-slate-700/50 transition-colors">
                <summary className="font-medium text-slate-800 dark:text-slate-100 cursor-pointer list-none flex justify-between items-center">
                    Can I use this app on multiple devices?
                     <span className="text-slate-500 dark:text-slate-400 transform transition-transform duration-200 details-arrow">&#9654;</span>
                </summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Currently, all data is stored locally on your device. We are working on a cloud sync feature for a future update.
                </p>
            </details>
             <details className="p-3 rounded-lg bg-slate-100/50 dark:bg-slate-700/50 transition-colors">
                <summary className="font-medium text-slate-800 dark:text-slate-100 cursor-pointer list-none flex justify-between items-center">
                   Is SubScribe free to use?
                    <span className="text-slate-500 dark:text-slate-400 transform transition-transform duration-200 details-arrow">&#9654;</span>
                </summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Yes, SubScribe is completely free to use. We aim to help you manage your subscriptions without adding another one.
                </p>
            </details>
        </div>
        <style>{`
            details[open] .details-arrow {
                transform: rotate(90deg);
            }
        `}</style>
      </Card>
      
      <Card>
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-4">Contact & Support</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Have questions or need assistance? Reach out to our team. We're happy to help!
        </p>
        <div className="space-y-2">
            <p className="text-slate-800 dark:text-slate-100">
                <strong>Email:</strong> <a href="mailto:support@subscribe.example" className="text-indigo-600 dark:text-indigo-400 hover:underline">support@subscribe.example</a>
            </p>
            <p className="text-slate-800 dark:text-slate-100">
                <strong>Phone:</strong> +1 (555) 123-4567 (Mon-Fri, 9am-5pm EST)
            </p>
        </div>
      </Card>
    </div>
  );
};

export default Profile;