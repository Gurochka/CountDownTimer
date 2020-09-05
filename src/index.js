document.addEventListener("DOMContentLoaded", () => {
    const timer = new CountdownTimer({
        container: '.timer-container'
    });

    const customTimer = new CountdownTimer({
        customElement: document.querySelector('.timer-custom-element')
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