<?php
/**
 * Add the plugin settings page.
 *
 * @package meilisearch
 * @since   1.0.0
 */

namespace Meilisearch\Admin;

defined( 'ABSPATH' ) || exit;

/**
 * Register the plugin settings page.
 *
 * @since 1.0.0
 */
function add_settings_page() {
	add_submenu_page(
		'options-general.php',
		__( 'Meilisearch', 'meilisearch' ),
		__( 'Meilisearch', 'meilisearch' ),
		'manage_options',
		'meilisearch-settings',
		__NAMESPACE__ . '\print_settings_page'
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\add_settings_page' );

/**
 * Print the settings page wrapper div. Content is generated via JSX.
 *
 * @since 1.0.0
 */
function print_settings_page() {
	?>
		<div class="wrap" id="meilisearch-settings"></div>
	<?php
}

function enqueue_settings_assets( $admin_page ) {
    if ( 'settings_page_meilisearch-settings' !== $admin_page ) {
        return;
    }

    $asset_file = MS_ABSPATH . 'build/settings/index.asset.php';

    if ( ! file_exists( $asset_file ) ) {
        return;
    }

    $asset = include $asset_file;

    wp_enqueue_script(
        'unadorned-announcement-bar-script',
        MS_PLUGIN_URL. 'build/settings/index.js',
        $asset['dependencies'],
        $asset['version'],
        array(
            'in_footer' => true,
        )
    );
}

add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_settings_assets' );