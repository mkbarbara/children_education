const registerButton = document.querySelector('.ghost-btn.register');
const loginButton = document.querySelector('.ghost-btn.login');

const loginForm = document.querySelector('.login-container form');
const registrationForm = document.querySelector('.register-container form');
const questionsForm = document.querySelector(".questions-form form")

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('emailLoginInput').value;
  const password = document.getElementById('passwordLoginInput').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === 'Login successful') {
        const userId = data.userId;
        localStorage.setItem('userId', userId);
        window.location.href = 'curriculum.html';
      } else {
        alert('Incorrect username or password. Please try again.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle any errors that occurred during the request
    });
}

function handleRegistration(event) {
  event.preventDefault();

  const firstNameInput = document.getElementById('firstNameInput');
  const lastNameInput = document.getElementById('lastNameInput');
  const countryCodeSelect = document.querySelector('.country-code-select');
  const selectedOption = countryCodeSelect.options[countryCodeSelect.selectedIndex];
  const phoneInput = document.getElementById('phoneInput');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');

  // Perform any necessary validation on the form data
  // ...

  // Create an object with the user data
  const newUser = {
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    email: emailInput.value,
    phone: selectedOption.value + '-' + phoneInput.value,
    password: passwordInput.value
  };

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      // Handle the server response here
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle any errors that occurred during the request
    });
}

function handleQuestions(event) {
  event.preventDefault();

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('formMessage');

  const userMessage = {
    name: nameInput.value,
    email: emailInput.value,
    message: messageInput.value
  }

  fetch('/send-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userMessage),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      // Handle the server response here
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle any errors that occurred during the request
    });
}

loginForm.addEventListener('submit', handleLogin);
registrationForm.addEventListener('submit', handleRegistration);
questionsForm.addEventListener('submit', handleQuestions);

// QA code

const qaContent = document.querySelectorAll(".qa-content");

qaContent.forEach((item, index) => {
let header = item.querySelector("header");
header.addEventListener("click", () =>{
    item.classList.toggle("open");

    let description = item.querySelector(".qa-description");
    if (item.classList.contains("open")) {
      description.style.height = `${description.scrollHeight}px`;
      item.querySelector("i").classList.replace("fa-plus", "fa-minus");
    } else {
      description.style.height = "0px";
      item.querySelector("i").classList.replace("fa-minus", "fa-plus");
    }
    removeOpen(index);
  })
})

function removeOpen(index1){
  qaContent.forEach((item2, index2) => {
  if(index1 != index2){
    item2.classList.remove("open");

    let des = item2.querySelector(".qa-description");
    des.style.height = "0px";
    item2.querySelector("i").classList.replace("fa-minus", "fa-plus");
  }
  })
}

// Changing the form

const showFormButton = document.querySelector('.btn.show-form-button');
const formElement = document.querySelector('.container.account-container');
const darkBackground = document.createElement('div');
darkBackground.classList.add('dark-background');

showFormButton.addEventListener('click', function() {
    formElement.style.display = 'block';
    if (formElement.classList.contains("right-panel-active")) {
      formElement.classList.remove("right-panel-active");
    }
    document.body.appendChild(darkBackground);
    document.body.style.overflow = 'hidden';
});

const closeIcon = document.querySelector('.close-icon');
closeIcon.addEventListener('click', function() {
    formElement.style.display = 'none';
    document.body.removeChild(darkBackground);
    document.body.style.overflow = 'initial';
});

registerButton.addEventListener('click', () => {
	formElement.classList.add("right-panel-active");
  closeIcon.style.color = '#0069d9'
});

loginButton.addEventListener('click', () => {
	formElement.classList.remove("right-panel-active");
  closeIcon.style.color = '#fff';
});

// Validity

function validateNameInput(inputField) {
  const inputValue = inputField.value.trim();
  
  if (inputValue === '') {
    inputField.parentElement.classList.add('empty');
    inputField.parentElement.classList.remove('invalid');
    return;
  }
  
  const isNameValid = nameRegex.test(inputValue);
  
  if (isNameValid) {
    inputField.parentElement.classList.remove('empty', 'invalid');
  } else {
    inputField.parentElement.classList.remove('empty');
    inputField.parentElement.classList.add('invalid');
  }
}

function validatePhoneInput(inputField) {
  const inputValue = inputField.value.trim();
  
  if (inputValue === '') {
    inputField.parentElement.classList.add('empty');
    inputField.parentElement.classList.remove('invalid');
    return;
  }
  
  const isPhoneValid = phoneRegex.test(inputValue);
  
  const formattedPhone = inputValue.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '($1)-$2-$3-$4');
  inputField.value = formattedPhone;

  if (isPhoneValid && inputValue.length <= 10) {
    inputField.parentElement.classList.remove('empty', 'invalid');
  } else {
    inputField.parentElement.classList.remove('empty');
    inputField.parentElement.classList.add('invalid');
  }
}

const nameRegex = /^[A-Za-z\s-]+$/;
firstNameInput.addEventListener('input', function() {
  validateNameInput(this);
});
lastNameInput.addEventListener('input', function() {
  validateNameInput(this);
});
phoneInput.addEventListener('input', function() {
  formatPhoneNumber(this);
});

function formatPhoneNumber(inputField) {
  const inputValue = inputField.value.trim();
  const formattedValue = addParenthesesAndDashes(inputValue);

  // Update the input value with the formatted value
  inputField.value = formattedValue;

  // Validate the phone number and update the class list accordingly
  if (formattedValue === '') {
    inputField.parentElement.classList.add('empty');
    inputField.parentElement.classList.remove('invalid');
  } else if (isValidPhoneNumber(formattedValue)) {
    inputField.parentElement.classList.remove('empty', 'invalid');
  } else {
    inputField.parentElement.classList.remove('empty');
    inputField.parentElement.classList.add('invalid');
  }
}

function addParenthesesAndDashes(phoneNumber) {
  phoneNumber = phoneNumber.replace(/\D/g, '');
  
  // Apply formatting based on the length of the phoneNumber
  let formattedNumber = '';

  if (phoneNumber.length >= 1) {
    formattedNumber += '(' + phoneNumber.substring(0, 3);
  }
  if (phoneNumber.length >= 3) {
    formattedNumber += ')' + phoneNumber.substring(3, 6);
  }
  if (phoneNumber.length >= 6) {
    formattedNumber += '-' + phoneNumber.substring(6, 8);
  }
  if (phoneNumber.length >= 8) {
    formattedNumber += '-' + phoneNumber.substring(8, 10);
  }
  
  // Check if the last character is a non-digit character
  const lastChar = formattedNumber.slice(-1);
  if (/\D/.test(lastChar)) {
    formattedNumber = formattedNumber.slice(0, -1); // Remove the last non-digit character
  }

  return `${formattedNumber}`
}

function isValidPhoneNumber(phoneNumber) {
  // Remove all non-digit characters
  phoneNumber = phoneNumber.replace(/\D/g, '');

  // Return true if there are exactly 10 digits
  return phoneNumber.length === 10;
}

// Add smooth scrolling

const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2000,
  delay: 400
})

sr.reveal('.section');
sr.reveal('.left', {origin: 'left'})
sr.reveal('.right', {origin: 'right'})

const sectionAbout = document.querySelector('.section.section-about');
const sectionProcess = document.querySelector('.section.section-process');
const sectionQA = document.querySelector('.section.section-qa');
const sectionQuestions = document.querySelector('.section.section-questions');

function showAboutUs() {
  sectionAbout.scrollIntoView({ behavior: 'smooth' });
};

function showProgress() {
  sectionProcess.scrollIntoView({ behavior: 'smooth' });
};

function showQA() {
  sectionQA.scrollIntoView({ behavior: 'smooth' });
};

function showContactUs() {
  sectionQuestions.scrollIntoView({ behavior: 'smooth' });
};
