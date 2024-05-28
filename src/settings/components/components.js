import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import {
    // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
    TextControl,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    __experimentalText as Text,
    __experimentalHeading as Heading,
    Panel, PanelBody, PanelRow,
    Flex, FlexBlock,
    TabPanel,
    Dashicon,
    Spinner
} from '@wordpress/components';
import { post, page } from '@wordpress/icons';
import { useSettings } from '../hooks';

const HostURLControl = ({ value, onChange }) => {
    return (
        <TextControl
            label={__('Host URL', 'meilisearch')}
            value={value}
            onChange={onChange}
            type="url"
        />
    );
};

const APIKeyControl = ({ value, onChange }) => {
    return (
        <TextControl
            label={__('API Key', 'meilisearch')}
            value={value}
            onChange={onChange}
            type="text"
        />
    );
};

const IndexUIDControl = ({ value, onChange, placeholder }) => {
    return (
        <TextControl
            label={__('Index UID', 'meilisearch')}
            value={value}
            onChange={onChange}
            type="text"
            placeholder={placeholder}
        />
    );
};


const SaveButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} __next40pxDefaultSize>
            {__('SAVE SETTINGS', 'meilisearch')}
        </Button>
    );
};

const AddPostDocumentsButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} __next40pxDefaultSize>
            {__('Add Post Documents', 'meilisearch')}
        </Button>
    );
};

const AddPageDocumentButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} __next40pxDefaultSize>
            {__('Add Page Documents', 'meilisearch')}
        </Button>
    );
};

const SettingsTitle = () => {
    return (
        <Heading level={1}>
            {__('Meiliesearch', 'meilisearch')}
        </Heading>
    );
};

const APIKeyCard = () => {
    const {
        hostURL,
        setHostURL,
        APIKey,
        setAPIKey,
        saveSettings,
    } = useSettings();
    return (
        <Card>
            <CardHeader>
                <Heading level={3}>{__('API Key', 'meiliesearch')}</Heading>
            </CardHeader>
            <CardBody>
                <Flex align="start" justify="normal" gap="12">
                    <FlexBlock style={{ flexBasis: "20%" }}>
                        <h2>Configuration</h2>
                        <p>Enter the API keys for each reCAPTCHA type you want to use in your forms. Note that each reCAPTCHA type requires a different set of API keys. Generate API keys</p></FlexBlock>
                    <FlexBlock style={{ flexBasis: "80%" }}>
                        <HostURLControl
                            value={hostURL}
                            onChange={(value) => setHostURL(value)}
                        />
                        <APIKeyControl
                            value={APIKey}
                            onChange={(value) => setAPIKey(value)}
                        />
                    </FlexBlock>
                </Flex>
            </CardBody>
            <CardFooter justify="right">
                <SaveButton onClick={saveSettings} />
            </CardFooter>
        </Card >
    )
}

const IndexesCard = () => {
    const {
        healthStatus,
        meiliesearchClient,
        UIDs,
        setUIDs
    } = useSettings();
    
    if (!UIDs) {
        return <Spinner />
    }

    const addDocumentsButtonClick = (postType) => {
        let postObjects = [];

        const queryParams = { posts_per_page: -1 }
        apiFetch({ path: addQueryArgs(`/wp/v2/${postType}`, queryParams) }).then((posts) => {
            postObjects = posts.map(post => {
                return {
                    id: post.id,
                    title: post.title.rendered,
                    link: post.link
                };
            });
            meiliesearchClient.index(postType).addDocuments(postObjects)
                .then((res) => console.log(res))
        });
    }

    return (
        <Card>
            <CardHeader>
                <Heading level={3}>{__('Indexes', 'meiliesearch')}</Heading>
            </CardHeader>
            {healthStatus ? (
                <>
                    <CardBody>
                        <Flex align="start" justify="normal" gap="12">
                            <FlexBlock style={{ flexBasis: "20%" }}>
                                <h2>Configuration</h2>
                                <p>Enter the API keys for each reCAPTCHA type you want to use in your forms. Note that each reCAPTCHA type requires a different set of API keys. Generate API keys</p></FlexBlock>
                            <FlexBlock style={{ flexBasis: "80%" }}>
                                <Panel header="Indexes">
                                    <PanelBody title="Posts" icon={<Dashicon icon="admin-post" />} >
                                        <IndexUIDControl
                                            placeholder="post"
                                            value={UIDs[0]}
                                            onChange={(value) => setUIDs((prevUIDs) => {
                                                // Create a new array with the updated first element
                                                const newUIDs = [...prevUIDs]; // Spread operator to copy the previous state array
                                                newUIDs[0] = value; // Update the first element
                                                return newUIDs;
                                            })}
                                        />
                                        <AddPostDocumentsButton onClick={() => addDocumentsButtonClick('posts')} />
                                    </PanelBody>
                                    <PanelBody title="Pages" icon={<Dashicon icon="admin-page" />} initialOpen={false}>
                                        <IndexUIDControl
                                            placeholder="page"
                                            value={UIDs[1]}
                                            onChange={(value) => setUIDs((prevUIDs) => {
                                                // Create a new array with the updated first element
                                                const newUIDs = [...prevUIDs]; // Spread operator to copy the previous state array
                                                newUIDs[1] = value; // Update the first element
                                                return newUIDs;
                                            })}
                                        />
                                        <AddPageDocumentButton onClick={() => addDocumentsButtonClick('pages')} />
                                    </PanelBody>
                                </Panel>
                            </FlexBlock>
                        </Flex>
                    </CardBody>
                    <CardFooter>
                    </CardFooter>
                </>
            ) : (
                <CardBody>
                    <div>Loading MeiliSearch status...</div>
                </CardBody>
            )}

        </Card>
    )
}

const TabPanelItems = ({ tab }) => {
    if (tab.name === 'api-keys') {
        return <APIKeyCard />
    } else {
        return <IndexesCard />
    }
};

const SettingsTabPanel = () => {
    return (
        <TabPanel
            className="settings-tab-panel"
            orientation="vertical"
            tabs={[
                {
                    name: 'api-keys',
                    title: 'API Keys',
                },
                {
                    name: 'indexes',
                    title: 'Indexes',
                },
            ]}
        >
            {
                (tab) => (
                    <TabPanelItems tab={tab} />
                )
            }
        </TabPanel>
    )
};

export { SettingsTitle, SettingsTabPanel };