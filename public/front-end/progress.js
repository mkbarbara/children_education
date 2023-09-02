const subjectsDropdown = document.querySelector(".dropdown.subjects");
const subjectsSelectBtn = subjectsDropdown.querySelector(".select-btn");
const subjectsItems = subjectsDropdown.querySelectorAll(".item");

const taskTypesDropdown = document.querySelector(".dropdown.task-types");
const taskTypesSelectBtn = taskTypesDropdown.querySelector(".select-btn");
const taskTypesItems = taskTypesDropdown.querySelectorAll(".item");

const monthsDropdown = document.querySelector(".dropdown.months");
const monthsSelectBtn = monthsDropdown.querySelector(".select-btn");
const monthsItems = monthsDropdown.querySelectorAll(".item");

subjectsSelectBtn.addEventListener("click", () => {
    subjectsSelectBtn.classList.toggle('open')
});

taskTypesSelectBtn.addEventListener("click", () => {
    taskTypesSelectBtn.classList.toggle('open')
});

monthsSelectBtn.addEventListener("click", () => {
    monthsSelectBtn.classList.toggle('open')
});

subjectsItems.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle('checked');

        let checkedSubjects = subjectsDropdown.querySelectorAll(".checked");
        let subjectsBtnText = subjectsSelectBtn.querySelector(".btn-text");

        if (checkedSubjects && checkedSubjects.length > 0) {
            subjectsBtnText.innerHTML = `${checkedSubjects.length} Selected`
        } else {
            subjectsBtnText.innerHTML = "Select Subjects"
        }
        updateChart();
    });
});

taskTypesItems.forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle('checked');

        let checkedTaskTypes = taskTypesDropdown.querySelectorAll(".checked");
        let taskTypesBtnText = taskTypesSelectBtn.querySelector(".btn-text");

        if (checkedTaskTypes && checkedTaskTypes.length > 0) {
            taskTypesBtnText.innerHTML = `${checkedTaskTypes.length} Selected`
        } else {
            taskTypesBtnText.innerHTML = "Select Task Types"
        }
        updateChart();
    });
});

monthsItems.forEach(item => {
    item.addEventListener("click", () => {
        monthsItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('checked');
            }
        });

        item.classList.toggle('checked');

        let checkedMonths = monthsDropdown.querySelectorAll(".checked");
        let monthsBtnText = monthsSelectBtn.querySelector(".btn-text");

        if (checkedMonths && checkedMonths.length > 0) {
            monthsBtnText.innerHTML = checkedMonths[0].querySelector(".item-text").innerHTML;
        } else {
            monthsBtnText.innerHTML = "Select Month";
        }
        
        monthsSelectBtn.classList.remove('open');

        updateChart();
    });
});

let subjectsData = {
    "Chemistry": {
      "Hometasks": [5, 7, 9, 8, 6, 10],
      "Control Works": [8, 10, 4, 7, 9, 6],
      "Project Works": [7, 9, 6, 10, 8, 5]
    },
    "Maths": {
      "Hometasks": [3, 2, 5, 8, 7, 9],
      "Control Works": [6, 7, 8, 5, 9, 3],
      "Project Works": [10, 7, 6, 5, 8, 9]
    },
    "English": {
      "Hometasks": [4, 6, 8, 9, 7, 10],
      "Control Works": [8, 7, 6, 9, 5, 10],
      "Project Works": [7, 9, 5, 6, 8, 10]
    }
  };

const ctx = document.getElementById('myChart').getContext('2d');

// Define colors for each subject
const colors = {
  Chemistry: '#407ef4',
  Maths: '#39ac39',
  English: '#f1c40f'
};

// Define function to get selected options from dropdowns
function getSelectedOptions(dropdown) {
    const selectedOptions = [];
    const options = dropdown.querySelectorAll('.item.checked .item-text');
    for (let i = 0; i < options.length; i++) {
        selectedOptions.push(options[i].textContent);
    }
    return selectedOptions;
}

let chart;

// Define function to update the chart based on selected options
function updateChart() {

    if (chart) {
      chart.destroy();
    }
  
    // Get selected options from dropdowns
    const selectedSubjects = getSelectedOptions(subjectsDropdown);
    const selectedTaskTypes = getSelectedOptions(taskTypesDropdown);
  
    // Filter data based on selected options
    const filteredData = {};

    for (const subject of selectedSubjects) {
      filteredData[subject] = {};
      for (const taskType of selectedTaskTypes) {
        filteredData[subject][taskType] = subjectsData[subject][taskType];
      }
    }
  
    // Get values for x and y axes
    const labels = Array.from({ length: 30 }, (_, i) => `${i + 1} June`);
    const datasets = [];
    for (const [subject, data] of Object.entries(filteredData)) {
      for (const [taskType, values] of Object.entries(data)) {
        const dataset = {
          label: `${subject} - ${taskType}`,
          data: values,
          backgroundColor: colors[subject],
          borderColor: colors[subject],
          borderWidth: 2,
          fill: false
        };
        datasets.push(dataset);
      }
    }
  
    // Create chart
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets,
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Day',
              color: '#333'
            },
            gridLines : {
              display : false
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Number of completed tasks'
            }
          }]
        }
      }
    });
  }

// Initial chart update based on default selections
updateChart();

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