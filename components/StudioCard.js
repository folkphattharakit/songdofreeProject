import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, collection, addDoc, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { translations } from '@/constants/languages';

export default function StudioCard({ studio, user, onDeleteSuccess, lang }) {
  const [showDetail, setShowDetail] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [bookings, setBookings] = useState([]);
  const [bookingForm, setBookingForm] = useState({ name: '', date: '', time: '', duration: '1' });

  const t = translations[lang] || translations.th;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showDetail) {
      const q = query(collection(db, "bookings"), where("studioId", "==", studio.id));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const now = new Date();
        const validBookings = docs.filter(b => b.expireAt && b.expireAt.toDate() > now);
        setBookings(validBookings.sort((a, b) => a.expireAt - b.expireAt));
      });
      return () => unsubscribe();
    }
  }, [showDetail, studio.id]);

  const getIsOpen = () => {
    if (!studio.open_time || !studio.close_time) return null;
    const nowH = currentTime.getHours();
    const nowM = currentTime.getMinutes();
    const now = nowH * 100 + nowM;
    const [openH, openM] = studio.open_time.split(':').map(Number);
    const [closeH, closeM] = studio.close_time.split(':').map(Number);
    const open = openH * 100 + openM;
    const close = closeH * 100 + closeM;
    if (open < close) {
      return now >= open && now < close;
    } else {
      return now >= open || now < close;
    }
  };

  const isOpen = getIsOpen();

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.date || !bookingForm.time) {
      alert(lang === 'th' ? "กรุณากรอกข้อมูลให้ครบถ้วน" : "Please fill in all fields");
      return;
    }
    try {
      const startDate = new Date(`${bookingForm.date}T${bookingForm.time}`);
      
      const hoursToRent = parseInt(bookingForm.duration) || 1; 
      const expireDate = new Date(startDate.getTime() + (hoursToRent * 60 * 60 * 1000));
      
      const endTimeStr = expireDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      await addDoc(collection(db, "bookings"), {
        studioId: studio.id,
        userName: bookingForm.name,
        bookingDate: bookingForm.date,
        startTime: bookingForm.time,
        endTime: endTimeStr,
        expireAt: Timestamp.fromDate(expireDate),
        createdAt: Timestamp.now()
      });

      setBookingForm({ name: '', date: '', time: '', duration: '1' });
      alert(lang === 'th' ? "จองสำเร็จ!" : "Booked successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleDelete = async () => {
    const confirmMsg = lang === 'th' 
      ? `คุณแน่ใจใช่ไหมว่าจะลบห้องซ้อม "${studio.name}"?` 
      : `Are you sure you want to delete "${studio.name}"?`;

    if (window.confirm(confirmMsg)) {
      try {
        await deleteDoc(doc(db, "studios", studio.id));
        alert(lang === 'th' ? "ลบข้อมูลสำเร็จ!" : "Deleted successfully!");
        onDeleteSuccess(); 
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden relative border border-gray-100 flex flex-col hover:shadow-lg transition-shadow duration-300">
        {user?.role === 'admin' && (
          <button onClick={handleDelete} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 z-10 transition-transform active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
        <div className="w-full h-48 bg-gray-200">
          <img src={studio.image_url} className="w-full h-full object-cover" alt={studio.name} />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-bold text-gray-800">{studio.name}</h3>
            {isOpen !== null && (
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {isOpen ? `● ${lang === 'en' ? 'Open Now' : lang === 'cn' ? '营业中' : 'เปิดอยู่'}` : `○ ${t.statusClosed}`}
              </span>
            )}
          </div>
          <div className="flex items-center mt-2 space-x-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
              {t.open} {studio.open_time} - {studio.close_time} {lang === 'th' ? 'น.' : ''}
            </span>
            <span className="text-sm text-indigo-600 font-bold">฿{studio.price}{t.priceUnit}</span>
          </div>
          <button onClick={() => setShowDetail(true)} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 mt-4 transition-colors active:scale-95">
            {t.details}
          </button>
        </div>
      </div>

      {showDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start overflow-y-auto z-[1000] p-4 md:py-12 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-300 my-auto">
            <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center z-20 rounded-t-2xl shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800">{studio.name}</h2>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600 text-4xl leading-none">&times;</button>
            </div>

            <div className="p-6">
              <img src={studio.image_url} className="w-full h-72 object-cover rounded-xl mb-8 shadow-md border border-gray-100" alt={studio.name} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                    <p className="text-indigo-600 font-bold mb-1 flex items-center gap-1.5">💸 {lang === 'th' ? 'ราคาเช่า' : lang === 'en' ? 'Rental Price' : '租金'}</p>
                    <p className="text-2xl font-black text-indigo-900">฿{studio.price} <span className="text-sm font-normal text-gray-500">{t.priceUnit}</span></p>
                  </div>
                  <div className="bg-green-50 p-5 rounded-xl border border-green-100 relative">
                    <p className="text-green-600 font-bold mb-1 flex items-center gap-1.5">⏰ {t.open}</p>
                    <p className="text-lg font-bold text-green-900">{studio.open_time} - {studio.close_time} {lang === 'th' ? 'น.' : ''}</p>
                    {isOpen !== null && (
                      <span className={`text-[11px] font-bold mt-2 block ${isOpen ? "text-green-600" : "text-red-600"}`}>
                        {isOpen ? (lang === 'th' ? "สถานะ: เปิดอยู่" : "Status: Open") : (`${lang === 'th' ? 'สถานะ: ' : 'Status: '} ${t.statusClosed}`)}
                      </span>
                    )}
                  </div>
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                    <p className="text-blue-600 font-bold mb-1 flex items-center gap-1.5">📞 {lang === 'th' ? 'ช่องทางการติดต่อ' : lang === 'en' ? 'Contact' : '联系方式'}</p>
                    <p className="text-lg font-bold text-blue-900">{studio.phone || (lang === 'th' ? 'ไม่ระบุเบอร์โทรศัพท์' : 'N/A')}</p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-gray-700 mb-3 flex items-center gap-1.5">📍 {t.location}</p>
                  {studio.mapHtml ? (
                    <div className="w-full h-[280px] rounded-xl overflow-hidden border-2 border-gray-100 shadow-inner [&>iframe]:w-full [&>iframe]:h-full" dangerouslySetInnerHTML={{ __html: studio.mapHtml }} />
                  ) : (
                    <div className="w-full h-[280px] bg-gray-100 rounded-xl flex items-center justify-center italic text-gray-400 border border-dashed">
                      {lang === 'th' ? 'ยังไม่มีข้อมูลแผนที่' : 'No map data available'}
                    </div>
                  )}
                </div>
              </div>

              <hr className="my-8" />

              <div className="mb-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">📅 {lang === 'th' ? 'จองห้องซ้อม' : 'Book Studio'}</h4>
                <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" placeholder={lang === 'th' ? "ชื่อผู้จอง" : "Name"} value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})} className="border p-3 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none bg-white" />
                  <input type="date" value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} className="border p-3 rounded-xl text-sm text-gray-900 bg-white" />
                  <input type="time" value={bookingForm.time} onChange={e => setBookingForm({...bookingForm, time: e.target.value})} className="border p-3 rounded-xl text-sm text-gray-900 bg-white" />
                  
                  <select 
                    value={bookingForm.duration} 
                    onChange={e => setBookingForm({...bookingForm, duration: e.target.value})}
                    className="border p-3 rounded-xl text-sm text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="1">1 {lang === 'th' ? 'ชั่วโมง' : 'Hour'}</option>
                    <option value="2">2 {lang === 'th' ? 'ชั่วโมง' : 'Hours'}</option>
                    <option value="3">3 {lang === 'th' ? 'ชั่วโมง' : 'Hours'}</option>
                    <option value="4">4 {lang === 'th' ? 'ชั่วโมง' : 'Hours'}</option>
                    <option value="5">5 {lang === 'th' ? 'ชั่วโมง' : 'Hours'}</option>
                  </select>

                  <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg">
                    {lang === 'th' ? 'ยืนยันการจอง' : 'Confirm Booking'}
                  </button>
                </form>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-700 mb-4">📋 {lang === 'th' ? 'รายชื่อการจอง' : 'Booking List'}</h4>
                <div className="space-y-3">
                  {bookings.length > 0 ? bookings.map(b => (
                    <div key={b.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500 flex justify-between items-center animate-in slide-in-from-left duration-300">
                      <div>
                        <p className="font-bold text-gray-900">{b.userName}</p>
                        <p className="text-xs text-gray-500">
                          {b.bookingDate} | {b.startTime} - {b.endTime || '--:--'} น.
                        </p>
                      </div>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-black uppercase tracking-tighter">RESERVED</span>
                    </div>
                  )) : (
                    <p className="text-center py-6 text-gray-400 text-sm italic">{lang === 'th' ? 'ยังไม่มีการจองในขณะนี้' : 'No bookings yet'}</p>
                  )}
                </div>
              </div>

              <button onClick={() => setShowDetail(false)} className="w-full mt-10 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
                {lang === 'th' ? 'ปิดหน้าต่างนี้' : lang === 'en' ? 'Close' : '关闭'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}