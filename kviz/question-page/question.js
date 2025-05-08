let i = 1;
let bestScore = parseInt(localStorage.getItem("bestScore")) || 0;
let j = 0;
let timeLeft = null;
let timerId = null;

const question = document.querySelector(".question-text");
const QNum = document.getElementById("question-number");
const Points = document.getElementById("score");
const time = document.getElementById("time-left");
const AnsContainer = document.querySelector(".answers");

const bScore = document.createElement("div");
bScore.innerHTML = bestScore;

savePoints = () => {
    localStorage.setItem("points", j);
};

function showPopup(score) {
    const popup = document.querySelector(".popup");
    const scoreElement = popup.querySelector(".stat-item strong");
    scoreElement.innerHTML = `${score} bodova 🏆`;

    localStorage.removeItem("gameId");
    localStorage.removeItem("questionId");

    const closeButton = popup.querySelector(".btn-close");
    closeButton.addEventListener("click", () => {
        popup.style.display = "none";
        location.replace("../home-page/home.html");
    });

    const leaderboardButton = popup.querySelector(".btn-leaderboard");
    leaderboardButton.addEventListener("click", () => {
        location.replace("../home-page/home.html#home3");
    });
}

async function getQuestion() {
    try {
        const response = await fetch(
            "https://quiz-be-zeta.vercel.app/game/start",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            }
        );
        const data = await response.json();

        question.innerHTML = data.question.title;
        AnsContainer.innerHTML = "";

        data.question.options.forEach((option, index) => {
            const answerButton = document.createElement("button");
            answerButton.classList.add("answer");
            answerButton.innerHTML = option.text;
            answerButton.onclick = () => checkAnswer(option.text);
            AnsContainer.appendChild(answerButton);
        });

        QNum.innerHTML = i;
        Points.innerHTML = j;

        localStorage.setItem("gameId", data.gameId);
        localStorage.setItem("questionId", data.question._id);

        clearInterval(timerId);
        timeLeft = data.question.timeLimit ?? 30;
        time.innerHTML = timeLeft;
        timerId = setInterval(countdown, 1000);
    } catch (error) {
        console.error("Error:", error);
    }
}
getQuestion();

async function checkAnswer(Ans) {
    i++;
    clearTimeout(timerId);
    try {
        const response = await fetch(
            "https://quiz-be-zeta.vercel.app/game/answer",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    answer: Ans,
                    gameId: localStorage.getItem("gameId"),
                    questionId: localStorage.getItem("questionId"),
                }),
            }
        );
        const data = await response.json();

        QNum.innerHTML = i;
        if (data.correct) {
            j++;
            if (j > bestScore) {
                bestScore = j;
                localStorage.setItem("bestScore", j);
            }
            Points.innerHTML = j;

            if (!data.nextQuestion) {
                localStorage.setItem("points", j);
                showPopup(j);
                return;
            }

            timeLeft = data.nextQuestion.timeLimit;
            timerId = setInterval(countdown, 1000);

            question.innerHTML = data.nextQuestion.title;
            AnsContainer.innerHTML = "";

            data.nextQuestion.options.forEach((option) => {
                const answerButton = document.createElement("button");
                answerButton.classList.add("answer");
                answerButton.innerHTML = option.text;
                answerButton.onclick = () => checkAnswer(option.text);
                AnsContainer.appendChild(answerButton);
            });

            localStorage.setItem("questionId", data.nextQuestion._id);
        } else {
            localStorage.setItem("points", j);
            showPopup(j);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while checking the answer.");
    }
}

function countdown() {
    if (timeLeft == -1) {
        clearTimeout(timerId);
        localStorage.setItem("points", j);
        showPopup(j);
    } else {
        time.innerHTML = timeLeft;
        timeLeft--;
    }
}