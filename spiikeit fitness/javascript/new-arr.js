const filterButtons = document.querySelectorAll('.sport-filter-btn');
const productItems = document.querySelectorAll('.product-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Active button styling
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        productItems.forEach(item => {
            if(filter === 'all') {
                // Show only one card per category on page load
                if(item.style.display === "none" || item.dataset.category) {
                    item.style.display = "none"; // hide all first
                }
                // Show first of each category
                let firstOfCategory = [...productItems].filter(i => i.dataset.category === item.dataset.category && i.style.display === "none")[0];
                if(firstOfCategory) firstOfCategory.style.display = "block";
            } else {
                item.style.display = (item.getAttribute('data-category') === filter) ? "block" : "none";
            }
        });
    });
});
