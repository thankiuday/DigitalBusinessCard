import { useState, useEffect, useCallback } from 'react';
import cardService from '../services/cardService';
import toast from 'react-hot-toast';

export const useCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchCards = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const result = await cardService.getMyCards({ page, limit: 20 });
      setCards(result.cards);
      setPagination({ page: result.page, pages: result.pages, total: result.total });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const deleteCard = async (id) => {
    try {
      await cardService.deleteCard(id);
      setCards((prev) => prev.filter((c) => c._id !== id));
      toast.success('Card deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const duplicateCard = async (id) => {
    try {
      const newCard = await cardService.duplicateCard(id);
      setCards((prev) => [newCard, ...prev]);
      toast.success('Card duplicated');
      return newCard;
    } catch (err) {
      toast.error(err.message);
    }
  };

  return { cards, loading, error, pagination, fetchCards, deleteCard, duplicateCard };
};
