import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Home from '../routes/home';
import Profile from '../routes/profile';
import AlbumGallery from '../routes/album-gallery'
// import MovieGallery from '../routes/movie-gallery'
// import OtherGallery from '../routes/other-gallery'
import PhotoGallery from '../routes/photo-gallery'
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<AlbumGallery path="/albums/images" />
					{
					//<MovieGallery path="/albums/movies" />
					//<OtherGallery path="/albums/other" />
					}
					<PhotoGallery path="/gallery/:location/:name" />
				</Router>
			</div>
		);
	}
}
