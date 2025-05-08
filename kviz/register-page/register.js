const registerBtn = document.getElementById("register-btn");

async function register() {
  const Email = document.getElementById("email").value;
  const Username = document.getElementById("username").value;
  const Password = document.getElementById("password").value;
  const ConfirmPassword = document.getElementById("confirm-password").value;

  if (!Email || !Username || !Password || !ConfirmPassword) {
    alert("Sva polja moraju biti popunjena!");
    return;
  }

  if (Password !== ConfirmPassword) {
    alert("Lozinke se ne podudaraju!");
    return;
  }

  try {
    const response = await fetch(
      "https://quiz-be-zeta.vercel.app/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: Email,
          username: Username,
          password: Password,
        }),
      }
    );
    const data = await response.json();

    if (response.ok) {
      alert("Uspješno kreiran račun!");
      window.location.href = "/login-page/login.html";
    } else {
      alert(`Greška: ${data.message || "Registracija nije uspjela!"}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Došlo je do greške prilikom registracije. Molimo pokušajte ponovo.");
  }
}

registerBtn.addEventListener("click", register);