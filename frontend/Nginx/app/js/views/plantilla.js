class NAME extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback(){
    }
    disconnectedCallback(){
    }
}



customElements.define('NAME-NAME', NAME);

export default function RENDERNAME () {
    return ('<NAME-NAME></NAME-NAME>');
}