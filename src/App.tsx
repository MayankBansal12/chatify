import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home'
import PageNotFound from './components/PageNotFound'
import Auth from './components/Auth'
import { customTheme } from './utils/theme'
import { ThemeProvider } from '@mui/material';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/auth/:authType?',
      element: <Auth />,
    },
    {
      path: "*",
      element: <PageNotFound />
    }
  ])

  return (
    <ThemeProvider theme={customTheme}>
      <RouterProvider router={router} />
      <ToastContainer />
    </ThemeProvider>
  )
}

export default App
