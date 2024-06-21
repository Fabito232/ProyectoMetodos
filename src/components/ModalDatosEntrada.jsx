import { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

Modal.setAppElement('#root');

const ModalDatosEntrada = ({ isOpen, cerrar, agregarDatosEntrada }) => {
  const [datosEntrada, setDatosEntrada] = useState({ tiempoSimulacion: 60, tasaLlegada: 0, tasaServicio: 0, servidores: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'servidores' ? value : Number(value);
    if (name === 'servidores' && !['1', '2', '3', ''].includes(value)) {
      return;
    }

    setDatosEntrada(prevState => ({
      ...prevState,
      [name]: parsedValue
    }));
  };

  const handleKeyDown = (e) => {
    const allowedKeys = ['1', '2', '3', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos Entrada:', datosEntrada);

    if (datosEntrada.tasaLlegada <= 0 || datosEntrada.tasaServicio <= 0) {
      alert('Todos los valores deben ser mayores a 0.');
    } else if (![1, 2, 3].includes(Number(datosEntrada.servidores))) {
      alert('El número de servidores debe ser 1, 2 o 3.');
    } else if (datosEntrada.tasaLlegada >= datosEntrada.tasaServicio) {
      alert('La tasa de servicio debe ser mayor que la tasa de llegada.');
    } else {
      agregarDatosEntrada(datosEntrada);
      setDatosEntrada({ tiempoSimulacion: 60, tasaLlegada: 0, tasaServicio: 0, servidores: '' });
      cerrar();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={cerrar} 
      contentLabel="Agregar Datos de Entrada" 
      className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-75"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Agregar Datos de Entrada</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tasa de llegada:</label>
            <input 
              type="number" 
              name="tasaLlegada" 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tasa de servicio:</label>
            <input 
              type="number" 
              name="tasaServicio" 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Número de servidores:</label>
            <input 
              type="number" 
              name="servidores"  
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              value={datosEntrada.servidores}
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={cerrar} 
              className="mr-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

ModalDatosEntrada.propTypes = {
  isOpen: PropTypes.bool, 
  cerrar: PropTypes.func,
  agregarDatosEntrada: PropTypes.func,
};

export default ModalDatosEntrada;
