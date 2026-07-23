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
