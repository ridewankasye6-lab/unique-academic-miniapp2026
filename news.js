/* =========================================
   UNIQUE ACADEMIC
   NEWS & UPDATES SYSTEM

   STEP 3 — NEWS DATA + DISPLAY
========================================= */


/* =========================================
   NEWS DATA

   To add a new update later, add another
   object to this list.

   IMPORTANT:
   This file does NOT modify your existing
   quiz, registration, login or payment system.
========================================= */

const newsData = [

    {
        id: 1,

        type: "quiz",

        icon: "📚",

        typeName: "New Quiz",

        title: "New Quiz Content Added",

        subject: "Global Trends",

        chapter: "Chapter 1",

        description:
            "New quiz questions have been added to help you practice and prepare for your exams.",

        date: "August 22, 2026",

        link: "quiz.html?subject=global-trends&chapter=1"

    },


    {
        id: 2,

        type: "notes",

        icon: "📝",

        typeName: "New Notes",

        title: "New Study Notes Available",

        subject: "Global Trends",

        chapter: "Chapter 1",

        description:
            "New study materials and notes are now available for students.",

        date: "August 22, 2026",

        link: "#"

    },


    {
        id: 3,

        type: "announcement",

        icon: "📢",

        typeName: "Announcement",

        title: "Welcome to Unique Academic News",

        subject: "Unique Academic",

        chapter: "",

        description:
            "This page will keep you informed whenever new quizzes, notes, lessons or important announcements are added.",

        date: "August 22, 2026",

        link: "#"

    }

];


/* =========================================
   ELEMENTS
========================================= */

const newsList =
    document.getElementById("newsList");


const emptyNews =
    document.getElementById("emptyNews");


const filterButtons =
    document.querySelectorAll(".filter-button");


/* =========================================
   DISPLAY NEWS
========================================= */

function displayNews(filter = "all") {

    newsList.innerHTML = "";


    const filteredNews =
        filter === "all"
            ? newsData
            : newsData.filter(
                function (item) {
                    return item.type === filter;
                }
            );


    /* =====================================
       NO NEWS
    ===================================== */

    if (filteredNews.length === 0) {

        emptyNews.style.display =
            "block";

        return;

    }


    emptyNews.style.display =
        "none";


    /* =====================================
       CREATE NEWS CARDS
    ===================================== */

    filteredNews.forEach(
        function (item) {

            const card =
                document.createElement("article");


            card.className =
                "news-card";


            card.dataset.type =
                item.type;


            /* =============================
               CARD TOP
            ============================= */

            const cardTop =
                document.createElement("div");


            cardTop.className =
                "news-card-top";


            const type =
                document.createElement("span");


            type.className =
                "news-type";


            type.textContent =
                item.icon +
                " " +
                item.typeName;


            const date =
                document.createElement("span");


            date.className =
                "news-date";


            date.textContent =
                item.date;


            cardTop.appendChild(type);

            cardTop.appendChild(date);


            /* =============================
               TITLE
            ============================= */

            const title =
                document.createElement("h3");


            title.textContent =
                item.title;


            /* =============================
               SUBJECT
            ============================= */

            const subject =
                document.createElement("p");


            subject.className =
                "news-subject";


            subject.textContent =
                item.subject;


            /* =============================
               DESCRIPTION
            ============================= */

            const description =
                document.createElement("p");


            description.className =
                "news-description";


            description.textContent =
                item.description;


            /* =============================
               FOOTER
            ============================= */

            const footer =
                document.createElement("div");


            footer.className =
                "news-card-footer";


            /* =============================
               CHAPTER
            ============================= */

            const chapter =
                document.createElement("span");


            chapter.className =
                "news-chapter";


            if (item.chapter) {

                chapter.textContent =
                    "📖 " +
                    item.chapter;

            }


            /* =============================
               LINK
            ============================= */

            const link =
                document.createElement("a");


            link.className =
                "news-link";


            if (
                item.link &&
                item.link !== "#"
            ) {

                link.href =
                    item.link;

                link.textContent =
                    "Open →";

            }

            else {

                link.href =
                    "#";

                link.textContent =
                    "Update";

                link.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                    }
                );

            }


            footer.appendChild(chapter);

            footer.appendChild(link);


            /* =============================
               BUILD CARD
            ============================= */

            card.appendChild(cardTop);

            card.appendChild(title);

            card.appendChild(subject);

            card.appendChild(description);

            card.appendChild(footer);


            newsList.appendChild(card);

        }
    );

}


/* =========================================
   FILTER BUTTONS
========================================= */

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                /* =========================
                   REMOVE ACTIVE
                ========================= */

                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                /* =========================
                   ADD ACTIVE
                ========================= */

                this.classList.add(
                    "active"
                );


                /* =========================
                   GET FILTER
                ========================= */

                const filter =
                    this.dataset.filter;


                /* =========================
                   DISPLAY
                ========================= */

                displayNews(filter);

            }
        );

    }
);


/* =========================================
   INITIAL LOAD
========================================= */

displayNews("all");
