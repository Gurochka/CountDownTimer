# CountDownTimer

### Running demo, source files, etc..
There is a demo version located at the `/src` folder. Just run `index.html` file in your browser. There are two buttons - the first one is custom, and it's hidden at the start. The second one is a default button which is visible at the start (a green one). Both of them shouldn't work right now because of the wrong `post_url` option. Please, change this option, and provide the `timer_url` option as well.

The source file is located at `src/countdowntimer.js`. You can use the next gulp tasks, also:

- `gulp js` (or `npm run js`) - creates a file with help of Babel compiler. Use this file if you don't use Babel for your project. The destination file is `/dist/countdowntimer.js`

- `gulp compress` (or `npm run compress`) - creates a minified version of `/dist/countdowntimer.js`. The destination file is located at `/dist/countdowntimer-min.js`

### Available Widget options:
**customElement: DOMNode** - define your own submit button element instead of .countdowntimer. The element has to contain at least one button with type 'submit'
**container: string** - define container selector to draw button inside it.
**button_text: string** - submit button text, by default is "Submit"
**hide_on_start: boolean** - set to true to hide submit button when component has been just created. By default is true
**beforeSubmit: function = (this) => boolean;** - Asks if user wants to submit. Return true to continue submit, and false to reject it. Define empty funtion, like: `beforeSubmit: () => true` to disable verification
**submit_verify_message: string** - text of submit verify message

#### POST Submit options:
**post_url: string**
**cat: string**
**uuid: string**
**onSubmitSuccess: function** - launches if submit action is successful
**onSubmitError: function** - launches if submit action fired an error. By default error message would be shown in console.
#### GET Timer options:
**timer_url: string**
**onGetTimerError: function** - launches if getting timer info fired an error. By default error message would be shown in console.
#### Timer options:
**warning_threshold: number**
**warning_message: string**
**onShowWarning: function** - redefine this function to use your own warning message. A standart `alert` is used by default.
**alert_threshold: number**
**alert_message: string**
**onShowAlert: function** - redefine this function to use your own alert message. A standart `alert` is used by default.
**onStopTimer: function** - calls when timer has stopped because time's up. 

#### Methods (experimental part which needs to be redesigned a little bit):
**show** - shows timer component by setting `visibility: visible`
**hide** - hides timer component by setting `visibility: hidden`
Right now you can redefine both methods like that:
```
const timer = new CountdownTimer();
timer.show = yourOwnShowFunction;
timer.hide = yourOwnHideFunction;
```
**startTimer** - *experimental. Just recreates setInterval. To restart whole timer run stopTimer first.
**pauseTimer** - *experimental. Pauses timer, to start it back call startTimer function
**stopTimer** - *experimental. Clear all intervals and reset timer values.

#### todo Part:

1. Move styles for countdown timer inside widget (css-in-js)
2. Rewrite show/hide methods so you can manage it through classes
3. Add fetch polyfill so the widget could work with ie10+ browsers.