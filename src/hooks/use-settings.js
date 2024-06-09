import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { MeiliSearch } from 'meilisearch'
import {
    meilisearchAutocompleteClient,
} from '@meilisearch/autocomplete-client'

const useSettings = () => {
    const [message, setMessage] = useState('Hello, World!');
    const [display, setDisplay] = useState(true);
    const [hostURL, setHostURL] = useState('');
    const [APIKey, setAPIKey] = useState('');
    const [meilisearchClient, setMeiliesearchClient] = useState('');
    const [autocompleteSearchClient, setAutocompleteSearchClient] = useState(false);
    const [connectionInfo, setConnectionInfo] = useState({
        status: false,
        error: null,
    });
    const [selectedTab, setSelectedTab] = useState('');
    const [UIDs, setUIDs] = useState();

    let yutoSettings = {
        hostURL,
        APIKey,
        defaultPostTypesUIDs: UIDs
    }

    const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
    useEffect(() => {
        console.log('api fetching')
        apiFetch({ path: '/wp/v2/settings' }).then((settings) => {
            if (settings.yuto_settings) {
                setMessage(settings.yuto_settings.message);
                setDisplay(settings.yuto_settings.display);
                setHostURL(settings.yuto_settings.hostURL);
                setAPIKey(settings.yuto_settings.APIKey);
                setUIDs(settings.yuto_settings.defaultPostTypesUIDs);
            }

            createMeiliesearchClient(settings.yuto_settings.hostURL, settings.yuto_settings.APIKey)
            createAutocompleteSearchClient(settings.yuto_settings.hostURL, settings.yuto_settings.APIKey)
        })
    }, [])

    const createAutocompleteSearchClient = (host, APIKey) => {
        const searchClient = meilisearchAutocompleteClient({
            url: host, // Host
            apiKey: APIKey  // API key
        })
        setAutocompleteSearchClient(searchClient)
    }

    const createMeiliesearchClient = (host, APIKey, onFailNotice, onSuccessNotice) => {
        let client
        try {
            client = new MeiliSearch({
                host: host,
                apiKey: APIKey
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
        createErrorNotice(errorMessage);
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
                    onFailNotice && onFailNotice(error.message)
                });
        }
    }

    const connectMeilisearch = () => {
        console.log('save button click')

        apiFetch({
            path: '/wp/v2/settings',
            method: 'POST',
            data: {
                yuto_settings: {
                    ...yutoSettings,
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
                yuto_settings: {
                    ...yutoSettings,
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
        meilisearchClient,
        connectionInfo,
        selectedTab,
        setSelectedTab,
        connectMeilisearch,
        updateUIDs,
        UIDs,
        setUIDs,
        autocompleteSearchClient
    };
};

export default useSettings;