"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CountdownTimer =
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
function CountdownTimer() {
  var _this = this,
      _options$hide_on_star,
      _options$button_text,
      _options$beforeSubmit,
      _options$submit_verif,
      _options$post_data,
      _options$onSubmitErro,
      _options$onGetTimerEr,
      _options$warning_thre,
      _options$warning_mess,
      _options$onShowWarnin,
      _options$alert_thresh,
      _options$alert_messag,
      _options$onShowAlert;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, CountdownTimer);

  _defineProperty(this, "button_text", 'Submit');

  _defineProperty(this, "hide_on_start", true);

  _defineProperty(this, "submit_verify_message", 'Do you really want to submit?');

  _defineProperty(this, "onSubmitError", this._showError);

  _defineProperty(this, "onGetTimerError", this._showError);

  _defineProperty(this, "warning_threshold", 600);

  _defineProperty(this, "warning_message", '');

  _defineProperty(this, "onShowWarning", function () {
    return alert(_this.warning_message);
  });

  _defineProperty(this, "alert_threshold", 60);

  _defineProperty(this, "alert_message", '');

  _defineProperty(this, "onShowAlert", function () {
    return alert(_this.alert_message);
  });

  _defineProperty(this, "_element", null);

  _defineProperty(this, "_btn", null);

  _defineProperty(this, "_submitting", false);

  _defineProperty(this, "_getting_timer", false);

  _defineProperty(this, "_warning_message_is_shown", false);

  _defineProperty(this, "_alert_message_is_shown", false);

  _defineProperty(this, "_defineElements", function (selector) {
    if (!_this._element) {
      if (!selector) {
        _this._showWarn('Please, define container option or customElement');

        return;
      }

      var containerEl = document.querySelector(selector);

      if (!containerEl) {
        _this._showWarn('Container element wasn\'t found');

        return;
      }

      _this._element = _this._getElement();
      containerEl.appendChild(_this._element);
    }

    _this._defineButton();
  });

  _defineProperty(this, "_defineButton", function () {
    _this._btn = _this._element.querySelector('button[type=submit]');
    if (!_this._btn) _this._showWarn('Button element wasn\'t found');
  });

  _defineProperty(this, "_getElement", function () {
    var button = _this._createElement('button', {
      type: 'submit',
      class: 'countdowntimer__submit-btn'
    });

    button.textContent = _this.button_text;

    var wrapper = _this._createElement('div', {
      class: 'countdowntimer'
    });

    wrapper.appendChild(button);
    return wrapper;
  });

  _defineProperty(this, "_defineEventListeners", function () {
    _this._btn.addEventListener('click', function () {
      if (_this._submitting) return;

      var shouldSubmit = _this.beforeSubmit(_this);

      if (shouldSubmit === true) {
        _this.onSubmit();
      }
    });
  });

  _defineProperty(this, "beforeSubmit", function () {
    return window.confirm(_this.submit_verify_message);
  });

  _defineProperty(this, "onSubmit", function () {
    if (!_this.post_url) {
      _this._showWarn('post_url property wasn\'t defined');

      return;
    }

    if (_this._submitting) return;
    _this._submitting = true;
    fetch(_this.post_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cat: _this.cat,
        uuid: _this.uuid
      })
    }).then(function (res) {
      if (_this.onSubmitSuccess) _this.onSubmitSuccess(res);

      _this.getTimer();
    }).catch(_this.onSubmitError).finally(function () {
      _this._submitting = false;
    });
  });

  _defineProperty(this, "show", function () {
    _this._element.style.visibility = 'visible';
  });

  _defineProperty(this, "hide", function () {
    _this._element.style.visibility = 'hidden';
  });

  _defineProperty(this, "getTimer", function () {
    if (!_this.timer_url) {
      _this._showWarn('timer_url property wasn\'t defined');

      return;
    }

    if (_this._getting_timer) return;
    _this._getting_timer = true;
    fetch("".concat(_this.timer_url, "/").concat(_this.uuid, "?cat=").concat(_this.cat)).then(function (res) {
      return res.json();
    }).then(_this._setUpTimer).catch(_this.onGetTimerError).finally(function () {
      _this._getting_timer = false;
    });
  });

  _defineProperty(this, "_setUpTimer", function (res) {
    var _res$assessment;

    var secondsRemaining = res === null || res === void 0 ? void 0 : (_res$assessment = res.assessment) === null || _res$assessment === void 0 ? void 0 : _res$assessment.seconds_remaining;
    _this.secondsRemaining = secondsRemaining;

    if (secondsRemaining && typeof secondsRemaining === 'number') {
      _this._seconds_remaining = secondsRemaining;

      _this.startTimer(secondsRemaining);
    }
  });

  _defineProperty(this, "_callbackInterval", function () {
    _this._seconds_remaining--;

    if (_this._seconds_remaining <= _this.warning_threshold && !_this._warning_message_is_shown) {
      _this.onShowWarning();

      _this._warning_message_is_shown = true;
    }

    if (_this._seconds_remaining <= _this.alert_threshold && !_this._alert_message_is_shown) {
      _this.onShowAlert();

      _this._alert_message_is_shown = true;
    }

    if (_this._seconds_remaining <= 0) _this.stopTimer();
  });

  _defineProperty(this, "startTimer", function () {
    _this._interval_id = setInterval(_this._callbackInterval, 1000);
  });

  _defineProperty(this, "pauseTimer", function () {
    clearInterval(_this._interval_id);
    _this._interval_id = null;
  });

  _defineProperty(this, "stopTimer", function () {
    clearInterval(_this._interval_id);
    _this._interval_id = null;
    if (_this.onStopTimer) _this.onStopTimer();
    _this._warning_message_is_shown = false;
    _this._alert_message_is_shown = false;
  });

  _defineProperty(this, "_createElement", function (tagname) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var el = document.createElement(tagname);
    Object.keys(attrs).forEach(function (key) {
      el.setAttribute(key, attrs[key]);
    });
    return el;
  });

  _defineProperty(this, "_showWarn", function (message) {
    return console && console.warn("CountdownTimer: ".concat(message));
  });

  _defineProperty(this, "_showError", function (err) {
    return console && console.error('CountdownTimer: ', error);
  });

  this._element = options.customElement;
  this.hide_on_start = (_options$hide_on_star = options.hide_on_start) !== null && _options$hide_on_star !== void 0 ? _options$hide_on_star : this.hide_on_start;
  this.button_text = (_options$button_text = options.button_text) !== null && _options$button_text !== void 0 ? _options$button_text : this.button_text;
  this.beforeSubmit = (_options$beforeSubmit = options.beforeSubmit) !== null && _options$beforeSubmit !== void 0 ? _options$beforeSubmit : this.beforeSubmit;
  this.submit_verify_message = (_options$submit_verif = options.submit_verify_message) !== null && _options$submit_verif !== void 0 ? _options$submit_verif : this.submit_verify_message;
  this.post_url = options.post_url;
  this.post_data = (_options$post_data = options.post_data) !== null && _options$post_data !== void 0 ? _options$post_data : this.post_data;
  this.cat = options.cat;
  this.uuid = options.uuid;
  this.onSubmitSuccess = options.onSubmitSuccess;
  this.onSubmitError = (_options$onSubmitErro = options.onSubmitError) !== null && _options$onSubmitErro !== void 0 ? _options$onSubmitErro : this.onSubmitError;
  this.timer_url = options.timer_url;
  this.onGetTimerError = (_options$onGetTimerEr = options.onGetTimerError) !== null && _options$onGetTimerEr !== void 0 ? _options$onGetTimerEr : this.onGetTimerError;
  this.warning_threshold = (_options$warning_thre = options.warning_threshold) !== null && _options$warning_thre !== void 0 ? _options$warning_thre : this.warning_threshold;
  this.warning_message = (_options$warning_mess = options.warning_message) !== null && _options$warning_mess !== void 0 ? _options$warning_mess : this.warning_message;
  this.onShowWarning = (_options$onShowWarnin = options.onShowWarning) !== null && _options$onShowWarnin !== void 0 ? _options$onShowWarnin : this.onShowWarning;
  this.alert_threshold = (_options$alert_thresh = options.alert_threshold) !== null && _options$alert_thresh !== void 0 ? _options$alert_thresh : this.alert_threshold;
  this.alert_message = (_options$alert_messag = options.alert_message) !== null && _options$alert_messag !== void 0 ? _options$alert_messag : this.alert_message;
  this.onShowAlert = (_options$onShowAlert = options.onShowAlert) !== null && _options$onShowAlert !== void 0 ? _options$onShowAlert : this.onShowAlert;
  this.onStopTimer = options.onStopTimer;

  this._defineElements(options.container);

  if (!this._btn) return;

  if (this.hide_on_start === true) {
    this.hide();
  }

  this._defineEventListeners();
};