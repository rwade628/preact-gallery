import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import reduce from '../../redux/reducers';
import * as actions from '../../redux/actions';

import Gallery from '../../components/gallery'

@connect(reduce, actions)
export default class AlbumGallery extends Component {
	constructor() {
		super();
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		this.props.getAlbums(this.props.location);
		this.props.setMenuState('gallery')
	}

	onClick(event, obj) {
		this.props.setLastPage(this.props.currentPage)
		route(`/gallery/images/${this.props.albums[obj.index].name}`);
	}

	render({albums}) {
		return (
			<div>
				<Gallery photos={albums} onClick={this.onClick} showDescription={true} initialPage={this.props.lastPage}/>
			</div>
		)
	}
}