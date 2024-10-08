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

const hexToRgb = (hex) => {
    // Remove the leading '#' if present
    hex = hex.replace(/^#/, '');

    // Handle short hex code (#abc)
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r}, ${g}, ${b}`;
};

const YutoAutocomplete = ({ shouldPanelOpen, attributes }) => {
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
    const { enabledIndices, placeholder, autoFocus, openOnFocus, resultsPanelPlacement } = attributes

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
            panelPlacement: resultsPanelPlacement,
            openOnFocus: openOnFocus,
            // shouldPanelOpen: () => shouldPanelOpen,
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
                            let formattedIndexName = indexName.charAt(0).toUpperCase() + indexName.slice(1);

                            let headerTemplate = defaultHooks.applyFilters(`yuto_autocomplete_${indexName}_header_template`, `<b>${formattedIndexName}</b>`, props);
                            return createElement('div', {
                                dangerouslySetInnerHTML: { __html: headerTemplate }
                            });
                        },
                        item(props) {
                            const { item, components, html, createElement } = props;
                            let defaultItemTemplate = `
                                <div class="aa-ItemContent">
                                    <a class="aa-ItemLink" href="${item.link}">
                                    ${item.featured_media_url ? `
                                        <div class="aa-ItemIcon"><img src="${item.featured_media_url}" /></div>
                                        ` : ''}
                                        <div class="aa-ItemContentBody">
                                            <div class="aa-ItemContentTitle">
                                            ${item.title}
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            `;
                            let itemTemplate = defaultHooks.applyFilters(`yuto_autocomplete_${indexName}_item_template`, defaultItemTemplate, props);
                            return createElement('div', {
                                className: 'aa-ItemWrapper',
                                dangerouslySetInnerHTML: { __html: itemTemplate }
                            });
                        },
                        footer(props) {
                            const { createElement } = props;
                            let footerTemplate = defaultHooks.applyFilters(`yuto_autocomplete_${indexName}_footer_template`, ``, props);
                            return createElement('div', {
                                className: 'aa-ItemWrapper',
                                dangerouslySetInnerHTML: { __html: footerTemplate }
                            });
                        },
                        noResults(props) {
                            const { createElement } = props;
                            let noResultsTemplate = defaultHooks.applyFilters(
                                `yuto_autocomplete_${indexName}_noResults_template`,
                                `<i>${__(`No ${indexName} found!!!`, 'yuto')}</i>`,
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
    }, [autocompleteSearchClient, attributes, shouldPanelOpen]);

    if (!autocompleteSearchClient) {
        return <Spinner />;
    }

    return <div className='wp-block-yuto-meilisearch__autocomplete-container' ref={containerRef}></div>;
};

export default YutoAutocomplete;
