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
    const [hostURL, setHostURL] = useState('');
    const [masterAPIKey, setMasterAPIKey] = useState('');
    const [searchAPIKey, setSearchAPIKey] = useState('');
    const [adminAPIKey, setAdminAPIKey] = useState('');
    const [meilisearchClient, setMeiliesearchClient] = useState('');
    const [autocompleteSearchClientFromSetting, setAutocompleteSearchClient] = useState(false);
    const [connectionInfo, setConnectionInfo] = useState({
        status: false,
        error: null,
    });
    const [selectedTab, setSelectedTab] = useState('');
    const [UIDs, setUIDs] = useState(['post', 'page']);

    let yutoSettings = {
        hostURL,
        masterAPIKey,
        searchAPIKey,
        defaultPostTypesUIDs: UIDs
    }

    const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
    useEffect(() => {
        console.log('api fetching')
        apiFetch({ path: '/wp/v2/settings' }).then((settings) => {
            if (settings.yuto_settings) {
                setHostURL(settings.yuto_settings.hostURL);
                setMasterAPIKey(settings.yuto_settings.masterAPIKey);
                setSearchAPIKey(settings.yuto_settings.searchAPIKey);
                setAdminAPIKey(settings.yuto_settings.adminAPIKey);
                setUIDs(settings.yuto_settings.defaultPostTypesUIDs);
            }

            createMeiliesearchClient(settings.yuto_settings.hostURL, settings.yuto_settings.masterAPIKey)
            createAutocompleteSearchClient(settings.yuto_settings.hostURL, settings.yuto_settings.masterAPIKey)
        })
    }, [])

    const createAutocompleteSearchClient = (host, masterAPIKey) => {
        const searchClient = meilisearchAutocompleteClient({
            url: host, // Host
            apiKey: masterAPIKey  // API key
        })
        setAutocompleteSearchClient(searchClient)
    }

    const createMeiliesearchClient = (host, masterAPIKey, onFailNotice, onSuccessNotice) => {
        let client
        try {
            client = new MeiliSearch({
                host: host,
                apiKey: masterAPIKey
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
            client.getKeys()
                .then((keys) => {
                    setSearchAPIKey(keys.results[0].key)
                    setAdminAPIKey(keys.results[1].key)
                })
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
                    masterAPIKey,
                    searchAPIKey,
                    adminAPIKey
                },
            },
        }).then(() => {
            createMeiliesearchClient(hostURL, masterAPIKey, onFailNotice, onSuccessNotice)
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
        hostURL,
        setHostURL,
        masterAPIKey,
        setMasterAPIKey,
        meilisearchClient,
        connectionInfo,
        selectedTab,
        setSelectedTab,
        connectMeilisearch,
        updateUIDs,
        UIDs,
        searchAPIKey,
        adminAPIKey,
        setUIDs,
        autocompleteSearchClientFromSetting
    };
};

export default useSettings;