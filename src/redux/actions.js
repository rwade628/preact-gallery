export function getGallery(selectedLocation, selectedGallery) {
	return (dispatch, getState) => {
	    return new Promise((resolve, reject) => {
			var url = `/api/gallery/${selectedLocation}/${selectedGallery}`
			console.log('url', url)
			fetch(url).then((response) => {
				return response.json()
			}).then((json) => {
				console.log('dispatching', json)
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
				console.log('dispatching', json)
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