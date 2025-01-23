// import { DisplayLabel } from './components/DisplayLabel';

let Main = {
  init: async function () {
    // initialize demo javascript component - async/await invokes some
    //  level of babel transformation
    const displayLabel = new DisplayLabel();
    await displayLabel.init();
  },
};

// Main.init();
$(function () {
  $(document).on("change", "input[type=radio]", function () {
    const currentItem = $(this);
    var $form = $(this).closest("form.variations_form");
    // Enable Add to cart:
    const add_to_cart_btn = $form.find(".single_add_to_cart_button");
    if (add_to_cart_btn.hasClass("disabled")) {
      add_to_cart_btn.removeClass("disabled wc-variation-selection-needed");
    }
    const button_wrapper = add_to_cart_btn.closest(
      ".woocommerce-variation-add-to-cart"
    );

    button_wrapper.find('input[name="variation_id"]').val(currentItem.val());
    var attribute_name = $(this).attr("name").toLowerCase();
    var value = $(this).data("var_name");
    $form
      .find('select[name="' + attribute_name + '"]')
      .val(value)
      .trigger("change");
    $form.find('select[name="' + attribute_name + '"]').prop("selected", true);
    $form.trigger("check_variations");

    // change show prices
    $('.variation_price').html(`  $${currentItem.data('price')}`)
  });

  $("form.variations_form").on("submit", function (e) {
    e.preventDefault();

    const product_id = $('input[name="product_id"]').val();
    const variation_id = $('input[name="variation_id"]').val();
    const quantity = $('input[name="quantity"]').val();

    // Collect selected attributes
    var attributes = {};
    let variationName = '';
    $('select[name^="attribute_"]').each(function () {
      const attribute_name = $(this).attr("name");
      const attribute_value = $(this).val();
      variationName = attribute_value;

      if (attribute_value) {
        attributes[attribute_name] = attribute_value;
      }
    });

    // Ensure all required fields are filled
    if (
      !product_id ||
      !variation_id ||
      !quantity ||
      Object.keys(attributes).length === 0
    ) {
      alert("Please select all required options.");
      return;
    }

    // AJAX data
    var data = {
      action: "woocommerce_variable_add_to_cart",
      product_id: product_id,
      variation_id: variation_id,
      quantity: quantity,
      attributes: attributes,
    };

    // Send AJAX request
    $.post("/wp-admin/admin-ajax.php", data, function (response) {
      if (response.success) {
        showViewCart(variationName)
      } else {
        alert("Failed to add product to cart: " + response.data);
      }
    }).fail(function (xhr, status, error) {
      console.error("AJAX Error:", status, error);
      alert("An error occurred while adding the product to the cart.");
    });
  });

  const showViewCart = (variationName) =>  {
    $('.variation-name').html(variationName);
    $('.view-cart').fadeIn();
    const cartUrl = window.location.origin + '/cart';
    $('.cart-url').attr('href', cartUrl);
  }
});

