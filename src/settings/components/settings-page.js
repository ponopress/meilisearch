import { __ } from '@wordpress/i18n';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHeading as Heading,
	Button,
	Panel,
	PanelBody,
	PanelRow,
    Spinner
} from '@wordpress/components';
import { useSettings } from '../hooks';
import { Notices } from './notices';
import { HostURLControl, APIKeyControl } from './controls';

import { MeiliSearch } from 'meilisearch'
import movies from './../movies.json'
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

const SaveButton = ( { onClick } ) => {
    return (
        <Button variant="primary" onClick={ onClick } __next40pxDefaultSize>
            { __( 'Save', 'meilisearch' ) }
        </Button>
    );
};

const AddPostsButton = ( { onClick } ) => {
    return (
        <Button variant="primary" onClick={ onClick } __next40pxDefaultSize>
            { __( 'Add Posts', 'meilisearch' ) }
        </Button>
    );
};

const SettingsTitle = () => {
    return (
        <Heading level={ 1 }>
            { __( 'Meiliesearch', 'meilisearch' ) }
        </Heading>
    );
};


const SettingsPage = () => {
    const {
        hostURL,
        setHostURL,
        APIKey,
        setAPIKey,
        saveSettings
    } = useSettings();

     // To ensure that hostURL and APIKey from useSettings are fetched and available before initializing instantMeiliSearch and rendering the InstantSearch component,
     if ( !hostURL || !APIKey ) {
        return <Spinner />
    }

    const client = new MeiliSearch({
        host: hostURL,
        apiKey: APIKey
    })

    const addPostsButtonClick = () => {
        let postObjects = [];

        const queryParams = { posts_per_page: -1 }
        apiFetch( { path: addQueryArgs( '/wp/v2/posts', queryParams ) } ).then((posts) => {
            postObjects = posts.map(post => {
                return {
                    id: post.id,
                    title: post.title.rendered,
                    link: post.link
                };
            });
            client.index('posts').addDocuments(postObjects)
                .then((res) => console.log(res))
        });
    }

    return (
        <>
            <SettingsTitle />
            <Notices />
            <Panel>
                <PanelBody
                    title={ __( 'Appearance', 'meilisearch' ) }
                    initialOpen={ false }
                >
                    <PanelRow>
                        <HostURLControl
                            value={ hostURL }
                            onChange={ ( value ) => setHostURL( value ) }
                        />
                        <APIKeyControl
                            value={ APIKey }
                            onChange={ ( value ) => setAPIKey( value ) }
                        />
                        
                    </PanelRow>
                </PanelBody>
            </Panel>
            <SaveButton onClick={ saveSettings } />
            
            <AddPostsButton onClick={ addPostsButtonClick } />
            
        </>
   );
};

export { SettingsPage };