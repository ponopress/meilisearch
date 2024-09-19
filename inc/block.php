<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function yuto_block_init() {
	register_block_type( YUTO_ABSPATH . 'build/blocks/autocomplete' );
	register_block_type( YUTO_ABSPATH . 'build/blocks/instant-search' );
}
add_action( 'init', 'yuto_block_init' );

// Enqueue your script
function yuto_enqueue_script() {
	$yuto_settings = get_option('yuto_settings'); 
	// Passing searchKey from localization since it's saved on `options` table
	// and apiFetch for data there can't be done for logged out user.
    wp_localize_script('yuto-meilisearch-view-script', 'yutoViewData', array(
        'searchAPIKey' => $yuto_settings['searchAPIKey'],
        'host' => esc_url( $yuto_settings['hostURL'] )
    ));
}
add_action('wp_enqueue_scripts', 'yuto_enqueue_script');
