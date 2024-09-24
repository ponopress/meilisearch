import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { MeiliSearch } from 'meilisearch'
import { addQueryArgs } from '@wordpress/url';
import {
    meilisearchAutocompleteClient,
} from '@meilisearch/autocomplete-client'
import { defaultHooks } from '@wordpress/hooks';

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
    const [UIDs, setUIDs] = useState({
        posts: 'post',
        pages: 'page'
    });
    const [postTypes, setPostTypes] = useState({});

    // Handle progress state when `Add Documents` and `Delete Index` button is clicked
    const [documentAddingState, setDocumentAddingState] = useState({});
    const [indexDeletingState, setIndexDeletingState] = useState({});

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
                createMeiliesearchClient(settings.yuto_settings.hostURL, settings.yuto_settings.masterAPIKey)
                createAutocompleteSearchClient(settings.yuto_settings.hostURL, settings.yuto_settings.masterAPIKey)
            }
        })

        apiFetch({ path: '/wp/v2/types' })
            .then((data) => setPostTypes(data))
            .catch((error) => console.error('Error fetching post types:', error));
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

    const updateUIDs = (restBase, UID, action = 'add') => {
        console.log(`Performing ${action} on UIDs`);

        setUIDs((prevUIDs) => {
            const updatedUIDs = { ...prevUIDs };

            if (action === 'delete') {
                // Delete the key if the action is 'delete'
                delete updatedUIDs[restBase];
            } else if (action === 'add') {
                // Update or add the key if the action is 'add'
                updatedUIDs[restBase] = UID;
            }

            // Perform the API request inside the callback to use the updated state
            apiFetch({
                path: '/wp/v2/settings',
                method: 'POST',
                data: {
                    yuto_settings: {
                        ...yutoSettings,
                        defaultPostTypesUIDs: updatedUIDs, // Use updated state here
                    },
                },
            });

            return updatedUIDs;
        });
    };


    const getFeaturedMediaURL = async (id) => {
        try {
            // If post has a featured image, it should be greater than 0
            if (id > 0) {
                // Use apiFetch to get the media object
                const media = await apiFetch({ path: `/wp/v2/media/${id}` });
                // Extract and return the image URL (full size)
                return media.source_url;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching the media:', error);
            return null;
        }
    };

    const addDocuments = async (restBase, UID) => {
        setDocumentAddingState(prevState => ({
            ...prevState,
            [UID]: 'inProgress'
        }));
        updateUIDs(restBase, UID);
        let postObjects = [];

        const queryParams = { posts_per_page: -1 };

        try {
            const posts = await apiFetch({ path: addQueryArgs(`/wp/v2/${restBase}`, queryParams) });

            postObjects = await Promise.all(
                posts.map(async (post) => {
                    // Get the featured media URL for each post
                    const featured_media_url = await getFeaturedMediaURL(post.featured_media);

                    // Apply the filter to modify the post object before returning
                    return defaultHooks.applyFilters('yuto_modify_documents_data', {
                        id: post.id,
                        title: post.title.rendered,
                        link: post.link,
                        featured_media_url: featured_media_url || '', // Default to an empty string if null
                    }, post, UID);
                    // return {
                    //     id: post.id,
                    //     title: post.title.rendered,
                    //     link: post.link,
                    //     featured_media_url: featured_media_url || '', // Default to an empty string if null
                    // };
                })
            );

            // Add documents to Meilisearch
            const res = await meilisearchClient.index(UID).addDocuments(postObjects);
            console.log(res);
            setDocumentAddingState(prevState => ({
                ...prevState,
                [UID]: 'completed'
            }));

            // Show success notice
            createSuccessNotice(
                __(`Documents for ${UID} added successfully.`, 'yuto')
            );

        } catch (error) {
            // Handle any errors
            console.error('Error adding documents to Meilisearch:', error);
            createErrorNotice(
                __(`Error adding documents for ${UID}: ${error.message}`, 'yuto')
            );
        }
    };

    const deleteIndex = (restBase, UID) => {
        const userConfirmed = window.confirm(`Are you sure you want to delete the index with UID: ${UID}?`);
        if (userConfirmed) {
            setIndexDeletingState(prevState => ({
                ...prevState,
                [UID]: 'inProgress'
            }));
            meilisearchClient.deleteIndex(UID)
                .then((res) => {
                    console.log(res)
                    createErrorNotice(
                        __(`Index with UID: ${UID} deleted.`, 'yuto')
                    );
                })
            updateUIDs(restBase, UID, 'delete')
            setIndexDeletingState(prevState => ({
                ...prevState,
                [UID]: 'completed'
            }));
        }
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
        autocompleteSearchClientFromSetting,
        addDocuments,
        deleteIndex,
        documentAddingState,
        indexDeletingState,
        postTypes
    };
};

export default useSettings;