import { useState, useEffect, useCallback } from 'react';
import agenteImg from './assets/gerente.png';
import { db } from './data/db.js';
import Persona from './components/Persona.jsx';
import ModalDatosEntrada from './components/ModalDatosEntrada.jsx';
import { calcularP, calcularP0, calcularLq, calcularL, calcularPw, calcularWq, calcularW } from './data/metodosCola.js';
import Graficos from './components/Graficos.jsx';
import * as Math from 'mathjs';
import Menu from './components/Menu.jsx';
import InformeGerencial from './components/informe.jsx';

function App() {
  const [cola, setCola] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  const [tiemposLlamada, setTiemposLlamada] = useState([]);
  const [colaTiempos, setColaTiempos] = useState([]);
  const [tiempoSimulacion, setTiempoSimulacion] = useState(0);
  const [duracionSimulacion, setDuracionSimulacion] = useState(0);
  const [simulacionFinalizada, setSimulacionFinalizada] = useState(false);
  const [openInforme, setOpenInforme] = useState(false);

  //Menu
  const [opcionMenu, setOpcionMenu] = useState(1);

  //-------Metodos----------------
  const [utilizacionPromedio, setUtilizacionPromedio] = useState(0);
  const [probabilidadSistemaVacio, setProbabilidadSistemaVacio] = useState(0);
  const [promedioClienteCola, setPromedioClienteCola] = useState(0);
  const [promedioClienteSistema, setPromedioClienteSistema] = useState(0);
  const [probabilidadClienteEspere, setProbabilidadClienteEspere] = useState(0);
  const [tiempoPromedioCola, setTiempoPromedioCola] = useState(0);
  const [tiempoPromedioSistema, setTiempoPromedioSistema] = useState(0);

  //---------Modal--------------------
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tasaLlegada, setTasaLlegada] = useState(0);
  const [tasaServicio, setTasaServicio] = useState(0);
  const [numeroServidores, setNumeroServidores] = useState(1);

  const agregarDatosEntrada = (datosEntrada) => {
    setTasaLlegada(datosEntrada.tasaLlegada)
    setTasaServicio(datosEntrada.tasaServicio)
    setNumeroServidores(datosEntrada.servidores)
    setDuracionSimulacion(datosEntrada.tiempoSimulacion)
  }
  const abrirModal = () => {
    setModalIsOpen(true);
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
  };
  ///////////////////////////////

  const seleccionarPersonaAleatoria = () => {
    let indiceAleatorio = Math.floor(Math.random() * db.length);
    return db[indiceAleatorio];
  };

  const generarExponencial = (tasa) => {
    const calculo = -Math.log(1.0 - Math.random()) / tasa
    return calculo;
  };
  /////////////////////////////////////////////////////////////////
  const nuevaLlamada = useCallback(() => {
    let nuevaPersona = seleccionarPersonaAleatoria();

    while (agentes.some(agente => agente.personaLlamada?.id === nuevaPersona.id)) {
      nuevaPersona = seleccionarPersonaAleatoria();
    }
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
  }, [agentes]);

  const finalizarLlamada = useCallback((index) => {
    if (cola.length > 0) {
      const siguientePersona = cola[0];
      if (agentes[index].personaLlamada.id === siguientePersona.id) {
        setCola(prevCola => prevCola.slice(1));
        setColaTiempos(prevTiempos => prevTiempos.slice(1));
      }
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
  }, [agentes, cola]);

  useEffect(() => {
    if (simulacionActiva && tasaLlegada > 0) {
      setTimeout(nuevaLlamada, generarExponencial(((tasaLlegada) * 60000) * 60));
    }
  }, [simulacionActiva, tasaLlegada, nuevaLlamada]);



  useEffect(() => {
    let intervalosCronometro = [];
    if (simulacionActiva && tasaServicio > 0) {
      intervalosCronometro = agentes.map((_, index) =>
        setInterval(() => {
          setTiemposLlamada(prev => {
            const nuevosTiempos = [...prev];
            if (nuevosTiempos[index] >= (generarExponencial(tasaServicio) * 60)) {
              finalizarLlamada(index);
            }
            nuevosTiempos[index] += 1;
            return nuevosTiempos;
          });
        }, 1000)
      );
    }
    return () => intervalosCronometro.forEach(intervalo => clearInterval(intervalo));
  }, [simulacionActiva, tasaServicio, agentes, finalizarLlamada]);

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

  useEffect(() => {
    if (tasaLlegada > 0 && tasaServicio > 0 && numeroServidores > 0) {
      setUtilizacionPromedio(calcularP(tasaLlegada, tasaServicio, numeroServidores) * 100);
      setProbabilidadSistemaVacio(calcularP0(tasaLlegada, tasaServicio, numeroServidores) * 100);
      setProbabilidadClienteEspere(calcularPw(tasaLlegada, tasaServicio, numeroServidores) * 100);
      setPromedioClienteCola(calcularLq(tasaLlegada, tasaServicio, numeroServidores));
      setPromedioClienteSistema(calcularL(tasaLlegada, tasaServicio, numeroServidores));
      setTiempoPromedioCola(calcularWq(tasaLlegada, tasaServicio, numeroServidores) * 60);
      setTiempoPromedioSistema(calcularW(tasaLlegada, tasaServicio, numeroServidores) * 60);
    }
  }, [tasaLlegada, tasaServicio, numeroServidores, simulacionActiva])

  const iniciarSimulacion = () => {
    if (duracionSimulacion > 0 && tasaLlegada > 0 && tasaServicio > 0 && numeroServidores > 0) {
      const inicializarAgentes = Array.from({ length: numeroServidores }, () => ({ personaLlamada: null }));
      setAgentes(inicializarAgentes);
      setTiemposLlamada(Array(numeroServidores).fill(0));
      setSimulacionActiva(true);
      setSimulacionFinalizada(false);
    } else {
      alert('Todos los valores deben ser mayores a 0 y el número de servidores debe ser 1 o 2 como maximo.');
    }
  };

  const detenerSimulacion = () => {

    if (duracionSimulacion > 0 && tasaLlegada > 0 && tasaServicio > 0 && numeroServidores > 0) {
      setSimulacionActiva(false)
      setTiempoSimulacion(0);
      setCola([]);
      setColaTiempos([]);
      setAgentes([]);
      setTiemposLlamada([]);
      setSimulacionFinalizada(true);
    } else {
      alert('Todos los valores deben ser mayores a 0 y el número de servidores debe ser 1 o 2 como maximo.');
    }
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

  const abrirInforme = () => {
    setOpenInforme(true)
  };

  const agregarOpcionMenu = (opcion) => {
    if (opcion === 1) {
      detenerSimulacion();
    } else if (opcion === 2) {
      iniciarSimulacion()
    } else if (opcion === 3) {
      abrirModal();
    } else {
      abrirInforme();
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="container mx-auto text-center p-8 bg-white shadow-lg rounded-lg">
        {simulacionFinalizada ? (
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
        ) : (
          <div className="flex justify-center items-center min-h-screen ">
            <div className="container mx-auto text-center ">
              <div>
                {!simulacionActiva ? (
                  <div className="flex flex-col justify-center items-center min-h-screen bg-fondoInicial bg-cover">
                    <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg mb-48">
                      <h1 className="text-3xl font-bold text-center text-gray-800">Modelos de Filas de Espera y Teoría de Colas</h1>
                    </div>
                    <div className="flex justify-center items-center">
                      <Menu agregarOpcionMenu={agregarOpcionMenu} />
                    </div>
                    <ModalDatosEntrada isOpen={modalIsOpen} cerrar={cerrarModal} agregarDatosEntrada={agregarDatosEntrada} />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl mb-4">Simulación en Proceso</h1>
                    <button className="mt-4 px-4 py-2 mr-5 bg-red-500 text-white rounded" onClick={detenerSimulacion}>
                      Detener Simulación
                    </button>
                    <div className="text-center mt-4">
                      <p>Tiempo de simulación: {tiempoSimulacion} segundos</p>
                    </div>
                  </>
                )}
              </div>
              {simulacionActiva && (
                <div className={`grid ${agentes.length === 1 ? 'grid-cols-2' : 'grid-cols-3'}  gap-4 mt-4`}>
                  {agentes.map((agente, index) => (
                    <div key={index} className="bg-yellow-200 justify-center text-center items-center  m-5">
                      <h1 className="p-3 font-bold">Agente {index + 1}</h1>
                      <img className="sm:h-40 md:h-48 mx-auto" src={agenteImg} alt="Agente" />
                      <div className="bg-green-200 border-4 border-green-500 rounded-lg m-3">
                        <h1 className="text-left p-3 font-bold">{agente.personaLlamada ? `Atendiendo a: ${agente.personaLlamada.nombre}` : 'Agente libre'}</h1>
                        {agente.personaLlamada && (
                          <div>
                            <img className="sm:h-40 md:h-48 mx-auto" src={`/img/${agente.personaLlamada.imagen}.png`} alt="Persona Atendiendo" />
                            <p>Tiempo en llamada: {tiemposLlamada[index]} segundos</p>
                          </div>
                        )}
                      </div>
                      <button onClick={() => finalizarLlamada(index)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded mb-5">Finalizar llamada</button>
                    </div>
                  ))}
                  <div className="bg-red-400 m-5">
                    <h1 className="text-center p-3 font-bold">Personas en cola: {cola.length}</h1>
                    {cola.map((persona, index) => (
                      <div key={index} className="bg-white p-2 m-2 rounded">
                        <Persona persona={persona} />
                        <p>Tiempo en cola: {colaTiempos[index]} segundos</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


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

//Intervalos para reinciar los tiempos
// useEffect(() => {
//   let intervalosCronometro = [];
//   if (simulacionActiva && tasaServicio > 0) {
//     const intervaloServicio = 60000 / tasaServicio;
//     intervalosCronometro = agentes.map((_, index) =>
//       setInterval(() => {
//         setTiemposLlamada(prev => {
//           const nuevosTiempos = [...prev];
//           if (nuevosTiempos[index] >= intervaloServicio / 1000) {
//             finalizarLlamada(index);
//           }
//           nuevosTiempos[index] += 1;
//           return nuevosTiempos;
//         });
//       }, 1000)
//     );
//   }
//   return () => intervalosCronometro.forEach(intervalo => clearInterval(intervalo));
// }, [simulacionActiva, tasaServicio, agentes,finalizarLlamada]);

