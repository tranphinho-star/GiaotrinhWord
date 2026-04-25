// Auth guard - redirect to login if not authenticated
(function() {
  if (sessionStorage.getItem('word_auth') !== 'true') {
    window.location.href = 'login.html';
  }
})();
