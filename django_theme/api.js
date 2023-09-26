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
// function getCookie(name) {
//   let cookieValue = null;
//   if (document.cookie && document.cookie !== '') {
//       const cookies = document.cookie.split(';');
//       for (let i = 0; i < cookies.length; i++) {
//           const cookie = cookies[i].trim();
//           // Does this cookie string begin with the name we want?
//           if (cookie.substring(0, name.length + 1) === (name + '=')) {
//               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//               break;
//           }
//       }
//   }
//   return cookieValue;
// }
// Cookies.set('csrftoken', 'value')
//const csrftoken = getCookie('csrftoken');
// const csrftoken = Cookies.get('csrftoken');
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
      'Content-Type': 'application/json',
      // 'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Login successful
      sessionStorage.setItem('email', data.email);
      sessionStorage.setItem('id', data.id);
      sessionStorage.setItem('first_name', data.first_name);
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
      window.location.href = "http://127.0.0.1:5500/django_theme/landing.html";
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
  const userEmail = sessionStorage.getItem('email');
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
      for (let i = 0; i < messages.length; i++){
        const message = messages[i];
  
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
        const headDiv = document.createElement('header');
        headDiv.classList.add('headdivStyle');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('messagetextStyle')
        messageDiv.textContent = message.message;

        const emailDiv = document.createElement('div');
        emailDiv.classList.add('emailStyle');
        emailDiv.textContent = 'User: ' + message.email;

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('dateStyle')
        dateDiv.textContent = formattedDate;

        // messageElement.appendChild(messageDiv);
        // messageElement.appendChild(dateDiv);

        
        


        headDiv.appendChild(emailDiv);
        headDiv.appendChild(dateDiv);
        messageElement.appendChild(headDiv);
        messageElement.appendChild(messageDiv);
        const editBtn = createEditButton(message.id, message.message);
        // Create "Delete" button
        const deleteButton = createDeleteButton(message.id); // Assuming the message object has an 'id' property
        if (message.email === (userEmail)) {
        dateDiv.appendChild(deleteButton);

        dateDiv.appendChild(editBtn);  
        }
        
        messagesContainer.appendChild(messageElement);

       };
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
   const first_name = sessionStorage.getItem('first_name')
  
   // Display the email on the page
   
   if (document.getElementById('email_display')) {
     const email_display = document.getElementById('email_display');
     if(first_name != null){
      email_display.textContent = 'Hi, ' + first_name;
     }
     else {
      email_display.textContent = 'Hi, ' + email;
    }
   }
  window.onload = displayMessages();
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
  

confirmDeleteBtn.addEventListener('click', (e) => {
  // If the user confirms, proceed with the account deletion
  e.preventDefault();
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
        window.location.href = 'http://127.0.0.1:5500/django_theme/landing.html';
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


// "Delete Account" button
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
    window.location.href = 'http://127.0.0.1:5500/django_theme/landing.html';
  };

  // If the user is logged in, display the logout button
  if (isLoggedIn) {
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Logout';
     logoutButton.classList.add('logoutBtn');
    logoutButton.addEventListener('click', logout);

    const logoutContainer = document.getElementById('logoutContainer');
    logoutContainer.appendChild(logoutButton);
  }
}

//Delete message button

const deleteMessage = (messageId) => {
  // const confirmDelete = confirm('Are you sure you want to delete this message?');
  // if (confirmDelete) {
  //   const userId = sessionStorage.getItem('id');
  //   if (!userId) {
  //     console.error('User ID not found in session.');
  //     return;
  //   }
  const userId = sessionStorage.getItem('id');
  if (!userId) {
    console.error('User ID not found in session.');
    return;
  }

    const url = `http://127.0.0.1:8000/display/delete_message/${messageId}/`;

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId, // Send the user ID in a custom header
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Deletion successful, refresh the messages display
          window.location.reload()
        } else {
          // Display error message if deletion failed
          console.error(data.message);
        }
      })
      .catch(error => {
        console.error(error);
        // Handle any errors that occur during the request
      });
  }


  const createDeleteButton = (messageId) => {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('deleteMsgBtn');
    deleteBtn.setAttribute('data-message-id', messageId); // Set the messageId as a custom attribute
    deleteBtn.addEventListener('click', handleDeleteClick);
    return deleteBtn;
  };
  
  const handleDeleteClick = (event) => {
    const messageId = event.target.getAttribute('data-message-id');
    deleteMessage(messageId);
  };

  //edit message button
  const createEditButton = (messageId, messageContent) => {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('editMsgBtn');
    editBtn.setAttribute('data-message-id', messageId);
    editBtn.setAttribute('data-message-content', messageContent);
    editBtn.addEventListener('click', handleEditClick);
    return editBtn;
  };

  const handleEditClick = (event) => {
    const messageId = event.target.getAttribute('data-message-id');
    const messageContent = event.target.getAttribute('data-message-content'); 

  // Replace the message div with an editable input field or textarea
  const messageDiv = event.target.parentNode.parentNode;
  const editInput = document.createElement('input');
  editInput.classList.add('updateInput')
  editInput.type = 'text';
  editInput.value = messageContent;
  
  
  // You can also use a textarea for multiline editing:
  // const editInput = document.createElement('textarea');
  // editInput.value = messageContent;

  const updateBtn = document.createElement('button');
  updateBtn.textContent = 'Update';
  const returnBtn = document.createElement('button');
  returnBtn.textContent = 'Return';

  returnBtn.classList.add('editMsgBtn')
  updateBtn.classList.add('editMsgBtn');
  updateBtn.addEventListener('click', () => handleUpdateClick(messageId, editInput.value));
  returnBtn.addEventListener('click', () => window.location.href="index.html");

  messageDiv.innerHTML = ''; // Remove the existing message content
  messageDiv.appendChild(editInput);
  messageDiv.appendChild(updateBtn);
  messageDiv.appendChild(returnBtn);
  };

  const updateMessage = (messageId, newMessage) => {
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      console.error('User ID not found in session.');
      return;
    }
  
    const url = `http://127.0.0.1:8000/display/update_message/${messageId}/`;
  
    const data = {
      message: newMessage,
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
          // Update successful, refresh the messages
          displayMessages();
        } else {
          // Display error message if update failed
          console.error(data.message);
        }
      })
      .catch(error => {
        console.error(error);
        // Handle any errors that occur during the request
      });
  };
  
  // Add an event listener to the "Update" button for each message
  const handleUpdateClick = (messageId, newMessage) => {
    updateMessage(messageId, newMessage);
  };

const followUser = (userId) => {
  const userIdd = sessionStorage.getItem('id');
    if (!userIdd) {
      console.error('User ID not found in session.');
      return;
    }
    
  fetch(`http://127.0.0.1:8000/follow/${userId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Y-User-Id': userIdd,
      // 'X-CSRFToken': getCookie('csrftoken'),
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Handle success
        console.log('SUCCESS')
        window.location.reload()
      } else {
        // Handle error
        console.log('FAIL')
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle any errors that occur during the request
    });
};

const unfollowUser = (userId) => {
  const userIdd = sessionStorage.getItem('id');
  fetch(`http://127.0.0.1:8000/unfollow/${userId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': userIdd
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Handle success (e.g., update the UI to reflect the unfollow action)
        // For example, remove the user from the list of followed users
        // const followedUsersContainer = document.getElementById('followedUsersContainer');
        // const userElement = document.getElementById(`user-${userId}`);
        // followedUsersContainer.removeChild(userElement);
        window.location.reload();
      } else {
        // Handle error
        console.error(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle any errors that occur during the request
    });
};


const searchUsers = () => {
  const searchInput = document.getElementById('searchInput');
  const searchQuery = searchInput.value.trim();
  const userId = sessionStorage.getItem('id');
  // Validate the search query before sending the request
  if (!searchQuery) {
    // Handle case when the search query is empty
    console.error('Search query cannot be empty.');
    return;
  }

  fetch(`http://127.0.0.1:8000/search_users/?q=${searchQuery}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': userId,
      'X-CSRFToken': csrftoken,
    },
  })
    .then(response => response.json())
    .then(data => {
      const users = data.users;
      console.log('Users:', users); // Debugging: Check if the users data is received correctly

      const searchResultsContainer = document.getElementById('searchResultsContainer');

      // Clear the existing search results
      searchResultsContainer.innerHTML = '';

      // Display each user's email as clickable links
      users.forEach(user => {
        const userLink = document.createElement('a');
        userLink.classList.add('userlinkstyle')
        userLink.textContent = user.email;
        userLink.href = `/user/${user.id}`; // Replace with the URL of the user profile page

        const followBtn = document.createElement('button');
        followBtn.textContent = 'Follow';
        followBtn.classList.add('follow-btn')
        followBtn.addEventListener('click', () => followUser(user.id));

        const unfollowBtn = document.createElement('button');
        unfollowBtn.textContent = 'Unfollow';
        unfollowBtn.classList.add('follow-btn')
        unfollowBtn.addEventListener('click', () => unfollowUser(user.id));

        // Remove any previous buttons
        const previousButton = searchResultsContainer.querySelector(`[data-user-id="${user.id}"]`);
        if (previousButton) {
          previousButton.remove();
        }

        // Append the user email link to the search results container
        searchResultsContainer.appendChild(userLink);


        // Add the buttons based on whether the user is already followed or not
        if (user.is_followed || user.is_followed === true) {
          unfollowBtn.setAttribute('data-user-id', user.id);
          searchResultsContainer.appendChild(unfollowBtn);
        } else {
          followBtn.setAttribute('data-user-id', user.id);
          searchResultsContainer.appendChild(followBtn);
        }

        
      });
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle any errors that occur during the request
    });
};

const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', () => {
  searchUsers();
});
// const searchBtn = document.getElementById('searchBtn');
// const searchInput = document.getElementById('searchInput');

// searchBtn.addEventListener('click', () => {
//   const searchQuery = searchInput.value;
//   searchUsers(searchQuery);
// });



const displayFollowedUsers = () => {
  const userId = sessionStorage.getItem('id');
  if (!userId) {
    console.error('User ID not found in session.');
    return;
  }

  fetch('http://127.0.0.1:8000/get_followed_users/', {
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': userId,
    }
  })
  .then(response => response.json())
  .then(data => {
    const followedUsers = data.users;
    const followedUsersContainer = document.getElementById('followedUsersContainer');

    // Clear the existing list of followed users
    followedUsersContainer.innerHTML = '';

    // Display the list of followed users
    followedUsers.forEach(user => {
      const userElement = document.createElement('div');
      userElement.textContent = user.email;
      followedUsersContainer.appendChild(userElement);
    });
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle any errors that occur during the request
  });
};
displayFollowedUsers();