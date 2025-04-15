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


    const websGo = new WebSocket('ws://localhost:9000/webs');  // Correct the WebSocket URL
    websGo.onopen = function (event) {
        console.log('WebSocket connection opened: ' + event);  // Log the successful connection
    };
    websGo.onmessage = function (event) {
        console.log('Message from server: ' + event.data);  // Log incoming messages
        showNotification(event.data);  // Handle incoming messages
    };
    websGo.onerror = function (event) {
        console.error('WebSocket error: ' + event);  // Log WebSocket errors
    };
    websGo.onclose = function (event) {
        console.log('WebSocket connection closed: ' + event);  // Log the closed connection
    };
}
function showNotification(message) {
    const notifications = document.getElementById('notifications');
    const notification = document.createElement('p');
    notification.textContent = message;
    notifications.appendChild(notification);
}
connect();