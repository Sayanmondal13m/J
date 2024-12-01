const serverUrl = 'https://truth-coral-exhaust.glitch.me'; // Replace with your Glitch URL

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('sw.js')
        .then((registration) => {
            console.log('Service Worker registered.');

            // Request notification permission
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');

                    // Subscribe for push notifications
                    registration.pushManager
                        .subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array(
                                'BH02M17ts5wFAWTpYFzZq89BLAWLVkdN1FAM_g4DkiCa2cRcUxkIBt8RVhDFgaztgB313TgTFCImL2-ZvHQhiLw' // Replace with your VAPID public key
                            ),
                        })
                        .then((subscription) => {
                            console.log('User subscribed:', subscription);

                            // Send subscription to the server
                            fetch(`${serverUrl}/subscribe`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(subscription),
                            }).then(() => console.log('Subscription sent to the server.'));
                        });
                } else {
                    console.log('Notification permission denied.');
                }
            });
        })
        .catch((error) => console.error('Service Worker registration error:', error));
}

// Handle "Ring" button click
document.getElementById('ringButton').addEventListener('click', () => {
    fetch(`${serverUrl}/ring`, { method: 'POST' })
        .then(() => console.log('Ring button clicked and notification sent.'))
        .catch((error) => console.error('Error sending ring request:', error));
});

// Convert VAPID public key to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
