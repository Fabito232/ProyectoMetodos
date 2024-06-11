import { useState, useEffect } from 'react';
import agenteImg from './assets/gerente.png';
import { db } from '../src/data/db.js';
import Persona from './Persona.jsx';
import * as math from 'mathjs';
import { calcularP, calcularL, calcularLq, calcularP0, calcularPw, calcularW, calcularWq } from './data/metodoscolas.js';

function App() {
  const [cola, setCola] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  const [tiemposLlamada, setTiemposLlamada] = useState([]);
  const [colaTiempos, setColaTiempos] = useState([]);
  const [tiempoSimulacion, setTiempoSimulacion] = useState(0);
  const [duracionSimulacion, setDuracionSimulacion] = useState(0);
  const [tasaLlegada, setTasaLlegada] = useState(0);
  const [tasaServicio, setTasaServicio] = useState(0);
  const [numeroServidores, setNumeroServidores] = useState(1);
  const [mostrarVentanaInicial, setMostrarVentanaInicial] = useState(true);
  const [simulacionFinalizada, setSimulacionFinalizada] = useState(false);
  const [utilizacionPromedio, setUtilizacionPromedio] = useState(0);
  const [probabilidadSistemaVacio, setProbabilidadSistemaVacio] = useState(0);

  const seleccionarPersonaAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * db.length);
    return db[indiceAleatorio];
  };

  const nuevaLlamada = () => {
    const nuevaPersona = seleccionarPersonaAleatoria();
    const agenteLibre = agentes.findIndex(agente => agente.personaLlamada === null);

    if (agenteLibre !== -1) {
      const nuevosAgentes = [...agentes];
      nuevosAgentes[agenteLibre].personaLlamada = nuevaPersona;
      setAgentes(nuevosAgentes);
      setTiemposLlamada(prev => {
        const nuevosTiempos = [...prev];
        nuevosTiempos[agenteLibre] = 0;
        return nuevosTiempos;
      });
    } else {
      setCola(prevCola => [...prevCola, nuevaPersona]);
      setColaTiempos(prevTiempos => [...prevTiempos, 0]);
    }
  };

  const finalizarLlamada = (index) => {
    if (cola.length > 0) {
      const siguientePersona = cola[0];
      setCola(prevCola => prevCola.slice(1));
      setColaTiempos(prevTiempos => prevTiempos.slice(1));
      const nuevosAgentes = [...agentes];
      nuevosAgentes[index].personaLlamada = siguientePersona;
      setAgentes(nuevosAgentes);
      setTiemposLlamada(prev => {
        const nuevosTiempos = [...prev];
        nuevosTiempos[index] = 0;
        return nuevosTiempos;
      });
    } else {
      const nuevosAgentes = [...agentes];
      nuevosAgentes[index].personaLlamada = null;
      setAgentes(nuevosAgentes);
      setTiemposLlamada(prev => {
        const nuevosTiempos = [...prev];
        nuevosTiempos[index] = 0;
        return nuevosTiempos;
      });
    }
  };

  useEffect(() => {
    let intervaloLlamadas;
    if (simulacionActiva && tasaLlegada > 0) {
      const intervalo = 60000 / tasaLlegada; // Calcula el intervalo en milisegundos
      intervaloLlamadas = setInterval(() => {
        nuevaLlamada();
      }, intervalo);
    }

    return () => {
      clearInterval(intervaloLlamadas);
    };
  }, [simulacionActiva, tasaLlegada]);

  useEffect(() => {
    let intervalosCronometro = [];
    if (simulacionActiva && tasaServicio > 0) {
      const intervaloServicio = 60000 / tasaServicio; // Calcula el intervalo en milisegundos
      intervalosCronometro = agentes.map((_, index) =>
        setInterval(() => {
          setTiemposLlamada(prev => {
            const nuevosTiempos = [...prev];
            if (nuevosTiempos[index] >= intervaloServicio / 1000) { // Convierte milisegundos a segundos
              finalizarLlamada(index);
            }
            nuevosTiempos[index] += 1;
            return nuevosTiempos;
          });
        }, 1000)
      );
    }
    return () => intervalosCronometro.forEach(intervalo => clearInterval(intervalo));
  }, [simulacionActiva, tasaServicio, agentes]);

  useEffect(() => {
    let intervaloCola;
    if (cola.length > 0) {
      intervaloCola = setInterval(() => {
        setColaTiempos(prevTiempos => prevTiempos.map(t => t + 1));
      }, 1000);
    }
    return () => clearInterval(intervaloCola);
  }, [cola]);

  useEffect(() => {
    let intervaloSimulacion;
    if (simulacionActiva) {
      intervaloSimulacion = setInterval(() => {
        setTiempoSimulacion(prev => {
          if (prev >= duracionSimulacion) {
            clearInterval(intervaloSimulacion);
            setSimulacionActiva(false);
            setSimulacionFinalizada(true);
            setUtilizacionPromedio(tasaLlegada / (numeroServidores * tasaServicio));
            setProbabilidadSistemaVacio(calcular_P0(tasaLlegada, tasaServicio, numeroServidores));
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setTiempoSimulacion(0);
    }
    return () => clearInterval(intervaloSimulacion);
  }, [simulacionActiva, duracionSimulacion]);

  const iniciarSimulacion = () => {
    if (duracionSimulacion > 0 && tasaLlegada > 0 && tasaServicio > 0 && numeroServidores > 0) {
      const inicializarAgentes = Array.from({ length: numeroServidores }, () => ({ personaLlamada: null }));
      setAgentes(inicializarAgentes);
      setTiemposLlamada(Array(numeroServidores).fill(0));
      setMostrarVentanaInicial(false);
      setSimulacionActiva(true);
      setSimulacionFinalizada(false);
    } else {
      alert('Todos los valores deben ser mayores a 0 y el número de servidores debe estar entre 1 y 3.');
    }
  };

  const volverVentanaInicial = () => {
    setSimulacionActiva(false);
    setMostrarVentanaInicial(true);
    setTiempoSimulacion(0);
    setCola([]);
    setColaTiempos([]);
    setAgentes([]);
    setTiemposLlamada([]);
    setSimulacionFinalizada(false);
  };

  const calcular_P0 = (tasaLlegada, tasaServicio, numServidores) => {
    const calcular_P = (tasaLlegada, tasaServicio, numServidores) => {
      return tasaLlegada / (numServidores * tasaServicio);
    };

    const sumatoria = Array.from({ length: numServidores }, (_, n) =>
      Math.pow(tasaLlegada / tasaServicio, n) / math.factorial(n)
    ).reduce((acc, val) => acc + val, 0);

    const ultimoTermino = Math.pow(tasaLlegada / tasaServicio, numServidores) / math.factorial(numServidores) * (1 / (1 - calcular_P(tasaLlegada, tasaServicio, numServidores)));

    return 1 / (sumatoria + ultimoTermino);
  };

  return (
    <div>
      {mostrarVentanaInicial ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl mb-8">Configuración de Simulación</h1>
            <div className="mb-4">
              <label className="block text-left text-center">Duración en segundos de la simulación:</label>
              <input
                type="number"
                className="border-2 border-gray-300 p-2"
                placeholder="Ingrese duración de la simulación en segundos"
                value={duracionSimulacion}
                onChange={(e) => setDuracionSimulacion(Math.max(0, Number(e.target.value)))}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left text-center">Tasa de llegada de clientes por minuto:</label>
              <input
                type="number"
                className="border-2 border-gray-300 p-2"
                placeholder="Ingrese tasa de llegada de clientes por minuto"
                value={tasaLlegada}
                onChange={(e) => setTasaLlegada(Math.max(0, Number(e.target.value)))}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left text-center">Tasa de servicio por minuto (por agente):</label>
              <input
                type="number"
                className="border-2 border-gray-300 p-2"
                placeholder="Ingrese tasa de servicio por minuto"
                value={tasaServicio}
                onChange={(e) => setTasaServicio(Math.max(0, Number(e.target.value)))}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left text-center">Número de servidores (1-3):</label>
              <input
                type="number"
                className="border-2 border-gray-300 p-2"
                placeholder="Ingrese número de servidores"
                value={numeroServidores}
                onChange={(e) => setNumeroServidores(Math.min(3, Math.max(1, Number(e.target.value))))}
                required
              />
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={iniciarSimulacion}>
              Iniciar Simulación
            </button>
          </div>
        </div>
      ) : (
        <div>
          {simulacionFinalizada ? (
            <div className="flex justify-center items-center min-h-screen">
              <div className="container mx-auto text-center">
                <h1 className="text-3xl mb-4">Simulación Finalizada</h1>
                <p>Utilización promedio del sistema (p): {(utilizacionPromedio * 100).toFixed(2)}%</p>
                <p>Probabilidad de que el sistema esté vacío (P0): {(probabilidadSistemaVacio * 100).toFixed(2)}%</p>
                <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded" onClick={volverVentanaInicial}>
                  Volver a Configuración
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-screen">
              <div className="container mx-auto text-center">
                <h1 className="text-3xl mb-4">Simulación en Proceso</h1>
                <div>
                  <button
                    className={`mt-4 px-4 py-2 ${simulacionActiva ? 'bg-red-500' : 'bg-blue-500'} text-white rounded`}
                    onClick={() => setSimulacionActiva(!simulacionActiva)}
                  >
                    {simulacionActiva ? 'Detener Simulación' : 'Iniciar Simulación'}
                  </button>
                  {!simulacionActiva && (
                    <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded" onClick={volverVentanaInicial}>
                      Volver a Configuración
                    </button>
                  )}
                </div>
                <div className="text-center mt-4">
                  <p>Tiempo de simulación: {tiempoSimulacion} segundos</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {agentes.map((agente, index) => (
                    <div key={index} className="bg-yellow-200 justify-center text-center items-center">
                      <h1 className="p-3">Agente {index + 1}</h1>
                      <img className="sm:h-40 md:h-48 mx-auto" src={agenteImg} alt="Agente" />
                      <div className="bg-yellow-200 border-4 border-red-500 rounded-lg m-3">
                        <h1 className="text-left p-3">{agente.personaLlamada ? `Atendiendo a: ${agente.personaLlamada.nombre}` : 'Agente Libre'}</h1>
                        {agente.personaLlamada && (
                          <div>
                            <img className="sm:h-40 md:h-48 mx-auto" src={`/img/${agente.personaLlamada.imagen}.png`} alt="Persona Atendiendo" />
                            <p>Tiempo en llamada: {tiemposLlamada[index]} segundos</p>
                          </div>
                        )}
                      </div>
                      <button onClick={() => finalizarLlamada(index)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Finalizar Llamada</button>
                    </div>
                  ))}
                  <div className="bg-red-400">
                    <h1 className="text-center p-3">Personas en cola: {cola.length}</h1>
                    {cola.map((persona, index) => (
                      <div key={index} className="bg-white p-2 m-2 rounded">
                        <Persona persona={persona} />
                        <p>Tiempo en cola: {colaTiempos[index]} segundos</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-green-400">
                    <h1 className="text-center p-3">Personas en llamada: {agentes.filter(agente => agente.personaLlamada).length}</h1>
                    {agentes.some(agente => agente.personaLlamada) ? (
                      agentes.filter(agente => agente.personaLlamada).map((agente, index) => (
                        <Persona key={index} persona={agente.personaLlamada} />
                      ))
                    ) : (
                      <p className="text-center">No hay llamada en curso</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
