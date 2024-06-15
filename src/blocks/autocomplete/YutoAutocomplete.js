import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { getMeilisearchResults } from '@meilisearch/autocomplete-client';
import { useSettings } from '../../hooks';
import { Spinner, Notice } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
    meilisearchAutocompleteClient,
} from '@meilisearch/autocomplete-client'
import { defaultHooks } from '@wordpress/hooks';

const Test = () => {
    return 'hello'
}

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
    const { enabledIndices, placeholder, autoFocus } = attributes

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
            autoFocus: autoFocus,
            openOnFocus: true,
            getSources({ query }) {
                return enabledIndices.map(indexName => ({
                    sourceId: indexName,
                    getItems() {
                        return getMeilisearchResults({
                            searchClient,
                            queries: [
                                {
                                    indexName,
                                    query,
                                },
                            ],
                        });
                    },
                    getItemUrl({ item }) {
                        return item.link;
                    },
                    templates: {
                        header(props) {
                            const { createElement } = props;
                            let headerTemplate = defaultHooks.applyFilters(`yuto_autocomplete_${indexName}_header_template`, `<b>${indexName}</b>`, props);
                            return createElement('div', {
                                dangerouslySetInnerHTML: { __html: headerTemplate }
                            });
                        },
                        item(props) {
                            const { item, components, html, createElement } = props;
                            let defaultItemTemplate = `<a class="aa-ItemLink" href="${item.link}">${item.title}</a>`;
                            let itemTemplate = defaultHooks.applyFilters(`yuto_autocomplete_${indexName}_item_template`, defaultItemTemplate, props);
                            return createElement('span', {
                                dangerouslySetInnerHTML: { __html: itemTemplate }
                            });
                        },
                        footer(props) {
                            const { createElement } = props;
                            let footerTemplate = defaultHooks.applyFilters(`yuto_autocomplete_${indexName}_footer_template`, ``, props);
                            return createElement('div', {
                                dangerouslySetInnerHTML: { __html: footerTemplate }
                            });
                        },
                        noResults(props) {
                            const { createElement } = props;
                            let noResultsTemplate = defaultHooks.applyFilters(
                                `yuto_autocomplete_${indexName}_noResults_template`,
                                `<i>${__(`No ${indexName} found!!!`)}</i>`,
                                props
                            );
                            return createElement('div', {
                                dangerouslySetInnerHTML: { __html: noResultsTemplate }
                            });
                        },
                    },
                }));
            }

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
