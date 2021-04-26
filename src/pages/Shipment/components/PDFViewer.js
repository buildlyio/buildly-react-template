import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

const PdfViewer = ({ url, canvasClass, getPdfText }) => {
  const canvasRef = useRef();
  const [pdfRef, setPdfRef] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  const renderPage = useCallback((pageNum, pdf = pdfRef) => {
    if (pdf) {
      pdf.getPage(pageNum).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport,
        };
        const task = page.render(renderContext);
        task.promise.then(() => {
          getPdfText(canvas.toDataURL('image/jpeg'));
        });
      });
    }
  }, [pdfRef]);

  useEffect(() => {
    renderPage(currentPage, pdfRef);
  }, [pdfRef, currentPage, renderPage]);

  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then((loadedPdf) => {
      if (
        !pdfRef
        || (
          pdfRef
          && pdfRef.fingerprint !== loadedPdf.fingerprint
        )
      ) {
        setPdfRef(loadedPdf);
      }
    }, (reason) => {
      console.error(reason);
    });
  }, [url]);

  return <canvas className={canvasClass} ref={canvasRef} />;
};

export default PdfViewer;
