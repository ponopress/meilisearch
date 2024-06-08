import { autocomplete } from '@algolia/autocomplete-js'
import {
    getMeilisearchResults,
} from '@meilisearch/autocomplete-client'
import { useSettings } from './settings/hooks';
import { Spinner } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

const AppAutoComplete = ({container}) => {
    const {searchClient} = useSettings();
    useEffect(() => {
        if (!searchClient) {
            return;
        }
        const autocompleteInstance = autocomplete({
            container: container,
            placeholder: 'Search for games',
            getSources({ query }) {
                return [
                    {
                        sourceId: 'posts',
                        getItems() {
                            return getMeilisearchResults({
                                searchClient,
                                queries: [
                                    {
                                        indexName: 'posts',
                                        query,
                                    },
                                ],
                            });
                        },
                        templates: {
                            item({ item, components, html }) {
                                return html`<div>
                                    <div>${item.title}</div>
                                </div>`;
                            },
                        },
                    },
                ];
            },
        });

        // Clean up the autocomplete instance on unmount
        return () => {
            autocompleteInstance.destroy();
        };
    }, [searchClient]);

    if (!searchClient) {
        return <Spinner />;
    }
}

export default AppAutoComplete