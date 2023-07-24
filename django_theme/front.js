const loginModal = document.getElementById('loginModalBtn')
const registerBtn = document.getElementById('registerBtn')
const modalMain = document.getElementById("myModal");
const modalInner = document.getElementById("modalInner");
const formDisplay = document.getElementById("loginForm")
const span = document.getElementsByClassName("close")[0];

loginModal.addEventListener('click', function(e) {
    modalMain.style.display="block"
    formDisplay.style.display="block"
})

span.onclick = function() {
    modalMain.style.display = "none";
  }

  registerBtn.addEventListener('click', function(e) {
    window.location.href="register.html"
  })



// window.onclick = function(event) {
// if (event.target == modalMain) {
//     modalMain.style.display = "none";
//     formDisplay.style.display="none"
// }
// }