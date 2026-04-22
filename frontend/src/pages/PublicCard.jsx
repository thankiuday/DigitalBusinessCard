import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone, Mail, MessageCircle, Globe, Instagram, Facebook,
  Twitter, Linkedin, Youtube, Github, Send, UserPlus, ExternalLink, Printer,
} from 'lucide-react';
import cardService from '../services/cardService';
import analyticsService from '../services/analyticsService';
import { PageSpinner } from '../components/ui/Spinner';

const API_BASE = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '');

const socialConfig = {
  instagram: { icon: <Instagram size={18} />, color: '#e1306c', label: 'Instagram' },
  facebook: { icon: <Facebook size={18} />, color: '#1877f2', label: 'Facebook' },
  twitter: { icon: <Twitter size={18} />, color: '#1da1f2', label: 'Twitter' },
  linkedin: { icon: <Linkedin size={18} />, color: '#0a66c2', label: 'LinkedIn' },
  youtube: { icon: <Youtube size={18} />, color: '#ff0000', label: 'YouTube' },
  github: { icon: <Github size={18} />, color: '#f0f6fc', label: 'GitHub' },
  telegram: { icon: <Send size={18} />, color: '#229ed9', label: 'Telegram' },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

const PublicCard = () => {
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const trackEvent = useCallback(
    (eventType, metadata = {}) => {
      if (card?._id) analyticsService.track(card._id, eventType, metadata);
    },
    [card]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const data = await cardService.getPublicCard(slug);
        setCard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  useEffect(() => {
    if (card) trackEvent('view');
  }, [card]);

  const handleSaveContact = () => {
    window.location.href = `${API_BASE}/public/${slug}/vcard`;
    trackEvent('save_contact');
  };

  if (loading) return <PageSpinner />;

  if (error || !card) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-white mb-2">Card not found</h1>
          <p className="text-white/50 mb-6">{error || 'This card may be private or deleted.'}</p>
          <Link to="/" className="text-primary-400 hover:text-primary-300 text-sm">← Go to Phygital</Link>
        </div>
      </div>
    );
  }

  const { profile, contact, social, sections = [], design } = card;
  const photoSettings = profile?.imageSettings?.photo || { zoom: 1, x: 50, y: 50 };
  const bannerSettings = profile?.imageSettings?.banner || { zoom: 1, x: 50, y: 50 };
  const primary = design?.primaryColor || '#8b5cf6';
  const secondary = design?.secondaryColor || '#ec4899';
  const bg = design?.bgColor || '#0a0a0f';
  const isCover = design?.layout === 'cover';
  const isLeft = design?.layout === 'left';
  const hasBannerImage = Boolean(profile?.banner);

  const activeSocials = social ? Object.entries(social).filter(([, v]) => v) : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: bg, fontFamily: design?.font || 'Inter' }}>
      {/* Banner image: responsive height + aspect so desktop isn’t a thin crop */}
      {hasBannerImage && (
        <div
          className={`relative w-full overflow-hidden ${
            isCover
              ? 'h-[min(42vw,13.5rem)] sm:h-[min(38vw,17rem)] md:h-[min(34vw,20rem)] lg:h-[min(30vw,24rem)] xl:h-[min(28vw,26rem)]'
              : 'h-[min(36vw,11rem)] sm:h-[min(32vw,13rem)] md:h-[min(28vw,16rem)] lg:h-[min(24vw,18rem)] xl:h-[min(22vw,20rem)]'
          }`}
        >
          <img
            src={profile.banner}
            alt=""
            className="h-full w-full min-h-full object-cover object-center"
            style={{
              transform: `scale(${bannerSettings.zoom})`,
              transformOrigin: `${bannerSettings.x}% ${bannerSettings.y}%`,
            }}
          />
        </div>
      )}

      {/* Cover hero gradient when no image */}
      {!hasBannerImage && isCover && (
        <div
          className="w-full h-[min(42vw,13.5rem)] sm:h-[min(38vw,17rem)] md:h-[min(34vw,20rem)] lg:h-[min(30vw,24rem)]"
          style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
        />
      )}

      {/* Accent line when no banner image and not cover layout */}
      {!hasBannerImage && !isCover && (
        <div
          className="w-full h-1"
          style={{ background: `linear-gradient(90deg, ${primary}, ${secondary})` }}
        />
      )}

      <div className="mx-auto w-full max-w-lg px-4 py-8 sm:px-6 md:max-w-2xl md:py-10 lg:max-w-4xl lg:px-8 lg:py-12 xl:max-w-5xl">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className={`flex ${isLeft ? 'flex-row' : 'flex-col'} ${isLeft ? 'items-center md:items-start' : 'items-center'} gap-5 mb-8 md:mb-10 md:gap-6 ${isCover ? '-mt-10 sm:-mt-12 md:-mt-14' : ''}`}
        >
          {/* Avatar */}
          {profile?.photo ? (
            <div
              className="flex-shrink-0 overflow-hidden w-[5.25rem] h-[5.25rem] sm:w-24 sm:h-24 md:w-[6.5rem] md:h-[6.5rem] lg:w-28 lg:h-28"
              style={{
                borderRadius: design?.cornerStyle === 'sharp' ? '12px' : '50%',
                border: isCover ? `3px solid ${bg}` : 'none',
                boxShadow: `0 0 30px ${primary}40`,
                position: 'relative',
              }}
              aria-label={profile.name || 'Profile image'}
            >
              <img
                src={profile.photo}
                alt={profile.name || 'Profile'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `scale(${photoSettings.zoom})`,
                  transformOrigin: `${photoSettings.x}% ${photoSettings.y}%`,
                }}
              />
            </div>
          ) : (
            <div
              className="flex-shrink-0 flex items-center justify-center font-bold text-white text-2xl sm:text-3xl md:text-4xl w-[5.25rem] h-[5.25rem] sm:w-24 sm:h-24 md:w-[6.5rem] md:h-[6.5rem] lg:w-28 lg:h-28"
              style={{
                borderRadius: design?.cornerStyle === 'sharp' ? '12px' : '50%',
                background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                border: isCover ? `3px solid ${bg}` : 'none',
                boxShadow: `0 0 30px ${primary}40`,
              }}
            >
              {profile?.name?.charAt(0)?.toUpperCase() || 'P'}
            </div>
          )}

          <div className={isLeft ? 'text-left' : 'text-center'}>
            {profile?.name && (
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-white leading-tight">
                {profile.name}
              </h1>
            )}
            {profile?.jobTitle && (
              <p className="font-medium mt-1.5 text-base sm:text-lg md:text-xl" style={{ color: primary }}>
                {profile.jobTitle}
              </p>
            )}
            {profile?.company && (
              <p className="text-sm sm:text-base md:text-lg text-white/50 mt-1">{profile.company}</p>
            )}
          </div>
        </motion.div>

        {/* Bio */}
        {profile?.bio && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed text-center mb-8 md:mb-10 max-w-3xl mx-auto"
          >
            {profile.bio}
          </motion.p>
        )}

        {/* CTA Bar */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10"
        >
          {contact?.phone && (
            <a
              href={`tel:${contact.phone}`}
              onClick={() => trackEvent('click_call')}
              className="flex flex-col items-center gap-2 py-3.5 md:py-4 rounded-2xl transition-all hover:opacity-80 active:scale-95"
              style={{ background: `${primary}20`, border: `1px solid ${primary}40` }}
            >
              <Phone className="w-5 h-5 md:w-6 md:h-6" style={{ color: primary }} />
              <span className="text-xs md:text-sm text-white/70">Call</span>
            </a>
          )}
          {contact?.email && (
            <a
              href={`mailto:${contact.email}`}
              onClick={() => trackEvent('click_email')}
              className="flex flex-col items-center gap-2 py-3.5 md:py-4 rounded-2xl transition-all hover:opacity-80 active:scale-95"
              style={{ background: `${primary}20`, border: `1px solid ${primary}40` }}
            >
              <Mail className="w-5 h-5 md:w-6 md:h-6" style={{ color: primary }} />
              <span className="text-xs md:text-sm text-white/70">Email</span>
            </a>
          )}
          {contact?.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
              onClick={() => trackEvent('click_whatsapp')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 py-3.5 md:py-4 rounded-2xl transition-all hover:opacity-80 active:scale-95"
              style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)' }}
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              <span className="text-xs md:text-sm text-white/70">WhatsApp</span>
            </a>
          )}
          {contact?.website && (
            <a
              href={contact.website}
              onClick={() => trackEvent('click_website')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 py-3.5 md:py-4 rounded-2xl transition-all hover:opacity-80 active:scale-95"
              style={{ background: `${primary}20`, border: `1px solid ${primary}40` }}
            >
              <Globe className="w-5 h-5 md:w-6 md:h-6" style={{ color: primary }} />
              <span className="text-xs md:text-sm text-white/70">Website</span>
            </a>
          )}
        </motion.div>

        {/* Save Contact */}
        <motion.button
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          onClick={handleSaveContact}
          className="w-full py-3.5 md:py-4 rounded-2xl text-base md:text-lg font-semibold text-white flex items-center justify-center gap-2 mb-8 md:mb-10 transition-all hover:opacity-90 active:scale-98"
          style={{
            background: `linear-gradient(135deg, ${primary}, ${secondary})`,
            boxShadow: `0 0 30px ${primary}40`,
          }}
        >
          <UserPlus className="w-[18px] h-[18px] md:w-5 md:h-5 shrink-0" />
          Save Contact
        </motion.button>

        {/* Social Links */}
        {activeSocials.length > 0 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mb-8 md:mb-10"
          >
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-white/30 mb-4 text-center">
              Connect
            </h3>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {activeSocials.map(([key, url]) => {
                const cfg = socialConfig[key];
                if (!cfg) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('click_social', { platform: key })}
                    className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-2xl text-sm md:text-base font-medium transition-all hover:opacity-80 active:scale-95"
                    style={{
                      background: `${cfg.color}20`,
                      border: `1px solid ${cfg.color}40`,
                      color: cfg.color,
                    }}
                  >
                    {cfg.icon}
                    <span className="text-white/80">{cfg.label}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Dynamic Sections */}
        {sections.filter((s) => s.isVisible !== false).map((section, i) => (
          <motion.div
            key={section.id}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5 + i * 0.3}
            className="mb-6 md:mb-8 p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {section.title && (
              <h3
                className="font-semibold text-white mb-3 md:mb-4 text-lg md:text-xl lg:text-2xl"
                style={{ color: primary }}
              >
                {section.title}
              </h3>
            )}
            {(section.type === 'text' || section.type === 'about' || section.type === 'heading') && section.content && (
              <p className="text-white/60 text-sm md:text-base lg:text-lg leading-relaxed">{section.content}</p>
            )}
            {section.type === 'gallery' && section.images?.length > 0 && (
              <div className="flex w-full flex-col gap-5 md:gap-7 lg:gap-8">
                {section.images.map((img, idx) => (
                  <img
                    key={img.url ? `${img.url}-${idx}` : idx}
                    src={img.url}
                    alt={img.alt || `Gallery image ${idx + 1}`}
                    className="w-full max-w-full rounded-xl md:rounded-2xl object-cover object-center shadow-lg ring-1 ring-white/10 aspect-[4/3] md:aspect-auto md:min-h-[220px] md:max-h-[480px] lg:min-h-[280px] lg:max-h-[600px]"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            )}
            {section.type === 'video' && section.videoUrl && (
              <div className="w-full rounded-xl md:rounded-2xl overflow-hidden bg-black ring-1 ring-white/10">
                <video
                  src={section.videoUrl}
                  controls
                  playsInline
                  className="w-full max-h-[min(70vh,420px)] md:max-h-[min(78vh,640px)] object-contain bg-black"
                />
              </div>
            )}
            {section.type === 'links' && section.urls?.length > 0 && (
              <div className="space-y-2 md:space-y-3">
                {section.urls.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('click_link', { url: link.url })}
                    className="flex items-center justify-between p-3.5 md:p-4 rounded-xl md:rounded-2xl transition-all hover:opacity-80"
                    style={{ background: `${primary}15`, border: `1px solid ${primary}30` }}
                  >
                    <span className="text-sm md:text-base text-white/80">{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" style={{ color: primary }} />
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {/* Footer branding */}
        <div className="text-center pt-8 md:pt-10 border-t border-white/5 mt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/20 hover:text-white/40 text-xs md:text-sm transition-colors"
          >
            <div className="w-4 h-4 rounded bg-gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-[8px]">P</span>
            </div>
            Powered by Phygital
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicCard;
