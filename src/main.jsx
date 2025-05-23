import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import FormLogin from './pages/Login/Login.jsx';
import Publico from './pages/Principal/Publico.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import Especificaciones from './pages/Admin/Especificaciones.jsx';
import ProtocoloEstudio from './pages/Admin/ProtocoloEstudio/ProtocoloEstudio.jsx';
import FormulaList from './pages/Admin/FormulaCualitativa/FormulaList.jsx';
import FormaFarmaceuticaList from './pages/Admin/FormaFarmaceutica/FormaFarmaceuticaList.jsx';
import ClasificacionPA from './pages/Admin/ClasificacionPA.jsx';
import Valoraciones from './pages/Admin/Valoraciones.jsx';
import FrecuenciaMuestreoPage from './pages/Admin/ProtocoloEstudio/FrecuenciaMuestreoPage.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <FormLogin />
  },
  {
    path: '/admin-dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/protocolo-estudio',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <ProtocoloEstudio />
      </ProtectedRoute>
    )
  },
  {
    path: '/especificaciones',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Especificaciones />
      </ProtectedRoute>
    )
  },
  {
    path: '/publico-dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'publico']}>
        <Publico />
      </ProtectedRoute>
    )
  },
  {
    path: '/frecuencia-muestreo',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <FrecuenciaMuestreoPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/forma-farmaceutica',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <FormaFarmaceuticaList />
      </ProtectedRoute>
    )
  },
  {
    path: '/valoraciones',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Valoraciones />
      </ProtectedRoute>
    )
  },
  {
    path: '/clasificacion_pa',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <ClasificacionPA />
      </ProtectedRoute>
    )
  },
  {
    path: '/formula-cualitativa',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <FormulaList />
      </ProtectedRoute>
    )
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
