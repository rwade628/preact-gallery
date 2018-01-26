import { h, Component } from 'preact';
import { route } from 'preact-router';
import { connect } from 'preact-redux';
import reduce from '../../redux/reducers';
import * as actions from '../../redux/actions';
import Toolbar from 'preact-material-components/Toolbar';
import Drawer from 'preact-material-components/Drawer';
import List from 'preact-material-components/List';
import Dialog from 'preact-material-components/Dialog';
import Switch from 'preact-material-components/Switch';
import Button from 'preact-material-components/Button';
import Menu from 'preact-material-components/Menu'
import 'preact-material-components/Switch/style.css';
import 'preact-material-components/Dialog/style.css';
import 'preact-material-components/Drawer/style.css';
import 'preact-material-components/List/style.css';
import 'preact-material-components/Toolbar/style.css';
import 'preact-material-components/Menu/style.css';
import 'preact-material-components/Button/style.css';

class GalleryMenu extends Component {
	render() {
		return (
			<Menu.Anchor>
				<Toolbar.Icon sort onClick={e => {
					this.menu.MDComponent.open = true;
				}}
				>
					sort
				</Toolbar.Icon>
				<Menu
					ref={menu => {
					  this.menu = menu;
					}}
					>
					<Menu.Item>Hello1</Menu.Item>
					<Menu.Item>Hello2</Menu.Item>
					<Menu.Item>Hello3</Menu.Item>
				</Menu>
	        </Menu.Anchor>
        )
	}
}

@connect(reduce, actions)
export default class Header extends Component {

	componentDidMount() {
		document.body.classList.add('mdc-theme--dark');
		document.getElementById('outer').classList.add('mdc-theme--dark');
	}

	closeDrawer() {
		this.drawer.MDComponent.open = false;
	}

	openDrawer = () => (this.drawer.MDComponent.open = true);

	openSettings = () => this.dialog.MDComponent.show();

	drawerRef = drawer => (this.drawer = drawer);
	dialogRef = dialog => (this.dialog = dialog);

	linkTo = path => () => {
		route(path);
		this.closeDrawer();
	};

	goHome = this.linkTo('/');
	goToMyProfile = this.linkTo('/profile');
	goToGallery = this.linkTo('/albums')

	getMenuOption = () => {
		console.log(this.props.menu)
		switch(this.props.menu) {
		    case 'root':
		        return <Toolbar.Icon onClick={this.openSettings}>settings</Toolbar.Icon>
		        break;
		    case 'gallery':
		        return <GalleryMenu />
		        break;
		    default:
				return <Toolbar.Icon onClick={this.openSettings}>settings</Toolbar.Icon>
		}
	}

	render() {
		return (
			<div>
				<Toolbar className="toolbar">
					<Toolbar.Row>
						<Toolbar.Section align-start>
							<Toolbar.Icon menu onClick={this.openDrawer}>
								menu
							</Toolbar.Icon>
							<Toolbar.Title>Preact app</Toolbar.Title>
						</Toolbar.Section>
						<Toolbar.Section align-end>
							{this.getMenuOption()}
						</Toolbar.Section>
					</Toolbar.Row>
				</Toolbar>
				<Drawer.TemporaryDrawer ref={this.drawerRef}>
					<Drawer.TemporaryDrawerContent>
						<List>
							<List.LinkItem onClick={this.goHome}>
								<List.ItemIcon>home</List.ItemIcon>
								Home
							</List.LinkItem>
							<List.LinkItem onClick={this.goToMyProfile}>
								<List.ItemIcon>account_circle</List.ItemIcon>
								Profile
							</List.LinkItem>
							<List.LinkItem onClick={this.goToGallery}>
								<List.ItemIcon>camera</List.ItemIcon>
								Albums
							</List.LinkItem>
						</List>
					</Drawer.TemporaryDrawerContent>
				</Drawer.TemporaryDrawer>
				<Dialog ref={this.dialogRef}>
					<Dialog.Header>Settings</Dialog.Header>
					<Dialog.Body>
						<div>
							Enable dark theme <Switch onClick={this.toggleDarkTheme} />
						</div>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.FooterButton accept>okay</Dialog.FooterButton>
					</Dialog.Footer>
				</Dialog>
			</div>
		);
	}
}
