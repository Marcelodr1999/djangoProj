const submitbtn = document.getElementById('msgsubmit');
const submitinput = document.getElementById('msgid');
const registerbtn = document.getElementById('registerForm');


//login
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('loginEmail');
const passwordInput = document.getElementById('loginPassword');
const loginsubmit = document.getElementById('loginsubmit')
// const csrfTokenInput = document.getElementById('csrfTokenInput');

// function getCookie(name) {
//   const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
//   return cookieValue ? cookieValue.pop() : '';
// }

//  const csrfToken = getCookie('csrftoken');
//csrfTokenInput.value = csrfToken


const createPost = () => {
  const url = 'http://127.0.0.1:8000/display/'; 
  const data = {
    message: submitinput.value,
    msg_date: new Date().toISOString(),
    user_id: 2,
  };
    
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'X-CSRFToken': csrfToken
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the server
      console.log(data);
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error(error);
    });
};

//REGISTER
const register = (data) => {
  const url = 'http://127.0.0.1:8000/register/';
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(responseData => {
    console.log(responseData);
    // Handle the response from the server
    if (responseData.success) {
      // Registration successful
    } else {
      // Registration failed
    }
  })
  .catch(error => {
    console.error(error);
    // Handle any errors that occur during the request
  });
};

// registerbtn.addEventListener('submit', function(event) {
//   event.preventDefault(); // Prevent the form from submitting normally
//   const email = document.getElementById('registerUsername').value;
//   const password = document.getElementById('registerPassword').value;
//   // Perform validation on the input values if necessary
  
//   // Make the registration API call
//   const data = {
//     email: email,
//     password: password
//   };
//   register(data);
// });
  

// submitbtn.addEventListener('submit', function(e) {
//   e.preventDefault();
//   // const apicall = await msgsubmit('http://127.0.0.1:8000/display/')
//   // console.log(apicall)
//   createPost();
// })


//login



const login = () => {
  const url = 'http://127.0.0.1:8000/login/';  
  const data = {
    email: emailInput.value,
    password: passwordInput.value
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Login successful, redirect to the dashboard or another page
      const successElement = document.getElementById('loginSuccess');
      successElement.textContent = data.message;
      successElement.style.display = 'block';
      errorElement.style.display = 'none';
      // fetch('http://127.0.0.1:8000/loggedin_user/')
      //   .then(response => response.json())
      //   .then(data => {
      //     const email_display = data.email;
      //     document.getElementById('email_display').textContent = email_display;
      //   });
      
      //window.location.href = 'http://127.0.0.1:5500/django_theme/index.html';
        // Replace with the desired page URL
    } else {
      // Login failed, display error message
      const errorElement = document.getElementById('loginError');
      errorElement.textContent = data.message;
      errorElement.style.display = 'block';
    }
  })
  .catch(error => {
    console.error(error);
    // Handle any errors that occur during the request
  });
};

loginsubmit.addEventListener('submit', function(e) {
  e.preventDefault();
  login();
});

