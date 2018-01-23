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
		this.props.getAlbums();
	}

	onClick(event, obj) {
		route(`/gallery/${this.props.albums[obj.index].name}`);
	}

	render({albums}) {
		return (
			<div>
				<Gallery photos={albums} onClick={this.onClick} showDescription={true}/>
			</div>
		)
	}
}