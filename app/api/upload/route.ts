import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'taari';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const isVideo = file.type.startsWith('video/');

  try {
    const result = isVideo
      ? await uploadVideo(buffer, folder)
      : await uploadImage(buffer, folder);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
