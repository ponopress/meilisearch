<?php
/**
 * Setup Meilisearch
 *
 * @package meilisearch
 * @since   1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Main Meilisearch Class.
 *
 * @since 1.0.0
 */
final class Meilisearch {

	/**
	 * Return singleton instance of the Meilisearch plugin.
	 *
	 * @since 1.0.0
	 * @return Meilisearch
	 */
	public static function instance() {
		static $instance = false;

		if ( ! $instance ) {
			$instance = new self();
		}
		return $instance;
	}

	/**
	 * Cloning instances of the class is forbidden.
	 *
	 * @since 1.0.0
	 */
	public function __clone() {
		_doing_it_wrong(
			__FUNCTION__,
			esc_html__( 'Cloning instances of the class is forbidden.', 'meilisearch' ),
			'1.0'
		);
	}

	/**
	 * Unserializing instances of the class is forbidden.
	 *
	 * @since 1.0.0
	 */
	public function __wakeup() {
		_doing_it_wrong(
			__FUNCTION__,
			esc_html__( 'Unserializing instances of the class is forbidden.', 'meilisearch' ),
			'1.0'
		);
	}

	/**
	 * Initialise the plugin.
	 */
	private function __construct() {
		$this->define_constants();
		$this->includes();
		$this->actions();
	}

	/**
	 * Load required actions.
	 *
	 * @since 1.0.0
	 */
	public function actions() {
	}

	/**
	 * Include required files.
	 *
	 * @since 1.0.0
	 */
	public function includes() {
		include_once YUTO_ABSPATH . 'inc/block.php';
		include_once YUTO_ABSPATH . 'inc/admin/setting.php';
	}

	/**
	 * Define the contants for the Meilisearch plugin.
	 *
	 * @since 1.4.0
	 */
	private function define_constants() {
		$this->define( 'YUTO_ABSPATH', dirname( YUTO_PLUGIN_FILE ) . '/' );
		$this->define( 'YUTO_VERSION', get_file_data( YUTO_PLUGIN_FILE, [ 'Version' ] )[0] ); // phpcs:ignore
		$this->define( 'YUTO_PLUGIN_URL', plugin_dir_url( YUTO_PLUGIN_FILE ) );
		$this->define( 'YUTO_PLUGIN_BASENAME', plugin_basename( YUTO_PLUGIN_FILE ) );
	}

	/**
	 * Define constant if not already set.
	 *
	 * @since 1.4.0
	 *
	 * @param string      $name  Constant name.
	 * @param string|bool $value Constant value.
	 */
	private function define( $name, $value ) {
		if ( ! defined( $name ) ) {
			// phpcs:ignore
			define( $name, $value );
		}
	}
}
