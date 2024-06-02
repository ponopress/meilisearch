import { __ } from '@wordpress/i18n';
import { Notices } from './notices';
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