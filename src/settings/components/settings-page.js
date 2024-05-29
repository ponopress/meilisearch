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
 

    return (
        <>
            <SettingsTitle />
            <Notices />
            <SettingsTabPanel />
        </>
    );
};

export { SettingsPage };