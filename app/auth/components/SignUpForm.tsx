'use client';
import Spinner from '@/components/Spinner';
import SocialButtons from '@/components/SocialButtons';
import { Input } from '@/components/Input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockIcon, Mail } from 'lucide-react';
import { Checkbox } from '@/components/ui/check-box';
import { AUTH_API } from '@/lib/api';
import { ROUTES } from '@/constants/routes';
import { useToast } from '@/context/ToastContext';
import { STATUS_CODES } from '@/constants/statusCodes';
import { Button } from '@/components/ui/button';

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      showToast(
        'error',
        "Bad request",
        'Please enter your email and password'
      );
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      showToast(
        'error',
        "Password length",
        'Password must be at least 8 characters'
      );
      setLoading(false);
      return;
    }

    try {
      const data = await AUTH_API.signUp({
        email,
        password
      }) as any;
      if (data.code === STATUS_CODES.CREATED) {
        showToast(
          'success',
          "Account Created",
          data.message
        );
        setLoading(false);
        router.push(`${ROUTES.VALIDATE_OTP(email)}`);
      } else {
        showToast(
          'error',
          data.message
        );
      }
    } catch (error: any) {
      if (error.message === "APIError: User already exists") {
        showToast(
          'error',
          "Duplicate account",
          'User already exists'
        );
        return;
      }
      showToast(
        'error',
        "An error occurred",
        error?.data[0] || "An error occurred"
      );
    } finally {
      setLoading(false);
      setLoading(false);
    }
  };

  const OrSeparator = () => (
    <div className="flex items-center gap-x-4 w-full mx-auto px-1.5 text-sm text-gray-400">
      <div className="h-[0.1rem] w-full bg-gray-300" />
      <div>OR</div>
      <div className="h-[0.1rem] w-full bg-gray-300" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <SocialButtons />
        <OrSeparator />
      </div>

      <form
        className="mx-auto mb-0 mt-3 max-w-md space-y-3"
        onSubmit={handleSubmit}
      >
        <Input
          leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
          label="Email"
          variant="text"
          id="email"
          name="email"
          placeholder="johndoe@strides.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        <Input
          leftIcon={<LockIcon className="h-5 w-5 text-gray-400" />}
          label="Password"
          variant="password"
          placeholder="*****"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div>
          <Input
            leftIcon={<LockIcon className="h-5 w-5 text-gray-400" />}
            label="Confirm Password"
            variant="password"
            placeholder="*****"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="confirmPassword"
            name="confirmPassword"
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div
            className="text-sm flex items-center gap-2"
          >
            <Checkbox />
            <span>Remember Password</span>
          </div>
          <div
            onClick={() => router.push("/auth/forgot-password")}
            className="text-primary text-sm hover:cursor-pointer font-semibold"
          >
            Forgot password?
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading || !email || !password || !confirmPassword || password !== confirmPassword}
          className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
        >
          {loading ? (
            <Spinner className={""} />
          ) : (
            "Create an account with Crevoe"
          )}
        </Button>

        <div>
          <p className="text-[10px] text-center w-10/12 mx-auto leading-5">By creating an account, you agree to our Terms of Service and Privacy & Cookie Statement.</p>
        </div>
      </form>
    </div>
  );
}
