import React from 'react';
import Modal from 'react-modal';

const InformeGerencial = ({ open, onClose, agentes, utilizacionPromedio, probabilidadSistemaVacio, promedioClienteCola, promedioClienteSistema, probabilidadClienteEspere, tiempoPromedioCola, tiempoPromedioSistema }) => {

    const formatNumber = (num) => {
        return num.toFixed(2);
    };

    const obtenerRecomendacionUtilizacion = (utilizacion) => {
        if (utilizacion >= 80) {
            return "Emplear más agentes";
        } else if (utilizacion >= 29 && utilizacion <= 79) {
            return "Utilizar esta cantidad de agentes";
        } else {
            return "Emplear menos agentes";
        }
    };

    const obtenerRecomendacionClientesCola = (Lq) => {
        if (Lq >= 1.25) {
            return "Emplear más agentes";
        } else if (Lq >= 0.15 && Lq <= 1.24) {
            return "Utilizar esta cantidad de agentes";
        } else {
            return "Emplear menos agentes";
        }
    };

    const obtenerRecomendacionClientesSistema = (L) => {
        if (L >= 2) {
            return "Emplear más agentes";
        } else if (L >= 0.90 && L <= 1.99) {
            return "Utilizar esta cantidad de agentes";
        } else {
            return "Emplear menos agentes";
        }
    };

    const obtenerRecomendacionTiempoCola = (Wq) => {
        if (Wq >= 101) {
            return "Emplear más agentes";
        } else if (Wq >= 6 && Wq <= 100) {
            return "Utilizar esta cantidad de agentes";
        } else {
            return "Emplear menos agentes";
        }
    };

    const obtenerRecomendacionSistemaVacio = (P0) => {
        if (P0 <= 20) {
            return "Emplear más agentes";
        } else if (P0 >= 21 && P0 <= 44) {
            return "Utilizar esta cantidad de agentes";
        } else {
            return "Emplear menos agentes";
        }
    };

    const obtenerRecomendacionClienteEspere = (Pw) => {
        if (Pw >= 26) {
            return "Emplear más agentes";
        } else if (Pw >= 16 && Pw <= 25) {
            return "Utilizar esta cantidad de agentes";
        } else {
            return "Emplear menos agentes";
        }
    };

    const obtenerRecomendacionGeneral = () => {
        const utilizacion = obtenerRecomendacionUtilizacion(utilizacionPromedio);
        const clientesCola = obtenerRecomendacionClientesCola(promedioClienteCola);
        const clientesSistema = obtenerRecomendacionClientesSistema(promedioClienteSistema);
        const tiempoCola = obtenerRecomendacionTiempoCola(tiempoPromedioCola);
        const sistemaVacio = obtenerRecomendacionSistemaVacio(probabilidadSistemaVacio);
        const clienteEspere = obtenerRecomendacionClienteEspere(probabilidadClienteEspere);

        if (utilizacion === "Emplear más agentes" || clientesCola === "Emplear más agentes" || clientesSistema === "Emplear más agentes" || tiempoCola === "Emplear más agentes" || sistemaVacio === "Emplear más agentes" || clienteEspere === "Emplear más agentes") {
            return "Emplear más agentes";
        } else if (utilizacion === "Utilizar esta cantidad de agentes" && clientesCola === "Utilizar esta cantidad de agentes" && clientesSistema === "Utilizar esta cantidad de agentes" && tiempoCola === "Utilizar esta cantidad de agentes" && sistemaVacio === "Utilizar esta cantidad de agentes" && clienteEspere === "Utilizar esta cantidad de agentes") {
            return "Utilizar esta cantidad de agentes";
        } else {
            return "Emplear menos agentes";
        }
    };

    return (
        <Modal isOpen={open} onRequestClose={onClose} ariaHideApp={false}>
            <h2>Informe Gerencial</h2>
            <button
                className="absolute top-0 right-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center mt-2 mr-2"
                onClick={onClose}
            >
                Cerrar
            </button>
            <div>
                <p>Según los datos observados con {agentes} agente(s), nuestra recomendación es {obtenerRecomendacionGeneral()}, ya que el porcentaje de utilización promedio del sistema es {formatNumber(utilizacionPromedio)}% para las personas que deben de esperar en la cola y ser atendidas por un servidor. Otro punto a tener en cuenta es que la cantidad promedio de clientes en la cola es de {formatNumber(promedioClienteCola)} y el número promedio de clientes en el sistema es de {formatNumber(promedioClienteSistema)}, lo que quiere decir que el sistema es {promedioClienteSistema >= 2 ? 'ineficiente' : promedioClienteSistema >= 0.90 ? 'ideal' : 'excesivo'} para dar un buen servicio a todos los clientes. Al considerar el tiempo promedio en cola de {formatNumber(tiempoPromedioCola)} segundos y el intervalo promedio de {formatNumber(tiempoPromedioSistema)} segundos de tiempo que un cliente pasa en el sistema en general, resulta {tiempoPromedioCola >= 101 ? 'frustrante e inapropiado' : tiempoPromedioCola >= 6 ? 'en un intervalo en donde no es excesivo para la aerolínea ni molesto' : 'excesivo para la aerolínea, pero gratificante'} para la mayoría de las personas. Por último, al haber un {formatNumber(probabilidadSistemaVacio)}% de probabilidad de que el sistema esté vacío y un {formatNumber(probabilidadClienteEspere)}% de probabilidad de que un cliente que llega tenga que esperar indica que {probabilidadSistemaVacio <= 20 ? 'se usa demasiado el sistema, con lo cual, la cantidad de agentes es poca para la demanda de llamadas, lo que puede repercutir en la salud y eficiencia de los trabajadores' : probabilidadSistemaVacio <= 44 ? 'el sistema se encuentra en un estado óptimo por el hecho de que hay un equilibrio entre la cantidad de agentes y la demanda de llamadas que recibe la agencia' : 'no se usa mucho el sistema, con lo cual la cantidad de agentes es considerablemente grande para la demanda de llamadas y además, los empleados pueden estar mucho tiempo libre sin realizar trabajo efectivo'}.</p>
            </div>
        </Modal>
    );
};

export default InformeGerencial;
