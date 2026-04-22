import React, { memo } from 'react';
import {
  Phone, Mail, MessageCircle, Globe, Instagram, Facebook,
  Twitter, Linkedin, Youtube, Github, Send, ExternalLink,
} from 'lucide-react';

const socialIcons = {
  instagram: <Instagram size={14} />,
  facebook: <Facebook size={14} />,
  twitter: <Twitter size={14} />,
  linkedin: <Linkedin size={14} />,
  youtube: <Youtube size={14} />,
  github: <Github size={14} />,
  telegram: <Send size={14} />,
};

const CardPreview = memo(({ draft, scale = 1 }) => {
  const { profile, contact, social, sections = [], design } = draft;
  const photoSettings = profile?.imageSettings?.photo || { zoom: 1, x: 50, y: 50 };
  const bannerSettings = profile?.imageSettings?.banner || { zoom: 1, x: 50, y: 50 };
  const isLeft = design?.layout === 'left';
  const isCover = design?.layout === 'cover';
  const hasBannerImage = Boolean(profile?.banner);
  const primary = design?.primaryColor || '#8b5cf6';
  const secondary = design?.secondaryColor || '#ec4899';
  const bg = design?.bgColor || '#0a0a0f';
  const radius = design?.cornerStyle === 'sharp' ? '0' : '16px';

  const activeSocials = social
    ? Object.entries(social).filter(([, v]) => v)
    : [];

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        backgroundColor: bg,
        borderRadius: radius,
        width: '320px',
        minHeight: '480px',
        fontFamily: design?.font || 'Inter',
        color: '#f8fafc',
        overflow: 'hidden',
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: `0 0 40px ${primary}33`,
        position: 'relative',
      }}
    >
      {/* Banner: show uploaded banner on every layout; gradient hero only for "cover" when no image */}
      {hasBannerImage && (
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
            opacity: isCover ? 0.9 : 1,
            background: `linear-gradient(135deg, ${primary}33, ${secondary}22)`,
          }}
        >
          <img
            src={profile.banner}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transform: `scale(${bannerSettings.zoom})`,
              transformOrigin: `${bannerSettings.x}% ${bannerSettings.y}%`,
            }}
          />
        </div>
      )}
      {!hasBannerImage && isCover && (
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            background: `linear-gradient(135deg, ${primary}, ${secondary})`,
            opacity: 0.7,
            overflow: 'hidden',
            position: 'relative',
          }}
        />
      )}
      {!hasBannerImage && !isCover && (
        <div
          style={{
            height: '3px',
            width: '100%',
            background: `linear-gradient(90deg, ${primary}, ${secondary})`,
          }}
        />
      )}

      {/* Header */}
      <div
        style={{
          padding: isCover ? '0 20px 16px' : '20px 20px 12px',
          marginTop: isCover ? '-40px' : 0,
          display: 'flex',
          flexDirection: isLeft ? 'row' : 'column',
          alignItems: isLeft ? 'center' : 'center',
          gap: '12px',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: isCover ? '72px' : '64px',
            height: isCover ? '72px' : '64px',
            borderRadius: design?.cornerStyle === 'sharp' ? '4px' : '50%',
            background: profile?.photo ? undefined : `linear-gradient(135deg, ${primary}, ${secondary})`,
            border: isCover ? `3px solid ${bg}` : 'none',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 700,
            color: 'white',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {profile?.photo && (
            <img
              src={profile.photo}
              alt={profile?.name || 'Profile'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${photoSettings.zoom})`,
                transformOrigin: `${photoSettings.x}% ${photoSettings.y}%`,
              }}
            />
          )}
          {!profile?.photo && (profile?.name?.charAt(0)?.toUpperCase() || 'P')}
        </div>

        <div style={{ textAlign: isLeft ? 'left' : 'center' }}>
          {profile?.name && (
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
              {profile.name}
            </h2>
          )}
          {profile?.jobTitle && (
            <p style={{ fontSize: '12px', color: primary, margin: '4px 0 0', fontWeight: 500 }}>
              {profile.jobTitle}
            </p>
          )}
          {profile?.company && (
            <p style={{ fontSize: '11px', color: 'rgba(248,250,252,0.45)', margin: '2px 0 0' }}>
              {profile.company}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile?.bio && (
        <p
          style={{
            margin: '0 20px 12px',
            fontSize: '11px',
            lineHeight: 1.5,
            color: 'rgba(248,250,252,0.55)',
          }}
        >
          {profile.bio}
        </p>
      )}

      {/* Contact buttons */}
      {(contact?.phone || contact?.email || contact?.whatsapp || contact?.website) && (
        <div style={{ display: 'flex', gap: '8px', padding: '0 20px 14px', flexWrap: 'wrap' }}>
          {contact.phone && (
            <span style={btnStyle(primary)}>
              <Phone size={11} /> Call
            </span>
          )}
          {contact.email && (
            <span style={btnStyle(primary)}>
              <Mail size={11} /> Email
            </span>
          )}
          {contact.whatsapp && (
            <span style={{ ...btnStyle(primary), background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
              <MessageCircle size={11} /> WhatsApp
            </span>
          )}
          {contact.website && (
            <span style={btnStyle(primary)}>
              <Globe size={11} /> Website
            </span>
          )}
        </div>
      )}

      {/* Social icons */}
      {activeSocials.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', padding: '0 20px 14px', flexWrap: 'wrap' }}>
          {activeSocials.map(([key]) => (
            <span
              key={key}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: `${primary}20`,
                border: `1px solid ${primary}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: primary,
              }}
            >
              {socialIcons[key]}
            </span>
          ))}
        </div>
      )}

      {/* Sections */}
      {sections.filter((s) => s.isVisible !== false).map((section) => (
        <div key={section.id} style={{ padding: '0 20px 14px' }}>
          {section.type === 'heading' && (
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: primary, marginBottom: '4px' }}>
              {section.title}
            </h3>
          )}
          {(section.type === 'text' || section.type === 'about') && (
            <>
              {section.title && (
                <h4 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{section.title}</h4>
              )}
              {section.content && (
                <p style={{ fontSize: '11px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.5 }}>
                  {section.content}
                </p>
              )}
            </>
          )}
          {section.type === 'gallery' && section.images?.length > 0 && (
            <>
              {section.title && (
                <h4 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>{section.title}</h4>
              )}
              {/* Always single-column: preview is 320px but Tailwind sm: is viewport-based, so grid would show 2 cols on desktop */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                {section.images.map((img, i) => (
                  <img
                    key={img.url ? `${img.url}-${i}` : i}
                    src={img.url}
                    alt={img.alt || ''}
                    style={{
                      width: '100%',
                      aspectRatio: '4 / 3',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      display: 'block',
                    }}
                    loading="lazy"
                  />
                ))}
              </div>
            </>
          )}
          {section.type === 'video' && section.videoUrl && (
            <>
              {section.title && (
                <h4 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>{section.title}</h4>
              )}
              <video
                src={section.videoUrl}
                controls
                playsInline
                style={{
                  width: '100%',
                  maxHeight: '180px',
                  borderRadius: '6px',
                  background: '#000',
                }}
              />
            </>
          )}
          {section.type === 'links' && section.urls?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {section.urls.slice(0, 5).map((link, idx) => (
                <span
                  key={idx}
                  style={{
                    ...btnStyle(primary),
                    justifyContent: 'space-between',
                    fontSize: '10px',
                  }}
                >
                  {link.label || 'Link'} <ExternalLink size={10} />
                </span>
              ))}
            </div>
          )}
          {section.type === 'testimonials' && (
            <>
              {section.title && (
                <h4 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{section.title}</h4>
              )}
              <p style={{ fontSize: '10px', color: 'rgba(248,250,252,0.45)', lineHeight: 1.4 }}>
                {section.content || (section.items?.length ? `${section.items.length} testimonial(s)` : 'Testimonials')}
              </p>
            </>
          )}
        </div>
      ))}

      {/* Gradient bottom accent */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${primary}, ${secondary})`,
        }}
      />
    </div>
  );
});

const btnStyle = (primary) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '5px 10px',
  borderRadius: '8px',
  fontSize: '10px',
  fontWeight: 500,
  background: `${primary}20`,
  border: `1px solid ${primary}40`,
  color: primary,
  cursor: 'pointer',
});

CardPreview.displayName = 'CardPreview';
export default CardPreview;
