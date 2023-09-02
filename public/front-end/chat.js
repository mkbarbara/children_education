const messageInput = document.querySelector(".input-message");
  const sendMessageButton = document.querySelector(".btn-body.send-message");
  const messagesList = document.querySelector(".messages-list");

  sendMessageButton.addEventListener("click", function() {
    const messageText = messageInput.value.trim();
    if (messageText !== "") {
      const messageItem = createMessageItem(messageText);
      messagesList.appendChild(messageItem);
      messageInput.value = "";
      scrollToBottom(messagesList);
    }
  });

  function createMessageItem(messageText) {
    const messageItem = document.createElement("li");
    messageItem.classList.add("message-item");

    const userContainer = document.createElement("div");
    userContainer.className = "user-container";

    const image = document.createElement("img");
    image.classList.add("image");
    image.src = "images/user.png";
    userContainer.appendChild(image);

    const text = document.createElement("span");
    text.textContent = messageText;
    userContainer.appendChild(text);

    const time = document.createElement("p");
    time.className = "message-time";
    time.textContent = getCurrentTime();

    messageItem.appendChild(userContainer);
    messageItem.appendChild(time);

    return messageItem;
  }

  function scrollToBottom(element) {
    element.scrollTop = element.scrollHeight;
  }

  function getCurrentTime() {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let amOrPm = hours >= 12 ? "pm" : "am";
  
    hours = hours % 12 || 12;
  
    minutes = minutes < 10 ? "0" + minutes : minutes;
  
    return hours + ":" + minutes + " " + amOrPm;
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