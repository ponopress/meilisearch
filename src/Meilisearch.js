import { InstantSearch, SearchBox, Hits, Highlight, RefinementList } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { Spinner } from '@wordpress/components';

import { useSettings } from './settings/hooks';

const App = () => {
    const {
        hostURL,
        APIKey,
    } = useSettings();

    // To ensure that hostURL and APIKey from useSettings are fetched and available before initializing instantMeiliSearch and rendering the InstantSearch component,
    if ( !hostURL || !APIKey ) {
        return <Spinner />
    }

    const { searchClient } = instantMeiliSearch(
        hostURL,
        APIKey
    );
    
    return (
        <InstantSearch
            indexName="posts"
            searchClient={searchClient}
        >
            <SearchBox />
            <Hits hitComponent={Hit} />
        </InstantSearch>
    )
};

const Hit = ({ hit }) => <Highlight attribute="title" hit={hit} />;

export default App