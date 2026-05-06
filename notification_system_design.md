# Stage 1

## Problem

Users are missing important campus notifications because many notifications arrive together. The Priority Inbox should show the top `n` unread notifications first, with `n` configurable by the user. For this stage, the code returns the top 10 unread notifications.

## Priority Rule

Each unread notification is ranked by two factors:

1. Notification type weight
2. Recency

The type weight is:

- `placement` = 3
- `result` = 2
- `event` = 1

Notifications with a higher type weight are shown first. If two notifications have the same type weight, the newer notification is shown first.

## Implementation

The implementation is in `notification_app_be/priorityInbox.js`.

It performs these steps:

1. Read the notification list.
2. Keep only unread notifications.
3. Attach a priority weight and timestamp score to each notification.
4. Sort by priority weight in descending order.
5. For notifications with the same weight, sort by timestamp in descending order.
6. Return the first 10 notifications.

## Maintaining Top 10 Efficiently

For a small notification list, sorting is simple and easy to understand. For a live system where new notifications keep coming in, I would maintain a min-heap of size 10 for each user.

When a new unread notification arrives:

1. Calculate its priority score.
2. If the heap has fewer than 10 notifications, add it.
3. If the heap already has 10 notifications, compare the new notification with the lowest-ranked notification in the heap.
4. Replace the lowest-ranked notification only if the new notification has higher priority.

This keeps updates efficient because each new notification takes `O(log 10)` time, which is effectively constant for the top 10 use case. The inbox can then display the heap contents sorted by priority.

## Output

Running `npm start` prints the top 10 priority notifications with their type, message, weight, and time.
