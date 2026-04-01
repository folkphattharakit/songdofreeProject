"use client";
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/navigation'; // นำเข้า useRouter

export default function AdminPage() {
  const router = useRouter();
  const [lang, setLang] = useState("th");
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '',
    phone: '',
    image_url: '',
    mapHtml: '', 
    open_time: '', 
    close_time: '',
    lat: '', // เพิ่ม lat
    lng: ''  // เพิ่ม lng
  });

  useEffect(() => {
    // 1. ตรวจสอบสิทธิ์ Admin
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.push('/'); // ถ้าไม่ใช่ Admin ให้กลับหน้าแรก
    }

    const loadLang = () => {
      const savedLang = localStorage.getItem("appLang") || "th";
      setLang(savedLang);
    };
    loadLang();
    window.addEventListener("languageChange", loadLang);
    return () => window.removeEventListener("languageChange", loadLang);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "studios"), {
        name: formData.name,
        price: Number(formData.price),
        phone: formData.phone,
        open_time: formData.open_time,
        close_time: formData.close_time,
        image_url: formData.image_url,
        image: formData.image_url, // เก็บไว้ทั้งสอง field เพื่อความชัวร์
        mapHtml: formData.mapHtml,
        lat: Number(formData.lat), // บันทึก lat เป็นตัวเลข
        lng: Number(formData.lng), // บันทึก lng เป็นตัวเลข
        createdAt: serverTimestamp()
      });
      
      alert(lang === 'th' ? "เพิ่มข้อมูลห้องซ้อมสำเร็จ!" : "Studio added successfully!");
      
      // กลับไปหน้าหลักเพื่อดูรายการที่เพิ่มใหม่
      router.push('/'); 
    } catch (error) {
      console.error("Error adding document: ", error);
      alert(lang === 'th' ? "เกิดข้อผิดพลาดในการบันทึก" : "Error saving data");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <Navbar onLanguageChange={setLang} />
      
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-[2.5rem] shadow-xl border border-gray-100">
        <h2 className="text-2xl font-black mb-8 text-slate-800 uppercase italic tracking-tight border-b pb-4">
          {lang === 'th' ? 'เพิ่มห้องซ้อมใหม่' : 'Add New Studio'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Studio Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Studio Name</label>
            <input 
              className="w-full border-2 border-slate-50 p-4 rounded-2xl outline-none focus:border-indigo-500 bg-slate-50 font-bold text-slate-900" 
              placeholder="ระบุชื่อห้องซ้อม" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          {/* Price & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Price (฿ / Hour)</label>
              <input 
                type="number"
                className="w-full border-2 border-slate-50 p-4 rounded-2xl outline-none focus:border-indigo-500 bg-slate-50 font-bold text-slate-900" 
                placeholder="500" 
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})} 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Phone</label>
              <input 
                className="w-full border-2 border-slate-50 p-4 rounded-2xl outline-none focus:border-indigo-500 bg-slate-50 font-bold text-slate-500" 
                placeholder="097XXXXXXX" 
                required
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Open Time</label>
              <input 
                type="time" 
                className="w-full border-2 border-slate-50 p-4 rounded-2xl outline-none focus:border-indigo-500 bg-slate-50 font-bold text-slate-900" 
                required
                value={formData.open_time}
                onChange={e => setFormData({...formData, open_time: e.target.value})} 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Close Time</label>
              <input 
                type="time" 
                className="w-full border-2 border-slate-50 p-4 rounded-2xl outline-none focus:border-indigo-500 bg-slate-50 font-bold text-slate-900" 
                required
                value={formData.close_time}
                onChange={e => setFormData({...formData, close_time: e.target.value})} 
              />
            </div>
          </div>

          {/* Lat & Lng (สำคัญมากสำหรับ Map) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-indigo-400 ml-2">Latitude</label>
              <input 
                className="w-full border-2 border-indigo-50 p-4 rounded-2xl outline-none focus:border-indigo-500 font-bold text-slate-900" 
                placeholder="13.xxxx" 
                required
                value={formData.lat}
                onChange={e => setFormData({...formData, lat: e.target.value})} 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-indigo-400 ml-2">Longitude</label>
              <input 
                className="w-full border-2 border-indigo-50 p-4 rounded-2xl outline-none focus:border-indigo-500 font-bold text-slate-900" 
                placeholder="100.xxxx" 
                required
                value={formData.lng}
                onChange={e => setFormData({...formData, lng: e.target.value})} 
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Image URL</label>
            <input 
              className="w-full border-2 border-slate-50 p-4 rounded-2xl outline-none focus:border-indigo-500 bg-slate-50 font-bold text-slate-900" 
              placeholder="https://..." 
              required
              value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})} 
            />
          </div>

          {/* Google Maps */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Google Maps (Iframe)</label>
            <textarea 
              className="w-full border-2 border-slate-50 p-4 rounded-2xl outline-none focus:border-indigo-500 bg-slate-50 font-mono text-[10px] text-slate-900" 
              placeholder='วางโค้ด <iframe src="..." ...></iframe>' 
              rows="3"
              required
              value={formData.mapHtml}
              onChange={e => setFormData({...formData, mapHtml: e.target.value})} 
            />
          </div>

          <button 
            type="submit"
            className="bg-indigo-600 text-white p-5 rounded-[2rem] font-black hover:bg-indigo-700 transition-all shadow-xl mt-4 uppercase italic tracking-widest active:scale-95"
          >
            {lang === 'th' ? 'บันทึกข้อมูลห้องซ้อม' : 'SAVE STUDIO DATA'}
          </button>
        </form>
      </div>
    </div>
  );
}