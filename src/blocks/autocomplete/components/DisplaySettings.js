import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	RangeControl,
} from '@wordpress/components';

import { 
    PanelColorSettings
} from '@wordpress/block-editor';

export default function DisplaySettings(props) {
	const {attributes, setAttributes} = props
	const {themeColor} = attributes

    return(
        <>
            <PanelColorSettings
                title={ __( 'Colors', 'yuto' ) }
                colorSettings={ [
                    {
                        value: themeColor,
                        onChange: ( val ) => setAttributes( { themeColor: val } ),
                        label: __( 'Color', 'yuto' ),
                    }                    
                ] }
            >
            </PanelColorSettings>
        </>
	)
}