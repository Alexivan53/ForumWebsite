import { translations } from '../translations';

type Translation = typeof translations['en'] | typeof translations['bg'];

export const timeAgo = (date: Date, t: Translation): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
    const format = (value: number, unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second') => {
        const roundedValue = Math.floor(value);
        const units = {
            year: roundedValue === 1 ? t.year : t.years,
            month: roundedValue === 1 ? t.month : t.months,
            day: roundedValue === 1 ? t.day : t.days,
            hour: roundedValue === 1 ? t.hour : t.hours,
            minute: roundedValue === 1 ? t.minute : t.minutes,
            second: roundedValue === 1 ? t.second : t.seconds,
        };
        
        if (t.locale === 'bg') {
            return `${t.ago} ${roundedValue} ${units[unit]}`;
        }
        return `${roundedValue} ${units[unit]} ${t.ago}`;
    };
    
    if (seconds < 5) return t.justNow;

    let interval = seconds / 31536000;
    if (interval > 1) return format(interval, 'year');
    interval = seconds / 2592000;
    if (interval > 1) return format(interval, 'month');
    interval = seconds / 86400;
    if (interval > 1) return format(interval, 'day');
    interval = seconds / 3600;
    if (interval > 1) return format(interval, 'hour');
    interval = seconds / 60;
    if (interval > 1) return format(interval, 'minute');
    return format(seconds, 'second');
};
