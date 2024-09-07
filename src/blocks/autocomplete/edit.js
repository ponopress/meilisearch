/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';
import YutoAutocomplete from './YutoAutocomplete';
import InspectorSettings from './inspector-settings';
import { withFocusOutside, IsolatedEventContainer } from '@wordpress/components';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

const YutoAutocompleteFocusOutside = withFocusOutside(
	class extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				shouldPanelOpen: true,
			};

			this.handleFocusOutside = this.handleFocusOutside.bind(this);
			this.toggleAutocomplete = this.toggleAutocomplete.bind(this);
		}

		handleFocusOutside() {
			this.setState({ shouldPanelOpen: false });
		}

		toggleAutocomplete(show) {
			this.setState({ shouldPanelOpen: true });
		}

		render() {
			const { attributes } = this.props;
			const { shouldPanelOpen } = this.state;
			return (
				<IsolatedEventContainer
					className="component-some_component"
				>
					<YutoAutocomplete
						attributes={attributes}
						shouldPanelOpen={this.state.shouldPanelOpen}
						onFocus={() => this.toggleAutocomplete(true)}
					/>
				</IsolatedEventContainer>
			);
		}
	}
);


export default function Edit(props) {
	const { attributes } = props;

	const hex2rgb = (hex) => {
		if (typeof hex !== 'undefined' || hex) {
			return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
		}
	}
	const styles = {
		"--aa-primary-color-rgb": hex2rgb( attributes.themeColor )
	};
	const blockProps = useBlockProps({ style: styles });

	return (
		<div {...blockProps}>
			<InspectorSettings {...props} />
			<YutoAutocompleteFocusOutside attributes={attributes} />
		</div>
	);
}
