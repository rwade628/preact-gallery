import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import reduce from '../../redux/reducers';
import * as actions from '../../redux/actions';

import Gallery from '../../components/gallery'
import Lightbox from 'react-image-lightbox';

@connect(reduce, actions)
export default class PhotoGallery extends Component {
	constructor() {
		super();
		this.onClick = this.onClick.bind(this);
	    this.closeLightbox = this.closeLightbox.bind(this);
	    this.moveNext = this.moveNext.bind(this);
	    this.movePrev = this.movePrev.bind(this);
	}

	componentDidMount() {
		this.props.getGallery(this.props.location, this.props.name)
	}

	onClick = (event, obj) => {
		this.setState({ isOpen: true, index: obj.index });
	}

	hide = () => {
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

	openLightbox() {
		this.setState({ isOpen: true });
	}

	closeLightbox() {
		this.setState({ isOpen: false });
	}

	moveNext() {
		this.setState({ index: (this.state.index + 1) % this.props.gallery.length });
	}

	movePrev() {
		this.setState({
			index: (this.state.index + this.props.gallery.length - 1) % this.props.gallery.length,
		});
	}

	render({gallery}) {
		let image = this.props.selected ? this.props.selected.image : {}
		let lightbox;
	    if (this.state.isOpen) {
			lightbox = (
				<Lightbox
					mainSrc={this.props.gallery[this.state.index].src}
					nextSrc={this.props.gallery[(this.state.index + 1) % this.props.gallery.length].src}
					prevSrc={
						this.props.gallery[(this.state.index + this.props.gallery.length - 1) % this.props.gallery.length].src
					}
					onCloseRequest={this.closeLightbox}
					onMovePrevRequest={this.movePrev}
					onMoveNextRequest={this.moveNext}
				/>
			);
	    }
		return (
			<div>
				<Gallery photos={gallery} onClick={this.onClick} />
				{lightbox}
			</div>
		)
	}
}