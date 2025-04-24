import zxcvbn from 'zxcvbn';


export const validatePassword = (pass: string) => {
    if (!pass) return { score: 0, timeToCrack: 0 };
    const result = zxcvbn(pass);
    
    const timeToCrack = typeof result.crack_times_seconds.offline_slow_hashing_1e4_per_second === 'string' 
        ? parseFloat(result.crack_times_seconds.offline_slow_hashing_1e4_per_second) 
        : result.crack_times_seconds.offline_slow_hashing_1e4_per_second;
    
    return { 
        score: result.score, 
        timeToCrack: timeToCrack 
    };
};

export const getPasswordStrengthInfo = (score: number) => {
    switch (score) {
        case 0:
            return { color: '#ff4d4d', text: 'Very Weak', percentage: 20 };
        case 1:
            return { color: '#ffa64d', text: 'Weak', percentage: 40 };
        case 2:
            return { color: '#ffdd4d', text: 'Fair', percentage: 60 };
        case 3:
            return { color: '#4dff88', text: 'Good', percentage: 80 };
        case 4:
            return { color: '#2ecc71', text: 'Strong', percentage: 100 };
        default:
            return { color: '#ccc', text: 'None', percentage: 0 };
    }
};


export const formatTimeToCrack = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
    if (seconds < 315360000) return `${Math.round(seconds / 31536000)} years`;
    return 'centuries';
};


export const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};