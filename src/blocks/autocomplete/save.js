/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save(props) {
	const { attributes } = props
	const stringifedAttributes = JSON.stringify(attributes)
	const hex2rgb = (hex) => {
		if (typeof hex !== 'undefined' || hex) {
			return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
		}
	}
	const styles = {
		"--aa-primary-color-rgb": hex2rgb(attributes.themeColor)
	};
	return (
		<div data-autocomplete-attributes={stringifedAttributes} {...useBlockProps.save({ style: styles })}>
			<InnerBlocks.Content />
		</div>
	);
}
