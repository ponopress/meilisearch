import { getMeilisearchResults } from '@meilisearch/autocomplete-client';
import { useSettings } from '../../hooks';
import { Spinner, Notice } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { InstantSearch, SearchBox, Hits, Highlight, RefinementList, } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { defaultHooks } from '@wordpress/hooks';

const { searchClient } = instantMeiliSearch(
    'http://172.16.238.10:7700/',
    'aSampleMasterKey'
);

const YutoInstantSearch = () => {

    let instantSearchClient;
    // Checking `yutoViewData` since it is available only if called from frontend
    // So that the `instantSearchClient` gets created based on the call from frontend or admin
    if ('undefined' === typeof yutoViewData) {
        let { instantSearchClientFromSetting } = useSettings();
        instantSearchClient = instantSearchClientFromSetting;

    } else {
        instantSearchClient = instantMeiliSearch(
            yutoViewData.host, // Host
            yutoViewData.searchAPIKey  // API key
        )
    }
    return (
        <InstantSearch
            indexName="product"
            searchClient={searchClient}
        >
            <SearchBox />
            <RefinementList attribute="categories" />
            <Hits hitComponent={Hit} />
        </InstantSearch>
    )
};

const Hit = ({ hit }) => {
    return (
        <article>
            <Highlight attribute="title" hit={hit} />;
            <img src={hit.featured_media_url} alt={hit.title} />
        </article>
    );
}

export default YutoInstantSearch;
