const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random-btn');
const output = document.getElementById('output');

submit.addEventListener('submit', searchRecipe);
random.addEventListener('click', getRandomRecipe);

function searchRecipe(e) {
  e.preventDefault();
  const value = search.value;
  fetch(`https://legassick-recipes.herokuapp.com/api/v1/recipes?name=${value}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
    });
}

function getRandomRecipe() {
  fetch('https://legassick-recipes.herokuapp.com/api/v1/recipes/random')
    .then(res => res.json())
    .then(data => {
      console.log(data);
    });
}

const swiper = new Swiper('.swiper-container', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  loop: true,
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true
  }
});
