import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { apiFetch } from '../../lib/api';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Memverifikasi email...');

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setMessage('Token verifikasi tidak ditemukan');
        return;
      }

      try {
        const res = await apiFetch(`/auth/verify-email/${token}`);
        setMessage(res.message);

        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (err: any) {
        setMessage(err.message);
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Verifikasi Email</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}