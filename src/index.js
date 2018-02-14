import { Provider } from 'preact-redux';
import store from './redux/store';
import style from './style/index.scss'
import App from './components/app';

export default () => (
	<div id="outer">
		<Provider store={store}>
			<App />
		</Provider>
	</div>
);
