// ===============================
// UNIQUE ACADEMIC QUIZ
// Step 1 - Load Subject & Chapter
// ===============================

// Read URL
const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");
const chapter = params.get("chapter");

// Get HTML elements
const subjectName = document.getElementById("subjectName");
const chapterName = document.getElementById("chapterName");

// Show subject
if (subject) {
    subjectName.textContent = subject.replace(/-/g, " ").toUpperCase();
} else {
    subjectName.textContent = "Unknown Subject";
}

// Show chapter
if (chapter) {
    chapterName.textContent = "Chapter " + chapter;
} else {
    chapterName.textContent = "Unknown Chapter";
}
