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
    const [connectionInfo, setConnectionInfo] = useState({
        status: false,
        error: null,
    });
    const [selectedTab, setSelectedTab] = useState('');
    const [UIDs, setUIDs] = useState(['post', 'page']);

    const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
    useEffect(() => {
        console.log('api fetching')
        apiFetch({ path: '/wp/v2/settings' }).then((settings) => {
            if (settings.meilisearch_settings) {
                setMessage(settings.meilisearch_settings.message);
                setDisplay(settings.meilisearch_settings.display);
                setHostURL(settings.meilisearch_settings.hostURL);
                setAPIKey(settings.meilisearch_settings.APIKey);
                setUIDs(settings.meilisearch_settings.defaultPostTypesUIDs);
            }

            createMeiliesearchClient(settings.meilisearch_settings.hostURL, settings.meilisearch_settings.APIKey)
        })
    }, [])

    const createMeiliesearchClient = (host, apiKey, onFailNotice, onSuccessNotice) => {
        let client
        try {
            client = new MeiliSearch({
                host: host,
                apiKey: apiKey
            });
        } catch (error) {
            console.log('fail')
            setConnectionInfo({
                status: false,
                error: error.message,
            });
        };

        setMeiliesearchClient(client)
        checkConnectionStatus(client, onFailNotice, onSuccessNotice)
    }

    const onSuccessNotice = () => {
        createSuccessNotice(
            __('Connected successfully!!!.', 'meilisearch')
        );
    }

    const onFailNotice = (errorMessage) => {
        createErrorNotice( errorMessage );
    }

    const checkConnectionStatus = (client, onFailNotice, onSuccessNotice) => {
        console.log('connection checking')
        if (client) {
            client.getVersion()
                .then(() => {
                    console.log('pass')
                    setConnectionInfo({
                        status: true,
                        error: null,
                    });
                    onSuccessNotice && onSuccessNotice()
                })
                .catch((error) => {
                    console.log('fail')
                    setConnectionInfo({
                        status: false,
                        error: error.message,
                    });
                    onFailNotice && onFailNotice( error.message)
                });
        }
    }

    const saveSettings = () => {
        console.log('save button click')

        apiFetch({
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
        }).then(() => {
            createMeiliesearchClient(hostURL, APIKey, onFailNotice, onSuccessNotice)
        })
    };

    const updateUIDs = () => {
        console.log('updating UIDs')

        apiFetch({
            path: '/wp/v2/settings',
            method: 'POST',
            data: {
                meilisearch_settings: {
                    defaultPostTypesUIDs: UIDs
                },
            },
        })
    }

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
        connectionInfo,
        selectedTab,
        setSelectedTab,
        saveSettings,
        updateUIDs,
        UIDs,
        setUIDs
    };
};

export default useSettings;