import { __ } from '@wordpress/i18n';
import {
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHeading as Heading,
	Button,
	Panel,
	PanelBody,
	PanelRow,
} from '@wordpress/components';
import { useSettings } from '../hooks';
import { Notices } from './notices';
import { HostURLControl, APIKeyControl } from './controls';

const SaveButton = ( { onClick } ) => {
    return (
        <Button variant="primary" onClick={ onClick } __next40pxDefaultSize>
            { __( 'Save', 'meilisearch' ) }
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
        </>
   );
};

export { SettingsPage };