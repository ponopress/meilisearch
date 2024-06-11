import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { getMeilisearchResults } from '@meilisearch/autocomplete-client';
import { useSettings } from '../../hooks';
import { Spinner, Notice } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
    meilisearchAutocompleteClient,
} from '@meilisearch/autocomplete-client'

const YutoAutocomplete = ({ attributes }) => {
    let autocompleteSearchClient;
    // Checking `yutoViewData` since it is available only if called from frontend
    // So that the `autocompleteSearchClient` gets created based on the call from frontend or admin
    if ('undefined' === typeof yutoViewData) {
        let { autocompleteSearchClientFromSetting } = useSettings();
        autocompleteSearchClient = autocompleteSearchClientFromSetting;
    } else {
        autocompleteSearchClient = meilisearchAutocompleteClient({
            url: yutoViewData.host, // Host
            apiKey: yutoViewData.searchAPIKey  // API key
        })
    }
    
    const containerRef = useRef(null);
    const { enabledIndices, placeholder } = attributes

    useEffect(() => {
        if (!autocompleteSearchClient || !containerRef.current) {
            return;
        }

        // It's being reassigned because `getMeilisearchResults` is not working with any 
        // other variable name othar than `searchClient`. Need to look into this.
        const searchClient = autocompleteSearchClient
        const autocompleteInstance = autocomplete({
            container: containerRef.current,
            placeholder: placeholder,
            getSources({ query }) {
                return [
                    {
                        sourceId: 'posts',
                        getItems() {
                            const queries = enabledIndices.map(indexName => ({
                                indexName,
                                query,
                            }));
                            return getMeilisearchResults({
                                searchClient,
                                queries: queries,
                            });
                        },
                        templates: {
                            item({ item, components, html }) {
                                console.log(item,components, html)
                                return html`<div>
                                    <div>${item.title}</div>
                                </div>`;
                            },
                        },
                    }
                ];
            },
        });

        // Clean up the autocomplete instance on unmount
        return () => {
            autocompleteInstance.destroy();
        };
    }, [autocompleteSearchClient, attributes]);

    if (!autocompleteSearchClient) {
        return <Spinner />;
    }

    return <div className='wp-block-yuto-meilisearch__autocomplete-container' ref={containerRef}></div>;
};

export default YutoAutocomplete;
