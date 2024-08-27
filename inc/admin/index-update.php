<?php

/**
 * Handle document indexing on post update
 *
 * @package yuto
 * @since   0.0.4
 */

namespace Yuto\Admin;

defined('ABSPATH') || exit;

// add_action('wp_ajax_handle_post_update',  __NAMESPACE__ . '\handle_post_update');
// add_action('wp_ajax_nopriv_handle_post_update',  __NAMESPACE__ . '\handle_post_update');

function handle_post_update() {
    // Verify nonce
    // if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'post_update_nonce')) {
    //     wp_send_json_error('Nonce verification failed');
    // }
    var_dump($_POST['post_id'] );
    // Check if post ID is provided
    if (!isset($_POST['post_id'])) {
        wp_send_json_error('No post ID provided');
    }

    $post_id = intval($_POST['post_id']);

    // Respond with the post ID
    wp_send_json_success(array('post_id' => $post_id));
}


function on_post_update($post_id, $post_after, $post_before) {
    // Avoid running on auto-save or for revisions
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (wp_is_post_revision($post_id)) {
        return;
    }

    // Prepare the AJAX request
    $response = wp_remote_post(admin_url('admin-ajax.php'), array(
        'method'    => 'POST',
        'body'      => array(
            'action'   => 'handle_post_update', // The AJAX action hook
            'post_id'  => $post_id,
            // 'nonce'    => wp_create_nonce('post_update_nonce') // Add nonce for security
        ),
        'timeout'   => 45,
        'headers'   => array(
            'Content-Type' => 'application/x-www-form-urlencoded',
        ),
    ));

    echo '<pre>';

    var_dump( admin_url('admin-ajax.php') ); 
    var_dump( $response); 
    die;

    if (is_wp_error($response)) {
        error_log('Failed to send AJAX request: ' . $response->get_error_message());
    }
}


// add_action('save_post',  __NAMESPACE__ . '\on_post_update', 10, 3);

/**
 * Enqueue admin scripts and localize nonce
 *
 * @param string $hook_suffix The current admin page hook suffix
 * @return void
 */
function enqueue_admin_scripts($hook_suffix) {
    // Check if we are on the correct admin page
    if ($hook_suffix !== 'post.php' && $hook_suffix !== 'edit.php') {
        return;
    }

    $asset_file = YUTO_ABSPATH . 'build/post-update/index.asset.php';

    if (! file_exists($asset_file)) {
        return;
    }

    $asset = include $asset_file;

    // Enqueue the script
    wp_enqueue_script(
        'yuto-admin-script',
        YUTO_PLUGIN_URL . 'build/post-update/index.js',
        array('jquery', 'wp-hooks'), // Ensure jQuery is loaded
        $asset['version'],
        true // Load script in footer
    );

    // Generate a nonce
    $nonce = wp_create_nonce('post_update_nonce');

    // Localize the script with AJAX URL and nonce
    wp_localize_script('yuto-admin-script', 'yutoData', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => $nonce
    ));
}

add_action('admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_admin_scripts');
add_action( 'save_post', function() {
    sleep( 5 );
} );