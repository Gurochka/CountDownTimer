class CountdownTimer {
    /*
    options:
        customElement: DOMNode
            define your own submit button element instead of .countdowntimer
            the element has to contain at least one button with type 'submit'
        container: string
            find first matched container by selector and append Submit button.
        button_text: string
            Submit button text
    */
    button_text = 'Submit'

    _element = null
    _btn = null

    // post_url = ''
    // cat = ''
    // uuid = ''
    // submit_verify_message = 'Submit verify message'
    // timer_url = ''

    // warning_threshold = 600 // 10 mins
    // warning_message = 'Warning message'

    // alert_threshold = 60 // 1 min
    // alert_message = 'Alert message'

    constructor(options = {}){
        this._element = options.customElement;

        this._defineElements(options.container);
        if (!this._btn) return;
        this._defineEventListeners();
    }

    _defineElements = (selector) => {
        if (!this._element) {
            if (!selector) {
                this._showWarn('Please, define container option or customElement');
                return;
            }
            const containerEl = document.querySelector(selector);
            if (!containerEl) {
                this._showWarn('Container element wasn\'t found');
                return;
            }
            this._element = this._getElement();
            containerEl.appendChild(this._element);
        }
        this._defineButton();
    }

    _defineButton = () => {
        this._btn = this._element.querySelector('button[type=submit]');
        if (!this._btn) this._showWarn('Button element wasn\'t found');
    }

    _getElement = () => {
        const button = this._createElement('button', { type: 'submit', class: 'countdowntimer__submit-btn' });
        button.textContent = this.button_text;
        const wrapper = this._createElement('div', {class: 'countdowntimer'});
        wrapper.appendChild(button);
        return wrapper;
    }

    _defineEventListeners = () => {
    }

    onSubmit = (callback) => {
        console.log('onSubmit callback!');
    }

    show = () => {
        console.log('show timer!');
    }

    hide = () => {
        console.log('hide timer!');
    }

    // helper classes

    _createElement = (tagname, attrs = {}) => {
        const el = document.createElement(tagname);
        Object.keys(attrs).forEach(key => {
            el.setAttribute(key, attrs[key]);
        });
        return el;
    }

    _showWarn = (message) => console && console.warn && console.warn(`CountdownTimer: ${message}`)
}