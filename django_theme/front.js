const loginModal = document.getElementById('loginModalBtn')
const registerBtn2 = document.getElementById('createBtn')
const modalMain = document.getElementById("myModal");
const modalInner = document.getElementById("modalInner");
const formDisplay = document.getElementById("loginForm")
const span = document.getElementsByClassName("close")[0];
const span2 = document.getElementsByClassName("regClose")[0];
const returnBtn = document.getElementById('returnBtn');
const settingBtn = document.getElementById('settingBtn')

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
if(span2){
  span2.onclick = function() {
    window.location.href=("landing.html")
  }
}
if(registerBtn2){
  registerBtn2.addEventListener('click', function(e) {
    window.location.href="register.html"
  })
}

if(returnBtn){
  returnBtn.addEventListener('click', function(e) {
    window.location.href="index.html"
  })
}
