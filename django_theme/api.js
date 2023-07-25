const submitbtn = document.getElementById('msgsubmit');
const submitinput = document.getElementById('msgid');
const registerbtn = document.getElementById('registerBtn');
const form = document.getElementById('formId')
const editBtn = document.getElementById('editBtn');

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
    window.location.reload();
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
        messageElement.classList.add('messageStyle');
        const formattedDate = new Date(message.msg_date).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message.message;
        const dateDiv = document.createElement('div');
        dateDiv.textContent = formattedDate;

        messageElement.appendChild(messageDiv);
        messageElement.appendChild(dateDiv);
        
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

 const updateName = () => {
  const firstNameInput = document.getElementById('editFirstname');
  const lastNameInput = document.getElementById('editLastname');
 
  const userId = sessionStorage.getItem('id');
  if (!userId) {
    console.error('User ID not found in session.');
    return;
  }
  const url = 'http://127.0.0.1:8000/editname/';  

  const data = {
    first_name: firstNameInput.value,
    last_name: lastNameInput.value,
  };


  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': userId, // Send the user ID in a custom header
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update successful, display success message
        window.location.href = "http://127.0.0.1:5500/django_theme/index.html";
        console.log(data.message);
      } else {
        // Update failed, display error message
        console.log(data.errors);
      }
    })
    .catch(error => {
      console.error(error);
      // Handle any errors that occur during the request
    });
};

if(editBtn){
  editBtn.addEventListener('click', function(e) {
    e.preventDefault();
    updateName();
  });
}

//DELETE ACCOUNT FUNCTION
const deleteAccount = () => {
  const userId = sessionStorage.getItem('id');
  if (!userId) {
    console.error('User ID not found in session.');
    return;
  }

  // Show the confirmation dialog
  const confirmationDialog = document.getElementById('confirmationDialog');
  confirmationDialog.style.display = 'block';
};

// Listen for the user's confirmation
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
if(confirmDeleteBtn){
  

confirmDeleteBtn.addEventListener('click', () => {
  // If the user confirms, proceed with the account deletion
  const userId = sessionStorage.getItem('id');
  if (!userId) {
    console.error('User ID not found in session.');
    return;
  }

  const url = 'http://127.0.0.1:8000/delete_account/';
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': userId, // Send the user ID in a custom header
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Account deleted successfully, redirect to the login page
        sessionStorage.clear(); // Clear all session data
        window.location.href = 'http://127.0.0.1:5500/django_theme/login.html';
      } else {
        // Display error message if deletion failed
        console.error(data.message);
      }
    })
    .catch(error => {
      console.error(error);
      // Handle any errors that occur during the request
    });
});
}

// Listen for the user's cancellation
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
if(cancelDeleteBtn){
  cancelDeleteBtn.addEventListener('click', (e) => {
    // If the user cancels, hide the confirmation dialog
    e.preventDefault();
    const confirmationDialog = document.getElementById('confirmationDialog');
    confirmationDialog.style.display = 'none';
  });
}


// Add an event listener to the "Delete Account" button
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
if(deleteAccountBtn){
  deleteAccountBtn.addEventListener('click', function(e) {
    e.preventDefault();
    deleteAccount();
  });
  
}



//DISPLAY LOGOUT BUTTON IF USER IS LOGGED IN
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
    logoutButton.classList.add('order-button');
    logoutButton.addEventListener('click', logout);

    const logoutContainer = document.getElementById('logoutContainer');
    logoutContainer.appendChild(logoutButton);
  }
}



const followUser = (userId) => {
  fetch(`http://127.0.0.1:8000/follow/${userId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Handle success
      } else {
        // Handle error
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle any errors that occur during the request
    });
};

const unfollowUser = (userId) => {
  fetch(`http://127.0.0.1:8000/unfollow/${userId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Handle success
      } else {
        // Handle error
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle any errors that occur during the request
    });
};