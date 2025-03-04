document.addEventListener('DOMContentLoaded', function () {
    // Get JSON task data from hidden input
    const jsonTaskString = document.getElementById("sheetName").value;

    if (!jsonTaskString) {
        console.error("No jsonTask data provided");
        return;
    }

    let questions;
    try {
        const taskData = JSON.parse(jsonTaskString);
        questions = taskData.questions;
    } catch (error) {
        console.error("Error parsing jsonTask data:", error);
        return;
    }

    // DOM Elements
    const quizTimer = document.querySelector("#timer");
    const quizProgress = document.querySelector("#progress");
    const quizProgressText = document.querySelector("#progress_text");
    const quizSubmit = document.querySelector("#quiz_submit");
    const quizPrev = document.querySelector("#quiz_prev");
    const quizNext = document.querySelector("#quiz_next");
    const quizCount = document.querySelector(".quiz_question h5");
    const quizAnswers = document.querySelectorAll(".quiz_question ul li");
    const quizQuestionList = document.querySelector(".quiz_numbers ul");
    const quizAnswersItem = document.querySelectorAll(".quiz_answer_item");
    const quizTitle = document.querySelector("#quiz_title");

    // Quiz state variables
    let currentIndex = 0;
    let selectedAnswers = new Array(questions.length).fill(null);
    let quizResults = [];
    let isQuizSubmitted = false;
    let timeLeft = 15 * 60; // 15 minutes in seconds
    let timerInterval;

    // Quiz object with methods
    const quiz = {
        // Initialize quiz
        init() {
            this.renderQuestionList();
            this.renderCurrentQuestion();
            this.setupEventListeners();
            this.startTimer();
            this.updateProgressCircle();
        },

        // Render list of question numbers
        renderQuestionList() {
            quizQuestionList.innerHTML = questions.map((_, index) => {
                let className = '';
                if (selectedAnswers[index] !== null) {
                    className = 'selected';
                }
                return `<li class="${className}">${index + 1}</li>`;
            }).join('');

            // Add click event to question number list
            const questionNumberItems = quizQuestionList.querySelectorAll('li');
            questionNumberItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    currentIndex = index;
                    this.renderCurrentQuestion();
                });
            });
        },

        // Render current question
        renderCurrentQuestion() {
            if (questions.length === 0 || currentIndex >= questions.length) return;

            const currentQuestion = questions[currentIndex];

            quizCount.innerText = `Question ${currentIndex + 1} of ${questions.length}`;
            quizTitle.innerText = currentQuestion.question;

            // Render answers
            quizAnswersItem.forEach((answer, index) => {
                answer.innerText = currentQuestion.answers[index];
            });

            // Reset and highlight answers
            quizAnswers.forEach((answer, index) => {
                answer.classList.remove('active', 'incorrect');

                if (isQuizSubmitted) {
                    // Highlight correct and incorrect answers after submission
                    const currentResult = quizResults[currentIndex];
                    if (currentResult) {
                        const correctAnswerIndex = currentResult.correctAnswer;
                        const selectedAnswerIndex = currentResult.selectedAnswer;

                        if (index === correctAnswerIndex) {
                            answer.classList.add('active'); // Correct answer in orange
                        }

                        if (selectedAnswerIndex !== null &&
                            selectedAnswerIndex !== correctAnswerIndex &&
                            index === selectedAnswerIndex) {
                            answer.classList.add('incorrect'); // Incorrect selected answer in red
                        }
                    }
                } else if (selectedAnswers[currentIndex] === index) {
                    answer.classList.add('active');
                }
            });

            this.updateQuestionListHighlight();
        },

        // Update question list to highlight completed and current questions
        updateQuestionListHighlight() {
            const questionNumberItems = quizQuestionList.querySelectorAll('li');
            questionNumberItems.forEach((item, index) => {
                item.classList.remove('active', 'selected', 'incorrect');

                if (isQuizSubmitted && quizResults[index]) {
                    // Mark incorrect questions after submission
                    const currentResult = quizResults[index];
                    if (currentResult.selectedAnswer !== null &&
                        !currentResult.isCorrect) {
                        item.classList.add('incorrect');
                    }
                }

                if (selectedAnswers[index] !== null) {
                    item.classList.add('selected');
                }

                if (index === currentIndex) {
                    item.classList.add('active');
                }
            });
        },

        // Setup event listeners
        setupEventListeners() {
            // Answer selection
            quizAnswers.forEach((answer, index) => {
                answer.addEventListener('click', () => {
                    if (isQuizSubmitted) return;

                    quizAnswers.forEach(a => a.classList.remove('active'));
                    answer.classList.add('active');
                    selectedAnswers[currentIndex] = index;

                    this.updateProgressCircle();
                    this.updateQuestionListHighlight();
                });
            });

            // Navigation buttons
            quizPrev.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    this.renderCurrentQuestion();
                }
            });

            quizNext.addEventListener('click', () => {
                if (currentIndex < questions.length - 1) {
                    currentIndex++;
                    this.renderCurrentQuestion();
                }
            });

            // Submit button
            quizSubmit.addEventListener('click', () => {
                if (!isQuizSubmitted) {
                    this.submitQuiz();
                }
            });
        },

        // Update progress circle before submission
        updateProgressCircle() {
            const completedQuestions = selectedAnswers.filter(answer => answer !== null).length;
            const r = quizProgress.getAttribute('r');
            const circumference = 2 * Math.PI * r;

            quizProgress.style.strokeDasharray =
                `${(circumference * completedQuestions) / questions.length} 9999`;

            quizProgressText.innerText = `${completedQuestions}/${questions.length}`;
        },

        // Timer management
        startTimer() {
            const timerElement = document.getElementById('timer');

            const updateTimer = () => {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;

                timerElement.textContent =
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                if (timeLeft <= 0) {
                    timerElement.textContent = "Time's up!";
                    this.submitQuiz();
                    return;
                }

                if (!isQuizSubmitted) {
                    timeLeft--;
                }
            };

            timerInterval = setInterval(updateTimer, 1000);
        },

        // Submit quiz and calculate results
        submitQuiz() {
            clearInterval(timerInterval);
            isQuizSubmitted = true;
            quizSubmit.innerText = "Submitted";
            quizSubmit.disabled = true;

            let correctCount = 0;
            quizResults = questions.map((question, index) => {
                const correctAnswerIndex = question.correct_answer;
                const selectedAnswer = selectedAnswers[index];
                const isCorrect = (selectedAnswer === correctAnswerIndex);

                if (isCorrect) correctCount++;

                return {
                    questionIndex: index,
                    selectedAnswer: selectedAnswer,
                    correctAnswer: correctAnswerIndex,
                    isCorrect: isCorrect
                };
            });

            // Update progress circle to show correct answers
            const r = quizProgress.getAttribute('r');
            const circumference = 2 * Math.PI * r;

            quizProgress.style.strokeDasharray =
                `${(circumference * correctCount) / questions.length} 9999`;

            quizProgressText.innerText = `${correctCount}/${questions.length}`;

            // Render the current question with correct/incorrect markings
            this.renderCurrentQuestion();
            this.updateQuestionListHighlight();
        }
    };

    // Initialize quiz
    quiz.init();
});