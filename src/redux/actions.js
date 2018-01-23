export function getGallery(selectedGallery) {
	return {
		type: 'GET_GALLERY',
		selectedGallery
	};
}

export function getAlbums() {
	return {
		type: 'GET_ALBUMS'
	};
}

export function setSelected(selected) {
	return {
		type: 'SET_SELECTED',
		selected
	};
}