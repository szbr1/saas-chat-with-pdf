'use client'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

function useUploader() {
  const [progress, setProgress] = useState(0);
  const [fileId, setFileId] = useState();
  const [status, setStatus] = useState('idle');
  const { user } = useUser()

  const handleUpload = async (file) => {
    if (!file) return;

    setStatus('uploading');
    setProgress(5); // start from 5%

    // Simulate progress increasing
    const fakeProgress = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(fakeProgress);
          return prev;
        }
        return prev + Math.floor(Math.random() * 5) + 3; // random +3 to +8%
      });
    }, 300);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fileId = uuidv4();
      setFileId(fileId);

      const downloadUrl = res.data.url;

      await setDoc(doc(db, "users", user.id, "files", fileId), {
        name: file.name,
        size: file.size,
        type: file.type,
        downloadUrl: downloadUrl,
        ref: null,
        createdAt: new Date()
      });

      setProgress(100); // done
      clearInterval(fakeProgress);
      setStatus('success');

      console.log('Upload Success ✅', downloadUrl);

    } catch (err) {
      console.error('Upload Failed ❌', err);
      clearInterval(fakeProgress);
      setStatus('error');
    }
  }

  return { fileId, progress, status, handleUpload }
}

export default useUploader;
