/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/App.jsx",
    "./src/Persona.jsx",
    "./src/components/ModalDatosEntrada.jsx",
    "./src/components/SimulacionFinalizada.jsx",
  ],
  theme: {
    extend: {
      backgroundImage: {"fondoInicial": "url('./assets/atencion1.jpeg')"}
    },
  },
  plugins: [],
}

