// app/api/cloudinary/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_url } = body;

    if (!image_url) {
      return NextResponse.json({ success: false, error: 'Image URL is required' }, { status: 400 });
    }

    // Trích xuất public_id từ URL
    // URL format: https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[public_id].[format]
    const urlParts = image_url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const publicId = fileName.split('.')[0];

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'Could not extract public ID from URL' },
        { status: 400 },
      );
    }

    // Xóa ảnh từ Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    console.log('Cloudinary delete result:', result);

    if (result.result === 'ok') {
      return NextResponse.json({
        success: true,
        message: 'Image deleted from Cloudinary successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to delete image from Cloudinary' },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image from Cloudinary' },
      { status: 500 },
    );
  }
}
