document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ JavaScript Loaded!");

    // ✅ Mobile Navigation Toggle
    const navToggler = document.querySelector(".nav-toggler");
    const navLinks = document.querySelector(".nav-links");

    if (navToggler && navLinks) {
        navToggler.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }

    // ✅ Copy Course Link
    document.querySelectorAll(".share-btn").forEach(button => {
        button.addEventListener("click", function () {
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert("✅ Course link copied!"))
                .catch(err => console.error("❌ Copy failed:", err));
        });
    });

    // ✅ Subscription Form Handling (index.html)
    const subscribeForm = document.getElementById("subscribe-form");
    const emailInput = document.getElementById("email-input");
    const message = document.getElementById("message");

    if (subscribeForm) {
        subscribeForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const email = emailInput.value.trim();

            if (!validateEmail(email)) {
                message.style.color = "red";
                message.textContent = "❌ Please enter a valid email.";
                return;
            }

            try {
                const res = await fetch("http://localhost:3000/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });

                const data = await res.json();
                message.style.color = res.ok ? "green" : "red";
                message.textContent = data.message;
                if (res.ok) emailInput.value = "";
            } catch (err) {
                message.style.color = "red";
                message.textContent = "❌ Server error. Try again later.";
                console.error(err);
            }
        });
    }

    // ✅ Question Form Handling (courses.html)
    const questionForm = document.getElementById("questionForm");

    if (questionForm) {
        questionForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const title = document.getElementById("title").value.trim();
            const description = document.getElementById("description").value.trim();
            const category = document.getElementById("category").value;

            if (!title || !description || !category) {
                alert("❌ All fields are required.");
                return;
            }

            try {
                const res = await fetch("http://localhost:3000/question", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, description, category })
                });

                const data = await res.json();
                alert(data.message);
                if (res.ok) {
                    questionForm.reset();
                }
            } catch (err) {
                alert("❌ Failed to submit question. Try again.");
                console.error(err);
            }
        });
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});
