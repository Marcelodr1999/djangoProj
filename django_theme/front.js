const loginModal = document.getElementById('loginModalBtn')
const registerBtn = document.getElementById('registerBtn')
const modalMain = document.getElementById("myModal");
const modalInner = document.getElementById("modalInner");
const formDisplay = document.getElementById("loginForm")
const span = document.getElementsByClassName("close")[0];
const returnBtn = document.getElementById('returnBtn');


if(loginModal){
  loginModal.addEventListener('click', function(e) {
    modalMain.style.display="block"
    formDisplay.style.display="block"
})
}

if(span){
  span.onclick = function() {
    modalMain.style.display = "none";
  }
}
if(registerBtn){
  registerBtn.addEventListener('click', function(e) {
    window.location.href="register.html"
  })
}

if(returnBtn){
  returnBtn.addEventListener('click', function(e) {
    window.location.href="index.html"
  })
}






// window.onclick = function(event) {
// if (event.target == modalMain) {
//     modalMain.style.display = "none";
//     formDisplay.style.display="none"
// }
// }