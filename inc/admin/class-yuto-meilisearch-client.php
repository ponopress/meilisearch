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
    private $baseUrl;

    public function __construct($indexName)
    {
        $yutoSettings = get_option('yuto_settings');
        $this->host = rtrim($yutoSettings['hostURL'], '/');
        $this->indexName = urlencode($indexName);
        $this->apiKey = $yutoSettings['masterAPIKey'];
        $this->baseUrl = "{$this->host}/indexes/{$this->indexName}";
    }

    // Function to create an index if it doesn't exist
    private function create_index()
    {
        $url = $this->baseUrl;

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
        $url = "{$this->baseUrl}/documents";

        $response = wp_remote_post($url, [
            'body' => json_encode([$document]),
            'headers' => $this->get_headers(),
        ]);

        return wp_remote_retrieve_response_code($response) === 202;
    }

    // Function to delete a document by ID
    public function delete_document($document_id)
    {
        $url = "{$this->baseUrl}/documents/" . urlencode($document_id);

        $response = wp_remote_request($url, [
            'method' => 'DELETE',
            'headers' => $this->get_headers(),
        ]);

        return wp_remote_retrieve_response_code($response) === 204;
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
