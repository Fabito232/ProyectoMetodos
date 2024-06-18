
import PropTypes from 'prop-types';

function Persona({persona}) {
    const { nombre, imagen } = persona
    const URLImagen = `/img/${imagen}.png`;
  return (
    <div className={`border-4 border-black rounded-lg m-10 ${nombre ? 'bg-red-600' : 'bg-gray-500' } `}>
        <h1 className="text-center p-3">{nombre ? nombre : 'Nadie en Llamada'} </h1>
        {nombre && (
        <img className="sm:h-40 md:h-48 mx-auto m-3" src={URLImagen} alt="Imagen de persona" />
      )}
    </div>
  )
}

Persona.propTypes = { 
    persona: PropTypes.object.isRequired
}

export default Persona
