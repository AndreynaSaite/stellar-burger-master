import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loadAllOrders } from '../../services/slices/orderSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector((store) => store.order.ordersList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAllOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
