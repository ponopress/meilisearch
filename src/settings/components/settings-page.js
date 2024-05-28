import { __ } from '@wordpress/i18n';

import { useSettings } from '../hooks';
import { Notices } from './notices';

import movies from './../movies.json'
import {
    // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
    Spinner,
} from '@wordpress/components';

import { SettingsTitle, SettingsTabPanel } from './components'

const SettingsPage = () => {
    const {
        hostURL,
        APIKey,
    } = useSettings();

    // To ensure that hostURL and APIKey from useSettings are fetched and available 
    // before initializing instantMeiliSearch and rendering the InstantSearch component,
    if (!hostURL || !APIKey) {
        // return <Spinner />
    }

    return (
        <>
            <SettingsTitle />
            <Notices />
            <SettingsTabPanel />
        </>
    );
};

export { SettingsPage };