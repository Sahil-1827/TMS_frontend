"use client";
import { useState, useEffect } from 'react';

export const useTimeGreeting = () => {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const updateGreeting = () => {
            const currentHour = new Date().getHours();
            if (currentHour >= 5 && currentHour < 12) {
                setGreeting('Good Morning');
            } else if (currentHour >= 12 && currentHour < 17) {
                setGreeting('Good Afternoon');
            } else if (currentHour >= 17 && currentHour < 21) {
                setGreeting('Good Evening');
            } else {
                setGreeting('Good Night');
            }
        };
        updateGreeting();
        const interval = setInterval(updateGreeting, 60000);
        return () => clearInterval(interval);
    }, []);

    return greeting;
};
