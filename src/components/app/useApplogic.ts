// src/hooks/useAppLogic.ts
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingridientsSlice';
import { clearCurrentOrder } from '../../services/slices/orderSlice';

export const useAppLogic = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userstate = location.state as { background?: Location };

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
    dispatch(clearCurrentOrder());
  };

  return { location, userstate, handleModalClose };
};
