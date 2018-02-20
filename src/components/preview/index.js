import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import reduce from '../../redux/reducers';
import * as actions from '../../redux/actions';

import interact from 'interactjs'

@connect(reduce, actions)
export default class Preview extends Component {
	constructor() {
		super()
		this.draggableOptions = {
			max: 1,
			inertia: false,
			onend: event => {
				if (event.target.localName != 'video' && event.target.localName != 'img' && Math.abs(event.velocityX) > 20) {
					let direction = event.velocityX < 0 ? 'left' : 'right'
					this.onSwipe(direction)
				}
			}
		}
		this.tapTimeout
	}

	componentDidMount() {
		let imageObj = document.getElementById("preview")
		this.interact = interact(imageObj)
		this.interact.draggable(this.draggableOptions)
		this.interact.on('tap', event => {
			if (event.double || event.target.localName === 'video') { 
				clearTimeout(this.tapTimeout)
				return; 
			}
			this.tapTimeout = setTimeout(() => this.hide(), 500)
		})
	}

	hide = () => {
		this.props.setSelected({})
	}

	onSwipe = (direction) => {
		if (this.props.onSwipe) {
			this.props.onSwipe(direction);
		}
	}

	render({selected}) {
		const visible = selected.hasOwnProperty('image') || selected.hasOwnProperty('video') ? 'visible' : ''
		return (
			<div id="preview" className={visible} ref={(el) => this.container = el}>
				{this.props.children}
			</div>
		)
	}
}