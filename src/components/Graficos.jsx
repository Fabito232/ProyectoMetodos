import PropTypes from 'prop-types'
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

Graficos.propTypes = {
    utilizacionPromedio: PropTypes.number,
    probabilidadSistemaVacio: PropTypes.number,
    promedioClienteCola: PropTypes.number,
    promedioClienteSistema: PropTypes.number,
    probabilidadClienteEspere: PropTypes.number,
    tiempoPromedioCola: PropTypes.number,
    tiempoPromedioSistema: PropTypes.number,

}

function Graficos({ utilizacionPromedio, probabilidadSistemaVacio, promedioClienteCola, promedioClienteSistema, probabilidadClienteEspere, tiempoPromedioCola, tiempoPromedioSistema }) {
  // Datos para el gráfico de Tiempos
  const dataBarTiempos = {
    labels: ['Tiempo promedio en cola (Wq)', 'Tiempo promedio en el sistema (W)'],
    datasets: [
      {
        label: 'Tiempos (minutos)',
        data: [tiempoPromedioCola, tiempoPromedioSistema],
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1
      }
    ]
  };

  // Datos para el gráfico de Promedios
  const dataBarPromedios = {
    labels: ['Número promedio de llamadas en cola (Lq)', 'Número promedio de llamadas en el sistema (L)'],
    datasets: [
      {
        label: 'Promedios (Llamadas)',
        data: [promedioClienteCola, promedioClienteSistema],
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1
      }
    ]
  };

  // Datos para el gráfico de Probabilidades
  const dataBarProbabilidades = {
    labels: ['Probabilidad de que el sistema esté vacío', 'Probabilidad de que una persona tenga que esperar (Pw)'],
    datasets: [
      {
        label: 'Probabilidades (%)',
        data: [probabilidadSistemaVacio, probabilidadClienteEspere],
        backgroundColor: [
          'rgba(153, 102, 255, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1
      }
    ]
  };
console.log(utilizacionPromedio)
  // Datos para el gráfico de Pastel
  const dataPieUtilizacion = {
    labels: ['Utilización del sistema (%)', 'No utilizado'],
    datasets: [
      {
        data: [utilizacionPromedio, (100 - utilizacionPromedio)],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const optionsBar = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Resultados de la Simulación',
        font: {
          size: 24
        }
      },
      legend: {
        labels: {
          font: {
            size: 16
          }
        }
      }
    }
  };

  const optionsPie = {
    plugins: {
      title: {
        display: true,
        text: 'Utilización del Sistema',
        font: {
          size: 24
        }
      },
      legend: {
        labels: {
          font: {
            size: 16
          }
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
    <div className="p-4">
      <Bar data={dataBarTiempos} options={optionsBar} />
    </div>
    <div className="p-4">
      <Bar data={dataBarPromedios} options={optionsBar} />
    </div>
    <div className="p-4">
      <Bar data={dataBarProbabilidades} options={optionsBar} />
    </div>
    <div className="p-4">
      <Pie data={dataPieUtilizacion} options={optionsPie} />
    </div>
  </div>
  );
}

export default Graficos;
