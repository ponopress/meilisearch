import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { getMeilisearchResults } from '@meilisearch/autocomplete-client';
import { useSettings } from '../../hooks';
import { Spinner, Notice } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const YutoAutocomplete = ({ attributes }) => {
    const { autocompleteSearchClient } = useSettings();
    
    const containerRef = useRef(null);
    const { enabledIndices } = attributes

    useEffect(() => {
        if (!autocompleteSearchClient || !containerRef.current) {
            return;
        }

        // It's being reassigned because `getMeilisearchResults` is not working with any 
        // other variable name othar than `searchClient`. Need to look into this.
        const searchClient = autocompleteSearchClient
        const autocompleteInstance = autocomplete({
            container: containerRef.current,
            placeholder: __('Search for games', 'yuto'),
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
    }, [autocompleteSearchClient, enabledIndices]);

    if (!autocompleteSearchClient) {
        return <Spinner />;
    }

    return <div className='wp-block-yuto-meilisearch__autocomplete-container' ref={containerRef}></div>;
};

export default YutoAutocomplete;
