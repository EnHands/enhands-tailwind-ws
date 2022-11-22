

card = document.getElementsByClassName("card")
cardList= document.getElementById("CardList")

fetch('./people.json')
    .then((response) => response.json())
    .then((people) => 
    {
        console.log(people)
        people.sort((a, b) => 0.5 - Math.random());

        people.forEach(element => {
            var T=`<div class="card w-60 rounded overflow-hidden shadow-lg"><img class="w-full" src="${element.img}" alt="Mountain"><div class="px-6 py-4"><div class="font-bold text-xl mb-2">${element.name}</div><p class="text-gray-700 text-base">${element.job}</p></div></div>`
            var temp = document.createElement('div');
            temp.innerHTML = T;
            var htmlObject = temp.firstChild;
            console.log(htmlObject)
            cardList.append(htmlObject)

    });


});



