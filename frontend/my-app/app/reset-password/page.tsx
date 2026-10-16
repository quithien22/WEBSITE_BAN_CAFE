import { Suspense } from 'react';
import ResetPassword from '../../components/pages/auth/ResetPassword';

export default function ResetPasswordPage() {
  return (
    <div className="bg-white min-h-screen">
      <Suspense fallback={null}>
        <ResetPassword />
      </Suspense>
    </div>
  );
}