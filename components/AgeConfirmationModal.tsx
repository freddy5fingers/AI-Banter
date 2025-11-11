
import React from 'react';

interface AgeConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const AgeConfirmationModal: React.FC<AgeConfirmationModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-surface rounded-lg p-8 shadow-2xl max-w-md w-full border border-red-500">
        <h2 className="text-2xl font-bold text-center text-red-400 mb-4">Age Verification</h2>
        <p className="text-center text-gray-300 mb-6">
          This mode contains vulgar and mature content. Please confirm you are 18 years of age or older to proceed.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-bold"
          >
            I am 18+
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeConfirmationModal;
