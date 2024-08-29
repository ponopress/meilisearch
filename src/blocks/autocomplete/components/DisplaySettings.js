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
	const {shapeType, size, textColor, fillColor, strokeColor, strokeWidth, trailColor, trailWidth} = attributes

    // Fill doesn't work in line color so show it only in other shapes
    let fillColorSetting = ''
    if( 'line' !== shapeType ) {
        fillColorSetting = {
            value: fillColor,
            onChange: ( val ) => setAttributes( { fillColor: val } ),
            label: __( 'Fill', 'juno' ),
        }
    }

    return(
        <>
            <PanelColorSettings
                title={ __( 'Colors', 'juno' ) }
                colorSettings={ [
                    {
                        value: textColor,
                        onChange: ( val ) => setAttributes( { textColor: val } ),
                        label: __( 'Text', 'juno' ),
                    },
                    fillColorSetting,
                    {
                        value: strokeColor,
                        onChange: ( val ) => setAttributes( { strokeColor: val } ),
                        label: __( 'Stroke', 'juno' ),
                    },
                    {
                        value: trailColor,
                        onChange: ( val ) => setAttributes( { trailColor: val } ),
                        label: __( 'Trail', 'juno' ),
                    },
                ] }
            >
            </PanelColorSettings>
        </>
	)
}