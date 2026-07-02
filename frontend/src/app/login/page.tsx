import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In — ticktock',
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/dashboard');

  return (
    <div className="flex min-h-screen">
      {/* ── Left: form panel ─────────────────────────────── */}
      <div className="flex w-full flex-col items-start justify-center px-6 py-12 sm:px-10 sm:py-16 md:w-1/2 bg-white">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="mb-8 text-2xl font-bold text-gray-900">Welcome back</h1>
          <LoginForm />
        </div>
      </div>

      {/* ── Right: branding panel ─────────────────────────── */}
      <div className="hidden md:flex md:w-1/2 flex-col items-start justify-end bg-blue-600 px-14 py-16">
        <div className="max-w-sm">
          <h2 className="mb-4 text-3xl font-bold text-white">ticktock</h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Introducing ticktock, our cutting-edge timesheet web application designed
            to revolutionize how you manage employee work hours. With ticktock, you
            can effortlessly track and monitor employee attendance and productivity
            from anywhere, anytime, using any internet-connected device.
          </p>
        </div>
      </div>
    </div>
  );
}
