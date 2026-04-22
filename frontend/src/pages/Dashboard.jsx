import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Copy, Trash2, ExternalLink, BarChart3, QrCode,
  Eye, MoreVertical, Globe, Lock, Edit2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import useCardStore from '../store/useCardStore';
import { useCards } from '../hooks/useCards';
import cardService from '../services/cardService';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { SkeletonCard } from '../components/ui/Skeleton';

const CardMenu = ({ card, onDelete, onDuplicate, onEdit }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-40 glass-card border border-white/10 py-1 shadow-glass">
            <button
              onClick={() => { onEdit(card); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Edit2 size={13} /> Edit
            </button>
            <button
              onClick={() => { onDuplicate(card._id); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Copy size={13} /> Duplicate
            </button>
            <button
              onClick={() => { onDelete(card._id); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { resetDraft, loadDraftFromCard } = useCardStore();
  const { cards, loading, deleteCard, duplicateCard } = useCards();
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const handleCreate = () => {
    resetDraft();
    navigate('/create');
  };

  const handleEdit = async (card) => {
    try {
      const fullCard = await cardService.getCard(card._id);
      loadDraftFromCard(fullCard);
      navigate('/create');
    } catch (err) {
      toast.error(err.message || 'Failed to load card for editing');
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    await deleteCard(deleteModal.id);
    setDeleting(false);
    setDeleteModal({ open: false, id: null });
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-white/40 text-sm mt-1">Manage and share your digital cards</p>
          </div>
          <Button icon={<Plus size={16} />} onClick={handleCreate}>
            New Card
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Cards', value: cards.length },
            { label: 'Total Views', value: cards.reduce((a, c) => a + (c.views || 0), 0) },
            { label: 'Published', value: cards.filter((c) => c.isPublic).length },
            { label: 'With QR', value: cards.filter((c) => c.qrCodeUrl).length },
          ].map((stat) => (
            <div key={stat.label} className="glass-card border border-white/5">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
              <Plus size={28} className="text-primary-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No cards yet</h3>
            <p className="text-white/40 text-sm mb-6">Create your first digital business card</p>
            <Button onClick={handleCreate} icon={<Plus size={16} />}>Create Your First Card</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, i) => (
              <motion.div
                key={card._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card border border-white/5 hover:border-primary-500/20 transition-all duration-300 group"
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {card.profile?.photo ? (
                      <img
                        src={card.profile.photo}
                        alt={card.profile.name}
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                    ) : (
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                        style={{ background: `linear-gradient(135deg, ${card.design?.primaryColor || '#8b5cf6'}, ${card.design?.secondaryColor || '#ec4899'})` }}
                      >
                        {(card.profile?.name || card.title || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-medium text-sm leading-tight">{card.profile?.name || card.title || 'Untitled'}</h3>
                      <p className="text-white/40 text-xs">{card.profile?.jobTitle || 'No title'}</p>
                    </div>
                  </div>
                  <CardMenu
                    card={card}
                    onEdit={handleEdit}
                    onDelete={(id) => setDeleteModal({ open: true, id })}
                    onDuplicate={duplicateCard}
                  />
                </div>

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Badge variant={card.isPublic ? 'success' : 'neutral'} dot>
                    {card.isPublic ? 'Public' : 'Private'}
                  </Badge>
                  <Badge variant="neutral">
                    <Eye size={10} className="mr-1" />
                    {card.views || 0} views
                  </Badge>
                  {card.qrCodeUrl && <Badge variant="primary"><QrCode size={10} className="mr-1" />QR</Badge>}
                </div>

                <p className="text-white/30 text-xs mb-4 truncate">
                  phygital.app/card/{card.slug}
                </p>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleEdit(card)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => window.open(`/card/${card.slug}`, '_blank')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <ExternalLink size={12} /> View
                  </button>
                  <button
                    onClick={() => navigate(`/card/${card.slug}/print`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <QrCode size={12} /> Print
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Delete Card"
        size="sm"
      >
        <p className="text-white/60 text-sm mb-6">
          This action is permanent. The card and its analytics will be deleted.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setDeleteModal({ open: false, id: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" fullWidth loading={deleting} onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </AppLayout>
  );
};

export default Dashboard;
