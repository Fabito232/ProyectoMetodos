/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/App.jsx",
    "./src/Persona.jsx",
    "./src/components/ModalDatosEntrada.jsx"

  ],
  theme: {
    extend: {
      backgroundImage: {"fondoInicial": "url('./assets/colaInicio.png')"}
    },
  },
  plugins: [],
}

