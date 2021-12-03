import { CREATE_SOLDIER_START,CREATE_SOLDIER_FAIL,CREATE_SOLDIER_SUCCESS } from './types';

const initState = {
  state: 0,
  error: null
};

const createSoldier = (state = initState, action) => {
  switch(action.type) {
    case CREATE_SOLDIER_START:
      return {
        ...state,
        state: 0,
        error: null
      };
    case CREATE_SOLDIER_FAIL:
      return {
        ...state,
        state: 2,
        error: action.error
      };
    case CREATE_SOLDIER_SUCCESS:
      return {
        ...state,
        state: 1,
        error: null
      };
    default:
      return state;
  }
};

export default createSoldier;