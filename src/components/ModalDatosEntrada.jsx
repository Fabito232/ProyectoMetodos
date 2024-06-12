import { useState} from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types'

Modal.setAppElement('#root'); // Esto es necesario para la accesibilidad

const ModalDatosEntrada = ({ isOpen, cerrar, agregarDatosEntrada }) => {
  const [datosEntrada, setDatosEntrada] = useState({ tiempoSimulacion: 0, tasaLlegada: 0, tasaServicio: 0, servidores: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosEntrada(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(datosEntrada)
    agregarDatosEntrada(datosEntrada);
    setDatosEntrada({ tasaLlegada: 0, tasaServicio: 0, servidores: 0 });
    cerrar();
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
            <label className="block text-gray-700 mb-2">Tiempo simulacion (segundos):</label>
            <input 
              type="number" 
              name="tiempoSimulacion" 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
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
            <label className="block text-gray-700 mb-2">Numero de servidores:</label>
            <input 
              type="number" 
              name="servidores"  
              onChange={handleChange} 
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
}

export default ModalDatosEntrada;
