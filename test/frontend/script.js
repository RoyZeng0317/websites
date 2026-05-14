let questions = [];

async function loadQuestions() {
    try {
        const response = await fetch('../backend/data/11700_Mutpile.sql');
        const text = await response.text();
        questions = parseSQL(text);
        console.log("Questions loaded from SQL:", questions);
    } catch (error) {
        console.error("Error loading SQL file:", error);
    }
}

function parseSQL(sqlText) {
    const lines = sqlText.split('\n');
    const parsedQuestions = [];
    
    // Updated regex to include the 6th parameter: image path
    const regex = /VALUES\s*\(\s*(\d+)\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']*)'\s*\)/;

    lines.forEach(line => {
        const match = line.match(regex);
        if (match) {
            const [_, id, type, question, optionsStr, answerStr, imagePath] = match;
            parsedQuestions.push({
                id: parseInt(id),
                type: type,
                question: question,
                options: optionsStr.split(','),
                answer: answerStr.split(',').map(idx => parseInt(idx.trim())),
                image: imagePath ? '../' + imagePath : null // Adjust path to point back from frontend to data/img
            });
        }
    });

    return parsedQuestions;
}

const quizTypeSelect = document.getElementById('quiz-type');
const quizContainer = document.getElementById('quiz-container');

quizTypeSelect.addEventListener('change', () => {
    const selectedType = quizTypeSelect.value;
    renderQuiz(selectedType);
});

function renderQuiz(type) {
    quizContainer.innerHTML = '';
    const filteredQuestions = questions.filter(q => {
        if (type === 'all') return true;
        if (type === 'multiple' && q.type === 'multiple') return true;
        if (type === 'single' && q.type === 'single') return true;
        return false;
    });

    if (filteredQuestions.length === 0 && type !== "") {
        quizContainer.innerHTML = '<p>目前沒有此類型的題目。</p>';
        return;
    }

    filteredQuestions.forEach((q, index) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'question-item';
        qDiv.id = `q-${q.id}`;
        
        let imageHtml = q.image ? `<div class="question-image"><img src="${q.image}" alt="Question Image" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 4px; display: block;"></div>` : '';

        let optionsHtml = '';
        q.options.forEach((opt, optIdx) => {
            const inputType = q.type === 'multiple' ? 'checkbox' : 'radio';
            optionsHtml += `
                <div class="option">
                    <input type="${inputType}" name="q-${q.id}" value="${optIdx}" id="q-${q.id}-opt-${optIdx}" onchange="checkAnswer(${q.id}, ${q.type === 'multiple'})">
                    <label for="q-${q.id}-opt-${optIdx}">${opt}</label>
                </div>
            `;
        });

        qDiv.innerHTML = `
            <div class="question-text">${index + 1}. ${q.question}</div>
            ${imageHtml}
            <div class="options-container">
                ${optionsHtml}
            </div>
            <div class="feedback" id="feedback-${q.id}"></div>
        `;
        quizContainer.appendChild(qDiv);
    });
}

function checkAnswer(qId, isMultiple) {
    const question = questions.find(q => q.id === qId);
    const inputs = document.querySelectorAll(`input[name="q-${qId}"]:checked`);
    const selectedIndices = Array.from(inputs).map(i => parseInt(i.value));
    const feedbackDiv = document.getElementById(`feedback-${qId}`);
    const questionDiv = document.getElementById(`q-${qId}`);

    const sortedSelected = [...selectedIndices].sort();
    const sortedAnswer = [...question.answer].sort();

    const isCorrect = JSON.stringify(sortedSelected) === JSON.stringify(sortedAnswer);

    if (isMultiple) {
        if (isCorrect) {
            feedbackDiv.textContent = '正確！';
            feedbackDiv.style.color = '#4caf50';
            questionDiv.classList.add('correct');
            questionDiv.classList.remove('incorrect');
        } else {
            const hasWrongSelection = selectedIndices.some(idx => !question.answer.includes(idx));
            
            if (hasWrongSelection || (selectedIndices.length >= question.answer.length && selectedIndices.length > 0)) {
                feedbackDiv.textContent = '不正確，請再試試。';
                feedbackDiv.style.color = '#f44336';
                questionDiv.classList.add('incorrect');
                questionDiv.classList.remove('correct');
            } else {
                feedbackDiv.textContent = '選擇中...';
                feedbackDiv.style.color = '#ff9800';
                questionDiv.classList.remove('correct', 'incorrect');
            }
        }
    } else {
        if (isCorrect) {
            feedbackDiv.textContent = '正確！';
            feedbackDiv.style.color = '#4caf50';
            questionDiv.classList.add('correct');
            questionDiv.classList.remove('incorrect');
        } else {
            feedbackDiv.textContent = '錯誤！正確答案是：' + question.options[question.answer[0]];
            feedbackDiv.style.color = '#f44336';
            questionDiv.classList.add('incorrect');
            questionDiv.classList.remove('correct');
        }
    }
}

// Initial load
loadQuestions();
