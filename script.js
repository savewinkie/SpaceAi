// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Space AI website scripts loaded!');

    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button'); // Paper airplane icon
    const soundWaveButton = document.getElementById('sound-wave-button'); // Plus icon for file upload
    const fileInput = document.getElementById('file-input'); // Hidden file input
    const loadingIndicator = document.getElementById('loading-indicator');
    const initialPrompt = document.getElementById('initial-prompt'); // Initial prompt element
    const microphoneButton = document.getElementById('microphone-button');

    // Initialize SpeechRecognition if supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    let isListening = false;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'nl-NL';

        recognition.onstart = () => {
            isListening = true;
            microphoneButton.classList.add('bg-blue-200');
            console.log('Voice recognition started. Speak now.');
            soundWaveButton.classList.add('hidden');
            sendButton.classList.add('hidden');
            userInput.placeholder = "Listening...";
        };

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            userInput.value = transcript;
            // Show send button only when final result is available
            if (event.results[0].isFinal) {
                sendButton.classList.remove('hidden');
                soundWaveButton.classList.add('hidden');
            }
        };

        recognition.onend = () => {
            isListening = false;
            microphoneButton.classList.remove('bg-blue-200');
            console.log('Voice recognition ended.');
            userInput.placeholder = "Stel een vraag";
            handleInputButtonVisibility();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            appendMessage('ai', `Voice input error: ${event.error}. Probeer alstublieft te typen of klik opnieuw op de microfoon.`);
            isListening = false;
            microphoneButton.classList.remove('bg-blue-200');
            userInput.placeholder = "Stel een vraag";
            handleInputButtonVisibility();
        };

        microphoneButton.addEventListener('click', () => {
            if (!isListening) {
                recognition.start();
            } else {
                recognition.stop();
            }
        });

        console.log('Microphone button listener attached for voice input.');
    } else {
        console.warn('Web Speech API not supported.');
        microphoneButton.style.display = 'none';
        appendMessage('ai', 'Uw browser ondersteunt geen spraakinvoer. Gebruik alstublieft de tekstinvoer.');
    }

    // Append message function
    function appendMessage(sender, message) {
        if (initialPrompt && !initialPrompt.classList.contains('hidden')) {
            initialPrompt.classList.add('hidden');
        }

        const messageContainer = document.createElement('div');
        messageContainer.classList.add('w-full', 'flex', 'py-4', 'px-6', 'items-start');

        const avatarElement = document.createElement('div');
        avatarElement.classList.add(
            'w-8', 'h-8', 'rounded-full', 'flex', 'items-center', 'justify-center',
            'font-semibold', 'text-sm', 'flex-shrink-0', 'mr-4'
        );

        const messageBubble = document.createElement('div');
        messageBubble.classList.add(
            'flex-grow', 'whitespace-pre-wrap', 'break-words', 'text-gray-800'
        );

        if (sender === 'user') {
            avatarElement.classList.add('bg-blue-500', 'text-white');
            avatarElement.textContent = 'JP';
            messageContainer.classList.add('justify-end');
            messageBubble.classList.add('p-3', 'rounded-xl', 'bg-blue-600', 'text-white', 'font-medium', 'shadow-md');
        } else {
            avatarElement.classList.add('bg-gray-200', 'text-gray-800');
            avatarElement.textContent = 'AI';
            messageContainer.classList.add('justify-start');
            messageBubble.classList.add('p-3', 'rounded-xl', 'bg-gray-100', 'text-gray-800', 'font-normal', 'shadow-md');
        }

        messageBubble.textContent = message;
        messageContainer.appendChild(avatarElement);

        const messageContentWrapper = document.createElement('div');
        messageContentWrapper.classList.add('flex', 'flex-col', 'flex-grow');
        messageContentWrapper.appendChild(messageBubble);

        if (sender === 'ai') {
            const reactionIcons = document.createElement('div');
            reactionIcons.classList.add('flex', 'space-x-3', 'mt-2', 'text-gray-500');

            // Like icon
            const likeIcon = document.createElement('span');
            likeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:text-gray-700">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.447 2.075-1.107 1.488-1.775 8.25-4.45 8.25-4.45s2.571 1.253 2.571 2.248c0 .995-1.444 2.077-2.925 3.816-1.147 1.38-2.91 3.03-5.025 4.316-.381.2-.781.41-1.196.606Zm10.635-4.45c-.806 0-1.533.447-2.075 1.107-1.488 1.775-8.25 4.45-8.25 4.45s-2.571-1.253-2.571-2.248c0-.995 1.444-2.077 2.925-3.816 1.147-1.38 2.91-3.03 5.025-4.316.381-.2.781-.41 1.196-.606Z" />
                                  </svg>`;
            likeIcon.title = "Like";

            // Dislike icon
            const dislikeIcon = document.createElement('span');
            dislikeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:text-gray-700">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 15.75a3.75 3.75 0 0 0 7.5 0V9c0-.75-.293-1.5-.879-2.086l-4.72-4.72A3.75 3.75 0 0 0 6 2.25H2.25c-.414 0-.75.336-.75.75v10.5c0 .414.336.75.75.75h4.5Zm12.75-6a3.75 3.75 0 0 0-7.5 0V15c0 .75.293 1.5.879 2.086l4.72 4.72A3.75 3.75 0 0 0 18 21.75h3.75c.414 0 .75-.336.75-.75V11.25c0-.414-.336-.75-.75-.75h-4.5Z" />
                                    </svg>`;
            dislikeIcon.title = "Dislike";

            // Sound icon
            const soundIcon = document.createElement('span');
            soundIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:text-gray-700">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9.005 9.005 0 0 1 3.892 4.113m-1.063 1.063a7.5 7.5 0 0 0-14.735 0m-1.324 0a7.458 7.458 0 0 0-1.007 3.186 7.48 7.48 0 0 0 1.007 3.182M7.5 8.25v7.5a1.5 1.5 0 0 0 1.842 1.415l3.69-1.15a1.5 1.5 0 0 0 .968-1.4v-4.52a1.5 1.5 0 0 0-.968-1.401l-3.69-1.149A1.5 1.5 0 0 0 7.5 8.25Z" />
                                  </svg>`;
            soundIcon.title = "Play Sound";

            // Copy icon
            const copyIcon = document.createElement('span');
            copyIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:text-gray-700">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16h8M8 12h8m-6-8h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                                    <rect width="12" height="14" x="4" y="6" rx="2" ry="2" />
                                  </svg>`;
            copyIcon.title = "Copy to clipboard";

            copyIcon.addEventListener('click', () => {
                // Copy the message text
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(message).then(() => {
                        alert('Tekst gekopieerd naar klembord!');
                    }).catch(err => {
                        console.error('Clipboard copy failed:', err);
                    });
                } else {
                    // fallback for older browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = message;
                    document.body.appendChild(textarea);
                    textarea.select();
                    try {
                        document.execCommand('copy');
                        alert('Tekst gekopieerd naar klembord!');
                    } catch (err) {
                        console.error('Fallback clipboard copy failed:', err);
                    }
                    document.body.removeChild(textarea);
                }
            });

            reactionIcons.appendChild(likeIcon);
            reactionIcons.appendChild(dislikeIcon);
            reactionIcons.appendChild(soundIcon);
            reactionIcons.appendChild(copyIcon);
            messageContentWrapper.appendChild(reactionIcons);
        }

        messageContainer.appendChild(messageContentWrapper);
        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show/hide send and upload buttons based on input value
    function handleInputButtonVisibility() {
        if (userInput.value.trim() !== '') {
            sendButton.classList.remove('hidden');
            soundWaveButton.classList.add('hidden');
        } else {
            sendButton.classList.add('hidden');
            soundWaveButton.classList.remove('hidden');
        }
    }

    userInput.addEventListener('input', handleInputButtonVisibility);

    sendButton.addEventListener('click', () => {
        sendMessage(userInput.value.trim());
    });

    userInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(userInput.value.trim());
        }
    });

    soundWaveButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            appendMessage('user', `📎 Bestandsupload: ${file.name}`);
            // You might want to handle uploading file to server here
            fileInput.value = '';
        }
    });

    // Send message function - placeholder to simulate AI response
    function sendMessage(text) {
        if (!text) return;
        appendMessage('user', text);
        userInput.value = '';
        handleInputButtonVisibility();

        loadingIndicator.classList.remove('hidden');

        // Simulate AI reply after delay
        setTimeout(() => {
            loadingIndicator.classList.add('hidden');
            const aiResponse = `Dit is een simulatie van AI-antwoord voor: "${text}"`;
            appendMessage('ai', aiResponse);
        }, 1500);
    }

    // On initial page load
    handleInputButtonVisibility();
});