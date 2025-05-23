import React from 'react';
import { Input } from 'antd';

const SearchBar = ({
  searchValue,
  setSearchValue,
  sugerencias,
  setSugerencias,
  buscarProductos,
  handleSearch,
  setProductos,
}) => {
  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchValue(query);

    if (query.trim() === '') {
      setSugerencias([]);
      handleSearch();
      return;
    }

    try {
      const resultados = await buscarProductos(query);
      setSugerencias(resultados);
      setProductos(resultados); // Mostrar resultados en la tabla mientras se escribe
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
    }
  };

  const handleBusquedaDirecta = async (nombre) => {
    try {
      const nombreNormalizado = nombre.trim();
      const resultados = await buscarProductos(nombreNormalizado);
      console.log("🧪 Resultado búsqueda directa:", resultados);
      setProductos(resultados);
    } catch (error) {
      console.error("Error al buscar producto desde sugerencia:", error);
    }
  };

  return (
    <div className="search-container" style={{ position: 'relative', marginBottom: '20px' }}>
      <Input.Search
        value={searchValue}
        onChange={handleInputChange}
        onSearch={() => handleBusquedaDirecta(searchValue)}
        placeholder="Buscar productos..."
        style={{
          width: '300px',
          border: 'none',
          borderBottom: '1px solid #fff',
          backgroundColor: 'transparent',
          color: '#fff',
          borderRadius: 0,
          padding: '5px 10px',
          fontSize: '14px',
          boxShadow: 'none',
        }}
        allowClear
        onClear={() => handleSearch()}
      />

      {sugerencias.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '40px',
            left: '0',
            width: '300px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            listStyle: 'none',
            padding: '5px 0',
            margin: '0',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {sugerencias.map((producto) => (
            <li
              key={producto.id}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#333',
                transition: 'background-color 0.2s ease',
              }}
              onClick={() => {
                const nombreNormalizado = producto.nombre.trim();
                setSearchValue(nombreNormalizado);
                setSugerencias([]);
                handleBusquedaDirecta(nombreNormalizado);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
            >
              {producto.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
