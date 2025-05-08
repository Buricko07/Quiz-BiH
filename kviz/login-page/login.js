const loginButton = document.getElementById("login-btn");

async function login() {
    const Email = document.getElementById("email").value.trim();
    const Password = document.getElementById("password").value;

    if (!Email || !Password) {
        alert("Sva polja moraju biti popunjena!");
        return;
    }

    try {
        const response = await fetch(
            "https://quiz-be-zeta.vercel.app/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: Email,
                    password: Password,
                }),
            }
        );
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);

            alert("Uspješno ste pristupili akauntu!");

            window.location.href = "/home-page/home.html";
        } else {
            alert(`Greška: ${data.message || "Prijava nije uspjela!"}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Došlo je do greške prilikom prijave. Molimo pokušajte ponovo.");
    }
}

loginButton.addEventListener("click", login);