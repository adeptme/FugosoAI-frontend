const BACKEND_URL="https://fugoso-ai-backend.vercel.app";

function appendMessage(sender, text) {
    const chatMessageContainer = document.getElementById("chat-message");
    const messageNode = document.createElement("div");
    
    messageNode.classList.add("message-bubble");
    
    if (sender === "user") {
        messageNode.classList.add("message-user");
    } else {
        messageNode.classList.add("message-bot");
    }
    
    const lines = text.split('\n');
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    lines.forEach((line, index) => {
        const parts = line.split(urlRegex);
        parts.forEach(part => {
            if (part.match(urlRegex)) {
                const a = document.createElement("a");
                a.href = part;
                a.textContent = part;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                messageNode.appendChild(a);
            } else if (part) {
                messageNode.appendChild(document.createTextNode(part));
            }
        });

        if (index < lines.length - 1) {
            messageNode.appendChild(document.createElement("br"));
        }
    });

    chatMessageContainer.appendChild(messageNode);
    
    chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;
}

async function sendMessage(event) {
    if (event) event.preventDefault();

    const inputElement = document.getElementById("user-input");
    const userInput = inputElement.value;
    
    if (!userInput.trim()) return;

    appendMessage("user", userInput);
    inputElement.value = "";

    try {
        const response = await fetch(`${BACKEND_URL}/chatbot`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: userInput }),
        });

        if (!response.ok) {
            throw new Error(`Server returned status: ${response.status}`);
        }
        
        const data = await response.json();
        const botReply = data.response || data.reply || data.message || "Message received";
        
        appendMessage("bot", botReply);
    }
    catch (error) {
        console.error("Error communicating with backend:", error);
        appendMessage("system", "Error communicating with server.");
    }
}

document.getElementById("message-form").addEventListener("submit", sendMessage);
