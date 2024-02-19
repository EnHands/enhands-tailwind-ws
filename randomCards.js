

// This file is used to generate random cards for the team section of the website
cardList= document.getElementById("CardList-People")

fetch('./people.json')
    .then((response) => response.json())
    .then((people) => 
    {
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        shuffleArray(people);
        
        people.forEach(element => {
            let hoverImg = element.img_hover ? `<img class="img-hover w-full max-h-60 object-cover" src="${element.img_hover}"alt="${element.name} portrait">` : "";
            var T = `<div class="card w-36 sm:w-60 rounded overflow-hidden shadow-lg">
                <div class="card-image-area">
                <img class="${hoverImg ? 'img-nohover' : ''} w-full max-h-60 object-cover" src="${element.img}"alt="${element.name} portrait">
                ${hoverImg}
                </div>
                <div class="px-3 sm:px-6 py-4"><div class="font-bold text-sm sm:text-xl mb-2">${element.name}</div>
                <p class="text-gray-700 text-xs sm:text-base">${element.job}</p></div></div>`;
            var temp = document.createElement('div');
            temp.innerHTML = T;
            for (let imageElement of temp.getElementsByTagName("img")) {
                imageElement.decode();
            }
            var htmlObject = temp.firstChild;
            cardList.append(htmlObject)
    });


});



