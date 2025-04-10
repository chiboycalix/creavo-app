"use client";
import SocialButtons from "@/components/SocialButtons";
import { Input } from "@/components/Input";
import Cookies from "js-cookie";
import { useState } from "react";
import { LockIcon, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { COOKIE_OPTIONS, useAuth } from "@/context/AuthContext";
import { AUTH_API } from "@/lib/api/";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { STATUS_CODES } from "@/constants/statusCodes";
import { useToast } from "@/context/ToastContext";
import Spinner from "@/components/Spinner";
import { Checkbox } from "@/components/ui/check-box";

export default function SignInForm() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast, removeToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    try {
      const data = (await AUTH_API.signIn({
        email: email,
        password: password,
      })) as any;
      if (data.code === STATUS_CODES.OK) {
        Cookies.set("accessToken", data.data.token, COOKIE_OPTIONS);
        setAuth(true, data.data, data.data.token);
        showToast(
          'success',
          'Login Successful',
          'Anyone with a link can now view this file.'
        );
        if (!data.data.profileSetupCompleted) {
          router.push(`${ROUTES.PROFILE(data?.data?.id)}`);
          return;
        }
        router.push(ROUTES.HOME);
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      if (error.code === "API_ERR_INVALID_LOGIN") {
        showToast(
          'error',
          error.message,
          'Please check your email and password'
        );
        return;
      }
      if (error.data[0] === "Your account has not been verified. Check email for otp") {
        router.push(`${ROUTES.VALIDATE_OTP(email)}`);
        showToast(
          'error',
          'Enter your OTP',
          'Your account has not been verified. Check email for otp'
        );
        return;
      }
      showToast(
        'error',
        'Internal Server Error',
        'Something went wrong. Please try again later'
      );
    } finally {
      setLoading(false);
      removeToast(10000);
    }
  };

  const OrSeparator = () => (
    <div className="flex items-center gap-x-4 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto px-4 text-sm text-gray-400">
      <div className="h-[0.1rem] w-full bg-gray-300" />
      <div>OR</div>
      <div className="h-[0.1rem] w-full bg-gray-300" />
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="w-full">
        <SocialButtons />
        <OrSeparator />
      </div>

      <form
        className="mx-auto mb-0 mt-4 w-full space-y-4"
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
          className="w-full text-sm sm:text-base"
        />
        <Input
          leftIcon={<LockIcon className="h-5 w-5 text-gray-400" />}
          label="Password"
          variant="password"
          id="password"
          name="password"
          placeholder="*****"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-sm sm:text-base"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="text-sm flex items-center gap-2">
            <Checkbox />
            <span>Remember Password</span>
          </div>
          <div
            onClick={() => router.push("/auth/forgot-password")}
            className="text-primary text-sm hover:cursor-pointer font-semibold hover:underline"
          >
            Forgot password?
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !email || !password}
          className="bg-primary h-12 sm:h-[50px] border-0 p-2.5 text-sm sm:text-base cursor-pointer rounded-lg text-white w-full font-medium leading-6 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <Spinner /> : "Sign In with Crevoe"}
        </Button>

        <div>
          <p className="text-[10px] sm:text-xs text-center w-full mx-auto leading-5 text-gray-600">
            By creating an account, you agree to our{" "}
            <a href="#" className="font-semibold text-gray-800 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-semibold text-gray-800 hover:underline">
              Privacy & Cookie Statement
            </a>.
          </p>
        </div>
      </form>
    </div>
  );
}