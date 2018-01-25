import { h, Component } from 'preact';

import interact from 'interactjs'

let scale = 1,
	originalScale = 1, 
	maxScale,
	minScale,
	selectedWidth = 0,
	selectedHeight = 0

const dragMoveListener = event => {
	var target = event.target,
	// keep the dragged position in the data-x/data-y attributes
	x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
	y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
	// translate the element
	target.style.webkitTransform =
	target.style.transform =
	'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')'

	// update the posiion attributes
	target.setAttribute('data-x', x)
	target.setAttribute('data-y', y)
}

const restrictListener = (x, y, element) => {
    // important to use getBoundingClientRect as the element might be scaled
    var rect = document.getElementById("image").getBoundingClientRect()
    var dw = rect.width,
        dh = rect.height,
        vw = document.documentElement.clientWidth,
        vh = document.documentElement.clientHeight

    var restriction = {
        top: vh-dh < 0 ? vh-dh : 0,
        left: vw-dw < 0 ? vw-dw : 0,
        width: dw > vw ? Math.max(2*dw-vw, vw) : vw,
        height: dh > vh ? Math.max(2*dh-vh, vh) : vh
    }
    return {
        left: restriction.left,
        right: restriction.left + restriction.width,
        top: restriction.top + window.scrollY,
        bottom: restriction.top + restriction.height + window.scrollY
    }
}

const gestureListener = event => {
	const target = event.target
	let newScale = scale * (1 + event.ds)
	if (newScale > minScale && newScale < maxScale) {
		let currentX = parseFloat(target.getAttribute('data-x')) || 0
		let currentY = parseFloat(target.getAttribute('data-y')) || 0
		let middleX = (event.touches[0].clientX + event.touches[1].clientX)/2
		let middleY = (event.touches[0].clientY + event.touches[1].clientY)/2
        var delm = document.documentElement
        /// scroll offset
        var scrollX = delm.scrollLeft
        var scrollY = delm.scrollTop
        /// mouse cords
        var pointerX = middleX + scrollX
        var pointerY = middleY + scrollY
        /// calculate click at current zoom
        var imageX = (pointerX - currentX) / scale
        var imageY = (pointerY - currentY) / scale
        /// calculate click at new zoom
        let newX = imageX * newScale
        let newY = imageY * newScale
        /// move to the difference
        /// make sure we take mouse pointer offset into account!
        var cx = (imageX + (pointerX - imageX) - newX)
        var cy = (imageY + (pointerY - imageY) - newY)

        target.style.webkitTransform =
		target.style.transform =
			'translate3d(' + cx + 'px, ' + cy + 'px, 0) scale(' + newScale + ')'

		scale = newScale
		event.target.setAttribute('data-x', cx)
		event.target.setAttribute('data-y', cy)
	}
}


export default class Item extends Component {

	constructor() {
		super()
		this.draggableOptions = {
			max: 1,
			inertia: true,
			restrict: {
			    restriction: restrictListener,
			    endOnly: true,
			    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
			},
			onmove: event => {
				if (scale != originalScale) {
					dragMoveListener(event)	
				}
				event.preventDefault()
			},
			oninertiastart: event => {
				if (scale === originalScale && Math.abs(event.velocityX) > 20) {
					let direction = event.velocityX < 0 ? 'left' : 'right'
					this.onSwipe(direction)
				}
			}
		}
		this.gesturableOptions = {
			restrict: {
			    restriction: restrictListener,
			    endOnly: true,
			    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
			},
			onmove: event => {
				gestureListener(event)
				event.preventDefault()
			}
		}
	}

	componentDidMount() {
		let imageObj = document.getElementById("image")
		let parent = imageObj.parentElement
		this.interact = interact(imageObj)
		this.interact.draggable(this.draggableOptions)
		this.interact.gesturable(this.gesturableOptions)
		this.interact.on('doubletap', this.doubleTap)
		interact(parent).on('down', event => {
			event.preventDefault();
		})
	}

	componentWillUpdate({image}) {
		if (image) {
			let imageObj = document.getElementById("image")
			if (this.interact) {
				this.interact.unset()
				this.interact = interact(imageObj)
				this.interact.draggable(this.draggableOptions)
				this.interact.gesturable(this.gesturableOptions)
				this.interact.on('doubletap', this.doubleTap)
			}
			let maxWidth = document.documentElement.clientWidth;
			let maxHeight = document.documentElement.clientHeight;
			selectedWidth = image.width;
			selectedHeight = image.height;
			scale = originalScale = Math.min(maxWidth / selectedWidth, maxHeight / selectedHeight);
			maxScale = 3
			minScale = scale * .5 < .5 ? scale : .5

			imageObj.style.webkitTransformOrigin =
			imageObj.style.transformOrigin =
				'top left'
			let x = maxWidth / 2 - (selectedWidth * scale) / 2
			let y = maxHeight / 2 - (selectedHeight * scale) / 2
			imageObj.style.webkitTransform =
			imageObj.style.transform =
			'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';

			imageObj.setAttribute('data-x', x);
			imageObj.setAttribute('data-y', y);
		}
	}

	componentWillUnmount() {
	}

	doubleTap = (event) => {
		scale = originalScale
		let maxWidth = document.documentElement.clientWidth;
		let maxHeight = document.documentElement.clientHeight;
		let imageObj = document.getElementById("image")
		let x = maxWidth / 2 - (selectedWidth * scale) / 2
		let y = maxHeight / 2 - (selectedHeight * scale) / 2
		imageObj.style.webkitTransform =
		imageObj.style.transform =
		'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';

		imageObj.setAttribute('data-x', x);
		imageObj.setAttribute('data-y', y);
	}
	
	hide = () => {
		scale = originalScale = maxScale = minScale = 1,
		selectedWidth = selectedHeight = 0;
		if (this.props.hide) {
			this.props.hide();
		}
	}

	onSwipe = (direction) => {
		//call parent swipe if given
		if (this.props.onSwipe) {
			this.props.onSwipe(direction);
		}
	}

	render() {
		if (this.props.image === void 0) {
			this.props.image = {
				src: ''
			}
		}
		return <img id="image" src={this.props.image.src} />;
	}
}