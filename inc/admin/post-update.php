<?php
//     $yutoSettings = get_option('yuto_settings');
// echo "<pre>"; var_dump( $yutoSettings); die;
function index_post_to_meilisearch($post_id, $post, $update)
{
    // Avoid indexing revisions and autosaves
    if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
        return;
    }

    // Only index posts with status 'publish'
    if ($post->post_status !== 'publish') {
        return;
    }

    // Prepare the data for Meilisearch
    $post_data = [
        'id'      => $post_id,
        'title'   => get_the_title($post_id),
        'link' => get_permalink($post_id),
        'featured_media_url'   => get_the_post_thumbnail_url($post_id, 'full')
    ];

    $yutoSettings = get_option('yuto_settings');

    // Ensure yuto_settings and defaultPostTypesUIDs are available and valid
    if (isset($yutoSettings['defaultPostTypesUIDs'])) {
        // Get the post type
        $post_type = $post->post_type;

        // Get the index name from settings based on post type
        if (isset($yutoSettings['defaultPostTypesUIDs'][$post_type])) {
            $indexName = $yutoSettings['defaultPostTypesUIDs'][$post_type];

            // Initialize Meilisearch client with the appropriate index name
            $meilisearch_client = new Yuto_Meilisearch_Client($indexName);

            // Index the document
            $result = $meilisearch_client->index_document($post_data);

            if ($result) {
                // Log or handle successful indexing if needed
                error_log('Document indexed successfully!');
            } else {
                // Log or handle failure if needed
                error_log('Failed to index the document.');
            }
        } else {
            // Handle case where post type is not in settings
            error_log('Post type not found in Meilisearch settings.');
        }
    } else {
        // Handle case where yuto_settings or defaultPostTypesUIDs is not set
        error_log('Meilisearch settings not configured correctly.');
    }
}

// Hook into the save_post action
add_action('save_post', 'index_post_to_meilisearch', 10, 3);

