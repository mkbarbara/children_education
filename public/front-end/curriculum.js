const calendarBody = document.getElementById("calendar-body");
const currentMonthDisplay = document.getElementById("current-month");
const currentYearDisplay = document.getElementById("current-year");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const curriculumBody = document.getElementById("curriculum-body");
const dayTitle = document.getElementById("day-title");
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

function populateCalendar(month, year, currentDate) {
    // Clear any existing cells
    calendarBody.innerHTML = "";

    // Get the number of days in the specified month
    const numDays = new Date(year, month + 1, 0).getDate();

    // Get the day of the week of the first day of the specified month
    const firstDay = new Date(year, month, 1).getDay();

    const numberOfWeeks = Math.ceil((numDays + firstDay)/7);

    // Create cells for each day of the month and append them to the table
    let date = 1;
    let nextDate = 1;
    let prevDate = new Date(year, month, 0).getDate() - firstDay + 1;
    for (let i = 0; i < numberOfWeeks; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            let cell = document.createElement("td");
            if (i === 0 && j < firstDay) {
                // Create cells before the first day of the month
                cell.setAttribute("class", "prev-days")
                cell.textContent = prevDate;
                prevDate++;
            } else if (date > numDays && i ) {
                // Create cells after the first day of the month
                cell.setAttribute("class", "next-days")
                cell.textContent = nextDate;
                nextDate ++;
            } else {
                // Cell with the date and an event listener to display the curriculum for that day
                cell.textContent = date;
                if (year === currentDate.getFullYear() && month === currentDate.getMonth() && date === currentDate.getDate()) {
                    cell.classList.add("current-day", "now");
                } else {
                    cell.classList.add("current-days");
                }
                date++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }

    const cells = document.getElementsByTagName("td");

    // Loop through each cell and add a click event listener
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", function() {
            for (let j = 0; j < cells.length; j++) {
                cells[j].classList.remove("current-day");
            }
            cells[i].classList.add("current-day");
            displayCurriculum(cells[i].textContent, month);
        })
    }

    // Update the current month display
    currentMonthDisplay.textContent = `${months[month]}`;
    currentYearDisplay.textContent = `${year}`;
}

function displayCurriculum(day, month) {
    // TODO: Retrieve and display the specified day
    dayTitle.textContent = `${day} ${months[month]}`;
    document.getElementById('curriculum-events').innerHTML = '';

    var div1 = document.createElement("div");
    div1.className = 'subject-item';
    div1.innerHTML =  `
        <div class="subject-title">10:30 am</div>
        <div class="subject-description">Mathematics</div>
        <button class="go-icon">Visit class<i class="fa-solid fa-arrow-right"></i></button>
    `;

    var div2 = document.createElement("div");
    div2.className = 'subject-item';
    div2.innerHTML = `
        <div class="subject-title">12:30 am</div>
        <div class="subject-description">Chemistry</div>
        <button class="go-icon">Visit class<i class="fa-solid fa-arrow-right"></i></button>
    `;
    
    document.getElementById('curriculum-events').appendChild(div1);
    document.getElementById('curriculum-events').appendChild(div2);
}

// Populate the calendar for the current month
populateCalendar(currentMonth, currentYear, currentDate);
displayCurriculum(new Date().getDate(), currentMonth)

// Add event listeners to the prev/next month buttons
prevMonthButton.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    populateCalendar(currentMonth, currentYear, new Date());
});

nextMonthButton.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    populateCalendar(currentMonth, currentYear, new Date());
});

const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200
  })
sr.reveal('.day-title')
sr.reveal('.curriculum-events', {delay: 400, interval: 200, distance: '100px'})
sr.reveal('.curriculum-image', {delay: 400, interval: 300, distance: '200px', origin: 'left'})

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