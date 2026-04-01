import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase'; // ดึงค่า db ที่เราตั้งค่าไว้มาใช้
import { collection, getDocs, addDoc } from 'firebase/firestore';

// GET: ดึงข้อมูลห้องซ้อมทั้งหมดจาก Firebase
export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'studios'));
    const studios = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.id,
      ...doc.data()
    }));
    return NextResponse.json(studios);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: บันทึกข้อมูลห้องซ้อมใหม่ลง Firebase
export async function POST(request) {
  try {
    const body = await request.json();
    const docRef = await addDoc(collection(db, 'studios'), {
      name: body.name,
      lat: body.lat,
      lng: body.lng,
      open_time: body.open_time,
      close_time: body.close_time,
      image_url: body.image_url,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ id: docRef.id, message: "บันทึกสำเร็จ!" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}