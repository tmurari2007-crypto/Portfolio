document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const navChatbotBtn = document.getElementById('nav-chatbot-btn');
    
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');
    const chatMessages = document.getElementById('chatbot-messages');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Toggle Window
    function toggleChat() {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatInput.focus();
        }
    }

    chatbotToggle.addEventListener('click', toggleChat);
    chatbotClose.addEventListener('click', toggleChat);
    if(navChatbotBtn) navChatbotBtn.addEventListener('click', toggleChat);

    // Send Message
    function sendMessage(text) {
        if (!text.trim()) return;

        // Add user message to UI
        addMessage(text, 'user');
        chatInput.value = '';

        // Remove suggestions once conversation starts
        const suggestionsDiv = document.getElementById('chatbot-suggestions');
        if (suggestionsDiv) suggestionsDiv.remove();

        // Add loading indicator
        const loadingId = addMessage('...', 'bot', true);

        // Call Backend API
        fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        })
        .then(response => response.json())
        .then(data => {
            removeMessage(loadingId);
            addMessage(data.reply, 'bot');
        })
        .catch(error => {
            console.error('Chat error:', error);
            removeMessage(loadingId);
            addMessage("I'm sorry, I'm having trouble connecting to the server right now.", 'bot');
        });
    }

    function addMessage(text, sender, isLoading = false) {
        const id = 'msg-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.id = id;
        
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        
        if (isLoading) {
            bubble.innerHTML = '<i class="fa-solid fa-ellipsis fa-bounce"></i>';
        } else {
            // Basic HTML formatting for bot responses (bold, line breaks)
            const formattedText = text
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            bubble.innerHTML = formattedText;
        }

        msgDiv.appendChild(bubble);
        chatMessages.appendChild(msgDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // Event Listeners for input
    chatSubmit.addEventListener('click', () => {
        sendMessage(chatInput.value);
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(chatInput.value);
        }
    });

    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sendMessage(btn.textContent);
        });
    });
});
