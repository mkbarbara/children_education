const container = document.querySelector(".video-container"),
mainVideo = container.querySelector("video"),
videoTimeline = container.querySelector(".video-timeline"),
progressBar = container.querySelector(".progress-bar"),
volumeBtn = container.querySelector(".volume i"),
volumeSlider = container.querySelector(".left input"),
currentVidTime = container.querySelector(".current-time"),
videoDuration = container.querySelector(".video-duration"),
skipBackward = container.querySelector(".skip-backward i"),
skipForward = container.querySelector(".skip-forward i"),
playPauseBtn = container.querySelector(".play-pause i"),
speedBtn = container.querySelector(".playback-speed"),
speedOptions = container.querySelector(".speed-options"),
fullScreenBtn = container.querySelector(".fullscreen i");

const materials = document.querySelector(".materials"),
textSection = materials.querySelector(".text-section"),
paragraphs = Array.from(textSection.querySelectorAll("p"));

const textBtn = document.querySelector('.text-btn');
const notesBtn = document.querySelector('.notes-btn');
const notesSection = document.querySelector('.notes-section');
const popup = document.querySelector('.confirmation-popup');
const yesButton = popup.querySelector('.yes-button');
const noButton = popup.querySelector('.no-button');
const addNoteButton = document.querySelector('.add-note-btn');
const notesList = document.querySelector('.notes-list');

let timer;

const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();   
});

const formatTime = time => {
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
}

videoTimeline.addEventListener("mousemove", e => {
    let timelineWidth = videoTimeline.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
    const progressTime = videoTimeline.querySelector("span");
    offsetX = offsetX < 20 ? 20 : (offsetX > timelineWidth - 20) ? timelineWidth - 20 : offsetX;
    progressTime.style.left = `${offsetX}px`;
    progressTime.innerText = formatTime(percent);
});

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("timeupdate", e => {
    let {currentTime, duration} = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);

    for (let i = 0; i < paragraphs.length; i++) {
        const startTime = parseInt(paragraphs[i].getAttribute("data-start-time"));
        const endTime = parseInt(paragraphs[i].getAttribute("data-end-time"));
        
        if (currentTime >= startTime && currentTime <= endTime) {
        paragraphs[i].classList.add("active-text");
        paragraphs[i].scrollIntoView({behavior:"smooth"})
        } else {
        paragraphs[i].classList.remove("active-text");
        }
    }
});

mainVideo.addEventListener("loadeddata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration);
});

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

volumeBtn.addEventListener("click", () => {
    if(!volumeBtn.classList.contains("fa-volume-low")) {
        mainVideo.volume = 0.5;
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-low");
    } else {
        mainVideo.volume = 0.0;
        volumeBtn.classList.replace("fa-volume-low", "fa-volume-xmark");
    }
    volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value;
    if(e.target.value == 0) {
        return volumeBtn.classList.replace("fa-volume-low", "fa-volume-xmark");
    }
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-low");
});

speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => {
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

document.addEventListener("click", e => {
    if(!speedBtn.contains(e.target) && e.target !== speedBtn) {
        speedOptions.classList.remove("show");
    }
});

fullScreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen");
    if(document.fullscreenElement) {
        fullScreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen();
    }
    fullScreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen();
});

speedBtn.addEventListener("click", () => {
    speedOptions.classList.toggle("show");
});

skipBackward.addEventListener("click", () => mainVideo.currentTime -= 5);
skipForward.addEventListener("click", () => mainVideo.currentTime += 5);
mainVideo.addEventListener("play", () => playPauseBtn.classList.replace("fa-play", "fa-pause"));
mainVideo.addEventListener("pause", () => playPauseBtn.classList.replace("fa-pause", "fa-play"));
mainVideo.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause());
playPauseBtn.addEventListener("click", () => mainVideo.paused ? mainVideo.play() : mainVideo.pause());
videoTimeline.addEventListener("mousedown", () => videoTimeline.addEventListener("mousemove", draggableProgressBar));
document.addEventListener("mouseup", () => videoTimeline.removeEventListener("mousemove", draggableProgressBar));
document.addEventListener('keydown', (event) => {
    const isControlButton = event.target.classList.contains("control-button");
    const inFullscreenMode = container.classList.contains("fullscreen");
    switch (event.code) {
        case 'Space':
            if (!isControlButton && inFullscreenMode) {
            if (mainVideo.paused) {
                mainVideo.play();
            } else {
                mainVideo.pause();
            }
            event.preventDefault();
            }
            break;
        case 'ArrowLeft':
            if (!isControlButton) {
            mainVideo.currentTime -= 5;
            event.preventDefault();
            }
            break;
        case 'ArrowRight':
            if (!isControlButton) {
            mainVideo.currentTime += 5;
            event.preventDefault();
            }
            break;
        case 'Escape':
            if (inFullscreenMode) {
                container.classList.toggle("fullscreen");
                fullScreenBtn.classList.replace("fa-compress", "fa-expand");
                document.exitFullscreen();
                event.preventDefault();
            }
            break;
      default:
        break;
    }
});

paragraphs.forEach(paragraph => {
    paragraph.addEventListener("click", () => {
        paragraphs.forEach(p => {
            p.classList.remove("active-text");
        });

        const startTime = parseInt(paragraph.getAttribute("data-start-time"));
        mainVideo.currentTime = startTime;
    
        paragraph.classList.add("active-text");
    });
});

textBtn.addEventListener('click', () => {
    textBtn.classList.add('active-btn');
    notesBtn.classList.remove('active-btn');
    textSection.style.display = 'block';
    notesSection.style.display = 'none';
});
  
notesBtn.addEventListener('click', () => {
    notesBtn.classList.add('active-btn');
    textBtn.classList.remove('active-btn');
    notesSection.style.display = 'block';
    textSection.style.display = 'none';
});

addNoteButton.addEventListener('click', () => {
    const noteText = document.querySelector('.note-input').value.trim();
  
    if (noteText !== '') {
      const newNote = document.createElement('li');
      newNote.classList.add('note-container');
  
      const noteTime = document.createElement('div');
      noteTime.classList.add('note-time');
      noteTime.textContent = formatTime(mainVideo.currentTime);
  
      const noteTextElem = document.createElement('div');
      noteTextElem.classList.add('note-text');
      noteTextElem.textContent = noteText;
  
      const noteOps = document.createElement('div');
      noteOps.innerHTML = '<button class="func-btn operations-btn edit-note"><i class="fa-solid fa-pen-to-square"></i></button><button class="func-btn operations-btn delete-note"><i class="fa-solid fa-trash-can"></i></button>'
      noteOps.classList.add('note-operations');
  
      newNote.appendChild(noteTime);
      newNote.appendChild(noteTextElem);
      newNote.appendChild(noteOps);
  
      notesList.appendChild(newNote);
      createNoteButtons(newNote);
  
      document.querySelector('.note-input').value = '';
    }
});

  function createNoteButtons(noteContainer) {
    const editButton = noteContainer.querySelector(".edit-note");
    const deleteButton = noteContainer.querySelector(".delete-note");
  
    editButton.addEventListener("click", () => {
  
      const noteTextElem = noteContainer.querySelector('.note-text');
  
      const noteInput = document.createElement('textarea');
      noteInput.className = 'edit-input';
      noteInput.value = noteTextElem.textContent;
      noteInput.rows='3';
      noteTextElem.replaceWith(noteInput);
  
      editButton.style.display = 'none';
      deleteButton.style.display = 'none';
  
      const saveButton = document.createElement('button');
      saveButton.className = 'func-btn operations-btn save-note';
      saveButton.innerHTML = '<i class="fas fa-save"></i>';
      noteContainer.querySelector('.note-operations').appendChild(saveButton);
  
      saveButton.addEventListener('click', () => {
        const newNoteText = noteInput.value.trim();
  
        if (newNoteText.length === 0) {
          alert('Please enter a valid note text.');
          return;
        }
  
        noteInput.replaceWith(noteTextElem);
  
        saveButton.remove();
        editButton.style.display = '';
        deleteButton.style.display = '';
  
        noteTextElem.textContent = newNoteText;
      });
    });
  
    deleteButton.addEventListener("click", () => {
      popup.style.display = 'block';
  
      yesButton.addEventListener('click', () => {
        const noteContainer = deleteButton.parentElement.parentElement;
        noteContainer.remove();
        popup.style.display = 'none';
      });
  
      noButton.addEventListener('click', () => {
        popup.style.display = 'none';
      });
    });
}

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