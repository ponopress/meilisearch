<?php

/**
 * Yuto Meilisearch Indexer
 *
 * Class to connect to Meilisearch server from PHP and handle indexing
 *
 * @package yuto
 * @since   0.0.3
 */

defined('ABSPATH') || exit;

class Yuto_Meilisearch_Client
{

    private $host;
    private $indexName;
    private $apiKey;

    public function __construct($indexName)
    {
        $yutoSettings = get_option('yuto_settings');
        $this->host = $yutoSettings['hostURL'];
        $this->indexName = $indexName;
        $this->apiKey = $yutoSettings['masterAPIKey'];

        // Optional: Initialize the index if it doesn't exist
        // $this->create_index();
    }

    // Function to create an index if it doesn't exist
    private function create_index()
    {
        $url = $this->host . '/indexes/' . urlencode($this->indexName);

        $response = wp_remote_get($url, [
            'headers' => $this->get_headers()
        ]);

        if (wp_remote_retrieve_response_code($response) !== 200) {
            $body = json_encode(['uid' => $this->indexName]);
            wp_remote_post($this->host . '/indexes', [
                'body' => $body,
                'headers' => $this->get_headers(),
            ]);
        }
    }

    // Function to index a document
    public function index_document($document)
    {
        $url = $this->host . '/indexes/' . urlencode($this->indexName) . '/documents';

        $response = wp_remote_post($url, [
            'body' => json_encode([$document]),
            'headers' => $this->get_headers(),
        ]);

        return wp_remote_retrieve_response_code($response) === 202;
    }

    // Helper function to get headers with authorization
    private function get_headers()
    {
        $headers = [
            'Content-Type' => 'application/json',
        ];

        if (!empty($this->apiKey)) {
            $headers['Authorization'] = 'Bearer ' . $this->apiKey;
        }

        return $headers;
    }
}
