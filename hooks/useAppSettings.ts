import { useState, useEffect } from 'react';
import { Currency } from '../types';

const SETTINGS_KEY = 'app_settings';

interface AppSettings {
    displayCurrency: Currency;
}

export const useAppSettings = () => {
    const [settings, setSettings] = useState<AppSettings>(() => {
        try {
            const storedSettings = localStorage.getItem(SETTINGS_KEY);
            if (storedSettings) {
                const parsed = JSON.parse(storedSettings);
                // Basic validation
                if (Object.values(Currency).includes(parsed.displayCurrency)) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Failed to load app settings from localStorage", error);
        }
        return { displayCurrency: Currency.USD };
    });

    useEffect(() => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error("Failed to save app settings to localStorage", error);
        }
    }, [settings]);

    const setDisplayCurrency = (currency: Currency) => {
        setSettings(prev => ({ ...prev, displayCurrency: currency }));
    };

    return {
        ...settings,
        setDisplayCurrency,
    };
};
