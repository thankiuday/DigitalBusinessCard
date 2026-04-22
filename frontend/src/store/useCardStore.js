import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_DRAFT = {
  title: '',
  slug: '',
  profile: {
    photo: null,
    banner: null,
    imageSettings: {
      photo: { zoom: 1, x: 50, y: 50 },
      banner: { zoom: 1, x: 50, y: 50 },
    },
    name: '',
    jobTitle: '',
    company: '',
    bio: '',
  },
  contact: {
    phone: '',
    email: '',
    whatsapp: '',
    sms: '',
    website: '',
  },
  social: {
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    github: '',
    telegram: '',
  },
  sections: [],
  design: {
    template: 'professional',
    primaryColor: '#8b5cf6',
    secondaryColor: '#ec4899',
    bgColor: '#0a0a0f',
    font: 'Inter',
    layout: 'centered',
    cornerStyle: 'rounded',
    spacing: 'normal',
  },
  isPublic: true,
};

const newUploadDraftKey = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `d-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);

const cloneDraftTemplate = () =>
  typeof structuredClone === 'function'
    ? structuredClone(DEFAULT_DRAFT)
    : JSON.parse(JSON.stringify(DEFAULT_DRAFT));

const useCardStore = create(
  persist(
    (set, get) => ({
      draft: cloneDraftTemplate(),
      currentStep: 0,
      savedCardId: null,
      /** Scoped Cloudinary path for uploads before the card is saved (per-card folder after save) */
      uploadDraftKey: null,
      isSaving: false,

      ensureUploadDraftKey: () => {
        let key = get().uploadDraftKey;
        if (!key) {
          key = newUploadDraftKey();
          set({ uploadDraftKey: key });
        }
        return key;
      },

      setDraft: (updates) => {
        set((state) => ({
          draft: { ...state.draft, ...updates },
        }));
      },

      setDraftNested: (key, value) => {
        set((state) => ({
          draft: {
            ...state.draft,
            [key]: { ...state.draft[key], ...value },
          },
        }));
      },

      /** Batches profile + contact updates (one persist tick) for live form → preview sync */
      mergeDraftProfileContact: (profileSlice, contactSlice) => {
        set((state) => ({
          draft: {
            ...state.draft,
            profile: { ...state.draft.profile, ...profileSlice },
            contact: { ...state.draft.contact, ...contactSlice },
          },
        }));
      },

      setStep: (step) => set({ currentStep: step }),

      setSavedCardId: (id) => set({ savedCardId: id }),

      /** Clears wizard + persistence so a new card starts empty (not the last saved draft). */
      resetDraft: () =>
        set({
          draft: cloneDraftTemplate(),
          currentStep: 0,
          savedCardId: null,
          uploadDraftKey: newUploadDraftKey(),
        }),

      loadDraftFromCard: (card) => {
        const { _id, userId, views, qrCodeUrl, createdAt, updatedAt, ...draftData } = card;
        set({
          draft: { ...cloneDraftTemplate(), ...draftData },
          savedCardId: _id,
          uploadDraftKey: null,
        });
      },

      setIsSaving: (val) => set({ isSaving: val }),
    }),
    {
      name: 'phygital-card-draft',
      partialize: (state) => ({
        draft: state.draft,
        currentStep: state.currentStep,
        savedCardId: state.savedCardId,
        uploadDraftKey: state.uploadDraftKey,
      }),
    }
  )
);

export default useCardStore;
