let stompClient = null;

function connect() {
    const socket = new SockJS('http://localhost:8080/ws');  // Correct the WebSocket URL
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);  // Log the successful connection
        stompClient.subscribe('/topic/news', function (message) {
            showNotification(message.body, 'spring');  // Handle incoming messages
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
        showNotification(event.data, 'go');  // Handle incoming messages
    };
    websGo.onerror = function (event) {
        console.error('WebSocket error: ' + event);  // Log WebSocket errors
    };
    websGo.onclose = function (event) {
        console.log('WebSocket connection closed: ' + event);  // Log the closed connection
    };
}
function showNotification(message, type) {
    const notifications = document.getElementById(type + 'Notifications');
    const notification = document.createElement('p');
    notification.textContent = message;
    notifications.appendChild(notification);
}
connect();

function handleClick(type) {
    const spring = document.getElementById('springNotifications');
    const go = document.getElementById('goNotifications');
    spring.style.display = (type == 'spring' || spring.style.display === 'none') ? 'block' : 'none';
    go.style.display = (type == 'go' || go.style.display === 'none') ? 'block' : 'none';
}