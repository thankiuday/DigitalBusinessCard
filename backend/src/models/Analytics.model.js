import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: ['view', 'click_call', 'click_email', 'click_whatsapp', 'click_website', 'click_social', 'qr_scan', 'save_contact', 'click_link'],
      required: true,
    },
    visitorId: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: false }
);

analyticsSchema.index({ cardId: 1, timestamp: -1 });
analyticsSchema.index({ cardId: 1, eventType: 1 });

export default mongoose.model('Analytics', analyticsSchema);
