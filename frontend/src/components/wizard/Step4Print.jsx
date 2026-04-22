import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, ExternalLink, Home, LayoutDashboard } from 'lucide-react';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import useCardStore from '../../store/useCardStore';
import Button from '../ui/Button';

const CARD_THEMES = {
  white: {
    label: 'White',
    boardBg: '#e5e7eb',
    boardTexture: 'linear-gradient(135deg, #eceff3, #e5e7eb)',
    frontBg: '#f8fafc',
    frontBorder: '#d1d5db',
    frontTopShape: '#eef2f7',
    accentDark: '#1f2937',
    textPrimary: '#111827',
    textMuted: '#4b5563',
    textSubtle: '#6b7280',
  },
  black: {
    label: 'Black',
    boardBg: '#111827',
    boardTexture: 'linear-gradient(135deg, #1f2937, #111827)',
    frontBg: '#111827',
    frontBorder: '#374151',
    frontTopShape: '#1f2937',
    accentDark: '#030712',
    textPrimary: '#f9fafb',
    textMuted: '#d1d5db',
    textSubtle: '#9ca3af',
  },
  midnight: {
    label: 'Midnight Blue',
    boardBg: '#172033',
    boardTexture: 'linear-gradient(135deg, #1e293b, #0f172a)',
    frontBg: '#111827',
    frontBorder: '#334155',
    frontTopShape: '#1e293b',
    accentDark: '#020617',
    textPrimary: '#e2e8f0',
    textMuted: '#cbd5e1',
    textSubtle: '#94a3b8',
  },
  royal: {
    label: 'Royal Purple',
    boardBg: '#2a1f3f',
    boardTexture: 'linear-gradient(135deg, #312e81, #1f1147)',
    frontBg: '#f8fafc',
    frontBorder: '#c4b5fd',
    frontTopShape: '#ede9fe',
    accentDark: '#312e81',
    textPrimary: '#111827',
    textMuted: '#4b5563',
    textSubtle: '#6b7280',
  },
};

const INFO_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Job Title' },
  { key: 'company', label: 'Company' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'website', label: 'Website' },
  { key: 'address', label: 'Address' },
  { key: 'tagline', label: 'Tagline' },
];

const PRINT_SPEC = {
  region: 'US / Canada',
  trim: { widthIn: 3.5, heightIn: 2 },
  bleed: { widthIn: 3.75, heightIn: 2.25 },
  bleedEachSideIn: 0.125,
  // Preview/export base scale (not final DPI). html2canvas scale raises output quality.
  pxPerInch: 180,
};

const Step4Print = ({ onBack }) => {
  const navigate = useNavigate();
  const { draft } = useCardStore();
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [showQr, setShowQr] = useState(true);
  const [qrPosition, setQrPosition] = useState('bottom-right');
  const [selectedTheme, setSelectedTheme] = useState('white');
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoOffsetX, setPhotoOffsetX] = useState(50);
  const [photoOffsetY, setPhotoOffsetY] = useState(50);
  const [visibleFields, setVisibleFields] = useState({
    name: true,
    role: true,
    company: true,
    phone: true,
    email: true,
    website: true,
    address: true,
    tagline: true,
  });

  const cardUrl = draft.slug ? `${window.location.origin}/card/${draft.slug}` : null;
  const activeTheme = CARD_THEMES[selectedTheme];
  const EXPORT_SCALE = 5;
  const hasProfilePhoto = Boolean(draft.profile?.photo);

  const handleDownloadPNG = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: EXPORT_SCALE,
        useCORS: true,
        allowTaint: true,
        backgroundColor: activeTheme.boardBg,
        logging: false,
      });
      const url = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${draft.profile?.name || 'phygital-card'}.png`;
      link.href = url;
      link.click();
      toast.success('Card downloaded as PNG!');
    } catch (err) {
      toast.error('Download failed. Try again.');
    } finally {
      setDownloading(false);
    }
  };

  const primary = draft.design?.primaryColor || '#8b5cf6';
  const secondary = draft.design?.secondaryColor || '#ec4899';

  const cardName = draft.profile?.name || 'Your Name';
  const cardRole = draft.profile?.jobTitle || 'Your Role';
  const cardCompany = draft.profile?.company || 'Your Company';
  const cardTagline = draft.profile?.tagline || draft.profile?.bio || 'Your Tagline Here';
  const cardPhone = draft.contact?.phone || '';
  const cardEmail = draft.contact?.email || '';
  const cardWebsite = draft.contact?.website || '';
  const cardAddress = draft.contact?.address || draft.contact?.location || '';

  const toggleField = (fieldKey) => {
    setVisibleFields((prev) => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const renderProfilePhoto = (size, backgroundColor, shadow) => (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '999px',
        margin: '0 auto 10px',
        overflow: 'hidden',
        border: `2px solid ${primary}`,
        boxShadow: shadow,
        background: backgroundColor,
      }}
    >
      <img
        src={draft.profile.photo}
        alt={cardName}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${photoZoom})`,
          transformOrigin: `${photoOffsetX}% ${photoOffsetY}%`,
          display: 'block',
        }}
      />
    </div>
  );

  const cardWidth = Math.round(PRINT_SPEC.bleed.widthIn * PRINT_SPEC.pxPerInch);
  const cardHeight = Math.round(PRINT_SPEC.bleed.heightIn * PRINT_SPEC.pxPerInch);
  const trimInset = Math.round(PRINT_SPEC.bleedEachSideIn * PRINT_SPEC.pxPerInch);
  const qrSafeInset = trimInset + 10;
  const canvasPadding = 40;
  const cardGap = 20;
  const printCanvasWidth = cardWidth + canvasPadding * 2;
  const printCanvasHeight = cardHeight * 2 + cardGap + canvasPadding * 2;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Printable Card</h3>
        <p className="text-white/50 text-sm">
          Download a high-resolution PNG ready for physical card printing.
        </p>
        <p className="text-xs text-white/40 mt-2">
          Spec: {PRINT_SPEC.region} standard with bleed ({PRINT_SPEC.bleed.widthIn}" x {PRINT_SPEC.bleed.heightIn}" with
          {` `}{PRINT_SPEC.trim.widthIn}" x {PRINT_SPEC.trim.heightIn}" trim-safe area)
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="glass border border-white/10 rounded-xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showQr}
              onChange={(e) => setShowQr(e.target.checked)}
              className="w-4 h-4 accent-purple-500"
            />
            <div>
              <p className="text-sm font-medium text-white">Include QR Code</p>
              <p className="text-xs text-white/40">Add QR to printed card</p>
            </div>
          </label>
        </div>

        <div className="glass border border-white/10 rounded-xl p-4">
          <p className="text-xs text-white/50 mb-2">Theme</p>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="input-base text-sm"
          >
            {Object.entries(CARD_THEMES).map(([key, theme]) => (
              <option key={key} value={key}>
                {theme.label}
              </option>
            ))}
          </select>
        </div>

        {showQr && (
          <div className="glass border border-white/10 rounded-xl p-4">
            <p className="text-xs text-white/50 mb-2">QR Position</p>
            <select
              value={qrPosition}
              onChange={(e) => setQrPosition(e.target.value)}
              className="input-base text-sm"
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
              <option value="center">Center Bottom</option>
            </select>
          </div>
        )}
      </div>

      <div className="glass border border-white/10 rounded-xl p-4">
        <p className="text-sm font-medium text-white mb-3">Display Information</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {INFO_FIELDS.map((field) => (
            <label
              key={field.key}
              className="flex items-center gap-2 text-xs text-white/80 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={visibleFields[field.key]}
                onChange={() => toggleField(field.key)}
                className="w-4 h-4 accent-purple-500"
              />
              <span>{field.label}</span>
            </label>
          ))}
        </div>
      </div>

      {hasProfilePhoto && (
        <div className="glass border border-white/10 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-white">Profile Image Adjustments</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="block">
              <span className="text-xs text-white/60">Zoom ({photoZoom.toFixed(1)}x)</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={photoZoom}
                onChange={(e) => setPhotoZoom(Number(e.target.value))}
                className="w-full mt-2 accent-purple-500"
              />
            </label>
            <label className="block">
              <span className="text-xs text-white/60">Crop X ({Math.round(photoOffsetX)}%)</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={photoOffsetX}
                onChange={(e) => setPhotoOffsetX(Number(e.target.value))}
                className="w-full mt-2 accent-purple-500"
              />
            </label>
            <label className="block">
              <span className="text-xs text-white/60">Crop Y ({Math.round(photoOffsetY)}%)</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={photoOffsetY}
                onChange={(e) => setPhotoOffsetY(Number(e.target.value))}
                className="w-full mt-2 accent-purple-500"
              />
            </label>
          </div>
        </div>
      )}

      {/* Print preview */}
      <div className="overflow-auto">
        <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Preview</h3>
        <div className="flex justify-center">
          <div
            ref={printRef}
            style={{
              width: `${printCanvasWidth}px`,
              height: `${printCanvasHeight}px`,
              backgroundColor: activeTheme.boardBg,
              position: 'relative',
              borderRadius: '18px',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateRows: '1fr 1fr',
              gap: `${cardGap}px`,
              padding: `${canvasPadding}px`,
              boxSizing: 'border-box',
              flexShrink: 0,
            }}
          >
            {/* Print board texture */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: activeTheme.boardTexture,
                pointerEvents: 'none',
              }}
            />

            {/* Front side */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                background: activeTheme.frontBg,
                borderRadius: '10px',
                border: `1px solid ${activeTheme.frontBorder}`,
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: '1.45fr 1fr',
              }}
            >
              <div style={{ position: 'relative', padding: '28px 26px', color: activeTheme.textPrimary }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '180px',
                    height: '56px',
                    background: activeTheme.frontTopShape,
                    clipPath: 'polygon(0 0, 80% 0, 60% 100%, 0 100%)',
                  }}
                />
                <div style={{ position: 'relative' }}>
                  {visibleFields.name && (
                    <h4 style={{ margin: 0, fontSize: '24px', lineHeight: 1.1, fontWeight: 700 }}>{cardName}</h4>
                  )}
                  {visibleFields.role && (
                    <p style={{ margin: '6px 0 0', fontSize: '13px', color: activeTheme.textMuted, fontWeight: 600 }}>
                      {cardRole}
                    </p>
                  )}
                  {visibleFields.company && (
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: activeTheme.textSubtle }}>{cardCompany}</p>
                  )}
                </div>

                <div style={{ marginTop: '26px', display: 'grid', gap: '8px', fontSize: '12px', color: activeTheme.textMuted }}>
                  {visibleFields.phone && cardPhone && <p style={{ margin: 0 }}>• {cardPhone}</p>}
                  {visibleFields.email && cardEmail && <p style={{ margin: 0 }}>• {cardEmail}</p>}
                  {visibleFields.website && cardWebsite && <p style={{ margin: 0 }}>• {cardWebsite}</p>}
                  {visibleFields.address && cardAddress && <p style={{ margin: 0 }}>• {cardAddress}</p>}
                </div>
              </div>

              <div
                style={{
                  position: 'relative',
                  background: activeTheme.accentDark,
                  color: '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '-80px',
                    top: '-10px',
                    width: '210px',
                    height: '220px',
                    borderRadius: '18px',
                    transform: 'rotate(30deg)',
                    border: `10px solid ${primary}`,
                    opacity: 0.9,
                  }}
                />
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                  {draft.profile?.photo ? (
                    renderProfilePhoto(68, activeTheme.accentDark, '0 4px 14px rgba(0,0,0,0.35)')
                  ) : (
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '999px',
                        margin: '0 auto 10px',
                        background: `conic-gradient(from 90deg, ${primary}, ${secondary})`,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <div style={{ width: '28px', height: '28px', borderRadius: '999px', background: activeTheme.accentDark }} />
                    </div>
                  )}
                  {visibleFields.company && (
                    <p style={{ margin: 0, fontWeight: 700, letterSpacing: '0.08em' }}>
                      {cardCompany.toUpperCase()}
                    </p>
                  )}
                  {visibleFields.tagline && (
                    <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#cbd5e1' }}>
                      {cardTagline.slice(0, 42)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Back side */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                background: activeTheme.frontBg,
                borderRadius: '10px',
                border: `1px solid ${activeTheme.frontBorder}`,
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '-58px',
                  top: '-48px',
                  width: '190px',
                  height: '138px',
                  background: activeTheme.accentDark,
                  borderRadius: '20px',
                  transform: 'rotate(-25deg)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '-42px',
                  top: '-24px',
                  width: '190px',
                  height: '138px',
                  border: `8px solid ${primary}`,
                  borderRadius: '20px',
                  transform: 'rotate(-25deg)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '-58px',
                  bottom: '-50px',
                  width: '190px',
                  height: '138px',
                  background: activeTheme.accentDark,
                  borderRadius: '20px',
                  transform: 'rotate(-25deg)',
                }}
              />
              <div style={{ textAlign: 'center', zIndex: 1 }}>
                {draft.profile?.photo ? (
                  renderProfilePhoto(70, activeTheme.frontBg, '0 4px 14px rgba(0,0,0,0.25)')
                ) : (
                  <div
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '999px',
                      margin: '0 auto 10px',
                      background: `conic-gradient(from 90deg, ${primary}, ${secondary})`,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <div style={{ width: '30px', height: '30px', borderRadius: '999px', background: activeTheme.frontBg }} />
                  </div>
                )}
                {visibleFields.company && (
                  <p style={{ margin: 0, color: activeTheme.textPrimary, fontWeight: 700, letterSpacing: '0.08em' }}>
                    {cardCompany.toUpperCase()}
                  </p>
                )}
                {visibleFields.tagline && (
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: activeTheme.textMuted }}>
                    {cardTagline.slice(0, 46)}
                  </p>
                )}
              </div>

              {/* QR Code */}
              {showQr && cardUrl && (
                <div
                  style={{
                    position: 'absolute',
                    ...(qrPosition === 'bottom-right' && { bottom: `${qrSafeInset}px`, right: `${qrSafeInset}px` }),
                    ...(qrPosition === 'bottom-left' && { bottom: `${qrSafeInset}px`, left: `${qrSafeInset}px` }),
                    ...(qrPosition === 'top-right' && { top: `${qrSafeInset}px`, right: `${qrSafeInset}px` }),
                    ...(qrPosition === 'center' && { bottom: `${qrSafeInset}px`, left: '50%', transform: 'translateX(-50%)' }),
                    background: '#fff',
                    padding: '6px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                  }}
                >
                  <QRCodeSVG value={cardUrl} size={58} level="H" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="secondary" onClick={onBack}>← Back</Button>
        <Button
          icon={<Download size={16} />}
          onClick={handleDownloadPNG}
          loading={downloading}
          size="lg"
          className="flex-1"
        >
          Download PNG
        </Button>
        {draft.slug && (
          <Button
            variant="outline"
            icon={<ExternalLink size={16} />}
            onClick={() => window.open(`/card/${draft.slug}`, '_blank')}
          >
            View Live Card
          </Button>
        )}
      </div>

      <div className="glass border border-green-500/20 rounded-xl p-4">
        <p className="text-sm text-green-400 font-medium mb-1">Your card is live!</p>
        <p className="text-xs text-white/40">
          Share your link:{' '}
          <a href={`/card/${draft.slug}`} className="text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">
            {window.location.origin}/card/{draft.slug}
          </a>
        </p>
      </div>

      <div className="glass border border-white/10 rounded-xl p-5">
        <p className="text-sm font-semibold text-white mb-1">All set</p>
        <p className="text-xs text-white/45 mb-4">
          Leave the print step and go back to your dashboard or the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            icon={<LayoutDashboard size={16} />}
            onClick={() => navigate('/dashboard')}
            className="sm:flex-1"
          >
            Go to Dashboard
          </Button>
          <Button
            type="button"
            variant="secondary"
            icon={<Home size={16} />}
            onClick={() => navigate('/')}
            className="sm:flex-1"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step4Print;
