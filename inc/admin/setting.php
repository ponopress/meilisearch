<?php

/**
 * Add the plugin settings page.
 *
 * @package yuto
 * @since   0.0.1
 */

namespace Yuto\Admin;

defined('ABSPATH') || exit;

/**
 * Register the plugin settings page.
 *
 * @since 0.0.1
 */
function add_settings_page()
{
    add_menu_page(
        __('Yuto', 'yuto'),
        __('Yuto', 'yuto'),
        'manage_options',
        'yuto-settings',
        __NAMESPACE__ . '\print_settings_page',
        'dashicons-search'
    );
}
add_action('admin_menu', __NAMESPACE__ . '\add_settings_page');

/**
 * Print the settings page wrapper div. Content is generated via JSX.
 *
 * @since 0.0.1
 */
function print_settings_page()
{
?>
    <div class="wrap" id="yuto-settings"></div>
<?php
}

function enqueue_settings_assets($admin_page)
{
    if ('toplevel_page_yuto-settings' !== $admin_page) {
        return;
    }

    $asset_file = YUTO_ABSPATH . 'build/settings/index.asset.php';

    if (! file_exists($asset_file)) {
        return;
    }

    $asset = include $asset_file;

    wp_enqueue_script(
        'yuto',
        YUTO_PLUGIN_URL . 'build/settings/index.js',
        $asset['dependencies'],
        $asset['version'],
        array(
            'in_footer' => true,
        )
    );
    wp_enqueue_style(
        'yuto',
        YUTO_PLUGIN_URL . 'build/settings/index.css',
        array_filter(
            $asset['dependencies'],
            function ($style) {
                return wp_style_is($style, 'registered');
            }
        ),
        $asset['version'],
    );
}

add_action('admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_settings_assets');

function register_settings()
{
    $default = array(
        'hostURL' => '',
        'searchAPIKey' => '',
        'masterAPIKey' => '',
        'adminAPIKey' => '',
        'defaultPostTypesUIDs' => (object)array(
            'posts' => 'post',
            'pages' => 'page'
        )
    );

    $schema  = array(
        'type'       => 'object',
        'properties' => array(
            'searchAPIKey' => array(
                'type' => 'string',
            ),
            'adminAPIKey' => array(
                'type' => 'string',
            ),
            'hostURL' => array(
                'type' => 'string',
            ),
            'masterAPIKey' => array(
                'type' => 'string',
            ),
            'defaultPostTypesUIDs' => array(
                'type'       => 'object',
                'additionalProperties' => array('type' => 'string'),
            ),
        ),
    );
    register_setting(
        'options',
        'yuto_settings',
        array(
            'type'         => 'object',
            'default'      => $default,
            'show_in_rest' => array(
                'schema' => $schema,
            ),
        )
    );
}

add_action('init', __NAMESPACE__ . '\register_settings');
