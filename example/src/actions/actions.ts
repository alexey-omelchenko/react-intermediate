import { holesLength } from 'reducers/reducers';

export const START_GAME = 'START_GAME';
export const ALTER_HOLES = 'ALTER_HOLES';

const startGame = () => ({
  type: START_GAME,
});

const alterHoles = (holeState) => ({
  type: ALTER_HOLES,
  holeState,
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
};
