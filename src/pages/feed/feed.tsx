import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loadFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const loading = useSelector((store) => store.feeds.loading);
  const data = useSelector((store) => store.feeds.content);
  const handleGetFeeds = () => {
    dispatch(loadFeed());
  };
  useEffect(() => {
    handleGetFeeds();
  }, [dispatch]);

  const orders: TOrder[] = data.orders;

  if (!orders.length) {
    return <Preloader />;
  }

  return loading ? (
    <Preloader />
  ) : (
    <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
  );
};
