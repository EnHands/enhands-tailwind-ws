

card = document.getElementsByClassName("card")
cardList= document.getElementById("CardList")


var people=[
    {name: "Johannes Frey",
    img: "JohannesFrey-MA-RCI.jpg",
    job: "Studying M.Sc. Robotics, Cognition, Intelligence"},

    {name: "Leon Kiesgen",
    img: "LeonKiesgen_MA-RCI.jpg",
    job: "Studying M.Sc. Robotics, Cognition, Intelligence"},

    {name: "Negar Shahmoradi",
    img: "NegarShahmoradi_MS-Medizintechnik.jpg",
    job: "Studying M.Sc. Medical Engineering and Assistance Systems"},

    {name: "Silija Breimann",
    img: "SilijaBreimann_MasterMechatronicsAndRobotics.jpg",
    job: "Studying M.Sc. Mechatronics & Robotics"},

    {name: "Sonja Groß, M.Sc.",
    img: "SonjaGroß_MSc_Biomedical_Engineering.jpg",
    job: "Research Assistant, Munich Institute of Robotics and Machine Intelligence (MIRMI)"},

    {name: "Vincent Bürgin",
    img: "VincentBürgin-MasterInformatics.jpg",
    job: "Studying M.Sc. Informatics"},

    {name: "Amartya Ganguly, Ph.D.",
    img: "AmartyaGanguly.png",
    job: "Biomechanics, Munich Institute of Robotics and Machine Intelligence (MIRMI)"},


]
console.log(people)

people.sort((a, b) => 0.5 - Math.random());

people.forEach(element => {
    var T=`<div class="card w-60 rounded overflow-hidden shadow-lg"><img class="w-full" src="images/people/${element.img}" alt="Mountain"><div class="px-6 py-4"><div class="font-bold text-xl mb-2">${element.name}</div><p class="text-gray-700 text-base">${element.job}</p></div></div>`
    var temp = document.createElement('div');
    temp.innerHTML = T;
    var htmlObject = temp.firstChild;
    console.log(htmlObject)
    cardList.append(htmlObject)
});



