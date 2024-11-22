import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ShareAccess: React.FC = () => {
  const { user, generateShareCode } = useStore();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerateCode = async () => {
    try {
      setLoading(true);
      await generateShareCode();
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!user?.shareCode) return;
    
    const link = `${window.location.origin}/login?code=${user.shareCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Compartir Acceso</h3>
        </div>

        {user.shareCode ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Comparte este enlace para dar acceso a tu {user.role === 'admin' ? 'sistema' : 'cuenta'}:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-100 p-2 rounded text-sm">
                {window.location.origin}/login?code={user.shareCode}
              </code>
              <button
                onClick={handleCopyLink}
                className="p-2 text-blue-600 hover:text-blue-700"
                title="Copiar enlace"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleGenerateCode}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            <Share2 className="h-5 w-5" />
            {loading ? 'Generando...' : 'Generar Enlace de Acceso'}
          </button>
        )}
      </div>
    </div>
  );
};