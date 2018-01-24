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
	}

	componentDidMount() {
		let imageObj = document.getElementById("preview")
		this.interact = interact(imageObj)
		this.interact.draggable(this.draggableOptions)
	}

	// componentWillUpdate({selected}) {
	// 	if (selected != void 0 && selected != this.props.selected && selected.type === 'image') {
	// 		this.setState({image: this.props.results[selected.index]})
	// 	}
	// }

	hide = () => {
		this.props.setSelected(null);
	}

	onSwipe = (direction) => {
		console.log('direction', direction)
		// let index = this.props.selected.index;
		// if (direction === 'right') {
		// 	if (index === 0) {
		// 		index = this.props.results.length - 1;
		// 	} else {
		// 		index = this.props.selected.index - 1;
		// 	}
		// } else if (direction === 'left') {
		// 	if (index === this.props.results.length - 1) {
		// 		index = 0;
		// 	} else {
		// 		index = this.props.selected.index + 1;
		// 	}
		// }
		// this.props.setSelected({
	 //      type: this.props.selected.type,
	 //      index: index
	 //    });
	    // this.setState({image: this.props.results[this.props.selected.index]})
	}
	render({selected}) {
		console.log(selected)
		const visible = selected.hasOwnProperty('src') ? 'visible' : ''
		return (
			<div id="preview" className={visible} ref={(el) => this.container = el}>
				{this.props.children}
			</div>
		)
	}
}