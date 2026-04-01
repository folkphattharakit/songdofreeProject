"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import Navbar from '@/components/Navbar';
import StudioCard from '@/components/StudioCard';
import MainMap from '@/components/MainMap';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from 'next/link';
import { translations } from '@/constants/languages';

export default function Home() {
  const [user, setUser] = useState(null);
  const [studios, setStudios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudioForDetail, setSelectedStudioForDetail] = useState(null);
  const [lang, setLang] = useState('th');

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin === 'true') {
      setUser({ id: "project-admin", role: "admin" });
    }
    fetchStudios();
    const loadLang = () => {
      const savedLang = localStorage.getItem('appLang') || 'th';
      setLang(savedLang);
    };
    loadLang();
    window.addEventListener('languageChange', loadLang);
    return () => window.removeEventListener('languageChange', loadLang);
  }, []);

  const t = translations[lang] || translations.th;

  const fetchStudios = async () => {
    try {
      const q = query(collection(db, "studios"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudios(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setUser(null);
  };

  const filteredStudios = studios.filter((studio) =>
    studio.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafaff] font-sans text-slate-900">
      <Navbar user={user} onLogout={handleLogout} onLanguageChange={setLang} />

      {/* --- SECTION: COMPACT HERO --- */}
      <header className="relative flex items-center justify-center text-white pt-20 pb-14 px-4 text-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[30%] h-[60%] rounded-full bg-indigo-600/20 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[30%] h-[60%] rounded-full bg-purple-600/20 blur-[100px] animate-pulse delay-700"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-3 uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-purple-400 drop-shadow-sm">
            {t.heroTitle}
          </h1>
          <p className="text-indigo-100/70 text-xs md:text-sm mb-8 font-medium max-w-lg mx-auto leading-relaxed">
            {t.heroDesc}
          </p>

          <div className="max-w-xs md:max-w-sm mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-20 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center bg-white/95 backdrop-blur-sm rounded-xl p-0.5 shadow-xl">
              <span className="pl-3 text-sm">🔍</span>
              <input
                type="text"
                placeholder={lang === 'th' ? "ค้นหาชื่อห้อง..." : "Search..."}
                className="w-full pl-2 pr-8 py-2.5 rounded-lg text-slate-800 outline-none font-bold text-xs bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 text-slate-400 hover:text-red-500 transition-colors text-xs">✕</button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 w-full leading-[0] fill-[#fafaff]">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.47,105.77,113.62,110,172,105.48,235.54,100.5,296.2,85.6,321.39,56.44Z"></path>
            </svg>
        </div>
      </header>

      {/* --- SECTION: MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          <motion.aside className="w-full lg:w-1/3 order-1 lg:sticky lg:top-24">
            <div className="bg-white/80 backdrop-blur-md p-2 rounded-[2.5rem] shadow-xl border border-white/50 overflow-hidden">
              <div className="p-5 pb-2 flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-800 italic uppercase tracking-tighter">📍 {t.location}</h2>
                <span className="bg-indigo-600 text-white text-[10px] px-3 py-1 rounded-full font-black animate-pulse">MAP</span>
              </div>
              <div className="rounded-[2rem] overflow-hidden shadow-inner h-[450px] lg:h-[600px] border border-slate-50">
                <MainMap studios={studios} onOpenDetail={setSelectedStudioForDetail} lang={lang} />
              </div>
              <p className="text-slate-400 text-center text-[10px] py-3 font-bold uppercase tracking-widest">{t.clickPin}</p>
            </div>
          </motion.aside>

          <div className="w-full lg:w-2/3 order-2">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
                  {searchTerm ? `Results for: ${searchTerm}` : t.studioList}
                </h2>
                <p className="text-indigo-600 font-black text-xs mt-2 uppercase tracking-widest">
                  {lang === 'th' ? `พบทั้งหมด ${filteredStudios.length} แห่ง` : `Found ${filteredStudios.length} studios`}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Link href="/all-studios" className="flex-1 md:flex-none border-2 border-slate-900 px-6 py-3 rounded-xl text-[10px] font-black hover:bg-slate-900 hover:text-white transition-all text-center uppercase tracking-widest">
                  {t.viewAll} →
                </Link>
                {/* เปลี่ยนปุ่ม Add ให้ Link ไปหน้า Admin เเทน */}
                {user?.role === 'admin' && (
                  <Link href="/admin" className="flex-1 md:flex-none bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] hover:shadow-lg transition-all uppercase tracking-widest text-center">
                    + Add Studio
                  </Link>
                )}
              </div>
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode='popLayout'>
                {filteredStudios.length > 0 ? (
                  filteredStudios.map((studio, idx) => (
                    <motion.div key={studio.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2, delay: idx * 0.05 }}>
                      <StudioCard studio={studio} user={user} onDeleteSuccess={fetchStudios} lang={lang} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full border-2 border-dashed border-slate-200 rounded-[2.5rem] py-24 text-center bg-white">
                    <p className="text-slate-400 font-black uppercase italic">{lang === 'th' ? "ไม่พบข้อมูล..." : "No results..."}</p>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>

      {/* --- MODAL: DETAIL --- */}
      <AnimatePresence>
        {selectedStudioForDetail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-[200] p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
              <button onClick={() => setSelectedStudioForDetail(null)} className="absolute top-6 right-6 bg-slate-100 hover:bg-red-500 hover:text-white p-3 rounded-full text-slate-500 z-50 transition-all">✕</button>
              <div className="overflow-y-auto p-8 md:p-10 pt-8">
                <h2 className="text-4xl font-black text-slate-900 italic mb-6 uppercase tracking-tighter">{selectedStudioForDetail.name}</h2>
                <div className="rounded-[2rem] overflow-hidden mb-8 shadow-lg">
                  <img src={selectedStudioForDetail.image_url || selectedStudioForDetail.image} className="w-full h-64 md:h-80 object-cover" alt={selectedStudioForDetail.name} />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Price</p>
                    <p className="text-2xl font-black">฿{selectedStudioForDetail.price}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Hours</p>
                    <p className="text-xl font-black">{selectedStudioForDetail.open_time} - {selectedStudioForDetail.close_time}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <p className="font-black text-slate-900 italic uppercase">📍 Map Location</p>
                    <a href={`https://www.google.com/maps?q=${selectedStudioForDetail.lat},${selectedStudioForDetail.lng}`} target="_blank" className="text-[10px] font-black text-indigo-600 underline">GOOGLE MAPS</a>
                  </div>
                  <div className="rounded-[2rem] overflow-hidden h-64 border-4 border-slate-50" dangerouslySetInnerHTML={{ __html: selectedStudioForDetail.mapHtml }} />
                  <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">Contact Number</span>
                    <span className="text-3xl font-black tracking-tighter">{selectedStudioForDetail.phone}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}