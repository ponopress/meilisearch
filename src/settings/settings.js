import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { SettingsPage } from './components';

domReady( () => {
	const root = createRoot(
		document.getElementById( 'meilisearch-settings' )
	);

	root.render( <SettingsPage /> );
} );