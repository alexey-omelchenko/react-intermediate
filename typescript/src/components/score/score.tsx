import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'reducers/reducers';

import './score.scss';

type Props = {
  score: number;
};

const Score: React.FC<Props> = (props) => (
  <div className="score-container">
    Score:
    {props.score}
  </div>
);

const mapStateToProps = (state: RootState) => ({
  score: state.game.score
});

export default connect(mapStateToProps)(Score);
