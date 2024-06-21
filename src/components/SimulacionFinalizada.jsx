import PropTypes from 'prop-types';
import InformeGerencial from './informe';
import Graficos from './Graficos';

const SimulacionFinalizada = ({
  abrirInforme,
  openInforme,
  setOpenInforme,
  numeroServidores,
  utilizacionPromedio,
  probabilidadSistemaVacio,
  promedioClienteCola,
  promedioClienteSistema,
  probabilidadClienteEspere,
  tiempoPromedioCola,
  tiempoPromedioSistema,
  salirDelPrograma,
  iniciarSimulacion
}) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="container mx-auto text-center p-8 bg-white shadow-lg rounded-lg">
        <div className="flex justify-end">
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded ml-5" onClick={abrirInforme}>
            Informe Gerencial
          </button>
        </div>
        {openInforme && (
          <InformeGerencial
            open={openInforme}
            onClose={() => setOpenInforme(false)}
            agentes={numeroServidores}
            utilizacionPromedio={utilizacionPromedio}
            probabilidadSistemaVacio={probabilidadSistemaVacio}
            promedioClienteCola={promedioClienteCola}
            promedioClienteSistema={promedioClienteSistema}
            probabilidadClienteEspere={probabilidadClienteEspere}
            tiempoPromedioCola={tiempoPromedioCola}
            tiempoPromedioSistema={tiempoPromedioSistema}
          />
        )}
        <Graficos
          utilizacionPromedio={utilizacionPromedio}
          probabilidadSistemaVacio={probabilidadSistemaVacio}
          promedioClienteCola={promedioClienteCola}
          promedioClienteSistema={promedioClienteSistema}
          probabilidadClienteEspere={probabilidadClienteEspere}
          tiempoPromedioCola={tiempoPromedioCola}
          tiempoPromedioSistema={tiempoPromedioSistema}
        />
        <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded ml-5" onClick={salirDelPrograma}>
          Salir
        </button>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded ml-5" onClick={iniciarSimulacion}>
          Volver a la simulacion
        </button>
      </div>
    </div>
  );
};

SimulacionFinalizada.propTypes = {
  abrirInforme: PropTypes.func.isRequired,
  openInforme: PropTypes.bool.isRequired,
  setOpenInforme: PropTypes.func.isRequired,
  utilizacionPromedio: PropTypes.number.isRequired,
  probabilidadSistemaVacio: PropTypes.number.isRequired,
  promedioClienteCola: PropTypes.number.isRequired,
  promedioClienteSistema: PropTypes.number.isRequired,
  probabilidadClienteEspere: PropTypes.number.isRequired,
  tiempoPromedioCola: PropTypes.number.isRequired,
  tiempoPromedioSistema: PropTypes.number.isRequired,
  salirDelPrograma: PropTypes.func.isRequired,
  iniciarSimulacion: PropTypes.func.isRequired
};

export default SimulacionFinalizada;