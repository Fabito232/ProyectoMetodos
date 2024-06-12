import { useState, useEffect } from 'react';
import agenteImg from './assets/gerente.png';
import Persona from './Persona';
import { db } from '../src/data/db';

function App() {
  const [cola, setCola] = useState([]);
  const [personaLlamada, setPersonaLlamada] = useState(null);
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  const [tiempoLlamada, setTiempoLlamada] = useState(0);
  const [colaTiempos, setColaTiempos] = useState([]);

  const seleccionarPersonaAleatoria = () => {
    let persona;
    let bandera = true;
    console.log("cola", cola)
    while (bandera) {
      const indiceAleatorio = Math.floor(Math.random() * db.length);
      persona = db[indiceAleatorio];
      if (!cola.some(p => 
        p.id === persona.id
      )) {
        bandera = false;
      }
    }
    return persona;
  };

  const nuevaLlamada = () => {
    const nuevaPersona = seleccionarPersonaAleatoria();
    if (!personaLlamada) {
      setPersonaLlamada(nuevaPersona);
      setTiempoLlamada(0);
    } else {
      console.log("agregar pers")
      setCola(prevCola => [...prevCola, nuevaPersona]);
      setColaTiempos(prevTiempos => [...prevTiempos, 0]);
    }
  };

  const finalizarLlamada = () => {
    if (cola.length > 0) {
      const siguientePersona = cola[0];
      setCola(prevCola => prevCola.slice(1));
      setColaTiempos(prevTiempos => prevTiempos.slice(1));
      setPersonaLlamada(siguientePersona);
      setTiempoLlamada(0);
    } else {
      setPersonaLlamada(null);
      setTiempoLlamada(0);
    }
  };

  useEffect(() => {
    let intervaloLlamadas;
    if (simulacionActiva) {
      intervaloLlamadas = setInterval(() => {
        nuevaLlamada();
      }, 5000);
    }

    return () => {
      clearInterval(intervaloLlamadas);
    };
  }, [simulacionActiva, personaLlamada]);

  useEffect(() => {
    let intervaloCronometro;
    if (personaLlamada) {
      intervaloCronometro = setInterval(() => {
        setTiempoLlamada(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervaloCronometro);
  }, [personaLlamada]);

  useEffect(() => {
    let intervaloCola;
    if (cola.length > 0) {
      intervaloCola = setInterval(() => {
        setColaTiempos(prevTiempos => prevTiempos.map(t => t + 1));
      }, 1000);
    }
    return () => clearInterval(intervaloCola);
  }, [cola]);

  return (
    <div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setSimulacionActiva(!simulacionActiva)}
      >
        {simulacionActiva ? 'Detener Simulación' : 'Iniciar Simulación'}
      </button>
      <div className="flex justify-center items-center min-h-screen">
        <div className="container mx-auto">
          <h1 className="text-center text-3xl mb-8">Teoría de colas</h1>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-yellow-200 justify-center text-center items-center">
              <h1 className="p-3">Agente</h1>
              <img className="sm:h-40 md:h-48 mx-auto" src={agenteImg} alt="Logo" />
              <div className="bg-yellow-200 border-4 border-red-500 rounded-lg m-3">
                <h1 className="text-left p-3">
                  {personaLlamada ? `Atendiendo a: ${personaLlamada.nombre}` : 'Agente Libre'}
                </h1>
                {personaLlamada && (
                  <div>
                    <img
                      className="sm:h-40 md:h-48 mx-auto"
                      src={`/img/${personaLlamada.imagen}.png`}
                      alt="Persona Atendiendo"
                    />
                    <p>Tiempo en llamada: {tiempoLlamada} segundos</p>
                  </div>
                )}
              </div>
              <button onClick={finalizarLlamada} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Finalizar Llamada
              </button>
            </div>

            <div className="bg-red-400">
              <h1 className="text-center p-3">Personas en cola</h1>
              {cola.map((persona, index) => (
                <div key={index} className="bg-white p-2 m-2 rounded">
                  <Persona persona={persona} />
                  <p>Tiempo en cola: {colaTiempos[index]} segundos</p>
                </div>
              ))}
            </div>

            <div className="bg-green-400">
              <h1 className="text-center p-3">Persona en llamada</h1>
              {personaLlamada ? (
                <Persona persona={personaLlamada} />
              ) : (
                <p className="text-center">No hay llamada en curso</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
