// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Space AI website scripts loaded!');

    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button'); 
    const plusButton = document.getElementById('plus-button'); 
    const micButton = document.getElementById('mic-button'); 
    const fileInput = document.getElementById('file-input'); 
    const loadingIndicator = document.getElementById('loading-indicator');
    const initialPrompt = document.getElementById('initial-prompt'); 
    const noHistoryMessage = document.getElementById('no-history-message'); 

    // Chat limit variables
    let chatStartTime = Date.now(); // Start timer when the page loads
    const chatDurationLimit = 15 * 60 * 1000; // 15 minutes in milliseconds
    let isChatLimitReached = false;

    // Function to append a message to the chat display
    function appendMessage(sender, message) {
        if (initialPrompt && !initialPrompt.classList.contains('hidden')) {
            initialPrompt.classList.add('hidden');
        }
        if (noHistoryMessage && !noHistoryMessage.classList.contains('hidden')) {
            noHistoryMessage.classList.add('hidden');
        }

        const messageElement = document.createElement('div');
        messageElement.classList.add('flex', 'items-start', 'w-full'); 

        if (sender === 'ai') {
            messageElement.classList.add('justify-start'); 
        } else { 
            messageElement.classList.add('justify-end'); 
        }

        const messageBubble = document.createElement('div');

        if (sender === 'user') {
            if (message.length === 1) {
                messageBubble.classList.add(
                    'w-14', 'h-14', 
                    'rounded-full', 
                    'flex', 'items-center', 'justify-center', 
                    'bg-gray-900', 'text-white', 
                    'font-semibold', 'text-lg', 
                    'flex-shrink-0' 
                );
            } else {
                messageBubble.classList.add(
                    'p-3',
                    'rounded-xl',
                    'max-w-[75%]', 
                    'bg-gray-900', 'text-white', 
                    'font-semibold',
                    'whitespace-normal',
                    'break-words' 
                );
            }
        } else { 
            messageBubble.classList.add(
                'py-3', 'pr-3', 
                'rounded-lg', 
                'max-w-[90%]', 
                ...'bg-gray-100 text-gray-800'.split(' ') 
            );
        }
        messageBubble.textContent = message;

        messageElement.appendChild(messageBubble);
        
        if (sender === 'ai') {
            const reactionIcons = document.createElement('div');
            reactionIcons.classList.add('flex', 'space-x-3', 'mt-2', 'text-gray-500');

            const likeIcon = document.createElement('span');
            likeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:text-gray-700">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.447 2.075-1.107 1.488-1.775 8.25-4.45 8.25-4.45s2.571 1.253 2.571 2.248c0 .995-1.444 2.077-2.925 3.816-1.147 1.38-2.91 3.03-5.025 4.316-.381.2-.781.41-1.196.606Zm10.635-4.45c-.806 0-1.533.447-2.075 1.107-1.488 1.775-8.25 4.45-8.25 4.45s-2.571-1.253-2.571-2.248c0-.995 1.444-2.077 2.925-3.816 1.147-1.38 2.91-3.03 5.025-4.316.381-.2.781-.41 1.196-.606Z" />
                                  </svg>`;
            likeIcon.title = "Like";

            const dislikeIcon = document.createElement('span');
            dislikeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:text-gray-700">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 15.75a3.75 3.75 0 0 0 7.5 0V9c0-.75-.293-1.5-.879-2.086l-4.72-4.72A3.75 3.75 0 0 0 6 2.25H2.25c-.414 0-.75.336-.75.75v10.5c0 .414.336.75.75.75h4.5Zm12.75-6a3.75 3.75 0 0 0-7.5 0V15c0 .75.293 1.5.879 2.086l4.72 4.72A3.75 3.75 0 0 0 18 21.75h3.75c.414 0 .75-.336.75-.75V11.25c0-.414-.336-.75-.75-.75h-4.5Z" />
                                    </svg>`;
            dislikeIcon.title = "Dislike";

            const soundIcon = document.createElement('span');
            soundIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:text-gray-700">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9.005 9.005 0 0 1 3.892 4.113m-1.063 1.063a7.5 7.5 0 0 0-14.735 0m-1.063-1.063a9.005 9.005 0 0 1 3.892-4.113M12 18.75a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 .75.75ZM12 12.75a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 .75.75ZM12 6.75a.75.75 0 0 0 .75-.75V4.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 .75.75Z" />
                                  </svg>`;
            soundIcon.title = "Listen";

            const regenerateIcon = document.createElement('span');
            regenerateIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:text-gray-700">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.181A1.5 1.5 0 0 0 5.412 19.06L3.181 21.29a1.5 1.5 0 0 1-2.122 0l-.282-.282a1.5 1.5 0 0 1 0-2.122l3.181-3.181ZM19.495 21.29l-3.181-3.181A1.5 1.5 0 0 0 18.588 16.94l2.23-2.23a1.5 1.5 0 0 1 2.122 0l.282.282a1.5 1.5 0 0 1 0-2.122l-3.181-3.181Z" />
                                        </svg>`;
            regenerateIcon.title = "Regenerate response";

            const copyIcon = document.createElement('span');
            copyIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:text-gray-700">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h4.5M18 14.25V9a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 9 9v5.25m7.5-10.5H12a2.25 2.25 0 0 0-2.25 2.25v4.5m7.5-10.5a.75.75 0 0 1 .75-.75h.75c.414 0 .75.336.75.75v.75m-4.5-9h-1.5m.75 15.75a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v-.75m4.5 9h1.5m-.75-10.5a.75.75 0 0 1-.75-.75v-.75c0-.414.336-.75.75-.75h.75m-4.5 9h-1.5" />
                                  </svg>`;
            copyIcon.title = "Copy";
            copyIcon.addEventListener('click', () => {
                const textToCopy = messageBubble.textContent;
                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        console.log('Text copied to clipboard:', textToCopy);
                    }).catch(err => {
                        console.error('Failed to copy text:', err);
                        document.execCommand('copy');
                    });
                }
            });

            const shareIcon = document.createElement('span');
            shareIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 cursor-pointer hover:text-gray-700">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.75 3.75 0 0 1 18 19.5H6.75Z" />
                                  </svg>`;
            shareIcon.title = "Share";

            reactionIcons.appendChild(likeIcon);
            reactionIcons.appendChild(dislikeIcon);
            reactionIcons.appendChild(soundIcon);
            reactionIcons.appendChild(regenerateIcon);
            reactionIcons.appendChild(copyIcon);
            reactionIcons.appendChild(shareIcon);

            const messageContentWrapper = document.createElement('div');
            messageContentWrapper.classList.add('flex', 'flex-col', 'items-start'); 
            messageContentWrapper.appendChild(messageBubble);
            messageContentWrapper.appendChild(reactionIcons);
            messageElement.appendChild(messageContentWrapper); 
        } else { 
            const messageContentWrapper = document.createElement('div');
            messageContentWrapper.classList.add('flex', 'flex-col', 'items-end'); 
            messageContentWrapper.appendChild(messageBubble);
            messageElement.appendChild(messageContentWrapper);
        }

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage(promptText = null, imageData = null) {
        // Check if chat limit is reached
        if (isChatLimitReached) {
            appendMessage('ai', 'You have reached your chat LIMIT. Log in to get more!');
            return; // Stop sending message
        }

        console.log('sendMessage called. Prompt:', promptText, 'Image Data:', imageData ? 'present' : 'absent');
        let prompt;
        if (promptText) {
            prompt = promptText;
        } else {
            prompt = userInput.value.trim();
        }

        if (prompt === '' && !imageData) {
            console.log('User input is empty and no image data. Returning.');
            return;
        }

        if (!promptText) {
            appendMessage('user', prompt);
            if (imageData) {
                const imageMessageElement = document.createElement('div');
                imageMessageElement.classList.add('w-full', 'flex', 'py-2', 'justify-end');
                const imageBubble = document.createElement('div');
                imageBubble.classList.add('p-2', 'rounded-xl', 'bg-gray-900', 'shadow-md', 'max-w-xs');
                const img = document.createElement('img');
                img.src = imageData;
                img.classList.add('rounded-lg', 'max-w-full', 'h-auto');
                imageBubble.appendChild(img);
                imageMessageElement.appendChild(imageBubble);
                chatMessages.appendChild(imageMessageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                console.log('Image appended to chat messages.');
            }
        } else {
            console.log('Internal prompt triggered:', prompt);
        }

        userInput.value = '';
        console.log('User input cleared.');

        loadingIndicator.classList.remove('hidden');
        console.log('Loading indicator shown.');

        sendButton.classList.add('hidden'); 
        plusButton.classList.add('hidden'); 
        micButton.classList.add('hidden'); 


        try {
            let chatHistory = [];
            const parts = [];

            if (prompt) {
                parts.push({ text: prompt });
            }
            if (imageData) {
                parts.push({
                    inlineData: {
                        mimeType: "image/png", 
                        data: imageData.split(',')[1] 
                    }
                });
                console.log('Image data added to parts for API call.');
            }
            chatHistory.push({ role: "user", parts: parts });

            const payload = { contents: chatHistory };
            const apiKey = ""; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            console.log('Attempting to fetch from API:', apiUrl);
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            console.log('API response received. Status:', response.status);
            const result = await response.json();
            console.log('API response parsed:', result);

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const aiResponse = result.candidates[0].content.parts[0].text;
                appendMessage('ai', aiResponse);
                console.log('AI response appended.');
            } else {
                appendMessage('ai', 'Sorry, ik kon geen antwoord krijgen van Space AI. Probeer het opnieuw.');
                console.error('Unexpected API response structure:', result);
            }
        } catch (error) {
            console.error('Error communicating with Space AI:', error);
            appendMessage('ai', 'Oeps! Er ging iets mis. Controleer uw netwerkverbinding of probeer het later opnieuw.');
        } finally {
            loadingIndicator.classList.add('hidden');
            console.log('Loading indicator hidden.');
            handleInputButtonVisibility();
        }
    }

    // Function to manage button visibility based on user input
    function handleInputButtonVisibility() {
        // Only update visibility if chat limit is not reached
        if (!isChatLimitReached) {
            console.log('handleInputButtonVisibility called. Current input:', userInput.value.trim());
            const hasInput = userInput.value.trim() !== '';

            if (hasInput) {
                sendButton.classList.remove('hidden');    // Show send button
                plusButton.classList.add('hidden'); // Hide plus button
            } else {
                sendButton.classList.add('hidden');    // Hide send button
                plusButton.classList.remove('hidden'); // Show plus button
            }
            micButton.classList.remove('hidden'); // Ensure mic button is always visible
        } else {
            // If chat limit is reached, hide all input buttons
            sendButton.classList.add('hidden');
            plusButton.classList.add('hidden');
            micButton.classList.add('hidden');
            userInput.disabled = true; // Disable input field
            userInput.placeholder = "Chat limit reached. Please log in.";
        }
    }

    // Check if core chat elements exist on the current page before adding listeners
    if (chatMessages && userInput && sendButton && loadingIndicator && micButton && plusButton) {
        console.log('All core chat elements found. Attaching event listeners.');

        // Initialize SpeechRecognition if supported by the browser
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        let recognition;
        let isListening = false;

        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false; // Stop listening after a pause
            recognition.interimResults = true; // Get interim results
            recognition.lang = 'nl-NL'; // Set language to Dutch

            // Event handler for when speech recognition starts
            recognition.onstart = () => {
                isListening = true;
                micButton.classList.add('bg-blue-200'); // Indicate active listening
                console.log('Voice recognition started. Speak now.');
                // Hide other input icons when listening starts
                plusButton.classList.add('hidden'); // Hide plus button
                sendButton.classList.add('hidden'); // Hide send button
                userInput.placeholder = "Listening...";
            };

            // Event handler for speech recognition results
            recognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');

                userInput.value = transcript; // Update the input field with the transcribed text
                // Show send button as soon as there's text
                sendButton.classList.remove('hidden'); // Show send button
                plusButton.classList.add('hidden'); // Ensure plus button is hidden
                micButton.classList.remove('bg-blue-200'); // Remove active indicator
            };

            // Event handler for when speech recognition ends
            recognition.onend = () => {
                isListening = false;
                micButton.classList.remove('bg-blue-200'); // Remove active indicator
                console.log('Voice recognition ended.');
                userInput.placeholder = "Stel een vraag"; // Reset placeholder

                // If there's text in the input field after speech, send it
                if (userInput.value.trim() !== '') {
                    sendMessage(userInput.value.trim());
                }
                // Restore button visibility based on input content
                handleInputButtonVisibility();
            };

            // Event handler for errors in speech recognition
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                appendMessage('ai', `Voice input error: ${event.error}. Probeer alstublieft te typen of klik opnieuw op de microfoon.`);
                isListening = false;
                micButton.classList.remove('bg-blue-200');
                userInput.placeholder = "Stel een vraag"; // Reset placeholder
                // Restore button visibility
                handleInputButtonVisibility();
            };

            // Add click listener to the microphone button
            console.log('Attempting to attach micButton listener. micButton is:', micButton); 
            if (micButton) { 
                micButton.addEventListener('click', () => {
                    if (recognition) { 
                        if (!isListening) {
                            recognition.start();
                        } else {
                            recognition.stop(); 
                        }
                    } else {
                        console.error('SpeechRecognition object is not available for use.');
                        appendMessage('ai', 'Spraakinvoer is niet beschikbaar. Probeer alstublieft te typen.');
                    }
                });
                console.log('Microphone button listener attached for voice input.');
            } else {
                console.warn('micButton element not found after DOMContentLoaded, cannot attach event listener for speech recognition.');
            }

        } else {
            console.warn('Web Speech API not supported in this browser.');
            if (micButton) { 
                micButton.style.display = 'none'; // Hide microphone button if not supported
            }
            appendMessage('ai', 'Uw browser ondersteunt geen spraakinvoer. Gebruik alstublieft de tekstinvoer.');
        }

        // Initial call to set correct button visibility on page load
        handleInputButtonVisibility();

        // Event listeners for chat functionality
        sendButton.addEventListener('click', () => {
            console.log('Send button clicked.');
            sendMessage();
        });
        console.log('Send button click listener attached.');

        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                console.log('Enter key pressed.');
                sendMessage();
            }
        });
        console.log('User input keypress listener attached.');

        userInput.addEventListener('input', handleInputButtonVisibility);
        console.log('User input listener attached for visibility.');


        if (fileInput) { 
            plusButton.addEventListener('click', () => {
                console.log('Plus button clicked. Triggering file input.');
                fileInput.click(); 
            });
            console.log('PlusButton click listener attached for file input.');

            fileInput.addEventListener('change', (event) => {
                console.log('File input change event fired.');
                const files = event.target.files;
                if (files.length > 0) {
                    const file = files[0];
                    console.log('File selected:', file.name, file.type);

                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64Data = e.target.result;
                            console.log('Image file read successfully. Sending message with image.');
                            sendMessage("Afbeelding verzonden.", base64Data); 
                        };
                        reader.onerror = (error) => {
                            console.error("Error reading image file:", error);
                            appendMessage('ai', 'Kon de afbeelding niet lezen. Probeer een ander afbeeldingsbestand.');
                        };
                        reader.readAsDataURL(file);
                    } else {
                        console.log('Non-image file selected. Sending message about the file.');
                        appendMessage('user', `Bestand verzonden: ${file.name}`);
                        appendMessage('ai', 'Bestandsuploads voor niet-afbeeldingsbestanden worden momenteel niet verwerkt door de AI. Alleen afbeeldingen worden ondersteund voor AI-analyse.');
                        handleInputButtonVisibility(); 
                    }
                } else {
                    console.log('No file selected after opening file input (dialog probably cancelled).');
                    handleInputButtonVisibility(); 
                }
                fileInput.value = ''; 
                console.log('File input value cleared.');
            });
            console.log('File input change listener attached.');
        } else {
            console.warn('fileInput element not found. File upload functionality might be limited.');
        }

        // Set up the chat limit timer
        setTimeout(() => {
            isChatLimitReached = true;
            appendMessage('ai', 'You have reached your chat LIMIT. Log in to get more!');
            handleInputButtonVisibility(); // Update button visibility and disable input
        }, chatDurationLimit);

    } else {
        console.warn('One or more core chat elements NOT found on this page. Chat functionality not initialized.');
        console.log('chatMessages:', chatMessages);
        console.log('userInput:', userInput);
        console.log('sendButton:', sendButton);
        console.log('loadingIndicator:', loadingIndicator);
        console.log('micButton:', micButton);
        console.log('plusButton:', plusButton);
    }
});
