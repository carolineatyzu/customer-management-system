import { combineReducers } from 'redux';

import soldierList from './soldier-list';
import createSoldier from './create-soldier';
import editSoldier from './edit-soldier';
import delSoldier from './del-soldier';
import getAllSup from './get-all-sups';

const reducer = combineReducers({
  soldierList,
  createSoldier,
  editSoldier,
  delSoldier,
  getAllSup,
});

export default reducer;