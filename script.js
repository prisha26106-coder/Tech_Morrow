// TechMorrow JavaScript: each part runs only on the page that uses it.

// 1. Device dropdown: update advice when the selected device changes.
const deviceSelect = document.querySelector("#device-select");

if (deviceSelect) {
    const advice = {
        phone: ["Smartphone", "Erase your data and ask a reuse group or refurbisher if they accept working phones.", "A working phone can be kept as an offline camera or music player.", "If it cannot be reused, take it to an e-waste collection point."],
        laptop: ["Laptop", "A working laptop may be donated to a school or community group after your data is erased.", "Use it for learning, writing or as a shared family computer.", "Ask an authorized recycler to accept the laptop and its battery."],
        tablet: ["Tablet", "Offer a working tablet to a trusted reuse group after resetting it safely.", "It may be useful as an e-book reader or recipe screen.", "Use an e-waste collection point if it is no longer repairable."],
        tv: ["TV or monitor", "Donate only if it works and the recipient can use it safely.", "A working screen may be used as a second display if compatible.", "Use a recycler that accepts screens; do not dismantle the display."],
        printer: ["Printer", "Ask a school or community office if it needs a working printer.", "Keep it as a shared printer if compatible ink or toner is available.", "Check how the recycler wants ink or toner cartridges handled."],
        kitchen: ["Small kitchen appliance", "Donate it only if it is clean and works safely.", "Keep using a working appliance for its intended purpose.", "If unsafe or beyond repair, ask a suitable recycler how to hand it over."],
        battery: ["Battery or power bank", "Never pass on a swollen or damaged battery.", "Continue using a healthy power bank according to its instructions.", "Use a collection point that specifically accepts batteries; do not put them in general rubbish."]
    };

    deviceSelect.addEventListener("change", function () {
        const selected = advice[deviceSelect.value];
        document.querySelector("#solution-name").textContent = selected[0];
        document.querySelector("#solution-donate").textContent = selected[1];
        document.querySelector("#solution-reuse").textContent = selected[2];
        document.querySelector("#solution-recycle").textContent = selected[3];
    });
}

// 2. Pledge: count checked boxes and show a supportive message.
const pledgeForm = document.querySelector("#pledge-form");

if (pledgeForm) {
    pledgeForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const checked = pledgeForm.querySelectorAll('input[name="pledge"]:checked').length;
        const message = document.querySelector("#pledge-message");
        message.hidden = false;
        if (checked === 0) {
            message.textContent = "Choose at least one action to make your pledge. Every small step counts.";
        } else {
            message.textContent = "Thank you! You selected " + checked + " pledge(s). Start with one action this week, such as checking repair options or finding a responsible collection point.";
        }
    });
}

// 3. Quiz: simple multiple-question quiz with feedback and final score.
const quizForm = document.querySelector("#quiz-form");

if (quizForm) {
    const questions = [
        { q: "Your laptop works, but its battery life is poor. What should you do first?", a: ["Check battery health and repair options.", "Throw it away.", "Burn it."], correct: 0, why: "Checking the battery and repair options may extend the laptop's useful life." },
        { q: "Your old phone still works. What is a sensible next step?", a: ["Put it in general rubbish.", "Erase personal data and consider reuse or donation.", "Leave it outside."], correct: 1, why: "A working phone can help someone else, but protect your data before passing it on." },
        { q: "A power bank is swollen. What should you do?", a: ["Puncture it.", "Keep charging it.", "Stop using it and seek safe collection advice."], correct: 2, why: "A swollen battery can be hazardous. Do not charge, crush or open it." },
        { q: "A printer is broken beyond repair. What is best?", a: ["Use an appropriate e-waste collection service.", "Burn the plastic.", "Dump it outdoors."], correct: 0, why: "Suitable recycling is safer than dumping or burning electronics." }
    ];
    let current = 0;
    let score = 0;
    const questionText = document.querySelector("#quiz-question");
    const progress = document.querySelector("#quiz-progress");
    const feedback = document.querySelector("#quiz-feedback");
    const next = document.querySelector("#quiz-next");
    const results = document.querySelector("#quiz-results");

    function showQuestion() {
        questionText.textContent = questions[current].q;
        progress.textContent = "Question " + (current + 1) + " of " + questions.length;
        const labels = quizForm.querySelectorAll("fieldset label");
        questions[current].a.forEach(function (answer, index) {
            labels[index].lastChild.textContent = " " + answer;
            labels[index].querySelector("input").checked = false;
            labels[index].querySelector("input").disabled = false;
        });
        feedback.hidden = true;
        next.hidden = true;
        quizForm.querySelector('button[type="submit"]').hidden = false;
    }

    quizForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const selected = quizForm.querySelector('input[name="quiz-answer"]:checked');
        if (!selected) {
            feedback.textContent = "Please choose an answer first.";
            feedback.hidden = false;
            return;
        }
        const question = questions[current];
        const correct = Number(selected.value) === question.correct;
        if (correct) score++;
        feedback.textContent = (correct ? "Correct! " : "Not quite. ") + question.why;
        feedback.hidden = false;
        quizForm.querySelectorAll('input[name="quiz-answer"]').forEach(function (input) { input.disabled = true; });
        quizForm.querySelector('button[type="submit"]').hidden = true;
        next.hidden = false;
        next.textContent = current === questions.length - 1 ? "See results" : "Next question";
    });

    next.addEventListener("click", function () {
        if (current < questions.length - 1) {
            current++;
            showQuestion();
        } else {
            quizForm.hidden = true;
            progress.hidden = true;
            results.hidden = false;
            document.querySelector("#quiz-score").textContent = "You scored " + score + " out of " + questions.length + ".";
            document.querySelector("#quiz-message").textContent = score >= 3 ? "Nice work! Keep choosing repair, safe reuse and responsible recycling." : "Keep learning—review the recycling steps and try the quiz again.";
        }
    });

    document.querySelector("#quiz-restart").addEventListener("click", function () {
        current = 0;
        score = 0;
        quizForm.hidden = false;
        progress.hidden = false;
        results.hidden = true;
        showQuestion();
    });
    showQuestion();
}

// 4. Value Estimator: a rough guide, not a live market price.
const estimatorForm = document.querySelector("#estimator-form");

if (estimatorForm) {
    estimatorForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const model = document.querySelector("#model").value.trim();
        const result = document.querySelector("#estimate-result");
        if (model.length < 2 || model.length > 60) {
            result.textContent = "Please enter a model name between 2 and 60 characters.";
            result.hidden = false;
            return;
        }
        const device = document.querySelector("#device-type").value;
        const condition = document.querySelector("#condition").value;
        const age = document.querySelector("#age").value;
        const working = document.querySelector("#functionality").value;
        const base = { phone: 12000, laptop: 22000, tablet: 8000, tv: 9000, printer: 3500, other: 3000 }[device];
        const conditionFactor = { excellent: 1, good: 0.75, fair: 0.45, poor: 0.2 }[condition];
        const ageFactor = { under1: 1, "1to3": 0.7, "3to5": 0.45, over5: 0.25 }[age];
        const functionFactor = { fully: 1, minor: 0.65, major: 0.3, dead: 0.08 }[working];
        const estimate = Math.round(base * conditionFactor * ageFactor * functionFactor / 100) * 100;
        let advice = "Compare a few real listings before deciding whether to resell.";
        if (working === "dead" || condition === "poor") advice = "Recycling may be the most suitable option if repair is not practical.";
        else if (working === "major" || condition === "fair") advice = "Ask for a repair estimate; donation or refurbishment may be possible if it can be made safe.";
        else if (working === "fully" && (condition === "excellent" || condition === "good")) advice = "Resale or donation could be sensible if the device works well and your personal data is erased.";
        result.textContent = "For " + model + ", a very rough starting estimate is around ₹" + Math.max(0, estimate - 1000).toLocaleString("en-IN") + "–₹" + (estimate + 1000).toLocaleString("en-IN") + ". " + advice + " This is not a live quote; actual offers may be very different.";
        result.hidden = false;
    });
}


// 5. Map search: use the place entered by the visitor to search Google Maps.
const locationForm = document.querySelector("#location-form");

if (locationForm) {
    locationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const place = document.querySelector("#user-location").value.trim();
        const map = document.querySelector("#location-map");
        const mapLink = document.querySelector("#open-map-link");

        if (place.length < 2) {
            alert("Please enter a city, area or PIN code.");
            return;
        }

        const search = "e-waste donation recycling centres near " + place;
        const mapUrl = "https://www.google.com/maps?q=" + encodeURIComponent(search) + "&output=embed";

        map.src = mapUrl;
        map.hidden = false;
        mapLink.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(search);
        mapLink.hidden = false;
    });
}
