/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */
import { render, Suspense } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import YutoAutocomplete from './YutoAutocomplete'
import domReady from '@wordpress/dom-ready'

domReady( function() {
	const elements = document.querySelectorAll(
		'.wp-block-yuto-meilisearch'
	);
	if (elements) {
		elements.forEach(element => {
			const autocompleteData = { ...element.dataset }
			let data = JSON.parse(autocompleteData.autocompleteAttributes)
			render(
				<Suspense fallback={<Spinner />}>
					<YutoAutocomplete attributes={data}/>
				</Suspense>,
				element
			);
		})
	}
});
