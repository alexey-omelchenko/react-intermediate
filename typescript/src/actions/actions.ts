import { holesLength } from 'reducers/reducers';

export const START_GAME = 'START_GAME';
export const END_GAME = 'END_GAME';
export const ALTER_HOLES = 'ALTER_HOLES';
export const INCREASE_SCORE = 'INCREASE_SCORE';

// action creator
const startGame = () => ({
  type: START_GAME
});

export const endGame = () => ({
  type: END_GAME
});

export const alterHoles = (holeState) => ({
  type: ALTER_HOLES,
  holeState
});

const increaseScore = () => ({
  type: INCREASE_SCORE
});

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const startGameAction = () => (dispatch, getState) => {
  dispatch(startGame());

  const newState = getState().game.holeState.slice(0);
  newState[getRandomInt(0, holesLength)] = true;
  dispatch(alterHoles(newState));
};

export const clickFrogAction = (frogId) => (dispatch, getState) => {
  const newState = getState().game.holeState.slice(0);

  newState[frogId] = false;
  dispatch(alterHoles(newState));

  setTimeout(() => {
    const newerState = newState.slice(0);
    newerState[getRandomInt(0, holesLength)] = true;
    dispatch(alterHoles(newerState));
  }, 700);

  dispatch(increaseScore());
};
