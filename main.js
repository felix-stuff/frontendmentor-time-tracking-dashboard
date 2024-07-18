const container = document.getElementById('dashboard');
const navigation = document.getElementById('navigation');
const buttons = navigation.querySelectorAll('.navigation__link');
let selectedTimeframe = 'daily';

fetch('./data.json')
  .then((request) => {
    if (!request.ok) {
      return null;
    }

    return request.json();
  })
  .then((data) => {
    populateData(data);

    for (let button of buttons) {
      // set inital selected timeframe in navigation
      if (button.innerText.toLocaleLowerCase() === selectedTimeframe) {
        button.parentElement.classList.add('navigation__item--active');
      }

      // listen for clicks on navigation items
      button.addEventListener('click', () => {
        for (let button of buttons) {
          button.parentElement.classList.remove('navigation__item--active');
        }

        // get selected timeframe
        selectedTimeframe = button.innerText.toLocaleLowerCase();
        button.parentElement.classList.add('navigation__item--active');
        updateData(data, selectedTimeframe);
      });
    }
  });

const populateData = (data) => {
  const appendItem = (item) => {
    // set initial timeframe
    const current = item.timeframes[selectedTimeframe].current;
    const previous = item.timeframes[selectedTimeframe].previous;

    // remove all spaces from title and use lowercase characters only
    const cleanTitle = item.title.replace(/\s/g, '').toLowerCase();

    // add the markup for each item to the DOM
    const card = document.createElement('LI');

    // add styles to card
    card.classList.add('card');
    card.style.backgroundColor = `var(--color-${cleanTitle})`;

    // card markup
    card.innerHTML = `
        <img class="card__image" 
        style="background-color:var(--color-${cleanTitle})"
        src="./images/icon-${cleanTitle}.svg" 
        alt="Icon ${item.title}" />
        <div class="card__content">
            <h2 class="card__title">${item.title}</h2>
            <button class="card__edit">
            <span class="sr-only">edit</span>
            <svg width="21" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="#BBC0FF" fill-rule="evenodd"/></svg>
            </button>
            <strong class="card__time" data-counter="${current}">hrs</strong>
            <span class="card__time-previous">Previous - <span data-counter="${previous}">hrs</span></span>
        </div>
    `;

    // add the markup for each item to the DOM
    container.appendChild(card);
  };

  // loop over data to append all the cards
  data.forEach((item) => {
    appendItem(item);
  });
};

const updateData = (data, selectedTimeframe) => {
  const cardTimes = document.querySelectorAll('.card .card__time');
  const cardPrevTimes = document.querySelectorAll('.card .card__time-previous > span');

  // loop over data and set the selected timeframe value on the respective card
  for (let i = 0; i < data.length; i++) {
    cardTimes[i].setAttribute('data-counter', data[i].timeframes[selectedTimeframe].current);
    cardPrevTimes[i].setAttribute('data-counter', data[i].timeframes[selectedTimeframe].previous);
  }
};
