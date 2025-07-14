import { put } from '@vercel/blob';

export const POST = async (req) => {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file found' }), { status: 400 });
  }

  const blob = await put(file.name, file, {
    access: 'public',
    token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN, // ✅ use token here
  });

  return new Response(JSON.stringify({ url: blob.url }), { status: 200 });
};
