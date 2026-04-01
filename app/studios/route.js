import { NextResponse } from 'next/server';
// สมมติว่าใช้ Supabase เป็น Database
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function GET() {
  const { data } = await supabase.from('studios').select('*');
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  
  // บันทึกข้อมูลใหม่ลงตาราง studios ตาม schema ที่คุณวางไว้
  const { data, error } = await supabase
    .from('studios')
    .insert([
      { 
        name: body.name, 
        lat: body.lat, 
        lng: body.lng, 
        open_time: body.open_time, 
        close_time: body.close_time,
        image_url: body.image_url 
      }
    ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}