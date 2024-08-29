<?php

/**
 * Handles the indexing and deleting of posts
 *
 * @package yuto
 * @since   0.0.3
 */

namespace Yuto\Admin;

defined('ABSPATH') || exit;

/**
 * Internal dependencies
 */
use Yuto_Meilisearch_Client;

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

            if (! $result) {
                // Log or handle failure if needed
                error_log(__('Failed to index the document.', 'yuto'));
            }
        } else {
            // Handle case where post type is not in settings
            error_log(__('Post type not found in Meilisearch settings.', 'yuto'));
        }
    } else {
        // Handle case where yuto_settings or defaultPostTypesUIDs is not set
        error_log(__('Meilisearch settings not configured correctly.', 'yuto'));
    }
}

// Hook into the wp_after_insert_post action
add_action('wp_after_insert_post',  __NAMESPACE__ . '\index_post_to_meilisearch', 10, 3);

/**
 * Deletes a post from Meilisearch when it is deleted in WordPress.
 *
 * @param int $post_id The ID of the post being deleted.
 */
function delete_post_from_meilisearch($post_id, $previous_status)
{
    $yutoSettings = get_option('yuto_settings');

    // Ensure yuto_settings and defaultPostTypesUIDs are available and valid
    if (isset($yutoSettings['defaultPostTypesUIDs'])) {
        // Get the post type
        $post_type = get_post_type($post_id);
        $post_status = get_post_status($post_id);

        // Get the index name from settings based on post type
        if (isset($yutoSettings['defaultPostTypesUIDs'][$post_type]) && $post_status == 'publish') {
            $indexName = $yutoSettings['defaultPostTypesUIDs'][$post_type];

            /// Instantiate your Meilisearch client
            $meilisearch_client = new Yuto_Meilisearch_Client($indexName);

            // Delete the document from Meilisearch
            $result = $meilisearch_client->delete_document($post_id);

            if (! $result) {
                // Log or handle failure if needed
                error_log(__('Failed to delete the document.', 'yuto'));
            }
        } else {
            // Handle case where post type is not in settings
            error_log(__('Post type not found in Meilisearch settings.', 'yuto'));
        }
    } else {
        // Handle case where yuto_settings or defaultPostTypesUIDs is not set
        error_log(__('Meilisearch settings not configured correctly.', 'yuto'));
    }
}
add_action('wp_trash_post',  __NAMESPACE__ . '\delete_post_from_meilisearch', 10, 2);
