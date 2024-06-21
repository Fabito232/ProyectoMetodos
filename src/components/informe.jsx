import Modal from 'react-modal';

const InformeGerencial = ({ open, onClose, agentes, utilizacionPromedio, probabilidadSistemaVacio, promedioClienteCola, promedioClienteSistema, probabilidadClienteEspere, tiempoPromedioCola, tiempoPromedioSistema }) => {

    const formatNumber = (num) => {
        return num.toFixed(2);
    };

    const obtenerRecomendacionUtilizacion = (utilizacion) => {
        console.log("U: ", utilizacion);
        if (utilizacion >= 80) {
            return "emplear más agentes";
        } else if (utilizacion >= 29 && utilizacion <= 79) {
            return "utilizar esta cantidad de agentes";
        } else {
            return "emplear menos agentes";
        }
    };

    const obtenerRecomendacionClientesCola = (Lq) => {
        if (Lq >= 1.25) {
            return "emplear más agentes";
        } else if (Lq >= 0.15 && Lq <= 1.24) {
            return "utilizar esta cantidad de agentes";
        } else {
            return "emplear menos agentes";
        }
    };

    const obtenerRecomendacionClientesSistema = (L) => {
        if (L >= 2) {
            return "emplear más agentes";
        } else if (L >= 0.90 && L <= 1.99) {
            return "utilizar esta cantidad de agentes";
        } else {
            return "emplear menos agentes";
        }
    };

    const obtenerRecomendacionTiempoCola = (Wq) => {
        if (Wq >= 101) {
            return "emplear más agentes";
        } else if (Wq >= 6 && Wq <= 100) {
            return "utilizar esta cantidad de agentes";
        } else {
            return "emplear menos agentes";
        }
    };

    const obtenerRecomendacionSistemaVacio = (P0) => {
        if (P0 <= 20) {
            return "emplear más agentes";
        } else if (P0 >= 21 && P0 <= 44) {
            return "utilizar esta cantidad de agentes";
        } else {
            return "emplear menos agentes";
        }
    };

    const obtenerRecomendacionClienteEspere = (Pw) => {
        if (Pw >= 26) {
            return "emplear más agentes";
        } else if (Pw >= 16 && Pw <= 25) {
            return "utilizar esta cantidad de agentes";
        } else {
            return "emplear menos agentes";
        }
    };

    const obtenerRecomendacionGeneral = () => {
        const utilizacion = obtenerRecomendacionUtilizacion(utilizacionPromedio);
        const clientesCola = obtenerRecomendacionClientesCola(promedioClienteCola);
        const clientesSistema = obtenerRecomendacionClientesSistema(promedioClienteSistema);
        const tiempoCola = obtenerRecomendacionTiempoCola(tiempoPromedioCola);
        const sistemaVacio = obtenerRecomendacionSistemaVacio(probabilidadSistemaVacio);
        const clienteEspere = obtenerRecomendacionClienteEspere(probabilidadClienteEspere);

        if (utilizacion === "emplear más agentes" || clientesCola === "emplear más agentes" || clientesSistema === "emplear más agentes" || tiempoCola === "emplear más agentes" || sistemaVacio === "emplear más agentes" || clienteEspere === "emplear más agentes") {
            return "emplear más agentes";
        } else if (utilizacion === "utilizar esta cantidad de agentes" || clientesCola === "utilizar esta cantidad de agentes" || clientesSistema === "utilizar esta cantidad de agentes" || tiempoCola === "utilizar esta cantidad de agentes" || sistemaVacio === "utilizar esta cantidad de agentes" || clienteEspere === "utilizar esta cantidad de agentes") {
            return "utilizar esta cantidad de agentes";
        } else {
            return "emplear menos agentes";
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
                    <p>
                        Según los datos observados con <strong>{agentes} agente(s)</strong>, nuestra recomendación es <strong>{obtenerRecomendacionGeneral()}</strong>, ya que el porcentaje de utilización promedio del agente al ser <strong>{formatNumber(utilizacionPromedio)}%</strong> se traduce en que 
                        {utilizacionPromedio >= 80 ? (
                        <> el agente tendrá que trabajar mucho tiempo seguido sin poder así despejar la mente y tener algún tiempo de ocio.</>
                        ) : utilizacionPromedio >= 60 ? (
                        <> hay un balance en la carga de trabajo para la persona que está atendiendo las llamadas y tiene posibilidades de poder liberar su mente en algunos lapsos de tiempo.</>
                        ) : (
                        <> hay una gran posibilidad de que cada agente tenga mucho tiempo libre, lo cual podría reflejarse en que no harían trabajo efectivo y tendrían mucho tiempo de ocio.</>
                        )}
                    </p>
                    <br/>
                    <p>Otro punto a tener en cuenta es que la cantidad promedio de clientes en la cola es de <strong>{formatNumber(promedioClienteCola)}</strong> y el número promedio de clientes en el sistema es de <strong>{formatNumber(promedioClienteSistema)}</strong>, lo que quiere decir que el sistema es <strong>{promedioClienteSistema >= 2 ? 'ineficiente' : promedioClienteSistema >= 0.90 ? 'ideal' : 'excesivo para la aerolínea'}</strong> para dar un buen servicio a todos los clientes.</p>
                    <br/>
                    <p>Al considerar el tiempo promedio en cola de <strong>{formatNumber(tiempoPromedioCola)} minutos</strong> y el intervalo promedio de <strong>{formatNumber(tiempoPromedioSistema)} minutos</strong> de tiempo que un cliente pasa en el sistema en general, resulta <strong>{tiempoPromedioCola >= 1.01 ? 'frustrante e inapropiado' : tiempoPromedioCola >= 0.1 ? 'en un intervalo en donde no es excesivo para la aerolínea ni molesto' : 'excesivo para la aerolínea, pero gratificante'}</strong> para la mayoría de las personas.</p>
                    <br/>
                    <p>
                        Por último, al haber un <strong>{formatNumber(probabilidadSistemaVacio)}%</strong> de probabilidad de que el sistema esté vacío y un <strong>{formatNumber(probabilidadClienteEspere)}%</strong> de probabilidad de que un cliente que llega tenga que esperar indica que
                        {probabilidadSistemaVacio <= 20 ? (
                        <> se usa demasiado el sistema, con lo cual, la cantidad de agentes es poca para la demanda de llamadas, lo que puede repercutir en la salud y eficiencia de los trabajadores.</>
                        ) : probabilidadSistemaVacio <= 44 ? (
                        <> el sistema se encuentra en un estado óptimo por el hecho de que hay un equilibrio entre la cantidad de agentes y la demanda de llamadas que recibe la agencia.</> 
                        ) : (
                        <> no se usa mucho el sistema, con lo cual la cantidad de agentes es considerablemente grande para la demanda de llamadas y además, los empleados pueden estar mucho tiempo libre sin realizar trabajo efectivo.</>
                        )}
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default InformeGerencial;