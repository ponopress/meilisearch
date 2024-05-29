import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { MeiliSearch } from 'meilisearch'



const useSettings = () => {
    const [message, setMessage] = useState('Hello, World!');
    const [display, setDisplay] = useState(true);
    const [hostURL, setHostURL] = useState('');
    const [APIKey, setAPIKey] = useState('');
    const [meiliesearchClient, setMeiliesearchClient] = useState('');
    const [healthStatus, setHealthStatus] = useState(null);
    const [selectedTab, setSelectedTab] = useState('');
    const [UIDs, setUIDs] = useState(['post', 'page']);

    const { createSuccessNotice } = useDispatch(noticesStore);
    useEffect(() => {
        apiFetch({ path: '/wp/v2/settings' }).then((settings) => {
            if (settings.meilisearch_settings) {
                setMessage(settings.meilisearch_settings.message);
                setDisplay(settings.meilisearch_settings.display);
                setHostURL(settings.meilisearch_settings.hostURL);
                setAPIKey(settings.meilisearch_settings.APIKey);
                setUIDs(settings.meilisearch_settings.defaultPostTypesUIDs);
            }
        });
    }, []);


    useEffect(() => {
        // Ensure that hostURL and APIKey from useSettings are fetched and available 
        // before initializing instantMeiliSearch and rendering the InstantSearch component
        if (!hostURL || !APIKey) {
            return; // Exit early if hostURL or APIKey is not available
        }
        const client = new MeiliSearch({
            host: hostURL,
            apiKey: APIKey
        });
        
        setMeiliesearchClient(client);

        if (client) {
            client.health()
                .then((status) => {
                    console.log(status, 'first')

                    setHealthStatus(status);
                })
                .catch((error) => {
                    console.error('Error fetching MeiliSearch health status:', error);
                });
        }

    }, [hostURL, APIKey]);

    // useEffect(() => {
    //     if (meiliesearchClient) {
    //         meiliesearchClient.health()
    //             .then((status) => {
    //                 console.log(status, 'here')

    //                 setHealthStatus(status);
    //             })
    //             .catch((error) => {
    //                 console.error('Error fetching MeiliSearch health status:', error);
    //             });
    //     }
    // }, [meiliesearchClient]);

    const saveSettings = () => {
        apiFetch({
            path: '/wp/v2/settings',
            method: 'POST',
            data: {
                meilisearch_settings: {
                    message,
                    display,
                    hostURL,
                    APIKey,
                    defaultPostTypesUIDs: UIDs
                },
            },
        }).then(() => {
            createSuccessNotice(
                __('Settings saved.', 'meilisearch')
            );
        });


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
        meiliesearchClient,
        healthStatus,
        selectedTab,
        setSelectedTab,
        saveSettings,
        UIDs,
        setUIDs
    };
};

export default useSettings;