// Techmeme-inspired dynamic functionality for The Morning Brief
(function() {
  // Quick jump & date features
  window.addEventListener('DOMContentLoaded', function() {
    var searchForm = document.getElementById('briefSearchForm');
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var q = (document.getElementById('briefSearchInput') || {}).value;
        if (q) {
          window.find ? window.find(q) : alert('Searching for: ' + q);
        }
      });
    }
  });
})();
