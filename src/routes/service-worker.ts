/// <reference lib="webworker" />
self.addEventListener('push', (event: PushEvent) => {
    const data = event.data?.json() || {};
    const title = data.title || 'New Activity';
    const options = {
      body: data.body || 'Something new happened.',
      icon: '/icon.jpeg',
      data: { url: data.url || '/sales' }
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
  });
  
  self.addEventListener('notificationclick', (event: NotificationEvent) => {
    event.notification.close();
    event.waitUntil(
      self.clients.openWindow(event.notification.data.url)
    );
  });