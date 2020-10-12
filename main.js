const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random-btn');
const recipeHeading = document.getElementById('recipe-heading');
const recipeOutput = document.getElementById('recipe-output');
const singleRecipeOutput = document.getElementById('single-recipe-output');
const recipeOverlay = document.getElementById('recipe-overlay');

function initSwiper() {
  const swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    observer: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true
    }
  });
}

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
    closeSingleRecipe();
  }
});

function getAllRecipes() {
  fetch('https://legassick-recipes.herokuapp.com/api/v1/recipes')
    .then(res => res.json())
    .then(data => {
      const recipe = data.data;

      recipeOutput.innerHTML = recipe
        .map(
          recipe => `
          <div class="recipe swiper-slide" data-recipeID="${recipe._id}">
            <p>${recipe.name}</p>
          </div>
        `
        )
        .join('');
      initSwiper();
    });
}

getAllRecipes();

function searchRecipe(e) {
  e.preventDefault();
  const value = search.value;
  fetch(`https://legassick-recipes.herokuapp.com/api/v1/recipes?name=${value}`)
    .then(res => res.json())
    .then(data => {
      const recipe = data.data;

      if (recipe.length === 0) {
        recipeHeading.innerHTML = `<p>No results found for "${value}"</p>`;
      } else {
        recipeHeading.innerHTML = `<p>${recipe.length} results found for "${value}"</p>`;

        recipeOutput.innerHTML = recipe
          .map(
            recipe => `
          <div class="recipe swiper-slide" data-recipeID="${recipe._id}">
            <p>${recipe.name}</p>
          </div>
        `
          )
          .join('');
      }
      search.value = '';
    });
}

function getRandomRecipe() {
  fetch('https://legassick-recipes.herokuapp.com/api/v1/recipes/random')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      const recipe = data.data[0];
      recipeOutput.innerHTML = `
          <div class="recipe swiper-slide" data-recipeID="${recipe._id}">
            <p>${recipe.name}</p>
          </div>
        `;
    });
}

function getRecipeById(recipeID) {
  fetch(`https://legassick-recipes.herokuapp.com/api/v1/recipes/${recipeID}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      const recipe = data.data;
      singleRecipeOutput.innerHTML = `
        <div class="single-recipe">
          <button class="back-btn" id="back-btn">Go Back</button>
          <p>${recipe.name}</p>
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
      `;
    });
  recipeOverlay.classList.remove('hide');
}

function closeSingleRecipe() {
  recipeOverlay.classList.add('hide');
}
