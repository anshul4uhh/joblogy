const form = document.getElementById("jobForm");
const resultsDiv = document.getElementById("results");
const voiceBtn = document.getElementById("voiceBtn");
const descriptionInput = document.getElementById("description");

// 🎤 Voice Input (Web Speech API)
let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = function(event) {
    descriptionInput.value = event.results[0][0].transcript;
  };

  recognition.onerror = function() {
    alert("Voice recognition failed. Try again.");
  };
}

voiceBtn.addEventListener("click", () => {
  if (recognition) recognition.start();
  else alert("Voice recognition not supported in this browser.");
});

// 📡 Submit Form
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  resultsDiv.innerHTML = "<p>Loading jobs...</p>";

  const payload = {
    description: descriptionInput.value,
    country: document.getElementById("country").value,
    state: document.getElementById("state").value,
    city: document.getElementById("city").value
  };

  try {
    const response = await fetch("https://joblogy.onrender.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    renderResults(data.results);
  } catch (error) {
    resultsDiv.innerHTML = "<p>Error fetching jobs.</p>";
  }
});

// 🎨 Render Job Cards
function renderResults(jobs) {
  resultsDiv.innerHTML = "";

  if (!jobs || jobs.length === 0) {
    resultsDiv.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  jobs.forEach(job => {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
      <h3>${job.job_title || "Untitled"}</h3>
      <p><strong>Company:</strong> ${job.employer_name || "N/A"}</p>
      <p><strong>Location:</strong> ${job.job_city || ""}, ${job.job_state || ""}, ${job.job_country || ""}</p>
      <p><strong>Match Score:</strong> ${job.match_score || 0}%</p>
      <p><strong>Date Posted:</strong> ${job.date_posted || "N/A"}</p>
      <a href="${job.job_apply_link || "#"}" target="_blank" class="apply-btn">Apply Now</a>
    `;

    resultsDiv.appendChild(card);
  });
}
