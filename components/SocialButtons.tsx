import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { ImSpinner2 } from 'react-icons/im';
import { BsLinkedin } from 'react-icons/bs';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { useAuth, COOKIE_OPTIONS } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { baseUrl } from '@/utils/constant';
import { ROUTES } from '@/constants/routes';
import { STATUS_CODES } from '@/constants/statusCodes';

const SocialButtons = () => {
  const { setAuth } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const idToken = credentialResponse.credential;

      const res = await axios.post(`${baseUrl}/auth/google`, { idToken });
      const data = res.data;

      console.log('Google login response:', data); 

      const account = data?.data;
      const token = account?.token;

      if ((data.code === STATUS_CODES.OK || data.code === STATUS_CODES.CREATED) && account && token) {
        Cookies.set('accessToken', token, COOKIE_OPTIONS);
        setAuth(true, account, token);

        if (data.code === STATUS_CODES.CREATED) {
          showToast('success', 'Account Created', 'Welcome to Crevoe! Please complete your profile.');
        } else {
          showToast('success', 'Login Successful', 'Anyone with a link can now view this file.');
        }

        if (!account.profileSetupCompleted) {
          router.push(`${ROUTES.PROFILE(account.id)}`);
        } else {
          router.push(ROUTES.HOME);
        }

      } else if (data.code === "API_ERR_RESOURCE_NOT_FOUND") {
        showToast('info', 'Account not found', 'Please sign up to continue.');
      } else if (data.code && data.message) {
        showToast('error', 'Google Login Failed', data.message);
      } else {
        showToast('error', 'Google Login Failed', 'Unexpected server response. Please try again.');
      }
    } catch (error: any) {
      console.error('Google auth failed:', error);
      showToast('error', 'Google Login Failed', error?.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full my-3 flex flex-col gap-2">
      {loading ? (
        <div className="bg-white flex justify-center border-gray-600 border p-2.5 rounded-lg">
          <ImSpinner2 className="animate-spin text-2xl text-gray-600" />
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            showToast('error', 'Google Login Failed', 'Login was unsuccessful');
          }}
          logo_alignment="center"
        />
      )}

      <button
        type="button"
        disabled={loading}
        className="bg-white hover:bg-slate-300 flex justify-center border-gray-600 border p-2.5 text-sm cursor-pointer rounded-lg text-gray-800 w-full font-medium leading-6"
      >
        {loading ? (
          <ImSpinner2 className="animate-spin text-2xl text-gray-600" />
        ) : (
          <div className="flex items-center gap-2">
            <BsLinkedin className="text-xl" /> Sign In with LinkedIn
          </div>
        )}
      </button>
    </div>
  );
};

export default SocialButtons;