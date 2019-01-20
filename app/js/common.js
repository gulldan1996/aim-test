$(function() { 
  var navMain = document.querySelector('.categories');
  var menuToggle = document.querySelector('.menuToggle');
  
  menuToggle.addEventListener('click', function() {
    if(navMain.classList.contains('categories-closed')) {
      navMain.classList.remove('categories-closed');
      navMain.classList.add('categories-opened');
    } else {
      navMain.classList.add('categories-closed');
      navMain.classList.remove('categories-opened');
    }
  });
  window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
      if(navMain.classList.contains('categories-opened')) {
        navMain.classList.remove('categories-opened');
        navMain.classList.add('categories-closed');
      }
    }
  });
});

