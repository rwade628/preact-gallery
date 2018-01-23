import { h, Component } from 'preact';

export default class Preview extends Component {
	render({gallery}) {
		return (
			<div class="container">
				{this.props.children}
			</div>
		)
	}
}