import { useContext } from 'react';
import { AuthContext } from '../context/contexts';

export const useAuth = () => {
    // console.log('useAuth hook called');
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
