// Dealing with image input

const imageInput = document.getElementById("image-input");
const profileImage = document.getElementById("profile-image");
const overlay = document.querySelector(".overlay");

overlay.addEventListener("click", function() {
    imageInput.click();
});

imageInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
      profileImage.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

// Dealing with users info getting from database

const userId = localStorage.getItem('userId');

fetch(`/user/${userId}`)
  .then((response) => response.json())
  .then((data) => {
    const { user } = data;
    const {
      firstName,
      lastName,
      email,
      phone,
      birth,
      country,
      city,
      image
    } = user;

    document.getElementById('firstName').value = firstName;
    document.getElementById('lastName').value = lastName;
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;
    document.getElementById('birth').value = birth;
    document.getElementById('country').value = country;
    document.getElementById('city').value = city;

    const uint8Array = new Uint8Array(image.data);
    const base64Image = btoa(String.fromCharCode.apply(null, uint8Array));

    const src = `data:image/png;base64,${base64Image}`;

    document.getElementById('profile-image').src=src;
  })
  .catch((error) => {
    console.error('Error getting user information:', error);
  });

  const subjectContainer = document.getElementById('chosen-list');

  fetch(`/get-subjects/${userId}`)
  .then((response) => response.json())
  .then((data) => {
    const subjectsArray = data.user.subjects.split(', ');
    const cards = document.querySelectorAll('.card')

    subjectsArray.forEach((subject) => {
      addChosenSubject(subject);
      cards.forEach((card) => {
        const title = card.querySelector('.card-title').textContent;
        const itemCheckbox = card.querySelector('.item-checkbox');
        if (subject === title) {
          itemCheckbox.classList.add('checked');
        }
      })
    })
  })
  .catch((error) => {
    console.error('Error fetching subjects:', error);
  });

document.getElementById('save-changes').addEventListener('click', () => {
  const input = document.getElementById('image-input');
  const file = input.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageData = event.target.result;

      fetch(`/save-image/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Image saved successfully:', data);
        })
        .catch(error => {
          console.error('Error saving image:', error);
        });
    };
    reader.readAsDataURL(file);
  }

  const updatedUser = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    birth: document.getElementById('birth').value || null,
    country: document.getElementById('country').value || null,
    city: document.getElementById('city').value || null,
  };

  fetch(`/update-user/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('User information updated:', data);
      // Show a success message or perform any other necessary actions
    })
    .catch((error) => {
      console.error('Error updating user information:', error);
      // Show an error message or perform any other necessary actions
    });
});

// Dealing with dropdown

const areaDropdown = document.getElementById("area-dropdown");
const areaSelectBtn = areaDropdown.querySelector(".select-btn");
const areaItems = areaDropdown.querySelectorAll(".item");

areaSelectBtn.addEventListener("click", () => {
  areaSelectBtn.classList.toggle('open')
});

areaItems.forEach(item => {
  item.addEventListener("click", () => {
      item.classList.toggle('checked');

      let checkedArea = areaDropdown.querySelectorAll(".checked");
      let areaButtonText = areaSelectBtn.querySelector(".btn-text");

      if (checkedArea && checkedArea.length > 0) {
          areaButtonText.innerHTML = `${checkedArea.length} Selected`
      } else {
          areaButtonText.innerHTML = "Select Subjects"
      }
  });
});

// Dealing with card buttons and change between front and back

const showButtons = document.querySelectorAll('.desc.show');
const hideButtons = document.querySelectorAll('.desc.no-show');
const cards = document.querySelectorAll('.card');

showButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    cards[index].classList.add('show-back');
  });
});

hideButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    cards[index].classList.remove('show-back');
  });
});

const checkIcons = document.querySelectorAll('.item-checkbox');
checkIcons.forEach(icon => {
  icon.addEventListener('click', toggleCheckIcon);
});

function toggleCheckIcon(event) {
  const itemCheckbox = event.currentTarget;
  const listItem = itemCheckbox.closest('.card');
  const title = listItem.querySelector('.card-title').textContent;

  if (itemCheckbox.classList.contains('checked')) {
    itemCheckbox.classList.remove('checked');
    removeChosenSubject(title);
  } else {
    itemCheckbox.classList.add('checked');
    addChosenSubject(title);
  }
}

  function addChosenSubject(title) {
    const chosenList = document.getElementById('chosen-list');
    const listItem = document.createElement('li');
    listItem.className = "item checked";
    const checkBox = document.createElement('span');
    checkBox.className = "checkbox";
    checkBox.innerHTML = '<i class="fa-solid fa-check check-icon"></i>';
    const itemName = document.createElement('span')
    itemName.className = "item-text";
    itemName.textContent = title;
    listItem.appendChild(checkBox);
    listItem.appendChild(itemName);
    chosenList.appendChild(listItem);
  }

  // Function to remove chosen subject from the list
  function removeChosenSubject(title) {
    const chosenList = document.getElementById('chosen-list');
    const listItems = chosenList.querySelectorAll('li');

    listItems.forEach(item => {
      if (item.textContent === title) {
        chosenList.removeChild(item);
      }
    });
  }

  const chosenList = document.getElementById('chosen-list');

  chosenList.addEventListener('click', function(event) {
    if (event.target.classList.contains('check-icon')) {
      const icon = event.target;
      const listItem = icon.closest('li');
      const title = listItem.querySelector('.item-text').textContent;
  
      listItem.remove();
      uncheckCardIcon(title);
    }
  });
  
  function uncheckCardIcon(title) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const cardTitle = card.querySelector('.card-title').textContent;
      const checkIcon = card.querySelector('.check-icon');
      const itemCheckbox = checkIcon.parentNode;
  
      if (cardTitle === title) {
        checkIcon.classList.remove('checked');
        itemCheckbox.classList.remove('checked');
      }
    });
  }

const startStudying = document.getElementById('start-studying')
startStudying.addEventListener('click', () => {
  const chosenList = document.getElementById('chosen-list');
  const liElements = chosenList.getElementsByTagName('li');

  const names = [];
  for (let i = 0; i < liElements.length; i++) {
    const li = liElements[i];
    const name = li.textContent.trim();
    names.push(name);
  }

  const combinedNames = names.join(', ');

  const selectedSubjects = {
    subjects: combinedNames || null
  }

  fetch(`/add-subjects/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(selectedSubjects),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('User information updated:', data);
    })
    .catch((error) => {
      console.error('Error updating user information:', error);
    });

})

  function showNotifications() {
    const dropdown = document.querySelector('.dropdown-content');
    dropdown.classList.toggle('show');
  }

  const notificationsList = document.getElementById('notifications-list');
  const notificationsNumber = document.querySelector('.notifications-number');
  notificationsNumber.textContent = notificationsList.children.length;

  function showProgress() {
    window.location.href='progress.html';
  }
  
  function showCurriculum() {
    window.location.href='curriculum.html';
  }
  
  function showAboutUs() {
    window.location.href='home.html';
  }
  
  function showClasses() {
    window.location.href='classes.html'
  }

  function showPersonalAccount() {
    window.location.href='personal.html'
  }

  function showChat() {
    window.location.href='chat.html'
  }