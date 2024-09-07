=== Yuto - Meilisearch Integrator ===
Contributors: ponopress
Tags: search, better search, meilisearch, yuto
Requires at least: 6.3
Tested up to: 6.6
Requires PHP: 7.0
Stable tag: 0.0.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Turbocharge your website search with lightning-fast and hyper-relevant Meilisearch search engine 

== Description ==
Meilisearch is an open-source, blazing-fast, and feature-rich search engine. It's designed to deliver instant search results to your websites with high relevance and speed.⚡️🔎

[Yuto](https://ponopress.com/plugins/yuto/) seamlessly integrates the powerful Meilisearch engine into your website, unlocking lightning-fast search capabilities with hyper-relevant results. With Yuto, your users can enjoy instant search responses, typo-tolerance, customizable ranking rules, and faceted search features provided by Meilisearch. Boost user retention and satisfaction on your website with enhanced search capabilities.

**Lightning-Fast Search ⚡️🔎:** Meilisearch is built to deliver near-instantaneous search results, offering a responsive and efficient search experience.

**Full-Text Search:** Yuto supports advanced full-text search capabilities, including typo tolerance, synonyms, and language support, ensuring users find relevant results even with minor errors or variations in queries.

**Faceted Search:** It supports faceted search, enabling users to filter search results by categories, tags, or other attributes, enhancing the search experience with more precise results.

**Site Editor Blocks:** Yuto is fully compatible with the new Site Editor, offering an Autocomplete Search block for seamless integration and intuitive use. Additional blocks will be available soon.

**WooCommerce Compatible:** Yuto is fully compatible with WooCommerce, making it easy to index your store's products directly into Meilisearch. With Yuto, you can provide your customers with an enhanced search experience, allowing them to quickly find the products they need in your WooCommerce store. 

**Custom Post Types Support:**  Yuto offers extensive support for custom post types, ensuring full compatibility with any plugin that adds custom post types. This integration allows you to easily index various post types directly into Meilisearch. By using Yuto, you can enhance your customers' search experience across all post types, seamlessly working with plugins such as Easy Digital Downloads, BuddyPress, and others.

**Support and Continuous Development**

Reliable support to promptly addressing any issues you encounter. 

Have an idea for more feature? Let us know in the plugin support forum.

[Yuto Usage Guide](https://ponopress.com/guides/yuto/)

[Support Forum](https://wordpress.org/support/plugin/yuto/)

== Installation ==

= Automatic installation =

Automatic installation is the easiest option -- WordPress will handle the file transfer, and you won't need to leave your web browser. 

To do an automatic install of WooCommerce, log in to your WordPress dashboard, then follow the instructions below:

1. Navigate to **Plugins > Add New.**
2. Use the search form in the top-right and type **"Yuto - Meilisearch Integrator"**
3. On the search results that appear, click the **Install Now** button to install the plugin.
4. Once the plugin installation is complete, click **Activate** to activate the plugin.

= Manual installation =

Here are the detailed instructions to manually install a WordPress plugin by transferring the files onto the webserver. 

1. Download the plugin zip file from the [WordPress Plugin Directory](https://wordpress.org/plugins/yuto-meilisearch-integrator/) and unzip it locally.
2. Transfer the extracted folder to the `wp-content/plugins` directory of your WordPress site via SFTP or remote file manager.
3. From the Plugins menu in the Administration Screen, click Activate for the transferred plugin.

The WordPress codex contains [instructions on how to do this here](https://wordpress.org/documentation/article/manage-plugins/#finding-and-installing-plugins-1).

== Changelog ==

= 0.0.4 =
* Include featured images in the default search results.
* Index documents during post updates, deletions, and bulk edits.
* Display a loading indicator while indexing and deleting documents.
* Enable indexing for all available post types, excluding default types like `navigation`, `media` and so on.
* Add support for WooCommerce
* Add autocomplete theme color option for block

= 0.0.3 =
* Fix open on focus option in **Autocomplete Search** block
* Show image on result template
* Add classes as per Alogila classic theme rule
* Add option for search result panel placement

= 0.0.2 =
* Update readme file
* Add settings link and other row meta links
* Change block icons
* Add `uninstall.php` to delete options on plugin deletion

= 0.0.1 =
* Initial release
