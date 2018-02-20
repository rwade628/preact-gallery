export function getGallery(selectedLocation, selectedGallery) {
	return (dispatch, getState) => {
	    return new Promise((resolve, reject) => {
			var url = `/api/gallery/${selectedLocation}/${selectedGallery}`
			fetch(url).then((response) => {
				return response.json()
			}).then((json) => {
				dispatch({
					type: 'GET_GALLERY',
					selectedGallery: json
				})
			resolve()
			}).catch((ex) => {
				console.log('parsing failed test', ex)
				reject()
			})
	    })
	}
}


export function getAlbums(album) {
	return (dispatch, getState) => {
	    return new Promise((resolve, reject) => {
			const url = `/api/list/${album}`
			fetch(url).then((response) => {
				return response.json()
			}).then((json) => {
				dispatch({
				  type    : 'GET_ALBUMS',
				  albumList : json
				})
			resolve()
			}).catch((ex) => {
				console.log('parsing failed test', ex)
				reject()
			})
	    })
	}
}

export function setSelected(selectedItem) {
	return {
		type: 'SET_SELECTED',
		selectedItem
	};
}

export function setMenuState(menuState) {
	return {
		type: 'SET_MENU',
		menuState
	}
}

export function onChangePage(newVisibleItems, newCurrentPage) {
	console.log('newCurrentPage', newCurrentPage)
	return {
		type: 'CHANGE_PAGE',
		newVisibleItems,
		newCurrentPage
	}
}