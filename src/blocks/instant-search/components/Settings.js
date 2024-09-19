import { __ } from '@wordpress/i18n';
import {
	Panel,
	PanelBody,
	PanelRow,
	TextControl,
	FormTokenField,
	ToggleControl,
	SelectControl
} from '@wordpress/components';

export default function Settings(props) {
	const { UIDs } = props.yutoSettingProps

	const { attributes, setAttributes } = props
	const { enabledIndices, placeholder, autoFocus, openOnFocus, resultsPanelPlacement } = attributes
	const suggestions = Object.values(UIDs) // Convert to array of values

	return (
		<>
			<Panel>
				<PanelBody title={__('Indices', 'yuto')}>
					<FormTokenField
						label={__('Select indices', 'yuto')}
						value={enabledIndices}
						suggestions={suggestions}
						placeholder={__('Select index(es)', 'yuto')}
						__experimentalShowHowTo={false}
						__experimentalExpandOnFocus={true}
						onChange={(tokens) => {
							const value = tokens.filter((t) => suggestions.includes(t));
							setAttributes({ enabledIndices: value })
						}
						}
					/>
					<span className="yuto-form-token-field__help">{__('Select indices to be queried. Type two or more letters for suggestions.', 'yuto')}</span>
					<TextControl
						label={__('Placeholder', 'yuto')}
						value={placeholder}
						onChange={(value) => setAttributes({ placeholder: value })}
					/>

					<ToggleControl
						label={__("Auto Focus", 'yuto')}
						help={__("Enabling will focus on the search box on page load", 'yuto')}
						checked={autoFocus}
						onChange={(value) => {
							setAttributes({ autoFocus: value });
						}}
					/>

					<ToggleControl
						label={__("Open on Focus", 'yuto')}
						help={__("Display items as soon as a user selects the search, even without typing.", 'yuto')}
						checked={openOnFocus}
						onChange={(value) => {
							setAttributes({ openOnFocus: value });
						}}
					/>
					<SelectControl
						label={__("Results Panel Placement", 'yuto')}
						value={resultsPanelPlacement}
						options={[
							{ label: __('Search Input Width', 'yuto'), value: 'input-wrapper-width' },
							{ label: __('Start', 'yuto'), value: 'start' },
							{ label: __('End', 'yuto'), value: 'end' },
							{ label: __('Full Width', 'yuto'), value: 'full-width' },
						]}
						help={__("Select the positioning of the results panel when a search is performed.", 'yuto')}
						onChange={(value) => {
							setAttributes({ resultsPanelPlacement: value });
						}}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</Panel>
		</>
	)
}