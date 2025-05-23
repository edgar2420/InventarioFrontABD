import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Package, History, LogOut } from 'lucide-react'
import './Sidebar.css'

const Sidebar = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const isActive = (path) => location.pathname === path

    return (
        <aside className="sidebar">
            <h1 className="logo">Inventario ABD</h1>
            <nav className="nav">
                <button onClick={() => navigate('/')} className={isActive('/') ? 'active' : ''}>
                    <Home size={20} /> Inicio
                </button>
                <button onClick={() => navigate('/componentes')} className={isActive('/componentes') ? 'active' : ''}>
                    <Package size={20} /> Componentes
                </button>
                <button onClick={() => navigate('/unidad-proceso')} className={isActive('/unidad-proceso') ? 'active' : ''}>
                    <Package size={20} /> Unidad de Proceso
                </button>
                <button onClick={() => navigate('/movimientos')} className={isActive('/movimientos') ? 'active' : ''}>
                    <History size={20} /> Entradas y Salidas
                </button>
                <button className="logout">
                    <LogOut size={20} /> Cerrar sesión
                </button>
            </nav>
        </aside>
    )
}

export default Sidebar
