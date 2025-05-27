import '../../index.css';
import styles from './app.module.css';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { ProtectedRoute } from '../ProtectedRoute';

import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { fetchIngredients } from '../../services/slices/ingridientsSlice';
import { clearCurrentOrder } from '../../services/slices/orderSlice';
import { useAppLogic } from './useApplogic';
import { retrieveUser } from '../../services/slices/userSlice';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { location, userstate, handleModalClose } = useAppLogic();

  useEffect(() => {
    dispatch(retrieveUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={userstate?.background || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <Modal title='Детали заказа' onClose={handleModalClose}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Детали ингредиента' onClose={handleModalClose}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
      </Routes>
      {userstate?.background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
      {userstate?.background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
      {userstate?.background && (
        <Routes>
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
