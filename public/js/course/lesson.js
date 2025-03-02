// document.addEventListener("DOMContentLoaded", () => {
//     document.querySelectorAll(".lesson-link").forEach(link => {
//         link.addEventListener("click", async (event) => {
//             event.preventDefault(); // Ngăn trang load lại

//             const lessonLink = event.target.closest(".lesson-link");
//             if (!lessonLink) return;

//             const lessonId = lessonLink.dataset.lessonId;
//             const courseId = window.location.pathname.split("/")[2]; // Lấy ID khóa học

//             try {
//                 const response = await fetch(`/course/${courseId}/lesson/${lessonId}`, {
//                     headers: { "X-Requested-With": "XMLHttpRequest" } // Đánh dấu AJAX request
//                 });

//                 if (!response.ok) {
//                     console.error("Lỗi tải bài học:", response.statusText);
//                     return;
//                 }

//                 const data = await response.json();

//                 document.getElementById("lesson-title").textContent = data.title;
//                 document.getElementById("lesson-description").textContent = data.description;

//                 // Cập nhật video
//                 const videoElement = document.getElementById("lesson-video");
//                 if (videoElement) {
//                     if (data.videoUrl) {
//                         videoElement.src = data.videoUrl;
//                         videoElement.style.display = "block";
//                     } else {
//                         videoElement.style.display = "none";
//                     }
//                 }

//                 // Đánh dấu bài học đang xem
//                 document.querySelectorAll(".lesson-list li").forEach(li => li.classList.remove("active"));
//                 lessonLink.parentElement.classList.add("active");

//                 console.log("Cập nhật bài học thành công!");
//             } catch (error) {
//                 console.error("Lỗi:", error);
//             }
//         });
//     });
// });


//BAI TẬP

// lesson.js
// ________FAKE_DATA_______________
// public/js/lesson.js
// Thêm Socket.IO client (đảm bảo đã include script trong Pug hoặc HTML)
const socket = io();

// Dữ liệu câu hỏi ban đầu
let questions = [
    { quiz_id: "1", question: "1 + 1 bằng bao nhiêu?", answers: ["1", "2", "3", "4"], correctAnswer: "2" },
    { quiz_id: "2", question: "Mặt trời mọc ở đâu?", answers: ["Đông", "Tây", "Nam", "Bắc"], correctAnswer: "Đông" },
    { quiz_id: "3", question: "Nước biển có màu gì?", answers: ["Xanh", "Đỏ", "Vàng", "Tím"], correctAnswer: "Xanh" },
    { quiz_id: "4", question: "Thủ đô của Việt Nam là gì?", answers: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Huế"], correctAnswer: "Hà Nội" },
    { quiz_id: "5", question: "2 x 3 bằng bao nhiêu?", answers: ["5", "6", "8", "9"], correctAnswer: "6" },
    { quiz_id: "6", question: "Hành tinh nào lớn nhất trong hệ Mặt Trời?", answers: ["Trái Đất", "Sao Mộc", "Sao Thổ", "Sao Hỏa"], correctAnswer: "Sao Mộc" },
    { quiz_id: "7", question: "Một năm có bao nhiêu ngày?", answers: ["365", "366", "360", "364"], correctAnswer: "365" },
    { quiz_id: "8", question: "Loài động vật nào là biểu tượng của Úc?", answers: ["Kangaroo", "Gấu", "Hổ", "Sư tử"], correctAnswer: "Kangaroo" },
    { quiz_id: "9", question: "Ai là tác giả của 'Truyện Kiều'?", answers: ["Nguyễn Trãi", "Nguyễn Du", "Hồ Xuân Hương", "Tố Hữu"], correctAnswer: "Nguyễn Du" },
    { quiz_id: "10", question: "Mèo có bao nhiêu chân?", answers: ["2", "3", "4", "5"], correctAnswer: "4" },
    { quiz_id: "11", question: "Mèo có bao nhiêu chân?", answers: ["2", "3", "4", "5"], correctAnswer: "4" }
    
  ];


// Các phần tử DOM
const quizTimer = document.querySelector("#timer");
const quizProgress = document.querySelector("#progress");
const quizProgressText = document.querySelector("#progress_text");
const quizSubmit = document.querySelector("#quiz_submit");
const quizPrev = document.querySelector("#quiz_prev");
const quizNext = document.querySelector("#quiz_next");
const quizCount = document.querySelector(".quiz_question h5");
const quizAnswers = document.querySelectorAll(".quiz_question ul li");
let quizQuestions = document.querySelectorAll(".quiz_numbers ul li");
const quizQuestionList = document.querySelector(".quiz_numbers ul");
const quizAnswersItem = document.querySelectorAll(".quiz_answer_item");
const quizTitle = document.querySelector("#quiz_title");
const questionInput = document.querySelector("#questionInput");
const updateQuestionBtn = document.querySelector("#updateQuestion");
let currentIndex = null;
let listSubmit = [];
let listResults = [];
let isSubmit = false;

function randomArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function parseQuestionData(input) {
  const lines = input.trim().split('\n');
  let question = '';
  const answers = [];
  let correctAnswer = '';

  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('@')) question = line.substring(1).trim();
    else if (line.startsWith('-')) answers.push(line.substring(1).trim());
    else if (line.startsWith('+')) {
      answers.push(line.substring(1).trim());
      correctAnswer = line.substring(1).trim();
    }
  });

  if (answers.length !== 4) {
    alert('Vui lòng nhập đúng 4 đáp án!');
    return null;
  }

  return { quiz_id: String(questions.length + 1), question, answers, correctAnswer };
}

const quiz = {
    randomQuestions: function () {
        console.log("Trước khi random, số câu hỏi:", questions.length);
        questions = randomArray(questions);
        console.log("Sau khi random, số câu hỏi:", questions.length);
    
        questions.forEach((q) => q.answers = randomArray(q.answers));
    },    

  getQuestions: function () {
    console.log("Danh sách câu hỏi:", questions);
  },

  addQuestion: function () {
    updateQuestionBtn.addEventListener('click', () => {
      const inputData = questionInput.value.trim();
      if (inputData) {
        const newQuestion = parseQuestionData(inputData);
        if (newQuestion) {
          questions.push(newQuestion);
          socket.emit('newQuestion', newQuestion); // Gửi qua WebSocket
          this.renderQuestionList();
          questionInput.value = '';
          alert('Đã thêm câu hỏi thành công!');
          quizQuestions = document.querySelectorAll(".quiz_numbers ul li");
          this.handleQuestionList();
        }
      }
    });

    // Nhận câu hỏi mới từ server
    socket.on('updateQuestions', (newQuestion) => {
      questions.push(newQuestion);
      this.renderQuestionList();
      quizQuestions = document.querySelectorAll(".quiz_numbers ul li");
      this.handleQuestionList();
    });
  },

  getResults: function () {
    quizSubmit.innerText = "Kết quả";
    quizSubmit.style = "pointer-events:none";
    let correct = 0;
    questions.forEach((item, index) => {
      const correctIndex = item.answers.indexOf(item.correctAnswer);
      listResults[index] = correctIndex;
      if (listSubmit[index] === correctIndex) correct++;
      else quizQuestions[index].classList.add("incorrect");
    });
    isSubmit = true;
    this.handleProgress(correct);
    quizQuestions[0].click();
  },

  renderQuestionList: function () {
    let render = "";
    questions.forEach((_, index) => render += `<li>${index + 1}</li>`);
    quizQuestionList.innerHTML = render;
    quizQuestions = document.querySelectorAll(".quiz_numbers ul li");
  },

  renderCurrentQuestion: function () {
    quizCount.innerText = `Question ${currentIndex + 1} of ${questions.length}`;
    quizTitle.innerText = questions[currentIndex].question;
    quizAnswersItem.forEach((answer, index) => answer.innerText = questions[currentIndex].answers[index]);
  },

  renderProgress: function () {
    quizProgress.style = `stroke-dasharray: 0 9999;`;
    quizProgressText.innerText = `0/${questions.length}`;
  },

  renderTimer: function () {
    var timer = 60 * 15;
    let _this = this;
    var countdownElement = document.getElementById("timer");
    function updateTimer() {
      var minutes = Math.floor(timer / 60);
      var seconds = timer % 60;
      var timerString = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
      countdownElement.innerHTML = timerString;
      timer--;
      if (timer < 0) {
        countdownElement.innerHTML = "Hết thời gian!";
        _this.getResults();
      }
      if (isSubmit) clearInterval(intervalId);
    }
    var intervalId = setInterval(updateTimer, 1000);
  },

  renderResults: function () {
    if (listResults[currentIndex] === listSubmit[currentIndex]) {
      quizAnswers.forEach((item) => item.classList.remove("incorrect"));
      quizAnswers[listResults[currentIndex]].classList.add("active");
    } else {
      quizAnswers.forEach((item) => {
        item.classList.remove("active");
        item.classList.remove("incorrect");
      });
      quizAnswers[listResults[currentIndex]].classList.add("active");
      quizAnswers[listSubmit[currentIndex]].classList.add("incorrect");
    }
  },

  handleProgress: function (correct) {
    const r = quizProgress.getAttribute("r");
    if (!isSubmit) {
      const progressLen = listSubmit.filter((item) => item >= 0);
      quizProgress.style = `stroke-dasharray: ${(2 * Math.PI * r * progressLen.length) / questions.length} 9999;`;
      quizProgressText.innerText = `${progressLen.length}/${questions.length}`;
    } else {
      quizProgress.style = `stroke-dasharray: ${(2 * Math.PI * r * correct) / questions.length} 9999;`;
      quizProgressText.innerText = `${correct}/${questions.length}`;
    }
  },

  handleQuestionList: function () {
    quizQuestions.forEach((item, index) => {
      item.addEventListener("click", () => {
        item.scrollIntoView({ behavior: "smooth", block: "nearest" });
        quizQuestions.forEach((item) => item.classList.remove("active"));
        item.classList.add("active");
        currentIndex = index;
        this.renderCurrentQuestion();
        quizAnswers.forEach((item) => item.classList.remove("active"));
        const selected = listSubmit[currentIndex];
        selected >= 0 && quizAnswers[selected].click();
        if (isSubmit) this.renderResults();
      });
    });
    quizQuestions[0].click();
  },

  handleAnswer: function () {
    quizAnswers.forEach((answer, index) => {
      answer.addEventListener("click", () => {
        if (!isSubmit) {
          quizAnswers.forEach((item) => item.classList.remove("active"));
          answer.classList.add("active");
          quizQuestions[currentIndex].classList.add("selected");
          listSubmit[currentIndex] = index;
          this.handleProgress();
        }
      });
    });
  },

  handleNext: function () {
    quizNext.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % questions.length;
      quizQuestions[currentIndex].click();
    });
  },

  handlePrev: function () {
    quizPrev.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + questions.length) % questions.length;
      quizQuestions[currentIndex].click();
    });
  },

  handleSubmit: function () {
    quizSubmit.addEventListener("click", () => {
      const progressLen = listSubmit.filter((item) => item >= 0);
      if (progressLen.length === questions.length) this.getResults();
      else alert("Bạn chưa chọn hết đáp án");
    });
  },

  handleKeyDown: function () {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowRight": quizNext.click(); break;
        case "ArrowLeft": quizPrev.click(); break;
      }
    });
  },

  render: function () {
    this.renderQuestionList();
    this.renderProgress();
    this.renderTimer();
  },

  handle: function () {
    this.handleQuestionList();
    this.handleAnswer();
    this.handleNext();
    this.handlePrev();
    this.handleKeyDown();
    this.handleSubmit();
    this.addQuestion();
  },

  start: function () {
    this.getQuestions();
    this.randomQuestions();
    this.render();
    this.handle();
  },
};

quiz.start();