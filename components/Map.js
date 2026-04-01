export default function Map({ studios }) {
  return (
    <div className="w-full h-full bg-blue-50 flex flex-col items-center justify-center relative">
      {/* ส่วนนี้จำลองว่าเป็นหน้าจอแผนที่ */}
      <div className="text-indigo-400 font-medium">Google Maps API Area</div>
      <p className="text-xs text-gray-400">นครปฐม (Nakhon Pathom)</p>
      
      {/* จำลองหมุดบนแผนที่ */}
      {studios.map((studio, index) => (
        <div 
          key={index}
          className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-125 transition-transform"
          style={{ top: `${40 + (index * 10)}%`, left: `${45 + (index * 5)}%` }}
          title={studio.name}
        />
      ))}
      
      <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow text-[10px]">
        Zoom: 12z
      </div>
    </div>
  );
}