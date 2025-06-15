import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthData, setAuthData, clearAuthData, isAuthenticated } from '../utils/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const authData = getAuthData();
        if (authData) {
            setUser(authData.user);
            setToken(authData.token);
        }
        setLoading(false);
    }, []);

    const login = (userData, authToken) => {
        setAuthData(userData, authToken);
        setUser(userData);
        setToken(authToken);
    };

    const logout = () => {
        clearAuthData();
        setUser(null);
        setToken(null);
        router.push('/');
    };

    const checkAuth = () => {
        if (!isAuthenticated()) {
            logout();
            return false;
        }
        return true;
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            logout,
            checkAuth,
            isAuthenticated: isAuthenticated
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 