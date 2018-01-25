import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import reduce from '../../redux/reducers';
import * as actions from '../../redux/actions';

import Gallery from '../../components/gallery'
import Preview from '../../components/preview'
import Item from '../../components/item'

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
		console.log('clicked', this.props.gallery[obj.index])
		this.props.setSelected({
			image: this.props.gallery[obj.index],
			index: obj.index
		})
	}

	hide = () => {
		console.log('hiding')
		this.props.setSelected({});
	}

	onSwipe = (direction) => {
		let index = this.props.selected.index;
		if (direction === 'right') {
			if (index === 0) {
				index = this.props.gallery.length - 1;
			} else {
				index = this.props.selected.index - 1;
			}
		} else if (direction === 'left') {
			if (index === this.props.gallery.length - 1) {
				index = 0;
			} else {
				index = this.props.selected.index + 1;
			}
		}
		this.props.setSelected({
			image: this.props.gallery[index],
			index
		});
	}

	render({gallery}) {
		let image = this.props.selected ? this.props.selected.image : {}
		return (
			<div>
				<Gallery photos={gallery} onClick={this.onClick} />
				<Preview onSwipe={this.onSwipe}>
					<Item image={image} hide={this.hide} onSwipe={this.onSwipe}/>
				</Preview>
			</div>
		)
	}
}