// Lấy phần tử HTML
const cardsContainer = document.getElementById("cards-container");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const currentElement = document.getElementById("current");
const showButton = document.getElementById("show");
const hideButton = document.getElementById("hide");
const addContainer = document.getElementById("add-container");
const shuffleButton = document.getElementById("random"); // Nút trộn thẻ

// Lấy dữ liệu từ HTML (Pug đã render)
const cardData = document.querySelector(".card-data");
const flashcard = JSON.parse(cardData.getAttribute("data"));
const listCard = flashcard.cards;

// Chuyển đổi dữ liệu từ BE thành { question, answer }
let cardsData = listCard.map(card => ({
    question: card.vocabulary,
    answer: card.meaning
}));

let currentActiveCard = 0;
let cardsElement = [];

// Tạo các card từ dữ liệu BE
function createCards() {
    cardsContainer.innerHTML = ""; // Xóa danh sách cũ
    cardsElement = []; // Xóa danh sách phần tử cũ
    cardsData.forEach((data, index) => createCard(data, index));
}

function createCard(data, index) {
    const card = document.createElement("div");
    card.classList.add("card");
    if (index === 0) card.classList.add("active");
    card.innerHTML = `
    <div class="inner-card course-card">
        <div class="inner-card-front">
            <p style="font-size:1.5rem">${data.question}</p>
        </div>
        <div class="inner-card-back">
            <p style="font-size:1.5rem">${data.answer}</p>
        </div>
    </div>
    `;
    card.addEventListener("click", () => card.classList.toggle("show-answer"));
    cardsElement.push(card);
    cardsContainer.appendChild(card);
    updateCurrentText();
}

function updateCurrentText() {
    currentElement.innerText = `${currentActiveCard + 1}/${cardsElement.length}`;
}

// Chuyển card tiếp theo
nextButton.addEventListener("click", () => {
    cardsElement[currentActiveCard].className = "card left";
    currentActiveCard++;
    if (currentActiveCard > cardsElement.length - 1) {
        currentActiveCard = 0;
    }
    cardsElement[currentActiveCard].className = "card active";
    updateCurrentText();
});

// Chuyển card trước đó
prevButton.addEventListener("click", () => {
    cardsElement[currentActiveCard].className = "card right";
    currentActiveCard--;
    if (currentActiveCard < 0) {
        currentActiveCard = cardsElement.length - 1;
    }
    cardsElement[currentActiveCard].className = "card active";
    updateCurrentText();
});

// Mở form thêm card
showButton.addEventListener("click", () => addContainer.classList.add("show"));

// Đóng form thêm card
hideButton.addEventListener("click", () => addContainer.classList.remove("show"));

// Trộn ngẫu nhiên danh sách thẻ
shuffleButton.addEventListener("click", () => {
    if (cardsData.length === 0) {
        alert("Không có thẻ để trộn!");
        return;
    }

    // Fisher-Yates shuffle
    for (let i = cardsData.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cardsData[i], cardsData[j]] = [cardsData[j], cardsData[i]];
    }

    createCards(); // Cập nhật giao diện sau khi trộn
});

// Khởi tạo các card từ dữ liệu BE
createCards();

// Thêm card mới
document.getElementById("add-card").addEventListener("click", async () => {
    const vocabulary = document.getElementById("question").value.trim();
    const meaning = document.getElementById("answer").value.trim();
    const flashCardId = flashcard._id;

    if (!vocabulary || !meaning) {
        return;
    }

    try {
        const response = await fetch(`/flashcards/card/${flashCardId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ vocabulary, meaning }),
        });

        if (!response.ok) {
            throw new Error("Lỗi khi gửi dữ liệu");
        }

        const data = await response.json();
        console.log(data.message); // Kiểm tra phản hồi từ server
        alert(data.message); // Thông báo thành công (hoặc cập nhật UI)
        location.reload(); // Tải lại trang để cập nhật danh sách thẻ
    } catch (error) {
        console.error("Lỗi khi thêm thẻ:", error);
    }
});
