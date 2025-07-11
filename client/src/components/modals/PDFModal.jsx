"use client";

import React from "react";

const PDFModal = ({ visible, onClose, pdfUrl }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.3)]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-4xl h-[80%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">Vista previa del PDF</h2>
          <button
            className="text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        <div className="h-full">
          <iframe
            src={pdfUrl}
            title="Vista previa PDF"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFModal;
