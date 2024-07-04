document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password-input");
    const loginButton = document.getElementById("login-button");
    const welcomeContainer = document.getElementById("welcome-container");
    const errorMessage = document.getElementById("error-message");
    const chatContainer = document.getElementById("chat-container");
    const themeToggleButton = document.getElementById("theme-toggle");
    const chatWindow = document.getElementById("chat-window");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const fileInput = document.getElementById("file-input");

    let isDarkMode = false;
    const PASSWORD = "amanishjayswal";
    const ONE_HOUR = 3600000; // 1 hour in milliseconds

    // Check password
    loginButton.addEventListener("click", () => {
        if (passwordInput.value === PASSWORD) {
            welcomeContainer.classList.add("hidden");
            chatContainer.classList.remove("hidden");
            loadMessages();
        } else {
            errorMessage.classList.remove("hidden");
        }
    });

    themeToggleButton.addEventListener("click", () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle("dark-mode", isDarkMode);
    });

    sendButton.addEventListener("click", () => {
        sendMessage();
    });

    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    fileInput.addEventListener("change", () => {
        sendFile();
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            const messageData = {
                content: message,
                timestamp: Date.now(),
                type: 'sent',
                sender: 'You'
            };
            displayMessage(messageData);
            saveMessage(messageData);
            messageInput.value = "";
        }
    }

    function sendFile() {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const messageData = {
                    content: `<a href="${event.target.result}" download="${file.name}">Download ${file.name}</a>`,
                    timestamp: Date.now(),
                    type: 'sent',
                    sender: 'You'
                };
                displayMessage(messageData);
                saveMessage(messageData);
            };
            reader.readAsDataURL(file);
        }
    }

    function displayMessage(messageData) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", messageData.type);
        messageElement.innerHTML = `
            <p>${messageData.content}</p>
            <div class="info">
                <span>${messageData.sender}</span> • <span>${new Date(messageData.timestamp).toLocaleTimeString()}</span>
            </div>`;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function saveMessage(messageData) {
        const messages = JSON.parse(localStorage.getItem("messages")) || [];
        messages.push(messageData);
        localStorage.setItem("messages", JSON.stringify(messages));
    }

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem("messages")) || [];
        const currentTime = Date.now();
        const filteredMessages = messages.filter(msg => (currentTime - msg.timestamp) < ONE_HOUR);
        filteredMessages.forEach(displayMessage);
        localStorage.setItem("messages", JSON.stringify(filteredMessages));
    }

    // Clear messages older than 1 hour on page load
    setInterval(() => {
        const messages = JSON.parse(localStorage.getItem("messages")) || [];
        const currentTime = Date.now();
        const filteredMessages = messages.filter(msg => (currentTime - msg.timestamp) < ONE_HOUR);
        localStorage.setItem("messages", JSON.stringify(filteredMessages));
        chatWindow.innerHTML = "";
        filteredMessages.forEach(displayMessage);
    }, ONE_HOUR);
});
