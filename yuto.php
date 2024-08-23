<?php

/**
 * Plugin Name:       Yuto - Meilisearch Integrator
 * Plugin URI:        https://ponopress.com/plugins/yuto
 * Description:       Turbocharge your website search with lightning-fast and hyper-relevant Meilisearch search engine 
 * Requires at least: 6.3
 * Requires PHP:      7.0
 * Version:           0.0.3
 * Author:            Pono Press
 * Author URI:		  https://ponopress.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       yuto
 * Domain Path:       yuto
 *
 * @package           pono-press
 */

defined('ABSPATH') || exit;

if (! defined('YUTO_PLUGIN_FILE')) {
    define('YUTO_PLUGIN_FILE', __FILE__);
}

if (! class_exists('Yuto')) {
    include_once dirname(YUTO_PLUGIN_FILE) . '/inc/Yuto.php';
}

/**
 * The main function that returns the Yuto class
 *
 * @since 1.0.0
 * @return object|Yuto
 */
function yuto_load_plugin()
{
    return Yuto::instance();
}

// Get the plugin running.
add_action('plugins_loaded', 'yuto_load_plugin');
