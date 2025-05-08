let quizStartRequested = false;

document.addEventListener("DOMContentLoaded", () => {
    const startQuizButtons = document.querySelectorAll(".quiz-btn");
    const logoutButton = document.getElementById("odjavi");
    const loginButton = document.getElementById("btn1");
    const registerButton = document.getElementById("btn2");

    const token = localStorage.getItem("token");

    if (token) {
        logoutButton.style.display = "flex";
        loginButton.style.display = "none";
        registerButton.style.display = "none";

        logoutButton.addEventListener("click", () => {
            localStorage.clear();
            alert("Uspešno ste se odjavili!");
            window.location.reload();
        });

    } else {
        logoutButton.style.display = "none";

        startQuizButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                alert("Morate biti logovani da biste započeli kviz!");
                event.preventDefault();
            });
        });
    }
});

async function getLeaderboard() {
    const leaderboardItems = document.querySelectorAll(".leaderboard-item");

    try {
        const response = await fetch("https://quiz-be-zeta.vercel.app/leaderboard", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();

        leaderboardItems.forEach((item, index) => {
            if (data[index]) {
                const rankElement = item.querySelector(".rank");
                const nameElement = item.querySelector(".name");
                const scoreElement = item.querySelector(".score");

                rankElement.innerHTML = `#${index + 1}`;
                nameElement.innerHTML = data[index].username;
                scoreElement.innerHTML = `Bodovi: ${data[index].bestScore}`;
            }
        });
    } catch (error) {
        console.error("Error");
    }
}

getLeaderboard();

async function getProfileData() {
    const myRankElement = document.querySelector(".my-rank");
    const myNameElement = document.querySelector(".my-name");
    const myScoreElement = document.querySelector(".my-score");

    try {
        const response = await fetch("https://quiz-be-zeta.vercel.app/auth/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();

        myRankElement.innerHTML = `#TI`;
        myNameElement.innerHTML = data.username || "Nepoznato ime";
        myScoreElement.innerHTML = `Bodovi: ${data.bestScore || 0}`;
    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
}

getProfileData();

function openPopup() {
    document.getElementById("quizPopup").style.display = "flex";
}

function closePopup() {
    document.getElementById("quizPopup").style.display = "none";
}

document.querySelectorAll(".quiz-btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault(); 
      quizStartRequested = true; 
  
      if (localStorage.getItem("token")) {
        openPopup(); 
      } else {
        localStorage.setItem("quizIntent", "true");
      }
    });
});