import { put } from '@vercel/blob';
// we are using vercel blob storage  || ✅vercel blob storage ||❌ firebase storage ||❌ cloudinary storage
export const POST = async (req) => {

  // getting the fiel from the request 
  const formData = await req.formData();
  const file = formData.get('file');
 
  // file check available or not 
  if (!file) {
    return new Response(JSON.stringify({ error: 'No file found' }), { status: 400 });
  }
  // this will send to the vercel blob storage
  const blob = await put(file.name, file, {
    access: 'public',
    token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN, // ✅ use token here
  });

  return new Response(JSON.stringify({ url: blob.url }), { status: 200 });
};
