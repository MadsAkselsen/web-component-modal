class Modal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
            <style>
                #backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(0,0,0,0.75);
                    z-index: 10;
                    opacity: 0; /* make invisible */
                    pointer-events: none; /* enable click through when invisible */
                    transition: all 0.2s;
                }
                /* select backdrop and modal when the "opened" attribute is present */
                :host([opened]) #backdrop,
                :host([opened]) #modal {
                    opacity: 1;
                    pointer-events:all;
                }

                :host([opened]) #modal {
                    top: 15vh;
                }

                #modal {
                    position: fixed;
                    top: 10vh;
                    left: 25%;
                    width: 50%;
                    z-index: 100;
                    background: white;
                    border-radius: 3px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.26);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.2s;
                }

                #header {
                    padding: 1rem;
                    border-bottom: 1px solid #ccc;
                }

                /* this is how we target the h1 if users pass h1 into the slot */
                ::slotted(h1) {
                    font-size: 1.25rem;
                    margin: 0;
                }

                /* this is how we target the h1 in the shadowdom if no h1 is passed into the slot from the lightdom */
                header h1 {
                    font-size: 1.25rem;
                }

                #actions {
                    border-top: 1px solid #ccc;
                    padding: 1rem;
                    display: flex;
                    justify-content: flex-end;
                }

                #actions button {
                    margin: 0 0.25rem;
                }

                #main {
                    padding: 1rem;
                }
            </style>

            <div id="backdrop"></div>
            <div id="modal">
                <header id="header">
                    <slot name="title"><h1>Default Title</h1></slot>
                </header>
                <section id="main">
                    <slot name="body">This is a default text. You can add custom content in the html slot with name="body"</slot>
                </section>
                <section id="actions">
                    <button id="cancel-btn">Cancel</button>
                    <button id="confirm-btn">Okay</button>
                </section>
            </div>
        `;
    // the below slots variable is not being used for anything in this app. It's just here to show what is can do
    const slots = this.shadowRoot.querySelectorAll('slot');
    slots[1].addEventListener('slotchange', (event) => {
      console.dir(slots[1].assignedNodes());
    });

    const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
    const confirmButton = this.shadowRoot.querySelector('#confirm-btn');
    const backdrop = this.shadowRoot.getElementById('backdrop');
    cancelButton.addEventListener('click', this._cancel.bind(this));
    confirmButton.addEventListener('click', this._confirm.bind(this));
    backdrop.addEventListener('click', this._cancel.bind(this));
    /* cancelButton.addEventListener('cancel', () => {
      console.log('cancel inside the component');
    }); */
    //this.addEventListener("click", )

    this._modal = this.shadowRoot.getElementById('modal');
  }

  /*! This below code changes some CSS when the attribute "opened" is present. But if we only change css we actually dont need to use the attributeChangedCallback. Instead we can just change do this in the css itself */
  /* attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'opened') {
      this._backdrop.style.opacity = '1';
      this._backdrop.style.pointerEvents = 'auto';
      this._modal.style.opacity = '1';
      this._modal.style.pointerEvents = 'auto';
    } 
  }

  static get observedAttributes() {
    return ['opened'];
  } */

  open() {
    this.setAttribute('opened', '');
  }

  hide() {
    if (this.hasAttribute('opened')) {
      this.removeAttribute('opened');
    }
  }

  _cancel(event) {
    this.hide();

    const cancelEvent = new Event('cancel', { bubbles: true, composed: true }); //bubbles:true = bubble this event up through the elements until it meets and event listener. composed:true = this event can cross over to the lightdom from the shadowdom
    event.target.dispatchEvent(cancelEvent); // dispatches the cancelEvent from the cancel button element (event.target). From here the event will bubble up through the DOM nodes and trigger event listeners along the way.
  }

  // this event is dont different from the above _cancel to showcase another way to do this. In _confirm we dont need to set bubbles and composed. This is because the event is dispatched directly from the modal component itself (this), and therefore hits the event listener in the lightdom. Remember, the eventlistener in the lightdom is on the modal component itself (this). The event is not triggered in a nested element inside the shadowdom
  _confirm(event) {
    this.hide();
    const confirmEvent = new Event('confirm');
    this.dispatchEvent(confirmEvent);
  }
}

customElements.define('ma-modal', Modal);
