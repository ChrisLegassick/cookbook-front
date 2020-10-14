const mainContent = document.getElementById('main-content');
const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random-btn');
const recipeHeading = document.getElementById('recipe-heading');
const recipeOutput = document.getElementById('recipe-output');
const singleRecipeOutput = document.getElementById('single-recipe-output');
const recipeOverlay = document.getElementById('recipe-overlay');
const URL = 'https://legassick-recipes.herokuapp.com/api/v1/recipes';

const swiper = new Swiper('.swiper-container', {
  init: false,
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  loop: true,
  observer: true,
  watchOverflow: true,
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true
  }
});

submit.addEventListener('submit', searchRecipe);
random.addEventListener('click', getRandomRecipe);

recipeOutput.addEventListener('click', e => {
  const path = e.path || (e.composedPath && e.composedPath());
  const recipe = path.find(item => {
    if (item.classList) {
      return item.classList.contains('recipe');
    } else {
      return false;
    }
  });

  if (recipe) {
    const recipeID = recipe.getAttribute('data-recipeid');
    getRecipeById(recipeID);
  }
});

singleRecipeOutput.addEventListener('click', e => {
  const path = e.path || (e.composedPath && e.composedPath());
  const backBtn = path.find(item => {
    if (item.classList) {
      return item.classList.contains('back-btn');
    } else {
      return false;
    }
  });

  if (backBtn) {
    recipeOverlay.classList.add('hide');
    mainContent.classList.remove('hide');
  }
});

function getAllRecipes() {
  fetch(URL)
    .then(res => res.json())
    .then(data => {
      const recipe = data.data;

      recipeOutput.innerHTML = recipe
        .map(
          recipe => `
          <div class="recipe swiper-slide" data-recipeID="${recipe._id}">
            <h2>${recipe.name}</h2>
            <p>Tap to view recipe</p>
          </div>
        `
        )
        .join('');
      swiper.params.loopedSlides = `${recipe.length}`;
      swiper.init();
    });
}

getAllRecipes();

function searchRecipe(e) {
  e.preventDefault();
  const value = search.value;
  fetch(URL + `?name=${value}`)
    .then(res => res.json())
    .then(data => {
      const recipe = data.data;

      if (recipe.length === 0) {
        recipeHeading.innerHTML = `<p>No results found for "${value}"</p>`;
      } else {
        recipeHeading.innerHTML = `<p>${recipe.length} results found for "${value}"</p>`;

        swiper.removeAllSlides();

        recipeOutput.innerHTML = recipe
          .map(
            recipe => `
          <div class="recipe swiper-slide" data-recipeID="${recipe._id}">
            <h2>${recipe.name}</h2>
            <p>Tap to view recipe</p>
          </div>
        `
          )
          .join('');
        swiper.params.loopedSlides = `${recipe.length}`;
      }
      search.value = '';
    });
}

function getRandomRecipe() {
  fetch(URL + '/random')
    .then(res => res.json())
    .then(data => {
      const recipe = data.data[0];
      recipeOutput.innerHTML = `
          <div class="recipe swiper-slide" data-recipeID="${recipe._id}">
            <h2>${recipe.name}</h2>
            <p>Tap to view recipe</p>
          </div>
        `;
    });
  recipeHeading.innerHTML = '';
}

function getRecipeById(recipeID) {
  fetch(URL + `/${recipeID}`)
    .then(res => res.json())
    .then(data => {
      const recipe = data.data;
      singleRecipeOutput.innerHTML = `
        <div class="single-recipe">
          <div class="single-recipe-heading">
            <button class="back-btn" id="back-btn"><i class="fas fa-arrow-left"></i>Go Back</button>
            <h2>${recipe.name}</h2>
          </div>
          <div class="single-recipe-content">
            <p>Ingredients:</p>
            <ul>
              ${recipe.ingredients
                .map(ingredient => `<li>${ingredient}</li>`)
                .join('')}
            </ul>
            <p>Instructions:</p>
            <ul>
              ${recipe.instructions
                .map(instruction => `<li>${instruction}</li>`)
                .join('')}
            </ul>
          </div>
        </div>
      `;
    });
  recipeOverlay.classList.remove('hide');
  mainContent.classList.add('hide');
}
