

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
            var T=`<div class="card w-36 sm:w-60 rounded overflow-hidden shadow-lg"><img class="w-full max-h-60 object-cover" src="${element.img}"alt="Team member">
                <div class="px-3 sm:px-6 py-4"><div class="font-bold text-sm sm:text-xl mb-2">${element.name}</div>
                <p class="text-gray-700 text-xs sm:text-base">${element.job}</p></div></div>`

            var Text = `<img class="col-span-2 max-h-16 w-full object-contain lg:col-span-1" src="${element.img}" alt="Transistor" width="158" height="52"></img>`    
            var temp = document.createElement('div');
            temp.innerHTML = Text;
            var htmlObject = temp.firstChild;
            cardList_Partner.append(htmlObject)
    });


});



