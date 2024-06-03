import { useState, useEffect } from 'react';
import agenteImg from './assets/gerente.png';
import { db } from '../src/data/db.js';
import Persona from './Persona.jsx';

function App() {
  const [cola, setCola] = useState([]);
  const [personaLlamada, setPersonaLlamada] = useState(null);
  const [simulacionActiva, setSimulacionActiva] = useState(false);

  const seleccionarPersonaAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * db.length);
    return db[indiceAleatorio];
  };

  const nuevaLlamada = ()  => {
    const nuevaPersona = seleccionarPersonaAleatoria();
    console.log(nuevaPersona)
    if (!personaLlamada) {
      console.log('saa')
      setPersonaLlamada(nuevaPersona);
      console.log(personaLlamada)
    } else {
      setCola(prevCola => [...prevCola, nuevaPersona]);
    }
  };

  const finalizarLlamada = () => {
    if (cola.length > 0) {
      const siguientePersona = cola[0];
      setCola(prevCola => prevCola.slice(1));
      setPersonaLlamada(siguientePersona);
    } else {
      setPersonaLlamada(null);
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

  }, [simulacionActiva, personaLlamada, nuevaLlamada]);

  return (
    <div>
      <button className = "mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setSimulacionActiva(!simulacionActiva)}>
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
                <h1 className="text-left p-3">{personaLlamada ? `Atendiendo a: ${personaLlamada.nombre}` : 'Agente Libre'}</h1>
                {personaLlamada && (
                  <img className="sm:h-40 md:h-48 mx-auto" src={`/img/${personaLlamada.imagen}.png`} alt="Persona Atendiendo" />
                )}
              </div>
              <button onClick={finalizarLlamada} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Finalizar Llamada</button>
            </div>

            <div className="bg-red-400">
              <h1 className="text-center p-3">Personas en cola</h1>
              {cola.map((persona, index) => (
                <Persona 
                  key={index}
                  persona={persona}
                />
              ))}
            </div>

            <div className="bg-green-400">
              <h1 className="text-center p-3">Persona en llamada</h1>
              {personaLlamada ? (
                <Persona 
                  persona={personaLlamada}
                />
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





/*import { useState } from 'react'
import agenteImg from './assets/gerente.png'
import { db } from '../src/data/db.js'
import Persona from './Persona.jsx';

function App() {

   // Configuración inicial basada en métricas proporcionadas
   const cantidadPersonasSimulacion = 16; // Cantidad de personas que pasarán por la simulación
   const personasEjemplo = db; // Personas de ejemplo en la base de datos (8 personas)
 
   const averageServerUtilization = 0.8;
   const averageNumberInQueue = 3.2;
   const averageNumberInSystem = 4;
   const averageTimeInQueue = 0.2; // Supongo que esto está en minutos y lo convertiré a segundos
   const averageTimeInSystem = 0.25; // Supongo que esto está en minutos y lo convertiré a segundos
   const probabilitySystemEmpty = 0.2;
 
   const tiempoSimulacionMinutos = 5; // Duración de la simulación en minutos
   const tiempoSimulacionSegundos = tiempoSimulacionMinutos * 60; // Convertir minutos a segundos
 
   // Calcula el intervalo entre llamadas en segundos basado en la utilización promedio del servidor
  const intervaloLlamadasSegundos = tiempoSimulacionSegundos / (cantidadPersonasSimulacion * averageServerUtilization);


  const [data] = useState(db);
  const [cola, setCola] = useState([]);
  const [agente, setAgente] = useState({});
  const [personaLlamada, setPersonaLlamada] = useState({nombre: 'Juan', imagen: 'person_1'});



  return (
    <>
    <div className="flex justify-center items-center min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-center text-3xl mb-8">Teoria de colas</h1>

        <div className="grid grid-cols-3 gap-4">

          <div className="bg-yellow-200 justify-center text-center items-center">
            <h1 className=" p-3"> Agente</h1>
            <img className=" sm:h-40 md:h-48 mx-auto " src={agenteImg} alt="Logo" />
            <div className="bg-yellow-200 border-4 border-red-500 rounded-lg m-3">
              <h1 className="text-left p-3"> {personaLlamada.nombre ? 'Atendiendo a :' : 'Agente Libre' }</h1>
              {(personaLlamada.nombre && personaLlamada.imagen) && (
                <img className=" sm:h-40 md:h-48 mx-auto " src={`/img/${personaLlamada.imagen}.png`} alt="Persona Atendiendo" />
              )}
              
            </div>
          </div>

          <div className="bg-red-400">
            <h1 className="text-center p-3"> Personas en cola</h1>
            {data.map((persona) => (
              <Persona 
              key = {persona.id}
              persona = {persona}
              />
            ))}
          </div>

          <div className="bg-green-400">
            <h1 className="text-center p-3">Persona en llamada</h1>
            {
              <Persona 
              persona = {personaLlamada}
              />
            }
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default App
*/