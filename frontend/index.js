let stompClient = null;

function connect() {
    const socket = new SockJS('http://localhost:8080/ws');  // Correct the WebSocket URL
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);  // Log the successful connection
        stompClient.subscribe('/topic/news', function (message) {
            showNotification(message.body);  // Handle incoming messages
        });
    }, function (error) {
        console.error('WebSocket connection error: ' + error);  // Log WebSocket errors
    });
}
function showNotification(message) {
    const notifications = document.getElementById('notifications');
    const notification = document.createElement('p');
    notification.textContent = message;
    notifications.appendChild(notification);
}
connect();