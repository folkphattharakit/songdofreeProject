"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import StudioCard from "@/components/StudioCard";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { translations } from "@/constants/languages";

export default function AllStudiosPage() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // --- การจัดการภาษาผ่าน LocalStorage & Event ---
  const [lang, setLang] = useState("th");

  useEffect(() => {
    // ฟังก์ชันสำหรับโหลดภาษาจากเครื่อง
    const loadLang = () => {
      const savedLang = localStorage.getItem("appLang") || "th";
      setLang(savedLang);
    };

    loadLang(); // โหลดครั้งแรกตอนเข้าหน้า

    // ดักฟัง Event 'languageChange' จาก Navbar
    window.addEventListener("languageChange", loadLang);
    return () => window.removeEventListener("languageChange", loadLang);
  }, []);

  const t = translations[lang] || translations.th;
  
  const [sortType, setSortType] = useState("default");
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "studios"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudios(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getFilteredStudios = () => {
    let result = [...studios];

    if (showOnlyOpen) {
      const now = new Date();
      const nowH = now.getHours();
      const nowM = now.getMinutes();
      const currentTime = nowH * 100 + nowM;

      result = result.filter((studio) => {
        if (!studio.open_time || !studio.close_time) return false;
        const [openH, openM] = studio.open_time.split(":").map(Number);
        const [closeH, closeM] = studio.close_time.split(":").map(Number);
        const open = openH * 100 + openM;
        const close = closeH * 100 + closeM;

        if (open < close) {
          return currentTime >= open && currentTime < close;
        } else {
          return currentTime >= open || currentTime < close;
        }
      });
    }

    if (sortType === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortType === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  };

  const filteredData = getFilteredStudios();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ส่ง onLanguageChange ไปด้วยเพื่อความชัวร์ในการ Update State */}
      <Navbar user={user} onLanguageChange={setLang} lang={lang} />

      <div className="bg-white shadow-sm sticky top-[64px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {lang === 'th' ? 'กลับหน้าหลัก' : lang === 'en' ? 'Back to Home' : '返回首页'}
          </Link>
          <h1 className="text-xl font-black text-gray-800">{t.studioList}</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <p className="text-gray-500 font-medium">
                {lang === 'th' ? `พบทั้งหมด ${filteredData.length} แห่งในระบบ` 
                 : lang === 'en' ? `Found ${filteredData.length} studios` 
                 : `发现 ${filteredData.length} 家工作室`}
              </p>
              
              <div className="flex flex-wrap gap-3">
                <select 
                  className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  onChange={(e) => setSortType(e.target.value)}
                  value={sortType}
                >
                  <option value="default">{lang === 'th' ? 'เรียงตาม: ล่าสุด' : lang === 'en' ? 'Sort by: Latest' : '排序: 最新'}</option>
                  <option value="price-low">{lang === 'th' ? 'ราคา: น้อยไปมาก' : lang === 'en' ? 'Price: Low to High' : '价格: 从低到高'}</option>
                  <option value="price-high">{lang === 'th' ? 'ราคา: มากไปน้อย' : lang === 'en' ? 'Price: High to Low' : '价格: 从高到低'}</option>
                </select>

                <button
                  onClick={() => setShowOnlyOpen(!showOnlyOpen)}
                  className={`py-2 px-4 rounded-xl text-sm font-bold transition-all shadow-sm ${
                    showOnlyOpen 
                    ? "bg-indigo-600 text-white" 
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {showOnlyOpen 
                    ? (lang === 'th' ? "✓ กำลังเปิดอยู่" : lang === 'en' ? "✓ Open Now" : "✓ 营业中")
                    : (lang === 'th' ? "แสดงเฉพาะร้านที่เปิด" : lang === 'en' ? "Show only open" : "仅显示营业中")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredData.length > 0 ? (
                filteredData.map((studio) => (
                  <StudioCard key={studio.id} studio={studio} lang={lang} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                   <p className="text-gray-400 font-bold">
                     {lang === 'th' ? 'ไม่พบร้านที่ตรงตามเงื่อนไขที่คุณเลือก' 
                      : lang === 'en' ? 'No studios found matching your criteria' 
                      : '未找到符合条件的录音室'}
                   </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}