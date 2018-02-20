import { h, Component } from 'preact';

const imgWithClick = { cursor: 'pointer' };

class Photo extends Component {
	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
	}

	handleClick(event) {
		const { onClick, index, photo } = this.props;
		onClick(event, { photo, index });
	}

	handleLoad(event) {
		const { onLoad, index, photo } = this.props;
		onLoad(event, { photo, index })
	}

	render() {
		const { photo, onClick, margin, onLoad } = this.props;
		const imgStyle = { display: 'block', float: 'left', margin: margin };
		return (
			<div class="wrapper">
				<img
				style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
				{...photo}
				src={photo.thumbnail ? photo.thumbnail : photo.src}
				onClick={onClick ? this.handleClick : null}
				onLoad={onLoad ? this.handleLoad : null}
				/>
				{this.props.children}
			</div>
			);
	}
}

export default Photo;