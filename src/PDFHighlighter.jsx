import React, { useEffect } from "react";
import pdfjsLib from "pdfjs-dist";
import { Document, Page } from "react-pdf";
import { PDFViewer, PDFViewerApplication } from "pdfjs-dist/web/pdf_viewer";
import "pdfjs-dist/web/pdf_viewer.css";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

function getHighlightCoords() {
  const pageIndex = PDFViewerApplication.pdfViewer.currentPageNumber - 1;
  const page = PDFViewerApplication.pdfViewer.getPageView(pageIndex);
  const pageRect = page.canvas.getClientRects()[0];
  const selectionRects = window.getSelection().getRangeAt(0).getClientRects();
  const viewport = page.viewport;
  const r = selectionRects[0];
  const selected = viewport.convertToPdfPoint(r.left - pageRect.x, r.top - pageRect.y).concat(
    viewport.convertToPdfPoint(r.right - pageRect.x, r.bottom - pageRect.y)
  );
  return { page: pageIndex, coords: selected };
}

function PDFHighlighter() {
  useEffect(() => {
    document.addEventListener("selectionchange", () => {
      console.log(getHighlightCoords());
    });

    // cleanup function
    return () => {
      document.removeEventListener("selectionchange", () => {
        console.log(getHighlightCoords());
      });
    };
  }, []);

  return (
    <div>
      <PDFViewer>
        <Document file="https://arxiv.org/pdf/quant-ph/0410100.pdf">
          <Page pageNumber={1} />
        </Document>
      </PDFViewer>
    </div>
  );
}

export default PDFHighlighter;
