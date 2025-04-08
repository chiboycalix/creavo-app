'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { googleClientId } from '@/utils/constant';

const GoogleProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <GoogleOAuthProvider clientId={googleClientId || ''}>
        {children}
    </GoogleOAuthProvider>
);

export default GoogleProviderWrapper;
