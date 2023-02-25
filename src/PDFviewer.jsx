import React, { useEffect, useRef } from 'react';
import 'pdfjs-dist/build/pdf.worker.entry';
import * as pdfjs from 'pdfjs-dist';
import PDFAnnotate from 'pdf-annotate';
// import 'pdf-annotate/dist/pdf-annotate.min.css';

const PDFViewer = ({ pdfUrl }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const storeRef = useRef(null);

  useEffect(() => {
    const initPdfViewer = async () => {
      const pdf = await pdfjs.getDocument(pdfUrl).promise;
      const pdfViewer = new pdfjs.PDFViewer({
        container: containerRef.current,
      });

      pdfViewer.setDocument(pdf);

      storeRef.current = PDFAnnotate.Store.init({
        documentId: '123',
        pdfDocument: pdf,
      });

      pdfViewer.eventBus.on('textlayerrendered', () => {
        const textLayer = document.querySelector('.textLayer');

        textLayer.addEventListener('mouseup', handleMouseUp);
      });
    };

    initPdfViewer();
  }, [pdfUrl]);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    const boundingRect = rects[0];

    PDFAnnotate.Store.addAnnotation(
      storeRef.current,
      '123',
      1,
      PDFAnnotate.default.RectangleAnnotation(
        '123',
        1,
        {
          x: boundingRect.left,
          y: boundingRect.top,
          width: boundingRect.width,
          height: boundingRect.height,
        },
        {
          color: '000000',
        }
      )
    );
  };

  return (
    <div>
      <div ref={containerRef} className="pdfViewer"></div>
      <canvas ref={canvasRef} className="pdfAnnotations"></canvas>
    </div>
  );
};

export default PDFViewer;