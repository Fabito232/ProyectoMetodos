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
      backgroundImage: {"fondoInicial": "url('./assets/Colas_y_Lineas_de_Espera_2.jpeg')"}
    },
  },
  plugins: [],
}

