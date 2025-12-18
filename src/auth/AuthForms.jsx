import React, { useState } from 'react';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import { Card, Button, Input, Alert } from '../components/ui.jsx'; 
import { apiClient } from '../api/apiClient.jsx'; 

export const LoginForm = ({ onLoginSuccess, onViewChange }) => {
  const [email, setEmail] = useState('admin@example.com'); 
  const [password, setPassword] = useState('password123'); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const response = await apiClient('/api/auth/login', 'POST', { email, password });
        
        if (response.success && response.token) {
            onLoginSuccess(response.token, response.user);
        } else {
            // Ini seharusnya ditangani oleh catch jika response.ok adalah false, tapi jika server mengirim success: false
            setError(response.message || 'Gagal masuk. Coba lagi.');
        }
    } catch (err) {
        // Sekarang err.message seharusnya berisi pesan error dari API
        setError(err.message || 'Terjadi kesalahan saat koneksi API. Cek konsol untuk detail.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-20 p-8">
      <div className="flex flex-col items-center mb-6">
        <LogIn className="h-8 w-8 text-blue-600 mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Masuk</h2>
        <p className="text-sm text-gray-500">Akses Sistem Lead Scoring Bank</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert message={error} type="error" />
        <div>
          <label className="text-sm font-medium leading-none mb-1 block">Email</label>
          <Input type="email" placeholder="admin@example.com" onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium leading-none mb-1 block">Password</label>
          <Input type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isLoading ? 'Memproses...' : 'Masuk ke Dashboard'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Belum punya akun?{' '}
        <Button variant="link" onClick={() => onViewChange('register')} className="p-0 h-auto">
          Daftar Sekarang
        </Button>
      </p>
    </Card>
  );
};

export const RegisterForm = ({ onViewChange }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Konfirmasi Password tidak cocok.');
      setIsLoading(false);
      return;
    }

    try {
        const response = await apiClient('/api/auth/register', 'POST', { name, email, password });
        
        if (response.success) {
            setSuccess(true);
            setTimeout(() => onViewChange('login'), 2000); // Redirect ke login setelah 2 detik
        } else {
            setError(response.message || 'Pendaftaran gagal.');
        }
    } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat koneksi API. Cek konsol untuk detail.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-8">
      <div className="flex flex-col items-center mb-6">
        <UserPlus className="h-8 w-8 text-blue-600 mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Daftar Akun Baru</h2>
        <p className="text-sm text-gray-500">Untuk Akses Tim Sales</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert message={error} type="error" />
        <Alert message={success ? 'Pendaftaran berhasil! Mengalihkan ke halaman Masuk...' : ''} type="success" />
        
        <div>
          <label className="text-sm font-medium leading-none mb-1 block">Nama Lengkap</label>
          <Input type="text" placeholder="Nama Anda" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium leading-none mb-1 block">Email (Digunakan untuk Masuk)</label>
          <Input type="email" placeholder="email@bank.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium leading-none mb-1 block">Password</label>
          <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </div>
        <div>
          <label className="text-sm font-medium leading-none mb-1 block">Konfirmasi Password</label>
          <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isLoading ? 'Mendaftar...' : 'Daftar'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Button variant="link" onClick={() => onViewChange('login')} className="p-0 h-auto">
          Masuk
        </Button>
      </p>
    </Card>
  );
};