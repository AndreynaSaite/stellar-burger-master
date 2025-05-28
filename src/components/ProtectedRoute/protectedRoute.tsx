import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { FC, ReactElement } from 'react';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = (props) => {
  const { onlyUnAuth = false, children } = props;

  const location = useLocation();
  const { user: user } = useSelector((state) => state.user);
  if (onlyUnAuth && user.email && user.name) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && (!user.email || !user.name)) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
