import { __ } from '@wordpress/i18n';
import {
	TextareaControl,
	ToggleControl,
    TextControl,
} from '@wordpress/components';


const MessageControl = ( { value, onChange } ) => {
    return (
        <TextareaControl
            label={ __( 'Message', 'meilisearch' ) }
            value={ value }
            onChange={ onChange }
            __nextHasNoMarginBottom
        />
    );
};

const DisplayControl = ( { value, onChange } ) => {
    return (
        <ToggleControl
            label={ __( 'Display', 'meilisearch' ) }
            checked={ value }
            onChange={ onChange }
            __nextHasNoMarginBottom
        />
    );
};

const HostURLControl = ({ value, onChange }) => {
    return (
       <TextControl
           value={ value }
           onChange={ onChange }
           type="url"
       />
    );
};

const APIKeyControl = ({ value, onChange }) => {
    return (
       <TextControl
            value={ value }
            onChange={ onChange }
            type="password"
       />
    );
};

export { MessageControl, DisplayControl, HostURLControl, APIKeyControl };