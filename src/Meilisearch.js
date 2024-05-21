import { InstantSearch, SearchBox, Hits, Highlight, RefinementList } from 'react-instantsearch';
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

import { useSettings } from './settings/hooks';



const App = () => {
  const {
    hostURL,
    APIKey,
  } = useSettings();
  
  const { searchClient } = instantMeiliSearch(
    'http://172.16.238.10:7700/',
    'aSampleMasterKey'
  );
  
  return(
    <InstantSearch
      indexName="movies"
      searchClient={searchClient}
    >
      <SearchBox />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  )};

const Hit = ({ hit }) => <Highlight attribute="title" hit={hit} />;

export default App