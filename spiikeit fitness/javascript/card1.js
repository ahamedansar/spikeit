
$(document).ready(function() {
    // 1. Add to Cart button functionality
    $('.add-to-cart-overlay-alt button').on('click', function(e) {
        e.stopPropagation(); // Prevents clicking the card link underneath
        var productName = $(this).closest('.product-card').find('.card-title').text();
        console.log("Added '" + productName + "' from WEEKLY PRICE DROP to cart!");
        // Add your AJAX cart update logic here
    });

    // 2. Simple Wishlist icon hover effect (Optional)
    $('.wishlist-icon').hover(
        function() {
            $(this).find('i').removeClass('bi-heart').addClass('bi-heart-fill text-danger');
        },
        function() {
            $(this).find('i').removeClass('bi-heart-fill text-danger').addClass('bi-heart');
        }
    );
});
