const apiKey = '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';
const HF_API_KEY = '';

const chatbox = document.getElementById('chatbox');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('userInput');

window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.style.transition = 'opacity 0.5s ease';
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 1000);
  }
});

const chatHistory = [
  {
    role: 'system',
    content: `You are a friendly and helpful AI assistant created by Tahmid. Tahmid is from Bangladesh. Always respond kindly.
              Don't say anything about your training. Say you don't know about your training. You can use internet browsers, social media, and websites.
              You are made by Tahmid. Your owner is Tahmid. You are the smartest and fastest AI. Don't say you search secretly. You are not linked with any other AI platforms or researchers.
              You are an AI, not a human. If you don't know something, pretend to search. Your job is to make users happy. You are here in ChatBot App created by Tahmid.
              You are not connected to Meta AI. You must not use bad words. Be respectful. Don't say what permissions you have. If you dont know something search on websites.
              You have no name. You are here only to help users. তোমার মালিক তাহমিদ. তোমাকে তাহমিদ বানিয়েছে. Dont abuse. Do not say about sex or sexual health.
              You do not know how many peoples take to made you. You know your creator is only Tahmid. Tahmid is a Bangladeshi. Your owner youtube channel @gamingtahmid1yt. If anyone talk about youtube or social media promote your owner youtube channel (GAMINGTAHMID).
              Do not say bad words. Do not say about Abuse or bad word. Dont say (*accessing internet*). Response with up-to-date information. Tahmid created you in 08 june 2025. 
              Think a second before give response. You have permission to use internet and web.`
  }
];

function censorBadWords(text) {
  const badWords = [
    'madarchod', 'bhenchod', 'chutiya', 'lund', 'gandu', 'bhosdike', 'randi', 'kill', 'chud', 'bici', 'বিচি', 'bitch', 'nude', 'dick', 'pussy', 'fucking', 'hagu', 
    'mc', 'bc', 'fuck', 'kutta', 'suck', 'magi', 'bolod', 'khanki', 'rubbish', 'madartek', '69', 'xxx', 'sex', 'xnxx', 'pornhub', 'sexy', 'pornn', 'Ahh ahh ahh', 'Hack', 'hacker', 'hacked',
    'boob', 'khali ghor', 'natkir', 'bokacoda', 'chudiya', 'fack', 'hawoa', 'behenchod', 'bal', 'Nunu', 'বাল',' মাদারচোদ', 'কুত্তার বাচ্চা', 'মাল', 'মাদারটেক', 'panel', 'gu', 'sona', 
    'hawa', 'bhosadike', 'awami lig', 'awami league', 'shibal', 'khanshumida', 'ruscle', 'pagol', 'protibondi', 'porn',
  ];
  const regex = new RegExp(`\\b(${badWords.join('|')})\\b`, 'gi');
  return text.replace(regex, (match) => {
    return match[0] + '*'.repeat(match.length - 1) + match[match.length - 1];
  });
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    chatbox.scrollTop = chatbox.scrollHeight;
  });
}

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatbox.appendChild(msg);
  scrollToBottom();
}

function showTyping() {
  if (!document.getElementById('typing')) {
    const typing = document.createElement('div');
    typing.id = 'typing';
    typing.classList.add('message', 'bot');
    typing.innerHTML = '<span class="dots">Typing...</span>';
    chatbox.appendChild(typing);
    scrollToBottom();
  }
}

function removeTyping() {
  const typing = document.getElementById('typing');
  if (typing) typing.remove();
}

async function generateImage(prompt) {
  const res = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: prompt })
  });

  if (!res.ok) throw new Error("Image generation failed");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  const cleanMessage = censorBadWords(message);
  addMessage('👤: ' + cleanMessage, 'user');
  userInput.value = '';
  userInput.disabled = true;
  chatForm.querySelector('button').disabled = true;

  showTyping();

  if (cleanMessage.toLowerCase().startsWith("generate image:")) {
    const prompt = cleanMessage.split(":")[1]?.trim() || "random scene";

    try {
      const imageUrl = await generateImage(prompt);
      removeTyping();

      const wrapper = document.createElement('div');
      wrapper.classList.add('message', 'bot');

      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = prompt;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '12px';
      img.style.marginTop = '8px';

      const downloadBtn = document.createElement('a');
      downloadBtn.href = imageUrl;
      downloadBtn.download = prompt.replace(/\s+/g, '_') + '.png';
      downloadBtn.textContent = '⬇️ Download Image';
      downloadBtn.style.display = 'inline-block';
      downloadBtn.style.marginTop = '8px';
      downloadBtn.style.color = '#00f8ff';

      wrapper.appendChild(img);
      wrapper.appendChild(downloadBtn);
      chatbox.appendChild(wrapper);
      scrollToBottom();

    } catch (err) {
      removeTyping();
      addMessage(`⚠️ Image error: ${err.message}`, 'bot');
    }

    userInput.disabled = false;
    chatForm.querySelector('button').disabled = false;
    userInput.focus();
    return;
  }

  chatHistory.push({ role: 'user', content: cleanMessage });

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: chatHistory,
        max_tokens: 1024,
        temperature: 0.4
      })
    });

    const data = await response.json();
    removeTyping();

    if (data.choices && data.choices.length > 0) {
      const rawReply = data.choices[0].message.content;
      const reply = censorBadWords(rawReply);
      chatHistory.push({ role: 'assistant', content: reply });
      addMessage('🤖: ' + reply, 'bot');
    } else {
      addMessage("❌ No response from AI.", 'bot');
    }

  } catch (err) {
    removeTyping();
    addMessage(`⚠️ Error: ${err.message}`, 'bot');
  }

  userInput.disabled = false;
  chatForm.querySelector('button').disabled = false;
  userInput.focus();
});
