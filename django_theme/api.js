const submitbtn = document.getElementById('msgsubmit');
const submitinput = document.getElementById('msgid');
const registerbtn = document.getElementById('registerForm');
const form = document.getElementById('formId')

//login
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('loginEmail');
const passwordInput = document.getElementById('loginPassword');
const loginsubmit = document.getElementById('loginsubmit')
const successElement = document.getElementById('loginSuccess');
const errorElement = document.getElementById('loginError');


// const csrfTokenInput = document.getElementById('csrfTokenInput');

// function getCookie(name) {
//   const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
//   return cookieValue ? cookieValue.pop() : '';
// }

//  const csrfToken = getCookie('csrftoken');
//csrfTokenInput.value = csrfToken


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
      // Login successful
      sessionStorage.setItem('email', data.email);
      sessionStorage.setItem('id', data.id);
      window.location.href = "http://127.0.0.1:5500/django_theme/index.html";
      console.log(data)
      
      successElement.textContent = data.message;
      successElement.style.display = 'block';
      errorElement.style.display = 'none';

    } else {
      // Login failed, display error message
      console.log(data)
      
      errorElement.textContent = data.message;
      errorElement.style.display = 'block';
    }
  })
  .catch(error => {
    console.error(error);
    // Handle any errors that occur during the request
  });
};

window.onload = function() {
  // Retrieve the email from session or local storage
  const email = sessionStorage.getItem('email');
  
  // Display the email on the page
  
  if (document.getElementById('email_display')) {
    const email_display = document.getElementById('email_display');
    email_display.textContent = email;
  }
};


if(loginsubmit){
  loginsubmit.addEventListener('click', function(e) {
    e.preventDefault();
    login();
  });
}

const createPost = () => {
  const userid = sessionStorage.getItem('id');
  console.log('Inside createPost function');
  const url = 'http://127.0.0.1:8000/display/'; 
  const data = {
    message: submitinput.value,
    msg_date: new Date().toISOString(),
    user_id: userid,
  };
  console.log('Data:', data);
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
// const register = (data) => {
//   const url = 'http://127.0.0.1:8000/register/';
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data)
//   })
//   .then(response => response.json())
//   .then(responseData => {
//     console.log(responseData);
//     // Handle the response from the server
//     if (responseData.success) {
//       // Registration successful
//     } else {
//       // Registration failed
//     }
//   })
//   .catch(error => {
//     console.error(error);
//     // Handle any errors that occur during the request
//   });
// };

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
  
if(submitbtn){
  submitbtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Button clicked');
    createPost();
  })
}

//const userId = sessionStorage.getItem('id');
const displayMessages = () => {
  fetch('http://127.0.0.1:8000/display/messages/')  
  .then(response => response.json())
    .then(data => {
      const messages = data.messages;
      const messagesContainer = document.getElementById('messagesContainer');
      
      // Clear the existing messages
      messagesContainer.innerHTML = '';
      
      // Display each message
      messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `Message: ${message.message}, Date: ${message.msg_date}`;
        messagesContainer.appendChild(messageElement);
      });
    })
    .catch(error => {
      console.error(error);
      // Handle any errors that occur during the request
    });
};

// Call the displayMessages function when the page loads
window.onload = displayMessages;