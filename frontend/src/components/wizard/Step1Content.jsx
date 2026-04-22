import React, { useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Upload, Plus, Trash2, GripVertical, Phone, Mail, Globe,
  MessageCircle, Instagram, Linkedin, Github, Twitter, Youtube,
  Facebook, Send, Eye, EyeOff, Video,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import useCardStore from '../../store/useCardStore';
import cardService from '../../services/cardService';
import Input, { Textarea } from '../ui/Input';
import Button from '../ui/Button';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  jobTitle: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  sms: z.string().optional(),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

const SECTION_TYPES = [
  { value: 'heading', label: 'Heading' },
  { value: 'text', label: 'Text Block' },
  { value: 'about', label: 'About' },
  { value: 'gallery', label: 'Image Gallery' },
  { value: 'video', label: 'Video' },
  { value: 'links', label: 'Custom Links' },
  { value: 'testimonials', label: 'Testimonials' },
];

const SECTION_TYPE_LABELS = Object.fromEntries(SECTION_TYPES.map((s) => [s.value, s.label]));

const SortableSection = ({
  section,
  onRemove,
  onUpdate,
  onToggle,
  onGalleryFiles,
  onGalleryRemoveImage,
  galleryUploadingId,
  onVideoFile,
  onVideoClear,
  videoUploadingId,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="glass border border-white/10 rounded-xl p-4 group"
    >
      <div className="flex items-center gap-2 mb-3">
        <button {...attributes} {...listeners} className="text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing">
          <GripVertical size={16} />
        </button>
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider flex-1">
          {SECTION_TYPE_LABELS[section.type] || section.type}
        </span>
        <button onClick={() => onToggle(section.id)} className="text-white/30 hover:text-white/60 transition-colors">
          {section.isVisible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <button onClick={() => onRemove(section.id)} className="text-white/30 hover:text-red-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>

      {(section.type === 'heading' || section.type === 'text' || section.type === 'about' || section.type === 'links') && (
        <div className="space-y-2">
          <input
            placeholder="Title"
            value={section.title || ''}
            onChange={(e) => onUpdate(section.id, { title: e.target.value })}
            className="input-base text-sm"
          />
          {section.type !== 'heading' && (
            <textarea
              placeholder="Content"
              value={section.content || ''}
              onChange={(e) => onUpdate(section.id, { content: e.target.value })}
              rows={3}
              className="input-base text-sm resize-none"
            />
          )}
        </div>
      )}

      {section.type === 'gallery' && (
        <div className="space-y-3">
          <input
            placeholder="Section title (optional)"
            value={section.title || ''}
            onChange={(e) => onUpdate(section.id, { title: e.target.value })}
            className="input-base text-sm"
          />
          <label
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-5 transition-colors cursor-pointer ${
              galleryUploadingId === section.id
                ? 'border-white/10 bg-white/[0.02] cursor-wait opacity-70'
                : 'border-white/20 bg-white/[0.03] hover:border-primary-500/40'
            }`}
          >
            <Upload size={20} className="text-white/35" />
            <span className="text-xs text-white/50 text-center">
              {galleryUploadingId === section.id ? 'Uploading…' : 'Add photos — tap to choose several images'}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              disabled={!!galleryUploadingId}
              onChange={(e) => {
                onGalleryFiles(section.id, e.target.files);
                e.target.value = '';
              }}
            />
          </label>
          {section.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {section.images.map((img, idx) => (
                <div key={`${img.url}-${idx}`} className="relative group/thumb rounded-lg overflow-hidden border border-white/10 aspect-square">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onGalleryRemoveImage(section.id, idx)}
                    className="absolute top-1 right-1 p-1 rounded-md bg-black/70 text-white/90 opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {section.type === 'video' && (
        <div className="space-y-3">
          <input
            placeholder="Section title (optional)"
            value={section.title || ''}
            onChange={(e) => onUpdate(section.id, { title: e.target.value })}
            className="input-base text-sm"
          />
          <label
            className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-5 transition-colors cursor-pointer ${
              videoUploadingId === section.id
                ? 'border-white/10 bg-white/[0.02] cursor-wait opacity-70'
                : 'border-white/20 bg-white/[0.03] hover:border-primary-500/40'
            }`}
          >
            <Video size={20} className="text-white/35" />
            <span className="text-xs text-white/50 text-center">
              {videoUploadingId === section.id
                ? 'Uploading video…'
                : section.videoUrl
                  ? 'Replace video'
                  : 'Upload video — MP4, WebM, or MOV (max 50MB)'}
            </span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
              className="hidden"
              disabled={!!videoUploadingId}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onVideoFile(section.id, f);
                e.target.value = '';
              }}
            />
          </label>
          {section.videoUrl && (
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40">
              <video
                src={section.videoUrl}
                controls
                playsInline
                className="w-full max-h-64 object-contain bg-black"
              />
              <button
                type="button"
                onClick={() => onVideoClear(section.id)}
                className="absolute top-2 right-2 p-2 rounded-lg bg-black/75 text-white/90 hover:bg-black transition-colors"
                aria-label="Remove video"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LIVE_SYNC_MS = 280;
const MAX_GALLERY_IMAGES = 40;

const Step1Content = ({ onNext }) => {
  const {
    draft,
    setDraftNested,
    setDraft,
    mergeDraftProfileContact,
    savedCardId,
    ensureUploadDraftKey,
  } = useCardStore();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [galleryUploadingId, setGalleryUploadingId] = useState(null);
  const [videoUploadingId, setVideoUploadingId] = useState(null);
  const [cropModal, setCropModal] = useState({ open: false, type: null });
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [cropZoom, setCropZoom] = useState(1);
  const [croppedAreaPercentages, setCroppedAreaPercentages] = useState(null);
  const photoSettings = draft.profile?.imageSettings?.photo || { zoom: 1, x: 50, y: 50 };
  const bannerSettings = draft.profile?.imageSettings?.banner || { zoom: 1, x: 50, y: 50 };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: draft.profile?.name || '',
      jobTitle: draft.profile?.jobTitle || '',
      company: draft.profile?.company || '',
      bio: draft.profile?.bio || '',
      phone: draft.contact?.phone || '',
      email: draft.contact?.email || '',
      whatsapp: draft.contact?.whatsapp || '',
      sms: draft.contact?.sms || '',
      website: draft.contact?.website || '',
    },
  });

  const watched = useWatch({ control });

  useEffect(() => {
    if (!watched) return;
    const t = setTimeout(() => {
      mergeDraftProfileContact(
        {
          name: watched.name ?? '',
          jobTitle: watched.jobTitle ?? '',
          company: watched.company ?? '',
          bio: watched.bio ?? '',
        },
        {
          phone: watched.phone ?? '',
          email: watched.email ?? '',
          whatsapp: watched.whatsapp ?? '',
          sms: watched.sms ?? '',
          website: watched.website ?? '',
        }
      );
    }, LIVE_SYNC_MS);
    return () => clearTimeout(t);
  }, [watched, mergeDraftProfileContact]);

  useEffect(() => {
    if (!savedCardId) ensureUploadDraftKey();
  }, [savedCardId, ensureUploadDraftKey]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleImageUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const setter = type === 'profile' ? setUploadingPhoto : setUploadingBanner;
    setter(true);
    try {
      const draftKey = savedCardId ? undefined : ensureUploadDraftKey();
      const { url } = await cardService.uploadImage(file, type, {
        cardId: savedCardId || undefined,
        draftKey,
      });
      setDraftNested('profile', { [type === 'profile' ? 'photo' : 'banner']: url });
      toast.success('Image uploaded!');
    } catch (err) {
      console.error('[upload profile/banner]', err);
      toast.error(err?.message || 'Upload failed. Check that the API and Cloudinary env vars are set.');
    } finally {
      setter(false);
    }
  };

  const updateImageSettings = (type, updates) => {
    const current = draft.profile?.imageSettings || {
      photo: { zoom: 1, x: 50, y: 50 },
      banner: { zoom: 1, x: 50, y: 50 },
    };

    setDraftNested('profile', {
      imageSettings: {
        ...current,
        [type]: { ...current[type], ...updates },
      },
    });
  };

  const openCropEditor = (type) => {
    const settings = type === 'photo' ? photoSettings : bannerSettings;
    setCropZoom(settings.zoom || 1);
    setCropPosition({ x: 0, y: 0 });
    setCroppedAreaPercentages(null);
    setCropModal({ open: true, type });
  };

  const saveCroppedSettings = () => {
    if (!cropModal.type || !croppedAreaPercentages) {
      setCropModal({ open: false, type: null });
      return;
    }
    const centerX = Math.max(0, Math.min(100, (croppedAreaPercentages.x || 0) + (croppedAreaPercentages.width || 100) / 2));
    const centerY = Math.max(0, Math.min(100, (croppedAreaPercentages.y || 0) + (croppedAreaPercentages.height || 100) / 2));
    const zoomFromCrop = Math.max(1, Math.min(3, Math.max(100 / (croppedAreaPercentages.width || 100), 100 / (croppedAreaPercentages.height || 100))));

    updateImageSettings(cropModal.type, {
      zoom: Number(zoomFromCrop.toFixed(2)),
      x: Number(centerX.toFixed(1)),
      y: Number(centerY.toFixed(1)),
    });
    setCropModal({ open: false, type: null });
  };

  const addSection = (type) => {
    const newSection = {
      id: uuidv4(),
      type,
      title: '',
      content: '',
      videoUrl: '',
      images: [],
      urls: [],
      items: [],
      order: draft.sections.length,
      isVisible: true,
    };
    setDraft({ sections: [...draft.sections, newSection] });
  };

  const removeSection = (id) => {
    setDraft({ sections: draft.sections.filter((s) => s.id !== id) });
  };

  const updateSection = (id, updates) => {
    setDraft({ sections: draft.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)) });
  };

  const handleGalleryFiles = async (sectionId, fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    const section = draft.sections.find((s) => s.id === sectionId);
    const existingCount = section?.images?.length || 0;
    if (existingCount >= MAX_GALLERY_IMAGES) {
      toast.error(`You can add up to ${MAX_GALLERY_IMAGES} images per gallery.`);
      return;
    }
    const allowed = Math.min(files.length, MAX_GALLERY_IMAGES - existingCount);
    if (allowed < files.length) {
      toast(`Only ${allowed} more image(s) added (max ${MAX_GALLERY_IMAGES} per gallery).`, { icon: 'ℹ️' });
    }
    setGalleryUploadingId(sectionId);
    try {
      const batch = files.slice(0, allowed);
      const draftKey = savedCardId ? undefined : ensureUploadDraftKey();
      const nextImages = [...(section?.images || [])];
      for (const file of batch) {
        const { url } = await cardService.uploadImage(file, 'gallery', {
          cardId: savedCardId || undefined,
          draftKey,
        });
        nextImages.push({ url, alt: '' });
      }
      updateSection(sectionId, { images: nextImages });
      toast.success(batch.length === 1 ? 'Image added' : `${batch.length} images added`);
    } catch (err) {
      console.error('[upload gallery]', err);
      toast.error(err?.message || 'Could not upload images. Please try again.');
    } finally {
      setGalleryUploadingId(null);
    }
  };

  const handleGalleryRemoveImage = (sectionId, index) => {
    const section = draft.sections.find((s) => s.id === sectionId);
    if (!section?.images?.length) return;
    updateSection(sectionId, { images: section.images.filter((_, i) => i !== index) });
  };

  const handleVideoFile = async (sectionId, file) => {
    if (!file?.type?.startsWith('video/')) {
      toast.error('Choose a video file (MP4, WebM, or MOV).');
      return;
    }
    setVideoUploadingId(sectionId);
    try {
      const draftKey = savedCardId ? undefined : ensureUploadDraftKey();
      const { url } = await cardService.uploadVideo(file, {
        cardId: savedCardId || undefined,
        draftKey,
      });
      updateSection(sectionId, { videoUrl: url });
      toast.success('Video uploaded');
    } catch (err) {
      console.error('[upload video]', err);
      toast.error(err?.message || 'Video upload failed. Try a smaller file or check your connection.');
    } finally {
      setVideoUploadingId(null);
    }
  };

  const handleVideoClear = (sectionId) => {
    updateSection(sectionId, { videoUrl: '' });
  };

  const toggleSection = (id) => {
    setDraft({
      sections: draft.sections.map((s) =>
        s.id === id ? { ...s, isVisible: s.isVisible === false ? true : false } : s
      ),
    });
  };

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = draft.sections.findIndex((s) => s.id === active.id);
      const newIndex = draft.sections.findIndex((s) => s.id === over.id);
      setDraft({ sections: arrayMove(draft.sections, oldIndex, newIndex) });
    }
  };

  const onSubmit = (data) => {
    setDraftNested('profile', {
      name: data.name,
      jobTitle: data.jobTitle || '',
      company: data.company || '',
      bio: data.bio || '',
    });
    setDraftNested('contact', {
      phone: data.phone || '',
      email: data.email || '',
      whatsapp: data.whatsapp || '',
      sms: data.sms || '',
      website: data.website || '',
    });
    onNext();
  };

  const socialFields = [
    { key: 'instagram', label: 'Instagram', icon: <Instagram size={14} /> },
    { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={14} /> },
    { key: 'twitter', label: 'Twitter / X', icon: <Twitter size={14} /> },
    { key: 'github', label: 'GitHub', icon: <Github size={14} /> },
    { key: 'youtube', label: 'YouTube', icon: <Youtube size={14} /> },
    { key: 'facebook', label: 'Facebook', icon: <Facebook size={14} /> },
    { key: 'telegram', label: 'Telegram', icon: <Send size={14} /> },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400/90" aria-hidden />
        <div>
          <p className="text-xs font-medium text-white/85">Live draft</p>
          <p className="text-[11px] text-white/45 leading-snug mt-0.5">
            Your card updates in the preview as you type. This page auto-saves to your browser—if you lose connection or close the tab, your work is restored when you come back.
          </p>
        </div>
      </div>

      {/* Profile images */}
      <div>
        <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Profile Images</h3>
        <div className="flex gap-4">
          {/* Photo upload */}
          <div className="flex flex-col items-center gap-2">
            <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-white/20 hover:border-primary-500/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden bg-surface-100">
              {draft.profile?.photo ? (
                <img
                  src={draft.profile.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${photoSettings.zoom})`,
                    transformOrigin: `${photoSettings.x}% ${photoSettings.y}%`,
                  }}
                />
              ) : uploadingPhoto ? (
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={20} className="text-white/30" />
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'profile')} />
            </label>
            <span className="text-xs text-white/30">Photo</span>
          </div>

          {/* Banner upload */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <label className="w-full h-20 rounded-2xl border-2 border-dashed border-white/20 hover:border-primary-500/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden bg-surface-100">
              {draft.profile?.banner ? (
                <img
                  src={draft.profile.banner}
                  alt="Banner"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${bannerSettings.zoom})`,
                    transformOrigin: `${bannerSettings.x}% ${bannerSettings.y}%`,
                  }}
                />
              ) : uploadingBanner ? (
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Upload size={18} className="text-white/30" />
                  <span className="text-xs text-white/30">Banner (optional)</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'banner')} />
            </label>
          </div>
        </div>

        {(draft.profile?.photo || draft.profile?.banner) && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {draft.profile?.photo && (
              <div className="glass border border-white/10 rounded-xl p-3">
                <p className="text-xs text-white/70 mb-2">Photo Adjust</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-white/50">Use crop tool to adjust framing</p>
                  <Button type="button" size="sm" variant="secondary" onClick={() => openCropEditor('photo')}>
                    Crop Photo
                  </Button>
                </div>
              </div>
            )}

            {draft.profile?.banner && (
              <div className="glass border border-white/10 rounded-xl p-3">
                <p className="text-xs text-white/70 mb-2">Banner Adjust</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-white/50">Use crop tool to adjust framing</p>
                  <Button type="button" size="sm" variant="secondary" onClick={() => openCropEditor('banner')}>
                    Crop Banner
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {cropModal.open && cropModal.type && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass border border-white/20 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">
                Crop {cropModal.type === 'photo' ? 'Profile Photo' : 'Banner'}
              </h4>
              <button
                type="button"
                onClick={() => setCropModal({ open: false, type: null })}
                className="text-white/60 hover:text-white text-sm"
              >
                Close
              </button>
            </div>

            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-black/40 h-80">
              <Cropper
                image={cropModal.type === 'photo' ? draft.profile?.photo : draft.profile?.banner}
                crop={cropPosition}
                zoom={cropZoom}
                aspect={cropModal.type === 'photo' ? 1 : 3}
                cropShape={cropModal.type === 'photo' ? 'round' : 'rect'}
                showGrid
                onCropChange={setCropPosition}
                onZoomChange={setCropZoom}
                onCropComplete={(_, croppedAreaPercent) => setCroppedAreaPercentages(croppedAreaPercent)}
              />
            </div>

            <div className="mt-4">
              <label className="block">
                <span className="text-xs text-white/60">Zoom ({cropZoom.toFixed(1)}x)</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={cropZoom}
                  onChange={(e) => setCropZoom(Number(e.target.value))}
                  className="w-full mt-2 accent-purple-500"
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setCropModal({ open: false, type: null })}>
                Cancel
              </Button>
              <Button type="button" onClick={saveCroppedSettings}>
                Apply Crop
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Profile info */}
      <div>
        <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Profile Info</h3>
        <div className="space-y-4">
          <Input label="Full Name *" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Job Title" placeholder="Product Designer" {...register('jobTitle')} />
            <Input label="Company" placeholder="Acme Inc." {...register('company')} />
          </div>
          <Textarea label="Bio" placeholder="A short introduction about yourself..." rows={3} {...register('bio')} />
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Contact Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Phone" placeholder="+91 98765 43210" icon={<Phone size={14} />} {...register('phone')} />
          <Input label="Email" type="email" placeholder="you@example.com" icon={<Mail size={14} />} error={errors.email?.message} {...register('email')} />
          <Input label="WhatsApp" placeholder="+91 98765 43210" icon={<MessageCircle size={14} />} {...register('whatsapp')} />
          <Input label="Website" placeholder="https://yoursite.com" icon={<Globe size={14} />} error={errors.website?.message} {...register('website')} />
        </div>
      </div>

      {/* Social links */}
      <div>
        <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">Social Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socialFields.map(({ key, label, icon }) => (
            <Input
              key={key}
              label={label}
              placeholder={`https://...`}
              icon={icon}
              value={draft.social?.[key] || ''}
              onChange={(e) => setDraftNested('social', { [key]: e.target.value })}
            />
          ))}
        </div>
      </div>

      {/* Dynamic sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Sections</h3>
          <div className="flex gap-2 flex-wrap justify-end">
            {SECTION_TYPES.map((st) => (
              <button
                key={st.value}
                type="button"
                onClick={() => addSection(st.value)}
                className="text-xs glass px-2.5 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
              >
                <Plus size={11} /> {st.label}
              </button>
            ))}
          </div>
        </div>

        {draft.sections.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={draft.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {draft.sections.map((section) => (
                  <SortableSection
                    key={section.id}
                    section={section}
                    onRemove={removeSection}
                    onUpdate={updateSection}
                    onToggle={toggleSection}
                    onGalleryFiles={handleGalleryFiles}
                    onGalleryRemoveImage={handleGalleryRemoveImage}
                    galleryUploadingId={galleryUploadingId}
                    onVideoFile={handleVideoFile}
                    onVideoClear={handleVideoClear}
                    videoUploadingId={videoUploadingId}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-8 border border-dashed border-white/10 rounded-xl text-white/30 text-sm">
            Add sections to enrich your card
          </div>
        )}
      </div>

      <Button type="submit" fullWidth size="lg">
        Continue to Design →
      </Button>
    </form>
  );
};

export default Step1Content;
