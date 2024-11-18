import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Header from './components/custom/header';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CreateProduct from './create-product';
import ProductList from './product-list';
import ProductDetails from './product-details';
import ProductEdit from './product-edit';
//import ProductEdit from './product-edit';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/create-product',
    element: <CreateProduct />,
  },
  {
    path:'/product-list',
    element: <ProductList></ProductList>
  },
  {
    path:'/product-details/:id',
    element: <ProductDetails></ProductDetails>
  },
  // {
  //   path:'/product-edit-details/:id',
  //   element: <ProductEdit></ProductEdit>
  // }
  {
    path: '/product-edit-details/:id',
    element: <ProductEdit />, // Ensure this route is uncommented
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header />
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
