import React, { useState } from 'react';

import holeMask from 'assets/img/hole-mask.svg';
import './hole.scss';

interface Props {
  id: number;
}
const Hole: React.FC<Props> = () => {
  const [frogActive, setFrogActive] = useState(false);

  const toggleFrog = () => {
    setFrogActive(!frogActive);
  };

  return (
    <div className="hole-container">
      <button type="button" onClick={toggleFrog}>
        ACTIVATE
      </button>
      <div className="hole">
        <div className={frogActive ? 'frog up' : 'frog'} />
        <img src={holeMask} alt="hole-mask" className="hole-mask" />
      </div>
    </div>
  );
};

export default Hole;
