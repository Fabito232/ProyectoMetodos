import { useState } from 'react';
import PropTypes from 'prop-types';
import './Menu.css';

const Menu = ({agregarOpcionMenu}) => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    const toggleSound = document.getElementById('toggleSound');
    const openSound = document.getElementById('openSound');

    setMenuActive(!menuActive);
    toggleSound.currentTime = 0;
    toggleSound.play();
    if (!menuActive) {
      openSound.currentTime = 0;
      openSound.play();
    }
  };

  const playHoverSound = () => {
    const hoverSound = document.getElementById('hoverSound');
    hoverSound.currentTime = 0;
    hoverSound.play();
  };

  const handleClick = (item) => {
    agregarOpcionMenu(item)
  };

  return (
    <div>
      {/* MENÚ INICIAL */}
      <ul className={`menu ${menuActive ? 'active' : ''}`}>
        <div className="menuToggle" onClick={toggleMenu}>
          <ion-icon name="add-outline"></ion-icon>
        </div>
        <li style={{ '--i': 0, '--clr': '#ff2972' }}>
          <a href="#" onMouseEnter={playHoverSound} onClick={() => handleClick(1)}>
          <ion-icon name="stats-chart-outline"></ion-icon>
          </a>
        </li>
        <li style={{ '--i': 2, '--clr': '#04fc43' }}>
          <a href="#" onMouseEnter={playHoverSound} onClick={() => handleClick(2)}>
            <ion-icon name="play-outline"></ion-icon>
          </a>
        </li>
        <li style={{ '--i': 4, '--clr': '#fee800' }}>
          <a href="#" onMouseEnter={playHoverSound} onClick={() => handleClick(3)}>
            <ion-icon name="settings-outline"></ion-icon>
          </a>
        </li>
        <li style={{ '--i': 6, '--clr': '#fe00f1' }}>
          <a href="/docs/Informe_Gerencial_Regional_Airlines.pdf" onMouseEnter={playHoverSound} onClick={() => handleClick(4)}>
          <ion-icon name="newspaper-outline"></ion-icon>
          </a>
        </li>
      </ul>
      {/* AUDIO DEL MENÚ INICIAL */}
      <audio id="toggleSound">
        <source src="audio/close.mp3" type="audio/mpeg" />
        <source src="audio/close.ogg" type="audio/ogg" />
      </audio>

      <audio id="openSound">
        <source src="audio/open.mp3" type="audio/mpeg" />
        <source src="audio/open.ogg" type="audio/ogg" />
      </audio>

      <audio id="hoverSound">
        <source src="audio/beep.mp3" type="audio/mpeg" />
        <source src="audio/beep.ogg" type="audio/ogg" />
      </audio>
    </div>
  );
};

Menu.propTypes = {
  agregarOpcionMenu: PropTypes.func.isRequired,
};

export default Menu;