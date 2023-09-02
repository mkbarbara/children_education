const userId = localStorage.getItem('userId');

// Get the container element where the subjects will be appended
const subjectContainer = document.querySelector('.filter');
const classesContainer = document.querySelector('.classes');

// Fetch subjects from the database for id=1
fetch(`/get-subjects/${userId}`)
  .then((response) => response.json())
  .then((data) => {
    const subjectsArray = data.user.subjects.split(', ');

    // Generate the <div class="subject"> elements
    subjectsArray.forEach((subject) => {
      // Create the elements
      const subjectDiv = document.createElement('div');
      subjectDiv.classList.add('subject');

      const checkboxSpan = document.createElement('span');
      checkboxSpan.classList.add('checkbox');
      checkboxSpan.innerHTML = '<i class="fa-solid fa-check check-icon"></i>';

      const subjectTextSpan = document.createElement('span');
      subjectTextSpan.classList.add('subject-text');
      subjectTextSpan.textContent = subject;

      // Append the elements to the container
      subjectDiv.appendChild(checkboxSpan);
      subjectDiv.appendChild(subjectTextSpan);
      subjectContainer.appendChild(subjectDiv);

      // Fetch the classes for the current subject
      fetch(`/get-classes/${subject}`)
        .then((response) => response.json())
        .then((classesData) => {
          const classesArray = classesData.classes;
          classesArray.forEach((classData) => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card', classData.subject.toLowerCase().replace(/\s+/g, '-'));
            cardDiv.addEventListener('click', showClass);

            const frontDiv = document.createElement('div');
            frontDiv.classList.add('front');

            const backDiv = document.createElement('div');
            backDiv.classList.add('back');

            const cardImage = document.createElement('img');4
            cardImage.src = 'images/classes/' + classData.subject.toLowerCase().replace(/\s+/g, '-') + '/' + classData.class.toLowerCase().replace(/\s+/g, '-') + '.png';

            cardImage.alt = 'Card Image';
            cardImage.classList.add('card-image');

            const classTitle = document.createElement('h3');
            classTitle.classList.add('class-title');
            classTitle.textContent = `${classData.subject}. ${classData.class}`;

            const classShort = document.createElement('p');
            classShort.classList.add('class-short');
            classShort.textContent = classData.shortDescription;

            const classDescription = document.createElement('p');
            classDescription.textContent = classData.description;

            frontDiv.appendChild(cardImage);
            frontDiv.appendChild(classTitle);
            frontDiv.appendChild(classShort);

            backDiv.appendChild(classDescription);

            cardDiv.appendChild(frontDiv);
            cardDiv.appendChild(backDiv);

            classesContainer.appendChild(cardDiv);
          });
          if (subject === subjectsArray[subjectsArray.length - 1]) {
            // Call the addFiltering() function after all subjects and classes are generated
            addFiltering();
          }
        })
        .catch((error) => {
          console.error('Error fetching classes:', error);
        });
    });
  })
  .catch((error) => {
    console.error('Error fetching subjects:', error);
  });

function addFiltering() {
  // Add event listeners to checkboxes and manipulate cards
  const subjectCheckboxes = document.querySelectorAll('.subject');
  const cards = document.querySelectorAll('.card');

  subjectCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', () => {
      checkbox.classList.toggle('checked');
      const selectedSubjects = [];

      subjectCheckboxes.forEach((checkbox) => {
        if (checkbox.classList.contains('checked') && checkbox.innerText !== 'All') {
          selectedSubjects.push(checkbox.innerText.toLowerCase());
        }
      });

      if (selectedSubjects.length === 0 || selectedSubjects.length === subjectCheckboxes.length - 1) {
        cards.forEach((card) => {
          card.style.display = 'block';
        });
        subjectCheckboxes.forEach((checkbox) => {
          if (checkbox.innerText === 'All') {
            checkbox.classList.add('checked');
          } else {
            checkbox.classList.remove('checked');
          }
        });
      } else {
        cards.forEach((card) => {
          if (selectedSubjects.includes(card.classList[1].replace(/-/g, ' '))) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });

        const allCheckbox = document.querySelector('.subject-text').parentNode;
        const uncheckedCheckboxes = document.querySelectorAll('.subject:not(.checked)');
        if (uncheckedCheckboxes.length === 0) {
          allCheckbox.classList.add('checked');
        } else {
          allCheckbox.classList.remove('checked');
        }
      }
    })
  })
}

const sr = ScrollReveal({
  origin: 'left',
  distance: '60px',
  duration: 2000,
  delay: 200
})

sr.reveal('.classes')

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

function showClass() {
  window.location.href='class.html'
}