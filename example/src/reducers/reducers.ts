import { combineReducers } from 'redux';
import { START_GAME, ALTER_HOLES } from 'actions/actions';

export const holesLength = 4;

const initialGameState = {
  holeState: Array(holesLength).fill(false),
  isGameActive: false,
};

const game = (state = initialGameState, action) => {
  switch (action.type) {
    case START_GAME:
      return { ...state, isGameActive: true };
    case ALTER_HOLES:
      return { ...state, holeState: action.holeState };
    default:
      return state;
  }
};

export default combineReducers({
  game,
});
