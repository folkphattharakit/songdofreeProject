"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { translations } from '@/constants/languages';

// รับ props onLanguageChange เพิ่มเติมเพื่อแจ้งการเปลี่ยนภาษาไปยังหน้าหลัก
export default function Navbar({ user, onLogout, onLanguageChange }) {
  const [lang, setLang] = useState('th');

  useEffect(() => {
    // 1. ดึงค่าจาก localStorage เมื่อโหลด Component
    const savedLang = localStorage.getItem('appLang') || 'th';
    setLang(savedLang);
    // แจ้งหน้าหลัก (ถ้ามีฟังก์ชันรอรับอยู่)
    if (onLanguageChange) onLanguageChange(savedLang);
  }, [onLanguageChange]);

  const changeLanguage = (langCode) => {
    setLang(langCode);
    localStorage.setItem('appLang', langCode);
    
    // 2. แจ้งหน้าอื่นๆ ผ่าน Props (สำหรับ React State)
    if (onLanguageChange) onLanguageChange(langCode);
    
    // 3. แจ้งหน้าอื่นๆ ผ่าน Event (สำหรับหน้าที่ไม่ได้ใช้ props ร่วมกัน)
    window.dispatchEvent(new Event('languageChange'));
  };

  const t = translations[lang] || translations.th;

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold text-indigo-600">SONGDOFREE</Link>
      
      <div className="space-x-6 flex items-center">
        {/* Language Switcher */}
        <div className="flex items-center gap-2 border-r pr-6 border-gray-100">
          <button 
            onClick={() => changeLanguage('th')}
            className={`hover:scale-110 transition-transform p-1 rounded-md text-xl ${lang === 'th' ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'}`}
            title="ภาษาไทย"
          >
            🇹🇭
          </button>
          <button 
            onClick={() => changeLanguage('en')}
            className={`hover:scale-110 transition-transform p-1 rounded-md text-xl ${lang === 'en' ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'}`}
            title="English"
          >
            🇺🇸
          </button>
          <button 
            onClick={() => changeLanguage('cn')}
            className={`hover:scale-110 transition-transform p-1 rounded-md text-xl ${lang === 'cn' ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'}`}
            title="中文 (Chinese)"
          >
            🇨🇳
          </button>
        </div>

        <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">
          {t.home}
        </Link>
        
        {!user ? (
          <Link 
            href="/login" 
            className="text-gray-500 hover:text-red-600 text-sm border-l pl-6 transition-colors"
          >
            {t.admin}
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-red-500 font-bold text-sm">ADMIN MODE</span>
            <button onClick={onLogout} className="text-gray-500 hover:text-red-500 text-sm underline">
              {t.logout}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}