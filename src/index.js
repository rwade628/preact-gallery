import { Provider } from 'preact-redux';
import store from './redux/store';
import './style';
import App from './components/app';

export default () => (
	<div id="outer">
		<Provider store={store}>
			<App />
		</Provider>
	</div>
);
