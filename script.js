function searchSubjects() {
    let input = document.getElementById("search").value.toLowerCase();
    let cards = document.getElementsByClassName("card");

    for (let i = 0; i < cards.length; i++) {
        let text = cards[i].innerText.toLowerCase();

        if (text.includes(input)) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}
const modeBtn = document.getElementById("modeBtn");

modeBtn.onclick = function(){
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        modeBtn.innerHTML = "☀️ Light Mode";
    }
    else{
        modeBtn.innerHTML = "🌙 Dark Mode";
    }
}
document.addEventListener("DOMContentLoaded", function(){

const bookmarks = document.querySelectorAll(".bookmarkBtn");

bookmarks.forEach((button, index)=>{

    if(localStorage.getItem("bookmark"+index) === "saved"){
        button.innerHTML = "⭐ Saved";
        button.style.background = "green";
    }

    button.onclick = function(){

        if(button.innerHTML.includes("Bookmark")){

            button.innerHTML = "⭐ Saved";
            button.style.background = "green";

            localStorage.setItem("bookmark"+index,"saved");

        }else{

            button.innerHTML = "⭐ Bookmark";
            button.style.background = "#ffc107";

            localStorage.removeItem("bookmark"+index);

        }

    };

});

});
const progressBars = document.querySelectorAll(".progressBar");
const progressTexts = document.querySelectorAll(".progressText");


progressBars.forEach((bar,index)=>{

let saved = localStorage.getItem("progress"+index);

if(saved){
    bar.value = saved;
    progressTexts[index].innerHTML = saved+"%";
}


bar.oninput = function(){

progressTexts[index].innerHTML = bar.value+"%";

localStorage.setItem("progress"+index, bar.value);

}

});
// Continue Learning
const openButtons = document.querySelectorAll(".button");

openButtons.forEach(button => {

    if(button.innerHTML.includes("📖 Open")){

        button.onclick = function(){

            localStorage.setItem("lastSubject", button.parentElement.querySelector("h3").innerText);

            localStorage.setItem("lastLink", button.href);

        }

    }

});

const lastSubject = localStorage.getItem("lastSubject");
const lastLink = localStorage.getItem("lastLink");

if(lastSubject){

    document.getElementById("continueText").innerHTML =
    "Last opened: " + lastSubject;

    document.getElementById("continueBtn").href = lastLink;

    document.getElementById("continueBtn").innerHTML =
    "Continue Reading";

}
