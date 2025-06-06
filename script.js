// ===== LOGIN LOGIC =====
const loginBtn = document.getElementById('loginBtn');
const usernameInput = document.getElementById('username');
const msg = document.getElementById('msg');

if(loginBtn){
  loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if(username.length < 3){
      msg.textContent = "Username must be at least 3 characters.";
      return;
    }
    // Save username in localStorage (fake login)
    localStorage.setItem('username', username);
    // Redirect to home page
    window.location.href = 'home.html';
  });
}

// ===== LOGOUT LOGIC =====
const logoutBtn = document.getElementById('logoutBtn');
if(logoutBtn){
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('username');
    window.location.href = 'index.html';
  });
}

// Redirect user to login if not logged in (on home.html or quiz pages)
if(location.pathname.endsWith('home.html') || location.pathname.includes('quizzes')){
  if(!localStorage.getItem('username')){
    window.location.href = 'index.html';
  }
}

// ===== QUIZ LOGIC =====
function loadQuiz(questions) {
  const quizContainer = document.getElementById('quiz-container');
  const submitBtn = document.getElementById('submit-btn');
  const resultDiv = document.getElementById('result');

  if(!quizContainer || !submitBtn || !resultDiv) return;

  let userAnswers = new Array(questions.length).fill(null);

  // Build questions html
  quizContainer.innerHTML = '';

  questions.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-block');

    const qTitle = document.createElement('div');
    qTitle.classList.add('question');
    qTitle.textContent = `${index + 1}. ${q.question}`;
    questionDiv.appendChild(qTitle);

    const optionsList = document.createElement('ul');
    optionsList.classList.add('options');

    q.options.forEach((opt, i) => {
      const li = document.createElement('li');
      li.textContent = opt;
      li.addEventListener('click', () => {
        // clear selection for this question
        [...optionsList.children].forEach(child => {
          child.classList.remove('selected');
          child.classList.remove('correct');
          child.classList.remove('wrong');
        });
        // mark this option as selected
        li.classList.add('selected');
        // Save user answer
        userAnswers[index] = i;
      });
      optionsList.appendChild(li);
    });

    questionDiv.appendChild(optionsList);
    quizContainer.appendChild(questionDiv);
  });

  submitBtn.onclick = () => {
    // Check all questions answered
    if(userAnswers.includes(null)){
      alert('Please answer all questions before submitting.');
      return;
    }

    let score = 0;

    // Mark answers green/red
    const questionBlocks = quizContainer.querySelectorAll('.question-block');
    questions.forEach((q, idx) => {
      const opts = questionBlocks[idx].querySelectorAll('li');
      opts.forEach((optEl, i) => {
        optEl.classList.remove('correct', 'wrong');
        if(i === q.correct){
          optEl.classList.add('correct');
        }
        if(userAnswers[idx] === i && i !== q.correct){
          optEl.classList.add('wrong');
        }
      });
      if(userAnswers[idx] === q.correct) score++;
    });

    resultDiv.textContent = `Your score: ${score} / ${questions.length}`;
    submitBtn.disabled = true;
  }
}
