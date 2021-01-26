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
                    pointer-events: none; /* click through when invisible */
                    transition: opacity 0.2s;
                }
                /* select backdrop and modal when the "opened" attribute is present */
                :host([opened]) #backdrop,
                :host([opened]) #modal {
                    opacity: 1;
                    pointer-events:all;
                }

                #modal {
                    position: fixed;
                    top: 15vh;
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
                    transition: opacity 0.2s;
                }

                #header {
                    padding: 1rem;
                }

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
                    <slot></slot>
                </header>
                <section id="main">
                    <slot></slot>
                </section>
                <section id="actions">
                    <button>Cancel</button>
                    <button>Okay</button>
                </section>
            </div>
        `;
    this._backdrop = this.shadowRoot.getElementById('backdrop');
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
}

customElements.define('ma-modal', Modal);
