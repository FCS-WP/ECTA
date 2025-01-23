<?php 

add_action('wp_ajax_woocommerce_variable_add_to_cart', 'handle_variable_add_to_cart');
add_action('wp_ajax_nopriv_woocommerce_variable_add_to_cart', 'handle_variable_add_to_cart');

function handle_variable_add_to_cart() {
    // Ensure required data is present
    if (empty($_POST['product_id']) || empty($_POST['variation_id']) || empty($_POST['quantity']) || empty($_POST['attributes'])) {
        wp_send_json_error('Missing required parameters.', 400);
    }

    $product_id = intval($_POST['product_id']);
    $variation_id = intval($_POST['variation_id']);
    $quantity = intval($_POST['quantity']);
    $attributes = wc_clean($_POST['attributes']);

    // Attempt to add variation to cart
    $added = WC()->cart->add_to_cart($product_id, $quantity, $variation_id, $attributes);

    if ($added) {
        wp_send_json_success(['cart_item_key' => $added], 200);
    } else {
        wp_send_json_error('Failed to add product to cart.', 400);
    }
}