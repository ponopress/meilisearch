import { __ } from '@wordpress/i18n';
import {
	TextareaControl,
	ToggleControl,
    TextControl,
} from '@wordpress/components';

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
            type="text"
       />
    );
};

export { HostURLControl, APIKeyControl };