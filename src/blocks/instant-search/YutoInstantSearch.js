import { getMeilisearchResults } from '@meilisearch/autocomplete-client';
import { useSettings } from '../../hooks';
import { Spinner, Notice } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { defaultHooks } from '@wordpress/hooks';

const { searchClient } = instantMeiliSearch(
    'http://172.16.238.10:7700/',
    'aSampleMasterKey'
);
const YutoInstantSearch = () => (
    <InstantSearch
        indexName="product"
        searchClient={searchClient}
    >
        <SearchBox />
        <Hits hitComponent={Hit} />
    </InstantSearch>
);

const Hit = ({ hit }) => <Highlight attribute="title" hit={hit} />;

export default YutoInstantSearch;
