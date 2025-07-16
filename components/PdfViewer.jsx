"use client";

import React, { useEffect, useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css"; // ✅ Fixed typo
import "react-pdf/dist/Page/TextLayer.css";

import { Document, Page, pdfjs } from "react-pdf";
import { Loader2Icon, RotateCw, ZoomInIcon, ZoomOutIcon } from "lucide-react";
import { Button } from "./ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfViewer({ url }) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
 console.log("donwload:",url)
  // ✅ Properly run the fetchFile function
  useEffect(() => {
    async function fetchFile() {
      const response = await fetch(url);
      const blob = await response.blob();
      setFile(blob);
    }

    if (url) fetchFile();
  }, [url]);

  // ✅ Document Load Success
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] justify-center items-center overflow-y-auto overflow-x-auto p-3">
    <div className="sticky  top-0 z-50 bg-gray-100 p-2 rounded-b-lg">
      <div className="max-w-6xl px-2 grid grid-cols-6 gap-2">
        <Button
          variant="outline"
          disabled={pageNumber === 1}
          onClick={() => {
            if (pageNumber > 1) {
              setPageNumber(pageNumber - 1);
            }
          }}
        >
          Previous
        </Button>

        <p className="flex items-center justify-center">
          {pageNumber} of {numPages}
        </p>

        <Button
          variant="outline"
          disabled={pageNumber === numPages}
          onClick={() => {
            if (numPages) {
              if (pageNumber < numPages) {
                setPageNumber(pageNumber + 1);
              }
            }
          }}
        >
          Next
        </Button>

        <Button
          variant="outline"
          onClick={() => setRotation((rotation + 90) % 360)}
        >
          <RotateCw />
        </Button>

        <Button
          variant="outline"
          disabled={scale >= 1.5}
          onClick={() => {
            setScale(scale * 1.2);
          }}
        >
          <ZoomInIcon />
        </Button>

        <Button
          variant="outline"
          disabled={scale <= 0.75}
          onClick={() => setScale(scale / 1.2)}
        >
          <ZoomOutIcon />
        </Button>
      </div>
    </div>

    {!file ? (
      <Loader2Icon className="animate-spin h-20 w-20 text-indigo-600 mt-20" />
    ) : (
      <Document
        loading={null}
        file={file}
        rotate={rotation}
        onLoadSuccess={onDocumentLoadSuccess}
        className=" overflow-scroll"
      >
        <Page className="shadow-lg" scale={scale} pageNumber={pageNumber} />
      </Document>
    )}

    </div>

    
  );
}

export default PdfViewer;
