export class ListTemplate {
    constructor(container) {
        this.container = container;
    }
    render(item, heading, pos) {
        // Create <li> tag
        const li = document.createElement('li');
        // Create <h4> header
        const h4 = document.createElement('h4');
        // Assign your heading to the <h4> tag and append it to the <li> tag 
        h4.innerText = heading;
        li.append(h4);
        // Create a <p> tag
        const p = document.createElement('p');
        // Assign your format method of the class to the <p> tag
        p.innerText = item.format();
        // Append to the <li> tag
        li.append(p);
        // Check Position and determine where to fix it
        if (pos === 'start') {
            this.container.prepend(li);
        }
        else {
            this.container.append(li);
        }
    }
}
