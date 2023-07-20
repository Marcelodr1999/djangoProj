const submitbtn = document.getElementById('msgsubmit');
const submitinput = document.getElementById('msgid');
const registerbtn = document.getElementById('registerBtn');
const form = document.getElementById('formId')

//login
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('loginEmail');
const passwordInput = document.getElementById('loginPassword');
const loginsubmit = document.getElementById('loginsubmit')
const successElement = document.getElementById('loginSuccess');
const errorElement = document.getElementById('loginError');

//REGISTER

const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerPassword2 = document.getElementById('registerPassword2');



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
if(submitbtn){
  submitbtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Button clicked');
    createPost();
  })
}
//REGISTER
const register = () => {
  const url = 'http://127.0.0.1:8000/register/';
  const data = {
    email: registerEmail.value,
    password1: registerPassword.value,
    password2: registerPassword2.value,
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
      // Registration successful
      window.location.href = "http://127.0.0.1:5500/django_theme/login.html";
      console.log(data.message);
    } else {
      // Registration failed, display error messages
      console.log(data.errors);
    }
  })
  .catch(error => {
    console.error(error);
    // Handle any errors that occur during the request
  });
};

if(registerbtn){
registerbtn.addEventListener('click', function(e) {
  e.preventDefault();
  register();
});
}

const displayMessages = () => {
  const userId = sessionStorage.getItem('id');
  if (!userId) {
    console.error('User ID not found in session.');
    return;
  }

  fetch('http://127.0.0.1:8000/display/messages/', {
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': userId  // Send the user ID in a custom header
    }
  })  
  .then(response => response.json())
    .then(data => {
      const messages = data.messages;
      const messagesContainer = document.getElementById('messagesContainer');
      
      // Clear the existing messages
      messagesContainer.innerHTML = '';
      
      // Display each message
      messages.forEach(message => {
        const messageElement = document.createElement('div');
        const formattedDate = new Date(message.msg_date).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });

        messageElement.textContent = `Message: ${message.message}, Date: ${formattedDate}`;
        messagesContainer.appendChild(messageElement);
      });
    })
    .catch(error => {
      console.error(error);
      // Handle any errors that occur during the request
    });
};

// Call the displayMessages function when the page loads and display user name
 if(window.location.pathname === '/django_theme/index.html'){
   // Retrieve the email from session or local storage
   const email = sessionStorage.getItem('email');
  
   // Display the email on the page
   
   if (document.getElementById('email_display')) {
     const email_display = document.getElementById('email_display');
     email_display.textContent = email;
   }
  window.onload = displayMessages;
 }


if (window.location.pathname === '/django_theme/index.html') {
  // Check if there is an active session (user is logged in)
  const isLoggedIn = sessionStorage.getItem('email') !== null;

  // Function to handle the logout action
  const logout = () => {
    // Remove the email from the session storage
    sessionStorage.removeItem('email');

    // Redirect the user to the login page or any other page
    window.location.href = 'http://127.0.0.1:5500/django_theme/login.html';
  };

  // If the user is logged in, display the logout button
  if (isLoggedIn) {
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
    logoutButton.addEventListener('click', logout);

    const logoutContainer = document.getElementById('logoutContainer');
    logoutContainer.appendChild(logoutButton);
  }
}