import { DEL_SOLDIER_START,DEL_SOLDIER_FAIL,DEL_SOLDIER_SUCCESS } from './types';

const initState = {
  state: 0,
  error: null
};

const delSoldier = (state = initState, action) => {
  switch(action.type) {
    case DEL_SOLDIER_START:
      return {
        ...state,
        state: 0,
        error: null
      };
    case DEL_SOLDIER_FAIL:
      return {
        ...state,
        state: 2,
        error: action.error
      };
    case DEL_SOLDIER_SUCCESS:
      return {
        ...state,
        state: 1,
        error: null
      };
    default:
      return state;
  }
};

export default delSoldier;