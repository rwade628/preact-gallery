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
	}),
	CHANGE_PAGE: ({visibleItems, currentPage, ...state}, {newVisibleItems, newCurrentPage}) => ({
		visibleItems: newVisibleItems,
		currentPage: newCurrentPage,
		...state
	}),
	LAST_PAGE: ({lastPage, ...state}, {currentPage}) => ({
		lastPage: currentPage,
		...state
	})
};

const INITIAL = {
	gallery: [],
	albums: [],
	selected: {},
	visibleItems: [],
	currentPage: 1,
	lastPage: 1,
	pageSize: 9,
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