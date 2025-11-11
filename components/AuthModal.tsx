
import React from 'react';
import Spinner from './Spinner';

interface AuthModalProps {
  onSignIn: () => void;
  onClose: () => void;
  loading: boolean;
  error: string | null;
}

const AuthModal: React.FC<AuthModalProps> = ({ onSignIn, onClose, loading, error }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-brand-surface rounded-lg p-8 shadow-2xl max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Sign In Required</h2>
        <p className="text-center text-gray-400 mb-6">
          Please sign in with your Google account to start a banter.
        </p>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <button
          onClick={onSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-400"
        >
          {loading ? (
            <Spinner />
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          )}
          <span>{loading ? 'Signing In...' : 'Sign In with Google'}</span>
        </button>
        <button onClick={onClose} className="w-full text-center text-gray-500 mt-4 hover:text-gray-300">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
