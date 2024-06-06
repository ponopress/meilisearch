import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

import {
    // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
    TextControl,
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardDivider,
    __experimentalText as Text,
    __experimentalHeading as Heading,
    Panel, PanelBody, PanelRow,
    Flex, FlexBlock,
    TabPanel,
    Dashicon,
    Spinner
} from '@wordpress/components';
import { post, page, seen, color } from '@wordpress/icons';
import { useSettings } from '../hooks';

const HostURLControl = ({ value, onChange }) => {
    return (
        <TextControl
            label={__('Host URL', 'meilisearch')}
            value={value}
            onChange={onChange}
            type="url"
            help={__('Enter the URL of your Meilisearch instance.', 'meilisearch')}
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
            help={__('Provide the API key to authenticate with Meilisearch.', 'meilisearch')}
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
            help={__('Enter uniuqe identifier for index.  Must be an integer or string containing only alphanumeric characters, hyphens and underscores. By default, it\'s value is the slug', 'meilisearch')}
            placeholder={placeholder}
        />
    );
};


const SaveButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} __next40pxDefaultSize>
            {__('CONNECT', 'meilisearch')}
        </Button>
    );
};

const AddDocumentsButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} __next40pxDefaultSize>
            {__('Add Documents', 'meilisearch')}
        </Button>
    );
};

const DeleteIndexButton = ({ onClick }) => {
    return (
        <Button variant="secondary" onClick={onClick} __next40pxDefaultSize>
            {__('Delete Index', 'meilisearch')}
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

const ConnectionInfo = ({ connectionInfo }) => {
    return (
        <div className='meilisearch__connection-info'>
            <span>Connection Status: </span>
            {connectionInfo.status ? (
                <span className='meilisearch__connection-info__status success'>
                    <span>Connected </span>
                </span>
            ) : (
                <span>
                    <span className='meilisearch__connection-info__status error'>
                        <span>Disconnected </span>
                    </span>
                </span>
            )}
        </div>
    );
};

const APIKeyCard = (settingsProps) => {
    const {
        hostURL,
        setHostURL,
        APIKey,
        setAPIKey,
        connectMeilisearch,
        connectionInfo,
    } = settingsProps
    return (
        <Card>
            <CardHeader>
                <Heading level={3}>{__('Connection', 'meilisearch')}</Heading>
                <ConnectionInfo connectionInfo={connectionInfo} />
            </CardHeader>
            <CardBody>
                <Flex align="start" justify="normal" gap="12">
                    <FlexBlock style={{ flexBasis: "20%" }}>
                        <h2>Configuration</h2>
                        <p>Configure the connection between your site and Meilisearch. <a href="https://www.meilisearch.com/docs/learn/security/basic_security" target='_blank'>Get API keys</a></p></FlexBlock>
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
                <SaveButton onClick={connectMeilisearch} />
            </CardFooter>
        </Card >
    )
}

const IndexesCard = (settingsProps) => {
    const {
        connectionInfo,
        meilisearchClient,
        UIDs,
        setUIDs,
        updateUIDs
    } = settingsProps
    if (!UIDs) {
        return <Spinner />
    }
    const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
    const addDocumentsButtonClick = (postType, UID) => {
        updateUIDs()
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
            meilisearchClient.index(UID).addDocuments(postObjects)
                .then((res) => {
                    console.log(res)
                    createSuccessNotice(
                        __(`Documents for ${UID} added successfully.`, 'meilisearch')
                    );
                })
        });
    }

    const deleteIndexButtonClick = (UID) => {
        meilisearchClient.deleteIndex(UID)
            .then((res) => {
                console.log(res)
                createErrorNotice(
                    __(`Index with UID: ${UID} deleted.`, 'meilisearch')
                );
            })
    }

    return (
        <Card>
            <CardHeader>
                <Heading level={3}>{__('Indexes', 'meilisearch')}</Heading>
            </CardHeader>
            {connectionInfo.status ? (
                <>
                    <CardBody>
                        Each index is a collection of documents, similar to a table in a relational database. Here, <b>Posts</b> & <b>Pages</b> are indexes and each posts & pages are the documents.<a href='https://www.meilisearch.com/docs/learn/core_concepts/indexes' target='_blank'>Learn more.</a>
                    </CardBody>
                    <CardBody>
                        <Flex align="start" justify="normal" gap="12">
                            <FlexBlock style={{ flexBasis: "20%" }}>
                                <h2>Configuration</h2>
                                <p>Configure <a target='_blank' href='https://www.meilisearch.com/docs/learn/core_concepts/indexes#index-uid'>UID (unique identifier)</a> for each index and add documents to each index.Learn more.</p></FlexBlock>
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
                                        <Flex>
                                            <AddDocumentsButton onClick={() => addDocumentsButtonClick('posts', UIDs[0])} />
                                            <DeleteIndexButton onClick={() => deleteIndexButtonClick(UIDs[0])} />
                                        </Flex>
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
                                        <Flex>
                                            <AddDocumentsButton onClick={() => addDocumentsButtonClick('pages', UIDs[1])} />
                                            <DeleteIndexButton onClick={() => deleteIndexButtonClick(UIDs[1])} />
                                        </Flex>
                                    </PanelBody>
                                </Panel>
                            </FlexBlock>
                        </Flex>
                    </CardBody>
                </>
            ) : (
                <CardBody>
                    <p><Dashicon style={{ color: "red" }} icon="dismiss" /> Error loading indexes: {connectionInfo.error}</p>
                </CardBody>
            )}

        </Card>
    )
}

const TabPanelItems = ({ tab, ...settingsProps }) => {
    if (tab.name === 'connection') {
        return <APIKeyCard {...settingsProps} />
    } else {
        return <IndexesCard {...settingsProps} />
    }
};

const SettingsTabPanel = () => {
    const settingsProps = useSettings();

    return (
        <TabPanel
            className="meilisearch__settings-tab-panel"
            orientation="vertical"
            tabs={[
                {
                    name: 'connection',
                    title: __('Connection', 'meilisearch'),
                },
                {
                    name: 'indexes',
                    title: __('Indexes', 'meilisearch'),
                },
            ]}
        >
            {
                (tab) => (
                    <TabPanelItems tab={tab} {...settingsProps} />
                )
            }
        </TabPanel>
    )
};

export { SettingsTitle, SettingsTabPanel };