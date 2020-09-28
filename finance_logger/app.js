import { Invoice } from './classes/Invoice.js';
import { ListTemplate } from './classes/ListTemplate.js';
// Form
const form = document.querySelector('.new-item-form');
// inputs
const type = document.querySelector('#type');
const toFrom = document.querySelector('#tofrom');
const details = document.querySelector('#details');
const amount = document.querySelector('#amount');
// List template instance
const ul = document.querySelector('ul'); // Add exclamation to take null error away. <ul> is on the index.html so it wont be null 
const list = new ListTemplate(ul);
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let values;
    values = [toFrom.value, details.value, amount.valueAsNumber];
    let doc;
    if (type.value === 'invoice') {
        //doc = new Invoice(toFrom.value, details.value, amount.valueAsNumber);
        doc = new Invoice(...values);
    }
    else {
        //doc = new Payment(toFrom.value, details.value, amount.valueAsNumber);
        doc = new Invoice(...values);
    }
    // Render to the page
    list.render(doc, type.value, 'end');
});
