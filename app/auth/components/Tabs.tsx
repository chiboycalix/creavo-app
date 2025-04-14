'use client';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface TabsProps {
  tab: string;
}

export function Tabs({ tab }: TabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (newTab: string) => {
    router.push(`${pathname}?tab=${newTab}`);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 lg:px-8 flex-1">
      <div className="mb-4 sm:mb-6">
        <Button
          className="w-full bg-primary-100 text-black hover:bg-primary-200 h-10 sm:h-12 text-sm sm:text-base rounded-lg"
          onClick={() => router.push('/')}
        >
          Explore
        </Button>
      </div>

      <div className="flex w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto bg-primary-100 p-1 sm:p-2 rounded-xl gap-2">
        <Button
          className={`w-full text-[#454545] text-sm sm:text-base h-10 sm:h-12 ${tab === 'signin'
            ? "bg-primary-200 font-bold hover:bg-primary-300"
            : "bg-transparent hover:bg-primary-200"
            }`}
          onClick={() => handleTabChange('signin')}
        >
          Sign In
        </Button>

        <Button
          className={`w-full text-[#454545] text-sm sm:text-base h-10 sm:h-12 ${tab === 'signup'
            ? "bg-primary-200 font-bold hover:bg-primary-300"
            : "bg-transparent hover:bg-primary-200"
            }`}
          onClick={() => handleTabChange('signup')}
        >
          Create an Account
        </Button>
      </div>

      <div className="mt-6 sm:mt-8">
        {tab === 'signin' && <SignInForm />}
        {tab === 'signup' && <SignUpForm />}
      </div>
    </div>
  );
}