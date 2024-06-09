import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	SelectControl,
	FormTokenField
} from '@wordpress/components';

export default function Settings(props) {
	const {UIDs} = props.yutoSettingProps

	const { attributes, setAttributes } = props
	const { enabledIndices } = attributes
	const suggestions = UIDs;
	
	return (
		<>
			<PanelBody title={__('Indices', 'yuto')}	>
				<FormTokenField
					label={__( 'Select indices', 'yuto' )}
					value={enabledIndices}
					suggestions={suggestions}
					placeholder={__('Select index(es)', 'yuto')}
					__experimentalShowHowTo={false}
					onChange={(tokens) => {
						const value = tokens.filter((t) => suggestions.includes(t));
						setAttributes({enabledIndices: value})}
					}
				/>
				<span className="yuto-form-token-field__help">{__( 'Select indices to be queried. Type two or more letters for suggestions.', 'yuto' )}</span>
			</PanelBody>
		</>
	)
}