<?php
/**
 * Plugin Name:       Yuto
 * Plugin URI:        https://ponopress.com/plugins/meilisearch
 * Description:       WordPress plugin for Meilisearch
 * Requires at least: 6.3
 * Requires PHP:      7.0
 * Version:           0.0.1
 * Author:            ponopress
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       meilisearch
 * Domain Path:       meilisearch
 *
 * @package           pono-press
 */

 defined( 'ABSPATH' ) || exit;

 if ( ! defined( 'YUTO_PLUGIN_FILE' ) ) {
	 define( 'YUTO_PLUGIN_FILE', __FILE__ );
 }
 
 if ( ! class_exists( 'MeiliSearch' ) ) {
	 include_once dirname( YUTO_PLUGIN_FILE ) . '/inc/Meilisearch.php';
 }
 
 /**
  * The main function that returns the MeiliSearch class
  *
  * @since 1.0.0
  * @return object|Meilisearch
  */
 function meilisearch_load_plugin() {
	 return Meilisearch::instance();
 }
 
 // Get the plugin running.
 add_action( 'plugins_loaded', 'meilisearch_load_plugin' );
