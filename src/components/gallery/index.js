import { h, Component } from 'preact';

import Photo from './Photo';
import { computeSizes } from './utils';

class Gallery extends Component {
	constructor() {
		super();
		this.state = {
			containerWidth: 0,
		};
		this.handleResize = this.handleResize.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
	}
	componentDidMount() {
		this.setState({ containerWidth: Math.floor(this._gallery.clientWidth) });
		window.addEventListener('resize', this.handleResize);
	}
	componentDidUpdate() {
		if (this._gallery.clientWidth !== this.state.containerWidth) {
			this.setState({ containerWidth: Math.floor(this._gallery.clientWidth) });
		}
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize, false);
	}
	handleResize(e) {
		this.setState({ containerWidth: Math.floor(this._gallery.clientWidth) });
	}
	handleClick(event, { index }) {
		const { photos, onClick } = this.props;
		onClick(event, {
			index,
			photo: photos[index],
			previous: photos[index - 1] || null,
			next: photos[index + 1] || null,
		});
	}

	handleLoad(event, { index }) {
		const { photos, onLoad } = this.props;
		onLoad(event, {
			index
		});
	}

	render() {
		const { ImageComponent = Photo } = this.props;
	    // subtract 1 pixel because the browser may round up a pixel
	    const width = this.state.containerWidth - 1;
	    const { photos, columns, margin, onClick, onLoad } = this.props;
	    const thumbs = computeSizes({ width, columns, margin, photos });
	    return (
	    	<div className="react-photo-gallery--gallery">
	    	<div ref={c => (this._gallery = c)}>
	    	{thumbs.map((photo, index) => {
	    		const { width, height } = photo;
	    		let descriptionStyle = {
	    			left: this.props.margin + 'px',
	    			width: photo.width + 'px'
	    		};
	    		if (this.props.showDescription) {
	    			return (
	    			<ImageComponent
	    			key={photo.key || photo.src}
	    			margin={margin}
	    			index={index}
	    			photo={photo}
	    			onClick={onClick ? this.handleClick : null}
	    			onLoad={onLoad ? this.handleLoad : null}>
    					<div class='description' style={descriptionStyle}>
							<p class='description_content'>{photo.name}</p>
						</div>
	    			</ImageComponent>
	    			);
	    		} else {
	    			return (
	    			<ImageComponent
	    			key={photo.key || photo.src}
	    			margin={margin}
	    			index={index}
	    			photo={photo}
	    			onClick={onClick ? this.handleClick : null}
	    			onLoad={onLoad ? this.handleLoad : null}
	    			/>
	    			);
	    		}
	    		
	    	})}
	    	</div>
	    	<div style={{ content: '', display: 'table', clear: 'both' }} />
	    	</div>
	    	);
	}
}

Gallery.defaultProps = {
	columns: 3,
	margin: 2,
	showDescription: false,
};

export default Gallery;