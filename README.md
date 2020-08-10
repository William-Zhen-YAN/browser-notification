# browser-notification

A lite package to display desktop notification for web application.

## On starting the app

Check if permission has been granted. If not, show a dialogue to ask for user's choice.

example:

```
const hasPermission = await BrowserNotification.askPermission();
if (hasPermission) {
    // do something if permission has been granted.
} else {
    // do something to ask for permission
}
```

## On showing notification

### 1. Show a small number of notifications

Use this when you have a small number of notifications to show.

example:

```
BrowserNotification.notify({
    title: 'title',
    message: 'message',
    icon:'path of icon'});
```

### 2. Show a large number of notifications

Use this when you have a large number of notifications to show.

example:

```
BrowserNotification.debounceNotify({
    title: 'title',
    message: 'message',
    icon:'path of icon'});
```

## Constraints

- This will not work in a http environment.
- Only show the latest notification when a large amount of notifications are received concurrently.
