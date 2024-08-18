import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home'
import PageNotFound from './components/PageNotFound'
import Auth from './components/Auth'

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/auth/:authType?',
      element: <Auth />,
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App
