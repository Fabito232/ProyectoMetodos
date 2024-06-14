import { useState, useEffect } from 'react';
import agenteImg from './assets/gerente.png';
import { db } from '../src/data/db.js';
import Persona from './components/Persona.jsx';
import ModalDatosEntrada from './components/ModalDatosEntrada.jsx';
import {calcularP,calcularP0, calcularLq, calcularL, calcularPw, calcularWq, calcularW } from './data/metodosCola.js';
import Graficos from './components/Graficos.jsx';
import * as Math from 'mathjs';

function App() {
  const [cola, setCola] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  const [tiemposLlamada, setTiemposLlamada] = useState([]);
  const [colaTiempos, setColaTiempos] = useState([]);

  const seleccionarPersonaAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * db.length);
    return db[indiceAleatorio];
  };

  const nuevaLlamada = ()  => {
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
  },[agentes]);

  const finalizarLlamada = () => {
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
  },[agentes, cola]);


  //Intervalos de llamadas
  // useEffect(() => {
  //   let intervaloLlamadas;
  //   if (simulacionActiva && tasaLlegada > 0) {
  //     const intervalo = 60000 / tasaLlegada;
  //     intervaloLlamadas = setInterval(() => {
  //       nuevaLlamada();
  //     }, intervalo);
  //   }

  //   return () => {
  //     clearInterval(intervaloLlamadas);
  //   };
  // }, [simulacionActiva, tasaLlegada, nuevaLlamada]);
  
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

///los timepos de las colas
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
            const utilizacion = tasaLlegada / (numeroServidores * tasaServicio);
            const p0 = calcularP0(tasaLlegada, tasaServicio, numeroServidores);
            setUtilizacionPromedio(utilizacion);
            setProbabilidadSistemaVacio(p0);
            setLq(calcularLq(tasaLlegada, tasaServicio, numeroServidores));
            setL(calcularL(tasaLlegada, tasaServicio, numeroServidores));
            setPw(calcularPw(tasaLlegada, tasaServicio, numeroServidores));
            setWq(calcularWq(tasaLlegada, tasaServicio, numeroServidores));
            setW(calcularW(tasaLlegada, tasaServicio, numeroServidores));
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

  const calcularP0 = (tasaLlegada, tasaServicio, numServidores) => {
    const calcular_P = (tasaLlegada, tasaServicio, numServidores) => {
      return tasaLlegada / (numServidores * tasaServicio);
    };

    const sumatoria = Array.from({ length: numServidores }, (_, n) =>
      Math.pow(tasaLlegada / tasaServicio, n) / math.factorial(n)
    ).reduce((acc, val) => acc + val, 0);

    const segundoTermino =
      (Math.pow(tasaLlegada / tasaServicio, numServidores) /
        math.factorial(numServidores)) *
      (1 / (1 - calcular_P(tasaLlegada, tasaServicio, numServidores)));

    return 1 / (sumatoria + segundoTermino);
  };

////Tiempo simulacion
  useEffect(() => {
    let intervaloSimulacion;
    if (simulacionActiva) {
      intervaloSimulacion = setInterval(() => {
        setTiempoSimulacion(prev => {
          if (prev >= duracionSimulacion) {
            clearInterval(intervaloSimulacion);
            setSimulacionActiva(false);
            setSimulacionFinalizada(true);
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

/////////////////////////////////////////////////////////////////

  useEffect(() =>{
    if(simulacionActiva){
      setUtilizacionPromedio(calcularP(tasaLlegada, tasaServicio, numeroServidores) * 100);
      setProbabilidadSistemaVacio(calcularP0(tasaLlegada, tasaServicio, numeroServidores) * 100);
      setProbabilidadClienteEspere(calcularPw(tasaLlegada, tasaServicio, numeroServidores) * 100);
      setPromedioClienteCola(calcularLq(tasaLlegada, tasaServicio, numeroServidores));
      setPromedioClienteSistema(calcularL(tasaLlegada, tasaServicio, numeroServidores));
      setTiempoPromedioCola(calcularWq(tasaLlegada, tasaServicio, numeroServidores) * 60);
      setTiempoPromedioSistema(calcularW(tasaLlegada, tasaServicio, numeroServidores) * 60);
    }
  },[tasaLlegada, tasaServicio, numeroServidores, simulacionActiva])

  const iniciarSimulacion = () => {
    if ( duracionSimulacion > 0 && tasaLlegada > 0 && tasaServicio > 0 && numeroServidores > 0) {
      const inicializarAgentes = Array.from({ length: numeroServidores }, () => ({ personaLlamada: null }));
      setAgentes(inicializarAgentes);
      setTiemposLlamada(Array(numeroServidores).fill(0));
      setSimulacionActiva(true);
      setSimulacionFinalizada(false);
    } else {
      alert('Todos los valores deben ser mayores a 0 y el número de servidores debe estar entre 1 y 3.');
    }
  };

  const detenerSimulacion = () => {
    setSimulacionActiva(false)
    setTiempoSimulacion(0);
    setCola([]);
    setColaTiempos([]);
    setAgentes([]);
    setTiemposLlamada([]);
    setSimulacionFinalizada(true);
  }

  const salirDelPrograma = () => {
    setSimulacionFinalizada(false);
    setSimulacionActiva(false);
    setNumeroServidores(0);
    setTasaServicio(0);
    setTasaLlegada(0);
    setTiempoSimulacion(0);
    setCola([]);
    setColaTiempos([]);
    setAgentes([]);
    setTiemposLlamada([]);
  }

  return (
    <div>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setSimulacionActiva(!simulacionActiva)}>
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
                  <div>
                    <img className="sm:h-40 md:h-48 mx-auto" src={`/img/${personaLlamada.imagen}.png`} alt="Persona Atendiendo" />
                    <p>Tiempo en llamada: {tiempoLlamada} segundos</p>
                  </div>
                )}
              </div>
              <button onClick={finalizarLlamada} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Finalizar Llamada</button>
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