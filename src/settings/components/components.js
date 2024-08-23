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
import { post, page, seen, color, image } from '@wordpress/icons';
import { useSettings } from '../../hooks';

const HostURLControl = ({ value, onChange }) => {
    return (
        <TextControl
            label={__('Host URL', 'yuto')}
            value={value}
            onChange={onChange}
            type="url"
            help={__('Enter the URL of your Meilisearch instance.', 'yuto')}
        />
    );
};

const MasterAPIKeyControl = ({ value, onChange }) => {
    return (
        <TextControl
            label={__('API Key', 'yuto')}
            value={value}
            onChange={onChange}
            type="text"
            help={__('Provide the API key to authenticate with Meilisearch.', 'yuto')}
        />
    );
};

const IndexUIDControl = ({ value, onChange, placeholder }) => {
    return (
        <TextControl
            label={__('Index UID', 'yuto')}
            value={value}
            onChange={onChange}
            type="text"
            help={__('Enter unique identifier for index.  Must be an integer or string containing only alphanumeric characters, hyphens and underscores. By default, it\'s value is the slug', 'yuto')}
            placeholder={placeholder}
        />
    );
};


const SaveButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} __next40pxDefaultSize>
            {__('CONNECT', 'yuto')}
        </Button>
    );
};

const AddDocumentsButton = ({ onClick }) => {
    return (
        <Button variant="primary" onClick={onClick} __next40pxDefaultSize>
            {__('Add Documents', 'yuto')}
        </Button>
    );
};

const DeleteIndexButton = ({ onClick }) => {
    return (
        <Button variant="secondary" onClick={onClick} __next40pxDefaultSize>
            {__('Delete Index', 'yuto')}
        </Button>
    );
};

const SettingsTitle = () => {
    return (
        <Heading level={1}>
            {__('Meiliesearch', 'yuto')}
        </Heading>
    );
};

const ConnectionInfo = ({ connectionInfo }) => {
    return (
        <div className='yuto__connection-info'>
            <span>Connection Status: </span>
            {connectionInfo.status ? (
                <span className='yuto__connection-info__status success'>
                    <span>{__('Connected', 'yuto')}</span>
                </span>
            ) : (
                <span>
                    <span className='yuto__connection-info__status error'>
                        <span>{__('Disconnected', 'yuto')}</span>
                    </span>
                </span>
            )}
        </div>
    );
};

const MasterAPIKeyCard = (yutoSettingsProps) => {
    const {
        hostURL,
        setHostURL,
        masterAPIKey,
        setMasterAPIKey,
        connectMeilisearch,
        connectionInfo,
    } = yutoSettingsProps
    return (
        <Card
            size="medium"
        >
            <CardHeader>
                <Heading level={3}>{__('Connection', 'yuto')}</Heading>
                <ConnectionInfo connectionInfo={connectionInfo} />
            </CardHeader>
            <CardBody>
                <Flex align="start" justify="normal" gap="12">
                    <FlexBlock style={{ flexBasis: "20%" }}>
                        <h2>{__('Configuration', 'yuto')}</h2>
                        <p>{__('Configure the connection between your site and Meilisearch. ', 'yuto')}<a href="https://www.meilisearch.com/docs/learn/security/basic_security" target='_blank'>{__('Get API keys', 'yuto')}</a></p></FlexBlock>
                    <FlexBlock style={{ flexBasis: "80%" }}>
                        <HostURLControl
                            value={hostURL}
                            onChange={(value) => setHostURL(value)}
                        />
                        <MasterAPIKeyControl
                            value={masterAPIKey}
                            onChange={(value) => setMasterAPIKey(value)}
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

const IndicesCard = (yutoSettingsProps) => {
    const {
        connectionInfo,
        meilisearchClient,
        UIDs,
        setUIDs,
        updateUIDs
    } = yutoSettingsProps
    if (!UIDs) {
        return <Spinner />
    }

    const getFeaturedMediaURL = async (id) => {
        try {
            // If post has a featured image, it should be greater than 0
            if (id > 0) {
                // Use apiFetch to get the media object
                const media = await apiFetch({ path: `/wp/v2/media/${id}` });
                // Extract and return the image URL (full size)
                return media.source_url;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching the media:', error);
            return null;
        }
    };

    const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);

    const addDocumentsButtonClick = async (postType, UID) => {
        updateUIDs();
        let postObjects = [];

        const queryParams = { posts_per_page: -1 };

        try {
            const posts = await apiFetch({ path: addQueryArgs(`/wp/v2/${postType}`, queryParams) });

            postObjects = await Promise.all(
                posts.map(async (post) => {
                    // Get the featured media URL for each post
                    const featured_media_url = await getFeaturedMediaURL(post.featured_media);

                    return {
                        id: post.id,
                        title: post.title.rendered,
                        link: post.link,
                        featured_media_url: featured_media_url || '', // Default to an empty string if null
                    };
                })
            );

            // Add documents to Meilisearch
            const res = await meilisearchClient.index(UID).addDocuments(postObjects);
            console.log(res);

            // Show success notice
            createSuccessNotice(
                __(`Documents for ${UID} added successfully.`, 'yuto')
            );

        } catch (error) {
            // Handle any errors
            console.error('Error adding documents to Meilisearch:', error);
            createErrorNotice(
                __(`Error adding documents for ${UID}: ${error.message}`, 'yuto')
            );
        }
    };


    const deleteIndexButtonClick = (UID) => {
        meilisearchClient.deleteIndex(UID)
            .then((res) => {
                console.log(res)
                createErrorNotice(
                    __(`Index with UID: ${UID} deleted.`, 'yuto')
                );
            })
    }

    return (
        <Card>
            <CardHeader>
                <Heading level={3}>{__('Indices', 'yuto')}</Heading>
            </CardHeader>
            {connectionInfo.status ? (
                <>
                    <CardBody>
                        {__('Each index is a collection of documents, similar to a table in a relational database. Here, Posts & Pages are indexes and each posts & pages are the documents.', 'yuto')} <a href='https://www.meilisearch.com/docs/learn/core_concepts/indexes' target='_blank'>{__('Learn more.', 'yuto')}</a>
                    </CardBody>
                    <CardBody>
                        <Flex align="start" justify="normal" gap="12">
                            <FlexBlock style={{ flexBasis: "20%" }}>
                                <h2>{__('Configuration', 'yuto')}</h2>
                                <p>{__('Configure', 'yuto')} <a target='_blank' href='https://www.meilisearch.com/docs/learn/core_concepts/indexes#index-uid'>{__('UID (unique identifier)', 'yuto')}</a> {__('for each index and add documents to each index.', 'yuto')}</p></FlexBlock>
                            <FlexBlock style={{ flexBasis: "80%" }}>
                                <Panel header={__('Indices', 'yuto')}>
                                    <PanelBody title={__('Posts', 'yuto')} icon={<Dashicon icon="admin-post" />} >
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
                                    <PanelBody title={__('Pages', 'yuto')} icon={<Dashicon icon="admin-page" />} initialOpen={false}>
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
                    <p><Dashicon style={{ color: "red" }} icon="dismiss" />{__('Error loading indexes: ', 'yuto') + connectionInfo.error}</p>
                </CardBody>
            )}

        </Card>
    )
}

const TabPanelItems = ({ tab, ...yutoSettingsProps }) => {
    if (tab.name === 'connection') {
        return <MasterAPIKeyCard {...yutoSettingsProps} />
    } else {
        return <IndicesCard {...yutoSettingsProps} />
    }
};

const SettingsTabPanel = () => {
    const yutoSettingsProps = useSettings();

    return (
        <TabPanel
            className="yuto__settings-tab-panel"
            orientation="vertical"
            tabs={[
                {
                    name: 'connection',
                    title: __('Connection', 'yuto'),
                },
                {
                    name: 'indexes',
                    title: __('Indices', 'yuto'),
                },
            ]}
        >
            {
                (tab) => (
                    <TabPanelItems tab={tab} {...yutoSettingsProps} />
                )
            }
        </TabPanel>
    )
};

export { SettingsTitle, SettingsTabPanel };