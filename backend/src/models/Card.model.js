import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['heading', 'text', 'about', 'gallery', 'video', 'social', 'links', 'testimonials'],
      required: true,
    },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    images: [{ url: String, alt: String }],
    urls: [{ label: String, url: String }],
    items: [mongoose.Schema.Types.Mixed],
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { _id: false }
);

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
      minlength: 3,
      maxlength: 60,
    },
    title: {
      type: String,
      default: 'My Card',
      maxlength: 100,
    },
    profile: {
      photo: { type: String, default: null },
      banner: { type: String, default: null },
      imageSettings: {
        photo: {
          zoom: { type: Number, default: 1 },
          x: { type: Number, default: 50 },
          y: { type: Number, default: 50 },
        },
        banner: {
          zoom: { type: Number, default: 1 },
          x: { type: Number, default: 50 },
          y: { type: Number, default: 50 },
        },
      },
      name: { type: String, default: '', maxlength: 100 },
      jobTitle: { type: String, default: '', maxlength: 100 },
      company: { type: String, default: '', maxlength: 100 },
      bio: { type: String, default: '', maxlength: 500 },
    },
    contact: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      sms: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    social: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      github: { type: String, default: '' },
      telegram: { type: String, default: '' },
    },
    sections: {
      type: [sectionSchema],
      default: [],
    },
    design: {
      template: { type: String, default: 'professional' },
      primaryColor: { type: String, default: '#8b5cf6' },
      secondaryColor: { type: String, default: '#ec4899' },
      bgColor: { type: String, default: '#0a0a0f' },
      font: { type: String, default: 'Inter' },
      layout: { type: String, default: 'centered', enum: ['centered', 'left', 'cover'] },
      cornerStyle: { type: String, default: 'rounded', enum: ['rounded', 'sharp'] },
      spacing: { type: String, default: 'normal', enum: ['compact', 'normal', 'relaxed'] },
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    qrCodeUrl: {
      type: String,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

cardSchema.index({ slug: 1 });
cardSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Card', cardSchema);
