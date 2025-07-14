"use client";

import React, { useState } from "react";

const PDFModal = ({ visible, onClose, pdfUrl }) => {
  if (!visible) return null;
  const [loading, setLoading] = useState(true)
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

        {loading && (
          <div className="h-full flex justify-center items-center">
            <div className="flex items-center p-2 w-30 rounded-[10px] justify-center flex-col gap-2">
              <div className="flex justify-center items-center space-x-2">
                <div className="w-3 h-3 rounded-full animate-bounce transition-colors duration-500 bg-blue-500 animate-color-bounce [animation-delay:-0.2s]"></div>
                <div className="w-3 h-3 rounded-full animate-bounce transition-colors duration-500 bg-blue-500 animate-color-bounce [animation-delay:-0.1s]"></div>
                <div className="w-3 h-3 rounded-full animate-bounce transition-colors duration-500 bg-blue-500 animate-color-bounce"></div>
              </div>
              <div className="text-blue-500 font-bold text-[15px]">
                Cargando ...
              </div>
            </div>
          </div>
        )}

        <div className="h-full">
          <iframe
            src={pdfUrl}
            title="Vista previa PDF"
            className="w-full h-full"
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFModal;
