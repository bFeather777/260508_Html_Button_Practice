window.onload = function() {
    const timeButton = document.getElementById('timeBtn');
    const timeDisplay = document.getElementById('displayTime');

    timeButton.addEventListener('click', function() {
        const now = new Date();
        timeDisplay.textContent = `現在時間是：${now.toLocaleTimeString()}`;
    });
};