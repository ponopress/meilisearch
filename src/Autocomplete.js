import { autocomplete } from '@algolia/autocomplete-js'
import {
    meilisearchAutocompleteClient,
    getMeilisearchResults,
} from '@meilisearch/autocomplete-client'
import '@algolia/autocomplete-theme-classic'
import { useSettings } from './settings/hooks';
import { Spinner } from '@wordpress/components';


const AppAutoComplete = () => {
    const {
        hostURL,
        APIKey,
    } = useSettings();

    // To ensure that hostURL and APIKey from useSettings are fetched and available before initializing instantMeiliSearch and rendering the InstantSearch component,
    if (!hostURL || !APIKey) {
        return <Spinner />
    }

    const searchClient = meilisearchAutocompleteClient({
        url: hostURL, // Host
        apiKey: APIKey  // API key
    })

    autocomplete({
        container: '.hello-test',
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
                        })
                    },
                    templates: {
                        item({ item, components, html }) {
                            return html`<div>
              <div>${item.title}</div>
            </div>`
                        },
                    },
                },
            ]
        },
    })
}

export default AppAutoComplete