import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';


const useSettings = () => {
    const [ message, setMessage ] = useState('Hello, World!');
    const [ display, setDisplay ] = useState(true);
    const [ hostURL, setHostURL ] = useState('');
    const [ APIKey, setAPIKey ] = useState('');

    const { createSuccessNotice } = useDispatch( noticesStore );
    useEffect( () => {
        apiFetch( { path: '/wp/v2/settings' } ).then( ( settings ) => {
            setMessage( settings.meilisearch_settings.message );
            setDisplay( settings.meilisearch_settings.display );
            setHostURL( settings.meilisearch_settings.hostURL );
            setAPIKey( settings.meilisearch_settings.APIKey );
        } );
    }, [] );

    const saveSettings = () => {
        apiFetch( {
            path: '/wp/v2/settings',
            method: 'POST',
            data: {
                meilisearch_settings: {
                    message,
                    display,
                    hostURL,
                    APIKey,
                },
            },
        } ).then( () => {
            createSuccessNotice(
                __( 'Settings saved.', 'meilisearch' )
            );
        } );

       
    };

    return {
        message,
        setMessage,
        display,
        setDisplay,
        hostURL,
        setHostURL,
        APIKey,
        setAPIKey,
        saveSettings
    };
};

export default useSettings;