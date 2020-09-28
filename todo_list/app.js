const addForm = document.querySelector('.add');
const list = document.querySelector('.todos');
const search = document.querySelector('.search input');



////////////////////////////////////
///////////// ADD TODO /////////////
////////////////////////////////////

const generateTemplate = todo => {
    // Create a template
    const html = `<li class="list-group-item d-flex justify-content-between align-items-center">
    <span>${todo}</span>
    <i class="far fa-trash-alt delete"></i>
  </li>`;

  // Add HTML template to existing HTML codes
  list.innerHTML += html;

}

addForm.addEventListener('submit', e => {
    // Prevent default reload
    e.preventDefault();
    // Get the value of the input textbox
    const todo = addForm.add.value.trim(); // trim removes white space before and after text
    
    // Check if the input is not empty
    if (todo.length){
        // Generate template 
        generateTemplate(todo); 
        // clear all the forms
        addForm.reset();
    }
  

});

////////////////////////////////////
////////// DELETE TODO /////////////
////////////////////////////////////
// Delete Todo ( Add event listener to the UL tag)

list.addEventListener('click', e =>{

    // Check is the className of the item clicked on the DOM contains Delete
    if(e.target.classList.contains('delete')){
        // Get the parent (li) and delete
        e.target.parentElement.remove();

    }

});


////////////////////////////////////
/////// IMPLEMENT SEARCH ///////////
////////////////////////////////////


// Select array of items that do not contain the input in the search so we can apply a CSS class to hide them
const filterTodos = (term) => {
    // Apply classes to the todos we dont need

    // Get the children of the UL tag
    Array.from(list.children) // Convert to Array
    .filter( todo => !todo.textContent.toLowerCase().includes(term)) // filter the Array to select all li without the term 
        .forEach(todo => todo.classList.add('filtered')); // loop through the list and add class filtered to hid the li(s)

    // Get the children of the UL tag
    Array.from(list.children) // Convert to Array
        .filter( todo => todo.textContent.toLowerCase().includes(term)) // filter the Array to select all li with the term 
            .forEach(todo => todo.classList.remove('filtered')); // loop through the list and add class filtered to hid the li(s)
};

search.addEventListener('keyup', e => {
    const term = search.value.trim().toLowerCase();

    // Filter Todos
    filterTodos(term);

    // Apply class to hide

})