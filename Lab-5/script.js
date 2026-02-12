document.addEventListener("DOMContentLoaded", () => {
  // -------- Part 2: Focus/Blur UX --------
  const inputs = document.querySelectorAll("#username, #email, #password");

  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.style.backgroundColor = "#fffae0";
    });

    input.addEventListener("blur", () => {
      input.style.backgroundColor = "white";
    });
  });

  // -------- Part 3: Form Validation on Submit --------
  const form = document.getElementById("signup-form");

  const usernameEl = document.getElementById("username");
  const emailEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");
  const termsEl = document.getElementById("terms");

  const errorUsername = document.getElementById("error-username");
  const errorEmail = document.getElementById("error-email");
  const errorPassword = document.getElementById("error-password");
  const errorTerms = document.getElementById("error-terms");

  function showError(fieldEl, errorSpan, message) {
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
    fieldEl.classList.add("error-border");
  }

  function clearError(fieldEl, errorSpan) {
    errorSpan.textContent = "";
    errorSpan.style.display = "none";
    fieldEl.classList.remove("error-border");
  }

  function isValidEmail(email) {
    // simple email validation: must contain "@" and "." after "@"
    const atPos = email.indexOf("@");
    const dotPos = email.lastIndexOf(".");
    return atPos > 0 && dotPos > atPos + 1 && dotPos < email.length - 1;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;

    const username = usernameEl.value.trim();
    const email = emailEl.value.trim();
    const password = passwordEl.value;

    // Username
    if (username === "") {
      showError(usernameEl, errorUsername, "Username is required");
      isValid = false;
    } else {
      clearError(usernameEl, errorUsername);
    }

    // Email
    if (email === "" || !isValidEmail(email)) {
      showError(emailEl, errorEmail, "Enter a valid email address");
      isValid = false;
    } else {
      clearError(emailEl, errorEmail);
    }

    // Password
    if (password.length < 8) {
      showError(passwordEl, errorPassword, "Password must be at least 8 characters");
      isValid = false;
    } else {
      clearError(passwordEl, errorPassword);
    }

    // Terms
    if (!termsEl.checked) {
      showError(termsEl, errorTerms, "You must accept the terms");
      isValid = false;
    } else {
      clearError(termsEl, errorTerms);
    }

    if (isValid) {
      alert("Registration successful!");
    }
  });

  // -------- Part 4: Interactive Gallery + Keyboard Enter --------
  const thumbs = document.querySelectorAll(".thumb");
  const captionEl = document.getElementById("image-caption");

  function selectThumb(thumbEl) {
    thumbs.forEach((t) => t.classList.remove("expanded"));
    thumbEl.classList.add("expanded");

    const cityName = thumbEl.dataset.city || thumbEl.querySelector("img")?.alt || "Unknown";
    captionEl.textContent = `You selected: ${cityName}`;
  }

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      selectThumb(thumb);
    });

    thumb.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        selectThumb(thumb);
      }
    });
  });
});
