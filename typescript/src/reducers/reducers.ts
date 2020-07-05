import { combineReducers } from 'redux';
import {
  START_GAME, ALTER_HOLES, END_GAME, INCREASE_SCORE
} from 'actions/actions';

export type RootState = {
  game: {
    isGameActive: boolean;
    isGameFinished: boolean;
    holeState: boolean[];
    score: number;
  };
};

export const holesLength = 5;

export const initialGameState = {
  isGameActive: false,
  isGameFinished: false,
  holeState: Array(holesLength).fill(false),
  score: 0
};

const game = (state = initialGameState, action) => {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        isGameActive: true,
        score: 0,
        isGameFinished: false
      };
    case END_GAME:
      return {
        ...state,
        isGameActive: false,
        isGameFinished: true,
        holeState: initialGameState.holeState
      };
    case ALTER_HOLES:
      return { ...state, holeState: action.holeState };
    case INCREASE_SCORE:
      return { ...state, score: state.score + 1 };
    default:
      return state;
  }
};

export default combineReducers({
  game
});
