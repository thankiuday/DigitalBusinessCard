import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Lock, Link, QrCode, Check, X, Loader, Copy, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import useCardStore from '../../store/useCardStore';
import useAuthStore from '../../store/useAuthStore';
import cardService from '../../services/cardService';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useDebounce from '../../hooks/useDebounce';

const Step3Publish = ({ onNext, onBack }) => {
  const { draft, setDraft, savedCardId, setSavedCardId, setIsSaving, isSaving } = useCardStore();
  const { isAuthenticated } = useAuthStore();
  const [slug, setSlug] = useState(draft.slug || '');
  const [slugStatus, setSlugStatus] = useState('idle'); // idle | checking | available | taken
  const [isPublic, setIsPublic] = useState(draft.isPublic !== false);
  const [qrUrl, setQrUrl] = useState(draft.qrCodeUrl || null);
  const [generatingQr, setGeneratingQr] = useState(false);

  const debouncedSlug = useDebounce(slug, 400);

  // Check slug availability
  useEffect(() => {
    if (!debouncedSlug || debouncedSlug.length < 3) {
      setSlugStatus('idle');
      return;
    }
    const check = async () => {
      setSlugStatus('checking');
      try {
        const { available } = await cardService.checkSlug(debouncedSlug, savedCardId);
        setSlugStatus(available ? 'available' : 'taken');
      } catch {
        setSlugStatus('idle');
      }
    };
    check();
  }, [debouncedSlug, savedCardId]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save your card');
      return false;
    }
    if (slugStatus === 'taken') {
      toast.error('This slug is taken. Choose a different one.');
      return false;
    }

    setIsSaving(true);
    try {
      const cardData = { ...draft, slug: slug || undefined, isPublic };
      let card;
      if (savedCardId) {
        card = await cardService.updateCard(savedCardId, cardData);
      } else {
        card = await cardService.createCard(cardData);
      }
      setSavedCardId(card._id);
      setDraft({ slug: card.slug, isPublic: card.isPublic });
      setSlug(card.slug);
      toast.success('Card saved successfully!');
      return true;
    } catch (err) {
      toast.error(err.message || 'Save failed');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinueToPrint = async () => {
    const ok = await handleSave();
    if (ok) onNext();
  };

  const handleGenerateQR = async () => {
    if (!savedCardId) {
      toast.error('Save your card first');
      return;
    }
    setGeneratingQr(true);
    try {
      const { qrCodeUrl } = await cardService.generateQR(savedCardId);
      setQrUrl(qrCodeUrl);
      setDraft({ qrCodeUrl });
      toast.success('QR code generated!');
    } catch (err) {
      toast.error(err.message || 'QR generation failed');
    } finally {
      setGeneratingQr(false);
    }
  };

  const copyLink = () => {
    if (!draft.slug) return;
    const url = `${window.location.origin}/card/${draft.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  const cardUrl = draft.slug ? `${window.location.origin}/card/${draft.slug}` : null;

  return (
    <div className="space-y-8">
      {/* Visibility */}
      <div>
        <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Visibility</h3>
        <div className="flex gap-4">
          {[
            { value: true, icon: <Globe size={18} />, label: 'Public', desc: 'Anyone with the link can view' },
            { value: false, icon: <Lock size={18} />, label: 'Private', desc: 'Only you can view' },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              onClick={() => setIsPublic(opt.value)}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                isPublic === opt.value
                  ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                  : 'border-white/10 text-white/50 hover:border-white/20'
              }`}
            >
              {opt.icon}
              <span className="text-sm font-medium">{opt.label}</span>
              <span className="text-xs opacity-60 text-center">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Slug */}
      <div>
        <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Custom URL</h3>
        <div className="relative">
          <div className="flex items-center gap-0">
            <span className="bg-surface-200 border border-white/10 border-r-0 px-3 py-3 text-sm text-white/40 rounded-l-xl whitespace-nowrap">
              /card/
            </span>
            <div className="relative flex-1">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="your-name"
                className="input-base rounded-l-none rounded-r-xl pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {slugStatus === 'checking' && <Loader size={14} className="animate-spin text-white/40" />}
                {slugStatus === 'available' && <Check size={14} className="text-green-400" />}
                {slugStatus === 'taken' && <X size={14} className="text-red-400" />}
              </span>
            </div>
          </div>
          {slugStatus === 'taken' && (
            <p className="text-xs text-red-400 mt-1.5">This slug is already taken</p>
          )}
          {slugStatus === 'available' && (
            <p className="text-xs text-green-400 mt-1.5">This slug is available</p>
          )}
        </div>
      </div>

      {/* Save button */}
      <Button
        fullWidth
        size="lg"
        loading={isSaving}
        onClick={handleSave}
        variant={savedCardId ? 'secondary' : 'primary'}
      >
        {savedCardId ? 'Update Card' : 'Save Card'}
      </Button>

      {/* Card link */}
      {draft.slug && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50 uppercase tracking-wider">Your Card URL</span>
            <div className="flex gap-2">
              <button onClick={copyLink} className="text-white/40 hover:text-primary-400 transition-colors">
                <Copy size={14} />
              </button>
              <a href={cardUrl} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-primary-400 transition-colors">
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
          <p className="text-sm text-primary-400 font-mono truncate">{cardUrl}</p>
        </motion.div>
      )}

      {/* QR Code */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">QR Code</h3>
          <Button
            size="sm"
            variant="secondary"
            icon={<QrCode size={14} />}
            loading={generatingQr}
            onClick={handleGenerateQR}
            disabled={!savedCardId}
          >
            {qrUrl ? 'Regenerate' : 'Generate QR'}
          </Button>
        </div>

        {cardUrl && (
          <div className="glass border border-white/10 rounded-xl p-6 flex flex-col items-center gap-4">
            <div className="bg-white p-3 rounded-xl">
              <QRCodeSVG value={cardUrl} size={160} level="H" />
            </div>
            {qrUrl && (
              <a
                href={qrUrl}
                download="qr-code.png"
                className="text-xs text-primary-400 hover:text-primary-300 underline"
              >
                Download QR PNG
              </a>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} fullWidth>← Back</Button>
        <Button
          onClick={handleContinueToPrint}
          fullWidth
          loading={isSaving}
          disabled={!isAuthenticated || slugStatus === 'taken'}
        >
          Continue to Print →
        </Button>
      </div>
    </div>
  );
};

export default Step3Publish;
