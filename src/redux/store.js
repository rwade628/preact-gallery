import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';

let ACTIONS = {
	GET_GALLERY: ({ gallery, ...state }, {selectedGallery}) => {
		return {
			gallery: selectedGallery,
			...state
		}
	},
	GET_ALBUMS: ({ albums, ...state }, {albumList}) => ({
		albums: albumList,
		...state
	}),
	SET_SELECTED: ({ selected, ...state }, {selectedItem}) => ({
		selected: selectedItem,
		...state
	}),
	SET_MENU: ({menu, ...state}, {menuState}) => ({
		menu: menuState,
		...state
	})
};

const INITIAL = {
	gallery: [],
	albums: [],
	selected: {},
	menu: 'root'
};

export default createStore( (state, action) => (
	action && ACTIONS[action.type] ? ACTIONS[action.type](state, action) : state
), 
INITIAL, 
applyMiddleware(
	//createLogger(),
	thunkMiddleware
));