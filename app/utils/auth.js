import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'auth_data';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const encryptData = (data) => {
    const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key';
    return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
};

export const decryptData = (encryptedData) => {
    try {
        const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key';
        const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        return null;
    }
};

export const setAuthData = (user, token) => {
    const authData = {
        user,
        token,
        expiresAt: Date.now() + TOKEN_EXPIRY
    };
    localStorage.setItem(STORAGE_KEY, encryptData(authData));
};

export const getAuthData = () => {
    const encryptedData = localStorage.getItem(STORAGE_KEY);
    if (!encryptedData) return null;

    const authData = decryptData(encryptedData);
    if (!authData) return null;

    // Check if token has expired
    if (Date.now() > authData.expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }

    return authData;
};

export const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEY);
};

export const getAuthHeaders = () => {
    const authData = getAuthData();
    return authData ? {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json'
    } : {};
};

export const isAuthenticated = () => {
    return getAuthData() !== null;
}; 