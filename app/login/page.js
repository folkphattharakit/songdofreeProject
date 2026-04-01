"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (id === 'project' && pass === 'project') {
      localStorage.setItem('isAdmin', 'true');
      alert("ยินดีต้อนรับ Admin!");
      router.push('/'); 
    } else {
      alert("ID หรือรหัสผ่านไม่ถูกต้อง!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Effects (แบบเดียวกับ Header ของหน้าหลัก) */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* --- ปุ่มย้อนกลับไปหน้าหลัก --- */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 text-indigo-200 hover:text-white flex items-center gap-2 transition-colors group z-20 font-medium bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-lg"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> 
        กลับหน้าหลัก
      </Link>
      {/* ----------------------- */}

      <div className="bg-white p-8 md:p-12 rounded-[3rem] w-full max-w-md shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-indigo-950 italic tracking-tighter uppercase mb-3">SONGDOFREE</h2>
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-4 border border-indigo-100 shadow-sm">
            <span className="text-lg">🔐</span> Admin Panel
          </div>
          <p className="text-slate-500 text-sm font-medium">เข้าสู่ระบบเพื่อจัดการข้อมูลห้องซ้อม</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-2 block">Admin ID</label>
            <input 
              type="text" required
              className="w-full bg-slate-50 border-none text-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              placeholder="กรอกไอดีผู้ดูแล..."
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-slate-500 text-xs font-black uppercase tracking-widest ml-2 block">Password</label>
            <input 
              type="password" required
              className="w-full bg-slate-50 border-none text-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
              placeholder="••••••••"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg py-4 rounded-2xl transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-indigo-200 mt-4">
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-slate-400 text-xs font-medium flex flex-col items-center gap-1.5">
          <span>เฉพาะผู้ดูแลระบบเท่านั้นที่มีสิทธิ์เข้าถึงหน้านี้</span>
        </div>
      </div>
    </div>
  );
}