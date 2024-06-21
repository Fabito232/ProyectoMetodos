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
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto', textAlign: 'center', backgroundColor: '#e0f7fa', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ color: '#007BFF' }}>Informe Gerencial</h2>
                <button
                    style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        backgroundColor: '#007BFF', 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px 20px', 
                        borderRadius: '5px', 
                        cursor: 'pointer' 
                    }}
                    onClick={onClose}
                >
                    Cerrar
                </button>
                <div style={{ marginTop: '20px' }}>
                    <p>Según los datos observados con <strong>{agentes} agente(s)</strong>, nuestra recomendación es <strong>{obtenerRecomendacionGeneral()}</strong>, ya que el porcentaje de utilización promedio del sistema es <strong>{formatNumber(utilizacionPromedio)}%</strong> para las personas que deben de esperar en la cola y ser atendidas por un servidor.</p>
                    <p>Otro punto a tener en cuenta es que la cantidad promedio de clientes en la cola es de <strong>{formatNumber(promedioClienteCola)}</strong> y el número promedio de clientes en el sistema es de <strong>{formatNumber(promedioClienteSistema)}</strong>, lo que quiere decir que el sistema es <strong>{promedioClienteSistema >= 2 ? 'ineficiente' : promedioClienteSistema >= 0.90 ? 'ideal' : 'excesivo'}</strong> para dar un buen servicio a todos los clientes.</p>
                    <p>Al considerar el tiempo promedio en cola de <strong>{formatNumber(tiempoPromedioCola)} segundos</strong> y el intervalo promedio de <strong>{formatNumber(tiempoPromedioSistema)} segundos</strong> de tiempo que un cliente pasa en el sistema en general, resulta <strong>{tiempoPromedioCola >= 101 ? 'frustrante e inapropiado' : tiempoPromedioCola >= 6 ? 'en un intervalo en donde no es excesivo para la aerolínea ni molesto' : 'excesivo para la aerolínea, pero gratificante'}</strong> para la mayoría de las personas.</p>
                    <p>Por último, al haber un <strong>{formatNumber(probabilidadSistemaVacio)}%</strong> de probabilidad de que el sistema esté vacío y un <strong>{formatNumber(probabilidadClienteEspere)}%</strong> de probabilidad de que un cliente que llega tenga que esperar indica que <strong>{probabilidadSistemaVacio <= 20 ? 'se usa demasiado el sistema, con lo cual, la cantidad de agentes es poca para la demanda de llamadas, lo que puede repercutir en la salud y eficiencia de los trabajadores' : probabilidadSistemaVacio <= 44 ? 'el sistema se encuentra en un estado óptimo por el hecho de que hay un equilibrio entre la cantidad de agentes y la demanda de llamadas que recibe la agencia' : 'no se usa mucho el sistema, con lo cual la cantidad de agentes es considerablemente grande para la demanda de llamadas y además, los empleados pueden estar mucho tiempo libre sin realizar trabajo efectivo'}</strong>.</p>
                </div>
            </div>
        </Modal>
    );
};

export default InformeGerencial;