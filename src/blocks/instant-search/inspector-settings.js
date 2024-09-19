import { InspectorControls } from '@wordpress/block-editor';

import Settings from './components/Settings';
import DisplaySettings from './components/DisplaySettings';

import { useSettings } from '../../hooks';

export default function InspectorSettings(props) {
	const yutoSettingProps = useSettings()
	return (
		<>
			<InspectorControls>
				<Settings {...props} yutoSettingProps={yutoSettingProps}/>
			</InspectorControls>
			<InspectorControls group="styles">
				<DisplaySettings {...props} />
			</InspectorControls>
		</>
	);
}