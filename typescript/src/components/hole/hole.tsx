import React from 'react';
import { connect } from 'react-redux';
import { clickFrogAction } from 'actions/actions';

// eslint-disable-next-line
import holeMask from '../../assets/img/hole-mask.svg';
import './hole.scss';

type DispatchProps = {
  clickFrogAction: (id: number) => void;
};

type Props = {
  active: boolean;
  id: number;
} & DispatchProps;

const Hole: React.FC<Props> = (props) => {
  let frogClass = 'frog';

  if (props.active) {
    frogClass = 'frog up';
  }

  return (
    <div className="hole-container">
      <div className="hole">
        <div className={frogClass} onClick={() => props.clickFrogAction(props.id)} />
        <img src={holeMask} alt="hole-mask" className="hole-mask" />
      </div>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  clickFrogAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Hole);
