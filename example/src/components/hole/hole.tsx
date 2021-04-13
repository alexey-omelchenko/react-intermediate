/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';

import holeMask from 'assets/img/hole-mask.svg';
import { clickFrogAction } from 'actions/actions';
import { useDispatch } from 'react-redux';

import './hole.scss';

interface Props {
  id: number;
  active: boolean;
}
const Hole: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const frogClick = () => {
    dispatch(clickFrogAction(props.id));
  };

  return (
    <div className="hole-container">
      <div className="hole">
        <div className={props.active ? 'frog up' : 'frog'} onClick={frogClick} />
        <img src={holeMask} alt="hole-mask" className="hole-mask" />
      </div>
    </div>
  );
};

export default Hole;
