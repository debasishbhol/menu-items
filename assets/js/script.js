'use strict';



// ? ============= PRELOAD ============= ? //
// ? Loading will be end after document is loaded

const preloader = document.querySelector("[data-preaload]");

var specialItems = new Set();
var allItems = new Set();
var categoryMap = new Map();
var restaurant = {}

window.addEventListener("load", function () {
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
});



// ? Add eventlistner on multiple events

const addEventOnElements = function (elements, eventType, callback) {
    for (let i = 0, len = elements.length; i < len; i++) {
        elements[i].addEventListener(eventType, callback);
    }
}



// ? ============= NAVBAR ============= ? //

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
}

// addEventOnElements(navTogglers, "click", toggleNavbar);



// ? ============= HEADER & BACK TO TOP BTN ============= ? //

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
    const isScrollBottom = lastScrollPos < window.scrollY;
    // if (isScrollBottom) {
    //     // header.classList.add("hide");
    // } else {
    //     // header.classList.remove("hide");
    // }

    lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
    if (window.scrollY >= 50) {
        // header.classList.add("active");
        backTopBtn.classList.add("active");
        hideHeader();
    } else {
        // header.classList.remove("active");
        backTopBtn.classList.remove("active");
    }
});


// ? ============= HERO SLIDER ============= ? //

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
    // lastActiveSliderItem.classList.remove("active");
    // heroSliderItems[currentSlidePos].classList.add("active");
    lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
    if (currentSlidePos >= heroSliderItems.length - 1) {
        currentSlidePos = 0;
    } else {
        currentSlidePos++;
    }

    updateSliderPos();
}

// heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
    if (currentSlidePos <= 0) {
        currentSlidePos = heroSliderItems.length - 1;
    } else {
        currentSlidePos--;
    }

    updateSliderPos();
}

// heroSliderPrevBtn.addEventListener("click", slidePrev);

// ? ============= AUTO SLIDE ============= ? //

let autoSlideInterval;

const autoSlide = function () {
    autoSlideInterval = setInterval(function () {
        slideNext();
    }, 7000);
}

// addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
//     clearInterval(autoSlideInterval);
// });

// addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



// ? ============= PARALLAX EFFECT ============= ? //

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});

function loadData() {
    setRestaurantName(data["name"]);
    extractAndMapItems(data["menu"]);
    listSpecialItems();
    insertAddress(data["address"]);
    restaurant = data;
}

function listAllItems() {
    document.querySelector(".grid-list").innerHTML = generateListTag(allItems).join("");
    document.querySelector("#special-items-btn").style.display = 'block';
    document.querySelector("#all-items-btn").style.display = 'none';
    document.querySelector("#menu-heading").innerText = 'All-inclusive menu';
}

function listSpecialItems() {
    document.querySelector(".grid-list").innerHTML = generateListTag(specialItems).join("");
    document.querySelector("#special-items-btn").style.display = 'none';
    document.querySelector("#all-items-btn").style.display = 'block';
    document.querySelector("#menu-heading").innerText = 'Bestseller';
}

function listItems(items) {
    let text = "NO ITEM FOUND";
    console.log(items);
    if(items.length == 1) {
        text = 'FOUND ' + items.length + ' ITEM';
    } else if(items.length > 1) {
        text = 'FOUND ' + items.length + ' ITEMS';
    }

    document.querySelector(".grid-list").innerHTML = generateListTag(items).join("");
    document.querySelector("#special-items-btn").style.display = 'none';
    document.querySelector("#all-items-btn").style.display = 'none';
    document.querySelector("#menu-heading").innerText = text;
}

function extractAndMapItems(menu) {
    menu.forEach(category => {
        categoryMap.set(category["name"], category["items"]);
        category["items"].forEach(item => {
            if(item["is-special"]) {
                specialItems.add(item);
            }
            allItems.add(item);
        });
    });
}

function generateListTag(data) {
    let items = [];
    data.forEach(value => {
        let liTop = '<li>' + 
        '                <div class="menu-card hover:card">' + 
        '                  <figure' + 
        '                    class="card-banner img-holder"' + 
        '                    style="--width: 100; --height: 100"' + 
        '                  >' + checkAndGetImageTag(value["item-url"]) + 
        '                  </figure>' +
        '                  <div>' + 
        '                    <div class="title-wrapper">' + 
        '                      <h3 class="title-3">' + 
        '                        <a href="#" class="card-title">'+ value["item-name"] +'</a>' + 
        '                      </h3>';


        let l1Middle = '<span class="badge label-1">' + value["item-tag"] + '</span>';

        let l1Bottom = '<span class="span title-2">'+ value["item-price"] +'</span>' + 
        '                    </div>' + 
        '' + 
        '                    <p class="card-text label-1">' + 
                                value['item-desc'] +
        '                    </p>' + 
        '                  </div>' + 
        '                </div>' + 
        '              </li>' + 
        '';
        let li = liTop;
        if(value["item-tag"] != null) li += l1Middle;
        li += l1Bottom;
        items.push(li);
    })

    return items;
}

function checkAndGetImageTag(path) {
    if(path != null || path != undefined) {
        return '<img' + 
        '       src=' + path + '' + 
        '       width="100"' + 
        '       height="100"' + 
        '       loading="lazy"' + 
        '       alt="Greek Salad"' + 
        '       class="img-cover"' + 
        '       />';
    } else {
        return '<img' + 
        '       src="https://raw.githubusercontent.com/debasishbhol/menu-items-images/main/default.png"' + 
        '       width="100"' + 
        '       height="100"' + 
        '       loading="lazy"' + 
        '       alt="Greek Salad"' + 
        '       class="img-cover"' + 
        '       />';
    }
}

function insertAddress(address) {
    let adrs = address["street"] + " " + address["city"] + " " + address["zip"] + ", " + address["state"]
    document.querySelector("#address").innerText = adrs;
}

function setRestaurantName(name) {
    document.querySelector("#restaurant-name").innerText = name;
}

function searchMenuItemByName(itemName) {
    let foundItems = [];
    if(itemName == '') {
        console.log("called!!");
       return '-1';
    }
    for (let category of restaurant.menu) {
      for (let item of category.items) {
        if (item["item-name"].toLowerCase().includes(itemName.toLowerCase())) {
          foundItems.push(item);
        }
        else if (itemName.length > 1 && item["item-name"].toLowerCase().includes(itemName.toLowerCase().charAt(0))) {
          const words = item["item-name"].split(' ');
          for (let word of words) {
            if (word.toLowerCase().startsWith(itemName.toLowerCase().charAt(0))) {
              let partialMatch = true;
              for (let i = 1; i < itemName.length; i++) {
                if (i >= word.length || word.toLowerCase().charAt(i) != itemName.toLowerCase().charAt(i)) {
                  partialMatch = false;
                  break;
                }
              }
              if (partialMatch) {
                foundItems.push(push);
                break;
              }
            }
          }
        }
      }
    }
    
    return foundItems;
  }
  