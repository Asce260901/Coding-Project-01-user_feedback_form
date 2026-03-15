const form            = document.getElementById("feedback-form");
const nameInput       = document.getElementById("name");
const emailInput      = document.getElementById("email");
const feedbackInput   = document.getElementById("feedback");
const submitBtn       = document.getElementById("submitbtn");
const feedbackDisplay = document.getElementById("feedback-display");
const tooltip         = document.getElementById("tooltip");
const feedbackCount = document.getElementById("feedback-count");
const nameErr     = document.getElementById("name-err");
const emailErr    = document.getElementById("email-err");
const feedbackErr = document.getElementById("feedback-err");
const FEEDBACK_MAX = 600;

form.addEventListener("input", function (e) {
    const target = e.target;
    if (target === feedbackInput) {
        const len = feedbackInput.value.length;
        feedbackCount.textContent = len + " / " + FEEDBACK_MAX;
        feedbackCount.classList.toggle("warn",  len >= FEEDBACK_MAX * 0.75 && len < FEEDBACK_MAX);
        feedbackCount.classList.toggle("limit", len >= FEEDBACK_MAX);
    }
});

form.addEventListener("mouseover", function (e) {
    const group = e.target.closest("[data-tooltip]");
    if (!group) return;
    tooltip.textContent = group.getAttribute("data-tooltip");
    tooltip.classList.add("show");
    moveTooltip(e);
});

form.addEventListener("mousemove", function (e) {
    if (tooltip.classList.contains("show")) {
        moveTooltip(e);
    }
});

form.addEventListener("mouseout", function (e) {
    const group = e.target.closest("[data-tooltip]");
    if (group && !group.contains(e.relatedTarget)) {
        tooltip.classList.remove("show");
    }
});

function moveTooltip(e) {
    const gap = 14;
    let x = e.clientX + gap;
    let y = e.clientY + gap;
    const rect = tooltip.getBoundingClientRect();
    if (x + rect.width  > window.innerWidth)  x = e.clientX - rect.width  - gap;
    if (y + rect.height > window.innerHeight) y = e.clientY - rect.height - gap;
    tooltip.style.left = x + "px";
    tooltip.style.top  = y + "px";
}

form.addEventListener("click", function (e) {
    e.stopPropagation();
});

document.addEventListener("click", function () {
    nameInput.classList.remove("invalid");
    emailInput.classList.remove("invalid");
    feedbackInput.classList.remove("invalid");
    nameErr.textContent     = "";
    emailErr.textContent    = "";
    feedbackErr.textContent = "";
    nameErr.classList.remove("visible");
    emailErr.classList.remove("visible");
    feedbackErr.classList.remove("visible");
});

function showFieldError(inputEl, errEl, message) {
    errEl.textContent = message;
    inputEl.classList.add("invalid");
    inputEl.classList.remove("valid");
}

function clearFieldError(inputEl, errEl) {
    errEl.textContent = "";
    inputEl.classList.remove("invalid");
    inputEl.classList.add("valid");
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const nameVal = nameInput.value.trim();
    const nameOk  = nameVal !== "";
    if (!nameOk) {
        showFieldError(nameInput, nameErr, "Name is required.");
    } else {
        clearFieldError(nameInput, nameErr);
    }
    const emailVal = emailInput.value.trim();
    const emailOk  = emailVal !== "" && isValidEmail(emailVal);
    if (emailVal === "") {
        showFieldError(emailInput, emailErr, "Email is required.");
    } else if (!isValidEmail(emailVal)) {
        showFieldError(emailInput, emailErr, "Enter a valid email address.");
    } else {
        clearFieldError(emailInput, emailErr);
    }
    const feedbackVal = feedbackInput.value.trim();
    const feedbackOk  = feedbackVal !== "";
    if (!feedbackOk) {
        showFieldError(feedbackInput, feedbackErr, "Feedback is required.");
    } else {
        clearFieldError(feedbackInput, feedbackErr);
    }
    if (!nameOk || !emailOk || !feedbackOk) return;
    appendFeedbackEntry(nameVal, emailVal, feedbackVal);
    form.reset();
    feedbackCount.textContent = "0 / " + FEEDBACK_MAX;
    feedbackCount.classList.remove("warn", "limit");
    nameInput.classList.remove("valid");
    emailInput.classList.remove("valid");
    feedbackInput.classList.remove("valid");
});

function appendFeedbackEntry(name, email, comment) {
    const card = document.createElement("div");
    card.classList.add("feedback-entry");
    const timestamp = new Date().toLocaleString("en-US", {
        month:  "short",
        day:    "numeric",
        year:   "numeric",
        hour:   "numeric",
        minute: "2-digit",
        hour12: true
    });
    const header = document.createElement("div");
    header.classList.add("entry-header");
    const nameEl = document.createElement("strong");
    nameEl.classList.add("entry-name");
    nameEl.textContent = name;
    const emailEl = document.createElement("span");
    emailEl.classList.add("entry-email");
    emailEl.textContent = email;
    header.appendChild(nameEl);
    header.appendChild(emailEl);
    const commentEl = document.createElement("p");
    commentEl.classList.add("entry-comment");
    commentEl.textContent = comment;
    const timeEl = document.createElement("p");
    timeEl.classList.add("entry-time");
    timeEl.textContent = timestamp;
    card.appendChild(header);
    card.appendChild(commentEl);
    card.appendChild(timeEl);
    feedbackDisplay.prepend(card);
}

const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", function () {
    feedbackDisplay.innerHTML = "";
});
