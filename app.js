// 540644 -> application ID
// const accessKey = YwTE9y3AFAwTT7QN9lkva6YV5AGxja840xKfq9apd84;
// const secretKey = xdF-e9EAaWk4AtigVT19_wAXrv6tHgjDG2MfEQv7u_E;
// const apiKey = '6ab4d79b01634e93b374927451e7c17c';

const searchInput = document.getElementById("searchInput");
const imageSelect = document.querySelectorAll(".imageSelect");
// var location = document.getElementById("locationInfo");

async function init() {

    //update images 
    async function update() {
        // const res = await fetch("https://dog.ceo/api/breeds/image/random");
        const resObj = await res.json();
        console.log(resObj);
        
        imageSelect.forEach(imageSelect => {
            imageSelect.src = resObj.message;
        });
    }

    // // TODO Get user current location
    // function getLocation() {
    //     if (navigator.geolocation) {
    //       navigator.geolocation.getCurrentPosition(showPosition);
    //     } else {
    //       location.innerHTML = "Geolocation is not supported by this browser.";
    //     }   
    // }

    //TODO nearbySearch from api to obtain name, ratings and distance from me
    // async function search() {
    //     const mapRes = await fetch(url);
    //     const mapResObj = await mapRes.json();
    //     console.log(mapResObj);
    // };

    refreshButton.addEventListener('click', function() {
        update();
    });

    // getLocationButton.addEventListener('click', function() {
    //     getLocation();
    // });

    // searchButton.addEventListener('click', function() {
    //     search();
    // });


    document.addEventListener('keypress', function handleKeyPress (event) {
        const action = event.key;
        console.log(action);

        if (action == "Enter") {
            update();
        }
    })
}

init();
