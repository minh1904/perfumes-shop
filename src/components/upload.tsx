'use client';
import { CldUploadWidget } from 'next-cloudinary';

import React from 'react';

const Upload = () => {
  return (
    <div>
      <CldUploadWidget uploadPreset="<Your Upload Preset>">
        {({ open }) => {
          return <button onClick={() => open()}>Upload an Image</button>;
        }}
      </CldUploadWidget>
    </div>
  );
};

export default Upload;
