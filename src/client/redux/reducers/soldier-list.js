import { FETCH_LIST_START,FETCH_LIST_FAIL,FETCH_LIST_SUCCESS_REPLACE,FETCH_LIST_SUCCESS_APPEND,UPDATE_LIST_QUERY,CLEAN_LIST_LIST } from './types';

const initState = {
  state: 0,
  error: null,
  query: {
    q: "",
    field: "",
    asc: 0,
    pageNum: 1,
    pageSize: 10,
    supid: "",
    sub: "",
  },
  list: {
    docs: [],
  }
};

const solderList = (state = initState, action) => {
  switch(action.type) {
    case FETCH_LIST_START:
      return {
        ...state,
        state: 0,
        error: null
      };
    case FETCH_LIST_FAIL:
      return {
        ...state,
        state: 2,
        error: action.error
      };
    case FETCH_LIST_SUCCESS_APPEND:
      return {
        ...state,
        state: 1,
        error: null,
        list: {
          ...action.list,
          docs: [
            ...state.list.docs,
            ...action.list.docs,
          ]
        }
      };
      case FETCH_LIST_SUCCESS_REPLACE:
      return {
        ...state,
        state: 1,
        error: null,
        list: action.list
      };
    case UPDATE_LIST_QUERY:
      return {
        ...state,
        query: {
          ...state.query,
          ...action.query,
        }
      };
    case CLEAN_LIST_LIST:
      return {
        ...state,
        list: {
          docs: []
        },
      };
    default:
      return state;
  };
};

export default solderList;