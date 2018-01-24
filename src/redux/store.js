import { createStore } from 'redux';

let ACTIONS = {
	GET_GALLERY: ({ gallery, ...state }, {selectedGallery}) => {
		let obj = [
			{src: '/assets/photos/1.jpeg', width:4, height:3},
	    	{src: '/assets/photos/2.jpeg', width:1, height:1},
    	]
		if (selectedGallery == 'Album 1') {
			obj = photos
		}
		return {
			gallery: obj,
			...state
		}
	},
	GET_ALBUMS: ({ albums, ...state }) => ({
		albums: albumList,
		...state
	}),
	SET_SELECTED: ({ selected, ...state }, {selectedItem}) => ({
		selected: selectedItem,
		...state
	})
};

const albumList = [
	{src: 'assets/photos/1.jpeg', width:4, height:3, name: 'Album 1'},
	{src: 'assets/photos/2.jpeg', width:1, height:1, name: 'Album 2'},
];

const photos = [
    {src: '/assets/photos/1.jpeg', width:800, height:600},
    {src: '/assets/photos/2.jpeg', width:800, height:800},
    {src: '/assets/photos/3.jpeg', width:600, height:800},
    {src: '/assets/photos/4.jpeg', width:600, height:800},
    {src: '/assets/photos/5.jpeg', width:600, height:800},
    {src: '/assets/photos/6.jpeg', width:800, height:600},
    {src: '/assets/photos/7.jpeg', width:600, height:800},
    {src: '/assets/photos/8.jpeg', width:800, height:600},
    {src: '/assets/photos/9.jpeg', width:800, height:600}
];

const INITIAL = {
	gallery: [],
	albums: [],
	selected: {}
};

export default createStore( (state, action) => (
	action && ACTIONS[action.type] ? ACTIONS[action.type](state, action) : state
), INITIAL, typeof devToolsExtension==='function' ? devToolsExtension(): undefined);