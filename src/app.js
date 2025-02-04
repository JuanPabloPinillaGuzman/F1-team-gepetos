import { MainMenu } from "./components/mainMenu.js";


document.querySelectorAll(".nav-link").forEach((val,id) => {
    val.addEventListener("click", (e)=>{
        let data =JSON.parse(e.target.dataset.verocultar);
        let cardVer = document.querySelector(data[0]);
        cardVer.style.display ='block';
        data[1].forEach(card => {
            let cardActual = document.querySelector(card);
            cardActual.style.display = 'none';
        });
        e.stopImmediatePropagation();
         e.preventDefault();

    })
});
