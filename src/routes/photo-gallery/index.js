import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import reduce from '../../redux/reducers';
import * as actions from '../../redux/actions';

import Gallery from '../../components/Gallery'
import Preview from '../../components/Preview'
import Item from '../../components/Item'

@connect(reduce, actions)
export default class PhotoGallery extends Component {
	constructor() {
		super();
		this.onClick = this.onClick.bind(this);
	}

	componentDidMount() {
		this.props.getGallery(this.props.name)
	}

	onClick = (event, obj) => {
		console.log('clicked')
		this.props.setSelected(this.props.gallery[obj.index])
	}

	hide = () => {
		console.log('hiding')
	}

	onSwipe = (direction) => {
		console.log('swiped', direction)
	}

	render({gallery}) {
		return (
			<div>
				<Gallery photos={gallery} onClick={this.onClick} />
				<Preview>
					<Item image={this.props.selected} hide={this.hide} onSwipe={this.onSwipe}/>
				</Preview>
			</div>
		)
	}
}