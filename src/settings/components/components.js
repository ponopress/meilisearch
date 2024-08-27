import { __ } from '@wordpress/i18n';

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

const AddDocumentsButton = ({ UID, onClick, documentAddingState }) => {
    return (
        <Button
            variant="primary"
            onClick={onClick}
            disabled={documentAddingState === 'inProgress'}
            __next40pxDefaultSize>
            {documentAddingState === 'inProgress' ? (
                <>
                    <Spinner />
                    <span> {__('Adding...', 'yuto')}</span>
                </>
            ) : (
                __('Add Documents', 'yuto')
            )}
        </Button>
    );
};

const DeleteIndexButton = ({ onClick, indexDeletingState }) => {
    return (
        <Button
            variant="secondary"
            isDestructive
            onClick={onClick}
            disabled={indexDeletingState === 'inProgress'}
            __next40pxDefaultSize>
            {indexDeletingState === 'inProgress' ? (
                <>
                    <Spinner />
                    <span> {__('Deleting...', 'yuto')}</span>
                </>
            ) : (
                __('Delete Index', 'yuto')
            )}
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
        UIDs,
        setUIDs,
        addDocuments,
        deleteIndex,
        documentAddingState,
        indexDeletingState
    } = yutoSettingsProps
    if (!UIDs) {
        return <Spinner />
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
                                            value={UIDs.post}
                                            onChange={(value) => setUIDs((prevUIDs) => ({
                                                ...prevUIDs,
                                                post: value
                                            }))}
                                        />
                                        <Flex>
                                            <AddDocumentsButton documentAddingState={documentAddingState[UIDs.post]} onClick={() => addDocuments('posts', UIDs.post)} />
                                            <DeleteIndexButton indexDeletingState={indexDeletingState[UIDs.post]} onClick={() => deleteIndex(UIDs.post)} />
                                        </Flex>
                                    </PanelBody>
                                    <PanelBody title={__('Pages', 'yuto')} icon={<Dashicon icon="admin-page" />} initialOpen={false}>
                                        <IndexUIDControl
                                            placeholder="page"
                                            value={UIDs.page}
                                            onChange={(value) => setUIDs((prevUIDs) => ({
                                                ...prevUIDs,
                                                page: value
                                            }))}
                                        />
                                        <Flex>
                                            <AddDocumentsButton documentAddingState={documentAddingState[UIDs.page]} onClick={() => addDocuments('pages', UIDs.page)} />
                                            <DeleteIndexButton indexDeletingState={indexDeletingState[UIDs.page]} onClick={() => deleteIndex(UIDs.page)} />
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