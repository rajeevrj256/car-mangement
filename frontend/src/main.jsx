import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Header from './components/ui/custom/Header'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>
  }
 
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
  <Header></Header>
  
  <RouterProvider  router={router}></RouterProvider>
    </GoogleOAuthProvider>;
</StrictMode>
)
