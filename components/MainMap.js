"use client";
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { useState } from "react";

// --- เพิ่มส่วนนี้เพื่อดึงคำแปล (ถ้าคุณแยกไฟล์ไว้) ---
import { translations } from '@/constants/languages';

export default function MainMap({ studios, onOpenDetail, lang }) { // <--- รับ lang เข้ามา
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, 
  });

  const [selectedStudio, setSelectedStudio] = useState(null);

  // ดึงชุดคำแปลมาใช้ (เพื่อให้คำว่า "ราคา" หรือ "ดูรายละเอียด" เปลี่ยนตาม)
  const t = translations[lang] || translations.th;

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-full h-full">
      <GoogleMap zoom={13} center={{ lat: 13.819, lng: 100.044 }} mapContainerClassName="w-full h-full">
        {studios.map((studio) => (
          <MarkerF
            key={studio.id}
            position={{ lat: parseFloat(studio.lat), lng: parseFloat(studio.lng) }}
            onClick={() => setSelectedStudio(studio)}
          />
        ))}

        {selectedStudio && (
          <InfoWindowF
            position={{ lat: parseFloat(selectedStudio.lat), lng: parseFloat(selectedStudio.lng) }}
            onCloseClick={() => setSelectedStudio(null)}
          >
            <div className="p-2 min-w-[180px] bg-white font-sans">
              <h3 className="font-bold text-indigo-900 text-sm mb-2">{selectedStudio.name}</h3>
              
              <div className="flex items-center justify-between mb-3 pb-2 border-b">
                {/* --- แก้ไข: ใช้เงื่อนไขภาษาสำหรับคำว่า "ราคา" --- */}
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {lang === 'th' ? 'ราคา' : lang === 'en' ? 'Price' : '价格'}
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  {selectedStudio.price} {lang === 'th' ? 'บาท/ชม.' : lang === 'en' ? 'Baht/hr.' : '铢/小时'}
                </span>
              </div>

              <button 
                onClick={() => {
                  onOpenDetail(selectedStudio);
                  setSelectedStudio(null);
                }}
                className="w-full bg-indigo-600 text-white text-[10px] py-2 rounded-lg font-bold"
              >
                {/* --- แก้ไข: ใช้เงื่อนไขภาษาสำหรับปุ่ม --- */}
                {lang === 'th' ? 'ดูรายละเอียดเพิ่มเติม' : lang === 'en' ? 'View Details' : '查看详情'}
              </button>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}