import React, { useRef ,useState} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import PDFViewer from "./PDFviewer";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const pdfRef = useRef(null);
  const [highlightedText, setHighlightedText] = useState("");

  const handleSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    const range = selection.getRangeAt(0);
    const boundingRect = range.getBoundingClientRect();
    const highlight = document.createElement("span");
    highlight.className = "highlight";
    highlight.style.top = boundingRect.top + "px";
    highlight.style.left = boundingRect.left + "px";
    highlight.style.width = boundingRect.width + "px";
    highlight.style.height = boundingRect.height + "px";
    range.surroundContents(highlight);
    setHighlightedText(selectedText);
    const highlightRect = highlight.getBoundingClientRect();
    console.table({
      left: highlightRect.left,
      top: highlightRect.top,
      right: highlightRect.right,
      bottom: highlightRect.bottom,
    });
    return {
      left: highlightRect.left,
      top: highlightRect.top,
      right: highlightRect.right,
      bottom: highlightRect.bottom,
    };
  };

  const highlightSelectedText = (pageIndex, coords) => {
    const page = pdfRef.current.pdfViewer.getPageView(pageIndex).div;
    const pageRect = page.getBoundingClientRect();
    const viewport = pdfRef.current.pdfViewer.getPageView(pageIndex).viewport;
    const selected = coords.map((rect) => {
      return viewport.convertToViewportRectangle(rect);
    });
    selected.forEach((rect) => {
      const el = document.createElement("div");
      el.setAttribute(
        "style",
        "position: absolute; background-color: pink;" +
          "left:" +
          Math.min(rect[0], rect[2]) +
          "px; top:" +
          Math.min(rect[1], rect[3]) +
          "px;" +
          "width:" +
          Math.abs(rect[0] - rect[2]) +
          "px; height:" +
          Math.abs(rect[1] - rect[3]) +
          "px;"
      );
      page.appendChild(el);
    });
  };

  return (
    <div>
      {/* <PDFViewer pdfUrl={"https://arxiv.org/pdf/quant-ph/0410100.pdf"}/> */}
      <Document file="https://arxiv.org/pdf/quant-ph/0410100.pdf">
        <Page pageNumber={1} ref={pdfRef} onMouseUp={handleSelection} />
      </Document>
    </div>
  );
}

export default App;
