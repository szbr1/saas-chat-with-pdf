// ✅ SERVER COMPONENT
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import PdfViewer from "@/components/PdfViewer";
import ChatPage from "@/components/ChatPage";
export default async function Page({ params: { id: docId } }) {
  const { userId } = await auth();

  if (!userId || !docId) {
    return <div>Invalid request: Missing user or document ID.</div>;
  }

  const ref = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = ref.data()?.downloadUrl;
  return (
    <div className="grid lg:grid-cols-5 h-full ">
      {/* Right */}
      <div className="col-span-5 lg:col-span-2 h-full overflow-x-hidden overflow-y-scroll">
        {/* Chat */}
        <ChatPage  />
      </div>

      {/* Left */}
      <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto p-5">
        {/* PDFView */}
        <PdfViewer url={downloadUrl} />
      </div>
    </div>
  );
}
