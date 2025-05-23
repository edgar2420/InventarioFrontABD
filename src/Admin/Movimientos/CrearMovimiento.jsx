import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Select from 'react-select'
import { registrarMovimiento } from '../../../src/services/Movimiento'
import { obtenerComponentes } from '../../services/Componente'
import './movimientos.css'

const CrearMovimiento = () => {
    const navigate = useNavigate()
    const [componentes, setComponentes] = useState([])
    const [form, setForm] = useState({
        componente_codigo: '',
        tipo: 'entrada',
        cantidad: '',
        persona: '',
        orden_trabajo: '',
        motivo: ''
    })
    const [cargando, setCargando] = useState(false)

    useEffect(() => {
        const cargar = async () => {
            const data = await obtenerComponentes()
            setComponentes(data)
        }
        cargar()
    }, [])

    const opcionesComponentes = componentes.map(c => ({
        value: c.codigo,
        label: `${c.codigo} - ${c.nombre}`
    }))

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCargando(true)

        try {
            await registrarMovimiento(form)
            alert('✅ Movimiento registrado correctamente')
            navigate('/componentes')
        } catch (err) {
            console.error(err)
            alert('❌ Error al registrar movimiento')
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="producto-container">
            <div className="form-box">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-blue-600 text-2xl font-bold flex items-center gap-2">
                        <Upload size={24} /> Registrar Movimiento
                    </h2>
                    <button
                        type="button"
                        onClick={() => navigate('/componentes')}
                        className="btn-navegacion"
                    >
                        <ArrowLeft size={18} /> Volver
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Select
                        options={opcionesComponentes}
                        placeholder="Seleccionar Componente"
                        value={form.componente_codigo ? opcionesComponentes.find(o => o.value === form.componente_codigo) : null}
                        onChange={(opcion) => setForm({ ...form, componente_codigo: opcion?.value || '' })}
                        className="react-select"
                    />

                    <Select
                        options={[{ value: 'entrada', label: 'Entrada' }, { value: 'salida', label: 'Salida' }]}
                        value={{ value: form.tipo, label: form.tipo.charAt(0).toUpperCase() + form.tipo.slice(1) }}
                        onChange={(op) => setForm({ ...form, tipo: op.value })}
                        className="react-select"
                    />

                    <input
                        type="number"
                        name="cantidad"
                        value={form.cantidad}
                        placeholder="Cantidad"
                        min="1"
                        className="input"
                        onChange={(e) => {
                            const val = parseInt(e.target.value)
                            if (!isNaN(val) && val >= 0) setForm({ ...form, cantidad: val })
                            else if (e.target.value === '') setForm({ ...form, cantidad: '' })
                        }}
                    />

                    <input
                        name="persona"
                        value={form.persona}
                        onChange={handleChange}
                        placeholder="Persona Responsable"
                        className="input"
                    />

                    <input
                        name="orden_trabajo"
                        value={form.orden_trabajo}
                        onChange={handleChange}
                        placeholder="Orden de Trabajo (opcional)"
                        className="input"
                    />

                    <textarea
                        name="motivo"
                        value={form.motivo}
                        onChange={handleChange}
                        placeholder="Motivo (opcional)"
                        className="input sm:col-span-2"
                        rows={3}
                    />

                    <button
                        type="submit"
                        disabled={cargando}
                        className="col-span-full btn btn-guardar flex items-center justify-center gap-2"
                    >
                        {cargando ? 'Guardando...' : <><CheckCircle2 size={18} /> Guardar Movimiento</>}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CrearMovimiento
