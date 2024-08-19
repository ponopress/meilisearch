<?php
/**
 * Uninstall Yuto
 *
 * Deletes all plugin settings. Does not currently remove block attributes.
 *
 * @package block-visibility
 * @since   1.0.0
 */

namespace BlockVisibility;

// Exit if accessed directly.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Load main plugin file.
require_once 'yuto.php';

global $wpdb;

$yuto_settings = get_option( 'yuto_settings' );

// Delete all Yuto settings.
if ( $yuto_settings['plugin_settings']['remove_on_uninstall'] ) {
	delete_option( 'yuto_settings' );
}
