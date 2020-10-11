const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random-btn');
const recipeHeading = document.getElementById('recipe-heading');
const recipeOutput = document.getElementById('recipe-output');

submit.addEventListener('submit', searchRecipe);
random.addEventListener('click', getRandomRecipe);

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
