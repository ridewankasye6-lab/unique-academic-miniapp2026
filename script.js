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
