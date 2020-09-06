class CountdownTimer {
    /*
    Widget options:
        customElement: DOMNode
            Define your own submit button element instead of .countdowntimer
            the element has to contain at least one button with type 'submit'
        container: string
            Define container selector to draw button inside it.
        button_text: string
            Set submit button text, by default is "Submit"
        hide_on_start: boolean
            Set to true to hide submit button when component has been just created. By default is true
        beforeSubmit: function = (this) => boolean;
            Asks if user wants to submit. Return true to continue submit.
        submit_verify_message: string
            text of submit verify message
        
    POST Submit options:
        post_url: string
        cat: string
        uuid: string
        onSubmitSuccess: function
        onSubmitError: function

    GET timer options:
        timer_url: string
        onGetTimerError: function

    Timer options:
        warning_threshold: number
        warning_message: string
        onShowWarning: function

        alert_threshold: number
        alert_message: string
        onShowAlert: function
        onStopTimer: function

    methods:
        show
        hide
        startTimer
        pauseTimer
        stopTimer
    */

    button_text = 'Submit'
    hide_on_start = true
    submit_verify_message = 'Do you really want to submit?'
    onSubmitError = this._showError
    onGetTimerError = this._showError

    warning_threshold = 600
    warning_message = ''
    onShowWarning = () => alert(this.warning_message)

    alert_threshold = 60
    alert_message = ''
    onShowAlert = () => alert(this.alert_message)

    _element = null
    _btn = null
    _submitting = false
    _getting_timer = false
    _warning_message_is_shown = false
    _alert_message_is_shown = false

    constructor(options = {}){
        this._element = options.customElement;
        this.hide_on_start = options.hide_on_start ?? this.hide_on_start;
        this.button_text = options.button_text ?? this.button_text;
        this.beforeSubmit = options.beforeSubmit ?? this.beforeSubmit;
        this.submit_verify_message = options.submit_verify_message ?? this.submit_verify_message;
        this.post_url = options.post_url;
        this.post_data = options.post_data ?? this.post_data;
        this.cat = options.cat;
        this.uuid = options.uuid;
        this.onSubmitSuccess = options.onSubmitSuccess;
        this.onSubmitError = options.onSubmitError ?? this.onSubmitError;
        this.timer_url = options.timer_url;
        this.onGetTimerError = options.onGetTimerError ?? this.onGetTimerError;

        this.warning_threshold = options.warning_threshold ?? this.warning_threshold;
        this.warning_message = options.warning_message ?? this.warning_message;
        this.onShowWarning = options.onShowWarning ?? this.onShowWarning;

        this.alert_threshold = options.alert_threshold ?? this.alert_threshold;
        this.alert_message = options.alert_message ?? this.alert_message;
        this.onShowAlert = options.onShowAlert ?? this.onShowAlert;

        this.onStopTimer = options.onStopTimer;

        this._defineElements(options.container);
        if (!this._btn) return;
        if (this.hide_on_start === true) {
            this.hide();
        }
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
        this._btn.addEventListener('click', () => {
            if (this._submitting) return;
            const shouldSubmit = this.beforeSubmit(this);
            if (shouldSubmit === true) {
                this.onSubmit();
            }
        });
    }

    beforeSubmit = () => window.confirm(this.submit_verify_message)

    onSubmit = () => {
        if (!this.post_url) {
            this._showWarn('post_url property wasn\'t defined');
            return;
        }
        if (this._submitting) return;
        this._submitting = true;
        fetch(this.post_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cat: this.cat,
                uuid: this.uuid
            })
        })
        .then(res => {
            if (this.onSubmitSuccess) this.onSubmitSuccess(res);
            this.getTimer();
        })
        .catch(this.onSubmitError)
        .finally(() => { this._submitting = false; })
    }

    show = () => {
        this._element.style.visibility = 'visible';
    }

    hide = () => {
        this._element.style.visibility = 'hidden';
    }

    getTimer = () => {
        if (!this.timer_url) {
            this._showWarn('timer_url property wasn\'t defined');
            return;
        }
        if (this._getting_timer) return;
        this._getting_timer = true;
        fetch(`${this.timer_url}/${this.uuid}?cat=${this.cat}`)
            .then(res => res.json())
            .then(this._setUpTimer)
            .catch(this.onGetTimerError)
            .finally(() => { this._getting_timer = false; })
    }

    _setUpTimer = (res) => {
        const secondsRemaining = res?.assessment?.seconds_remaining;
        this.secondsRemaining = secondsRemaining;
        if (secondsRemaining && typeof secondsRemaining === 'number') {
            this._seconds_remaining = secondsRemaining;
            this.startTimer(secondsRemaining);
        }
    }

    _callbackInterval = () => {
        this._seconds_remaining--;
        if (this._seconds_remaining <= this.warning_threshold && !this._warning_message_is_shown) {
            this.onShowWarning();
            this._warning_message_is_shown = true;
        }
        if (this._seconds_remaining <= this.alert_threshold && !this._alert_message_is_shown) {
            this.onShowAlert();
            this._alert_message_is_shown = true;
        }
        if (this._seconds_remaining <= 0) this.stopTimer();
    }

    startTimer = () => {
        this._interval_id = setInterval(this._callbackInterval, 1000);
    }

    pauseTimer = () => {
        clearInterval(this._interval_id);
        this._interval_id = null;
    }

    stopTimer = () => {
        clearInterval(this._interval_id);
        this._interval_id = null;
        if (this.onStopTimer) this.onStopTimer();
        this._warning_message_is_shown = false;
        this._alert_message_is_shown = false;
    }

    // helper classes

    _createElement = (tagname, attrs = {}) => {
        const el = document.createElement(tagname);
        Object.keys(attrs).forEach(key => {
            el.setAttribute(key, attrs[key]);
        });
        return el;
    }

    _showWarn = (message) => console && console.warn(`CountdownTimer: ${message}`)
    _showError = (err) => console && console.error('CountdownTimer: ', error);
}