

// This file is used to generate random cards for the team section of the website
cardList_Partner= document.getElementById("CardList-Partner")

fetch('./supporter.json')
    .then((response) => response.json())
    .then((people) => 
    {
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        //shuffleArray(people);
        
        people.forEach(element => {
            var supporterImage = `<a title="${element.name}" href="${element.url}">
                <img class="col-span-2 max-h-16 w-full object-contain lg:col-span-1" src="${element.img}" alt="Transistor" width="158" height="52"></img>
                </a>`    
            var temp = document.createElement('div');
            temp.innerHTML = supporterImage;
            var htmlObject = temp.firstChild;
            cardList_Partner.append(htmlObject)
    });


});



