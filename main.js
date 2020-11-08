const mainContent = document.getElementById('main-content');
const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random-btn');
const create = document.getElementById('create-btn');
const recipeName = document.getElementById('recipe-name');
const ingredients = document.getElementById('ingredients');
const instructions = document.getElementById('instructions');
const createRecipeSubmit = document.getElementById('create-recipe');
const recipeHeading = document.getElementById('recipe-heading');
const recipeOutput = document.getElementById('recipe-output');
const singleRecipeOutput = document.getElementById('single-recipe-output');
const recipeOverlay = document.getElementById('recipe-overlay');
const createRecipeOverlay = document.getElementById('create-recipe-overlay');
const addExtraIngredient = document.getElementById('add-extra-ingredient');
const addExtraInstruction = document.getElementById('add-extra-instruction');
const URL = 'https://legassick-recipes.herokuapp.com/api/v1/recipes';

let loading = false;
let state = '';

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
create.addEventListener('click', createRecipe);
createRecipeSubmit.addEventListener('submit', saveRecipe);

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
  const singleRecipe = document.querySelector('.single-recipe');
  const recipeID = singleRecipe.getAttribute('data-recipeid');
  const backBtn = path.find(item => {
    if (item.classList) {
      return item.classList.contains('back-btn');
    } else {
      return false;
    }
  });

  const deleteBtn = path.find(item => {
    if (item.classList) {
      return item.classList.contains('delete-btn');
    } else {
      return false;
    }
  });

  const editBtn = path.find(item => {
    if (item.classList) {
      return item.classList.contains('edit-btn');
    } else {
      return false;
    }
  });

  if (backBtn) {
    recipeOverlay.classList.add('hide');
    mainContent.classList.remove('hide');
  }

  if (deleteBtn) {
    showAlertMessage(recipeID);
  }

  if (editBtn) {
    state = 'editRecipe';
    recipeOverlay.classList.add('hide');
    editRecipe(recipeID);
  }
});

addExtraIngredient.addEventListener('click', () => {
  const createInput = document.createElement('input');
  createInput.type = 'text';
  createInput.name = 'recipe-ingredient';
  createInput.className = 'recipe-ingredient';
  createInput.placeholder = 'Ingredient';
  ingredients.appendChild(createInput);
});

addExtraInstruction.addEventListener('click', () => {
  const createTextArea = document.createElement('textarea');
  createTextArea.name = 'recipe-instruction';
  createTextArea.className = 'recipe-instruction';
  createTextArea.placeholder = 'Instruction';
  instructions.appendChild(createTextArea);
});

function loadingContent() {
  if (loading === true) {
    recipeOutput.innerHTML = '<p class="loading">Loading...</p>';
  }
}

function getAllRecipes() {
  loading = true;
  loadingContent();
  fetch(URL)
    .then(res => res.json())
    .then(data => showRecipes(data));
}

getAllRecipes();

function showRecipes(data) {
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
  swiper.init();
  loading = false;
}

function searchRecipe(e) {
  e.preventDefault();
  const value = search.value;
  loading = true;
  loadingContent();
  fetch(URL + `?name=${value}`)
    .then(res => res.json())
    .then(data => {
      const recipe = data.data;

      if (recipe.length === 0) {
        recipeHeading.innerHTML = `<p>No results found for "${value}"</p>`;
        recipeOutput.innerHTML = '';
      } else {
        recipeHeading.innerHTML = `<p>${recipe.length} results found for "${value}"</p>`;

        swiper.removeAllSlides();
        showRecipes(data);
      }
      search.value = '';
    });
}

function getRandomRecipe() {
  loading = true;
  loadingContent();
  fetch(URL + '/random')
    .then(res => res.json())
    .then(data => showRecipes(data));
  recipeHeading.innerHTML = '';
}

function getRecipeById(recipeID) {
  fetch(URL + `/${recipeID}`)
    .then(res => res.json())
    .then(data => {
      const recipe = data.data;
      singleRecipeOutput.innerHTML = `
        <div class="single-recipe" data-recipeID=${recipe._id}>
          <div class="single-recipe-heading">
            <div class="heading-btns">
              <button class="btn back-btn" id="back-btn"><i class="fas fa-arrow-left"></i>Back</button>
              <button class="btn edit-btn" id="edit-btn"><i class="fas fa-edit"></i>Edit</button>
            </div>
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
            <button class="btn delete-btn" id="delete-btn"><i class="fas fa-trash"></i>Delete</button>
          </div>
        </div>
      `;
    });
  recipeOverlay.classList.remove('hide');
  mainContent.classList.add('hide');
}

function createRecipe() {
  createRecipeOverlay.classList.remove('hide');
  mainContent.classList.add('hide');
  state = 'newRecipe';
}

function saveRecipe(e) {
  e.preventDefault();

  let recipeIngredients = [];

  const recipeIngredient = document.querySelectorAll('.recipe-ingredient');

  recipeIngredient.forEach(recipeIngredient => {
    recipeIngredients.push(recipeIngredient.value);
  });

  let recipeInstructions = [];

  const recipeInstruction = document.querySelectorAll('.recipe-instruction');

  recipeInstruction.forEach(recipeInstruction => {
    recipeInstructions.push(recipeInstruction.value);
  });

  const recipeNameValue = recipeName.value;

  const data = {
    name: recipeNameValue,
    ingredients: recipeIngredients,
    instructions: recipeInstructions
  };

  if (state === 'newRecipe') {
    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        console.log('Success:', data);
        state = '';
        location.reload();
      });
  } else {
    const recipeID = document
      .getElementById('recipe-data-ID')
      .getAttribute('data-recipe');
    fetch(URL + `/${recipeID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        console.log('Success:', data);
        state = '';
        location.reload();
      });
  }
}

function showAlertMessage(recipeID) {
  const alertMessageContainer = document.getElementById(
    'alert-message-container'
  );
  const cancelBtn = document.getElementById('cancel-btn');
  const confirmBtn = document.getElementById('confirm-btn');
  const alertMessage = document.getElementById('alert-message');
  alertMessageContainer.classList.remove('hide');
  alertMessageContainer.classList.add('show-alert-message');
  cancelBtn.addEventListener('click', () => {
    alertMessageContainer.classList.add('hide');
    alertMessageContainer.classList.remove('show-alert-message');
  });
  confirmBtn.addEventListener('click', () => {
    alertMessage.innerText = 'Recipe deleted';
    setTimeout(() => {
      deleteRecipe(recipeID);
    }, 2000);
  });
}

async function deleteRecipe(recipeID) {
  await fetch(URL + `/${recipeID}`, {
    method: 'DELETE'
  });
  state = '';
  location.reload();
}

function editRecipe(recipeID) {
  createRecipeOverlay.classList.remove('hide');
  fetch(URL + `/${recipeID}`)
    .then(res => res.json())
    .then(data => {
      const recipe = data.data;
      const recipeDataID = document.getElementById('recipe-data-ID');
      recipeDataID.dataset.recipe = recipeID;
      recipeName.value = recipe.name;
      recipe.ingredients.forEach(ingredient => {
        const createInput = document.createElement('input');
        createInput.type = 'text';
        createInput.name = 'recipe-ingredient';
        createInput.className = 'recipe-ingredient';
        createInput.value = ingredient;
        ingredients.appendChild(createInput);
      });
      recipe.instructions.forEach(instruction => {
        const createTextArea = document.createElement('textarea');
        createTextArea.name = 'recipe-instruction';
        createTextArea.className = 'recipe-instruction';
        createTextArea.value = instruction;
        instructions.appendChild(createTextArea);
      });
    });
}
