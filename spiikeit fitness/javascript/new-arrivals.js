
  const sportBtns = document.querySelectorAll('.sport-filter-btn');
  const products = document.querySelectorAll('.product-item');

  sportBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sportBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      products.forEach(p => {
        if (filter === 'all' || p.dataset.category === filter) {
          p.style.display = 'block';
        } else {
          p.style.display = 'none';
        }
      });
    });
  });

