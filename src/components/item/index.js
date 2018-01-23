import { h, Component } from 'preact';

import interact from 'interactjs'

let scale = 1,
	originalScale = 1, 
	maxScale,
	minScale,
	selectedWidth = 0,
	selectedHeight = 0,
	tapTimeout

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
        top: restriction.top,
        bottom: restriction.top + restriction.height
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
				dragMoveListener(event)
				event.preventDefault()
			},
			oninertiastart: event => {
				if (scale === originalScale && event.swipe && (event.swipe.left || event.swipe.right) && Math.abs(event.swipe.velocity.x) > 3000) {
					let direction = event.swipe.left ? 'left': 'right'
					this.onSwipe(direction)
				}
			},
			onend: event => {
				console.log('here?')
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
		this.interact.on('tap', event => {
			if (event.shiftKey || event.altKey) {
				this.zoom(event)
			} else {
				if (event.double) { return; }
				tapTimeout = setTimeout(() => this.hide(), 500)
			}
			
		})
		// .on('doubletap', this.doubleTap)
		.on('down', function (event) {
			event.preventDefault();
		})
	}

	componentWillUpdate({image}) {
		if (image) {
			let maxWidth = document.documentElement.clientWidth;
			let maxHeight = document.documentElement.clientHeight;
			selectedWidth = image.width;
			selectedHeight = image.height;
			
			scale = originalScale = Math.min(maxWidth / selectedWidth, maxHeight / selectedHeight);
			maxScale = scale * 2 > 1 ? scale * 2 : 1
			minScale = scale * .5 < .5 ? scale : .5

			let imageObj = document.getElementById("image")
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

	zoom = (event) => {
		let currentX = parseFloat(event.target.getAttribute('data-x')) || 0
		let currentY = parseFloat(event.target.getAttribute('data-y')) || 0
		var coef = event.altKey ? 0.9 : 1.05
        var delm = document.documentElement
        var oz = scale
        var nz = scale * coef
        /// scroll offset
        var sx = delm.scrollLeft
        var sy = delm.scrollTop
        /// offset of container
        var ox = 0//50 + 21,
        var oy = 0//50 + 22,
        /// mouse cords
        var mx = event.clientX - ox + sx
        var my = event.clientY - oy + sy
        /// calculate click at current zoom
        var ix = (mx - currentX) / oz
        var iy = (my - currentY) / oz
        /// calculate click at new zoom
        var nx = ix * nz
        var ny = iy * nz
        /// move to the difference
        /// make sure we take mouse pointer offset into account!
        var cx = (ix + (mx - ix) - nx)
        var cy = (iy + (my - iy) - ny)

        event.target.style.webkitTransform =
		event.target.style.transform =
			'translate3d(' + cx + 'px, ' + cy + 'px, 0) scale(' + nz + ')'

		scale = nz
		event.target.setAttribute('data-x', cx)
		event.target.setAttribute('data-y', cy)
	}

	doubleTap = (event) => {
		console.log('doubletap')
		clearTimeout(tapTimeout)

		scale = originalScale
		let maxWidth = document.documentElement.clientWidth;
		let maxHeight = document.documentElement.clientHeight;
		let imageObj = document.getElementById("image")
		let x = maxWidth / 2 - selectedWidth / 2
		let y = maxHeight / 2 - selectedHeight / 2
		imageObj.style.webkitTransform =
		imageObj.style.transform =
		'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';

		imageObj.setAttribute('data-x', x);
		imageObj.setAttribute('data-y', y);
	}
	
	hide = () => {
		scale = originalScale = maxScale = minScale = 1,
		selectedWidth = selectedHeight = 0,
		tapTimeout = null
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

	render({image}) {
		return <img id="image" src={image.src} />;
	}
}