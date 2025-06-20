'use client';

import { CldUploadWidget } from 'next-cloudinary';

export default function CloudinaryRealWidget() {
  return (
    <CldUploadWidget uploadPreset="ml_default">
      {({ open }) => (
        <button type="button" onClick={() => open()}>
          Upload
        </button>
      )}
    </CldUploadWidget>
  );
}
