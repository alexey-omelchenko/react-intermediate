import React, { useState } from 'react';
import { connect } from 'react-redux';
import { startGameAction as startGame, endGame } from 'actions/actions';
import { RootState } from 'reducers/reducers';

import './controls.scss';

type DispatchProps = {
  startGame: () => void;
  endGame: () => void;
};

type StateProps = {
  isGameActive: boolean;
  isGameFinished: boolean;
};
type Props = StateProps & DispatchProps;

type State = {
  gameTimer: any;
};

const Controls: React.FC<Props> = (props) => {
  const [state, setState] = useState<any>({
    getTimer: null
  });

  const clickStartGame = () => {
    props.startGame();

    setState({
      gameTimer: setTimeout(() => {
        props.endGame();
      }, 20000)
    });
  };
  const gameStartClass = props.isGameActive ? 'hidden' : '';
  const gameInProgressClass = props.isGameActive ? 'invisible' : '';
  const gameOverClass = props.isGameFinished ? '' : 'hidden';

  return (
    <div className="controls-container">
      <div className={gameStartClass}>
        <h2>Click a frog</h2>
      </div>

      <div className={gameOverClass}>
        <h2>GAME OVER</h2>
      </div>

      <div className={gameInProgressClass}>
        <button type="button" className="btn btn-primary" onClick={() => clickStartGame()}>
          Start
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isGameActive: state.game.isGameActive,
  isGameFinished: state.game.isGameFinished
});

const mapDispatchToProps = {
  startGame,
  endGame
};

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
