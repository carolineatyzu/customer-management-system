import { EDIT_SOLDIER_START,EDIT_SOLDIER_FAIL,EDIT_SOLDIER_SUCCESS } from './types';

const initState = {
  state: 0,
  error: null
};

const editSoldier = (state = initState, action) => {
  switch(action.type) {
    case EDIT_SOLDIER_START:
      return {
        ...state,
        state: 0,
        error: null
      };
    case EDIT_SOLDIER_FAIL:
      return {
        ...state,
        state: 2,
        error: action.error
      };
    case EDIT_SOLDIER_SUCCESS:
      return {
        ...state,
        state: 1,
        error: null
      };
    default:
      return state;
  }
};

export default editSoldier;