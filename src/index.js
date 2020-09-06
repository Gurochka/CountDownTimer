document.addEventListener("DOMContentLoaded", () => {
    const timer = new CountdownTimer({
        container: '.timer-container',
        hide_on_start: false,
        post_url: 'https://post_url',
        cat: '9lPm7PgxKk8',
        uuid: 'a9888096-eca6-11ea-b278-0e285bd5193e',
        timer_url: 'https://app.trueability.com/api/ui_v1/assessment_heart_beats',
        warning_threshold: 10,
        alert_threshold: 5,
        warning_message: 'Warning! Just 10 secs left!',
        alert_message: 'Alert! Just 5 secs left!'
    });

    const customTimer = new CountdownTimer({
        customElement: document.querySelector('.timer-custom-element'),
        post_url: 'https://post_url',
        beforeSubmit: () => true
    });

    document.querySelector('#show_timer').addEventListener("click", () => {
        timer.show();
        customTimer.show();
    });

    document.querySelector('#hide_timer').addEventListener("click", () => {
        timer.hide();
        customTimer.hide();
    });
});