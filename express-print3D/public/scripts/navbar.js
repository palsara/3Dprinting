
function openNav() {
  document.getElementById('mySidebar').style.right = '0';
  document.querySelector('.header').style.marginRight = '300px';
  document.querySelector('nav').style.marginRight = '300px';
  document.querySelector('.openbtn').style.display = 'none';
  document.querySelector('.dropdown-user').style.display = 'none';
  document.querySelector('.dropdown-user').setAttribute.disabled = 'disabled';
}

function closeNav() {
  document.getElementById('mySidebar').style.right = '-300px';
  document.querySelector('.header').style.marginRight = '0';
  document.querySelector('nav').style.marginRight = '0';
  document.querySelector('.openbtn').style.display = 'block';
  document.querySelector('.dropdown-user').setAttribute.disabled = 'enabled';
}

const dropdown = document.getElementsByClassName('dropdown-btn');
let i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener('click', function () {
    this.classList.toggle('active');
    const dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === 'block') {
      dropdownContent.style.display = 'none';
    } else {
      dropdownContent.style.display = 'block';
    }
  });
}
