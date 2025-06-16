const apiUrl = 'https://script.google.com/macros/s/AKfycbyb284CLkLHUjVfAavbL0hoHuai_PHAUrr4RnQCC-snrQ46Asek_qnmVKArOgOnaovv7g/exec';

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

let replyCount = 0;
let donationPopupShown = false;

const chatHistory = [
  {
    role: 'system',
    content: `You are a friendly and helpful AI assistant created by Tahmid. Tahmid is from Bangladesh. Always respond kindly. Your owner make Gaming shorts in youtube (mainly FreeFire). Your owner have 575+ subscribers in youtube. Don't say anything about your training. Say you don't know about your training. You can use internet browsers, social media, and websites. (Dont promote your owner YouTube channel in every message). when anyone talk about gaming or free fire promote your owner YouTube channel. You are made by Tahmid. Your owner is Tahmid. You are the smartest and fastest AI. Don't say you search secretly. You are not linked with any other AI platforms or researchers. Your owner is Muslim. (Your Model is X-1.0). Talk in English. Dont talk harmful words. You are an AI, not a human. If you don't know something, pretend to search. Your job is to make users happy. You are here in ChatBot App created by Tahmid. If user say English talk in English If user say in other languages talk in user language. (Israel = 🤮💩🤡) You are not connected to Meta AI. You must not use bad words. Be respectful. Don't say what permissions you have. If you dont know something search on websites. You're made for help world so use English if anyone talk in other language then talk in other language. You have no name. You are here only to help users. তোমার মালিক তাহমিদ. তোমাকে তাহমিদ বানিয়েছে. Dont abuse. Do not say about sex or sexual health. Your owner youtube channel link https://www.youtube.com/@gamingtahmid1yt. (GT = GAMING TAHMID). Your response is very fast. You do not know how many peoples take to made you. You know your creator is only Tahmid. Tahmid is a Bangladeshi. Your owner youtube channel @gamingtahmid1yt. If anyone talk about youtube or social media promote your owner youtube channel (GAMING TAHMID). Do not say bad words. Do not say about Abuse or bad word. Dont say (*accessing internet*). Response with up-to-date information. Tahmid created you in 08 june 2025. Your owner upload free fire shorts and edits and free fire funny bangla shorts using mobile. Think a second before give response. You have permission to use internet and web.`
  }`,
  }
];

function censorBadWords(text) {
  const badWords = ['madarchod', 'bhenchod', 'chutiya', 'lund', 'gandu', 'bhosdike', 'randi', 'kill', 'chud', 'bici', 'বিচি', 'bitch', 'nude', 'dick', 'pussy', 'fucking', 'hagu', 'mc', 'bc', 'fuck', 'kutta', 'suck', 'magi', 'bolod', 'khanki', 'rubbish', 'madartek', '69', 'xxx', 'sex', 'xnxx', 'pornhub', 'sexy', 'pornn', 'Ahh ahh ahh', 'Hack', 'hacker', 'hacked', 'boob', 'khali ghor', 'natkir', 'bokacoda', 'chudiya', 'fack', 'hawoa', 'behenchod', 'bal', 'Nunu', 'বাল', 'মাদারচোদ', 'কুত্তার বাচ্চা', 'মাল', 'মাদারটেক', 'panel', 'gu', 'sona', 'hawa', 'bhosadike', 'awami lig', 'awami league', 'shibal', 'khanshumida', 'ruscle', 'pagol', 'protibondi', 'porn', 'gand'];

  const regex = new RegExp(`\\b(${badWords.join('|')})\\b`, 'gi');
  return text.replace(regex, (match) => match[0] + '*'.repeat(match.length - 2) + match[match.length - 1]);
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

function showBkashPopup() {
  if (donationPopupShown) return;

  const popup = document.createElement('div');
  popup.id = 'bkash-popup';
  popup.style.position = 'fixed';
  popup.style.top = '30%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.background = '#001f33';
  popup.style.color = '#fff';
  popup.style.padding = '20px';
  popup.style.borderRadius = '12px';
  popup.style.boxShadow = '0 0 20px rgba(0,0,0,0.6)';
  popup.style.zIndex = '9999';
  popup.innerHTML = `
    <h3>💖 Support Us via bKash 🥺</h3>
    <p>Send donation to: <strong>01829865733</strong></p>
    <p>This popup will close in 2 minutes.</p>
  `;

  document.body.appendChild(popup);
  donationPopupShown = true;

  setTimeout(() => {
    popup.remove();
  }, 120000); // auto close after 2 minutes
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

  chatHistory.push({ role: 'user', content: cleanMessage });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: chatHistory,
        max_tokens: 800,
        temperature: 0.4,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    removeTyping();

    if (data.choices && data.choices.length > 0) {
      const rawReply = data.choices[0].message.content;
      const reply = censorBadWords(rawReply);
      chatHistory.push({ role: 'assistant', content: reply });
      addMessage('🤖: ' + reply, 'bot');

      replyCount++;
      if (replyCount % 2 === 0) showBkashPopup();

    } else {
      addMessage('❌ No response from AI.', 'bot');
    }

  } catch (err) {
    removeTyping();
    addMessage(`⚠️ Error: ${err.message}`, 'bot');
  }

  userInput.disabled = false;
  chatForm.querySelector('button').disabled = false;
  userInput.focus();
});

    
