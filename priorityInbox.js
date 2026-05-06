const DEFAULT_LIMIT = 10;

const sampleNotifications = [
  { id: 1, Type: "event", Message: "Tech talk in seminar hall at 4 PM", Timestamp: "2026-05-06T09:10:00Z", read: false },
  { id: 2, Type: "placement", Message: "Campus drive shortlist released", Timestamp: "2026-05-06T09:20:00Z", read: false },
  { id: 3, Type: "result", Message: "Internal assessment result published", Timestamp: "2026-05-06T08:30:00Z", read: false },
  { id: 4, Type: "event", Message: "Sports meet registration closes today", Timestamp: "2026-05-05T15:40:00Z", read: false },
  { id: 5, Type: "placement", Message: "Pre-placement talk starts tomorrow", Timestamp: "2026-05-05T14:00:00Z", read: false },
  { id: 6, Type: "result", Message: "Lab exam marks uploaded", Timestamp: "2026-05-06T07:15:00Z", read: false },
  { id: 7, Type: "event", Message: "Library orientation for first years", Timestamp: "2026-05-06T06:20:00Z", read: true },
  { id: 8, Type: "placement", Message: "Resume submission deadline updated", Timestamp: "2026-05-06T10:00:00Z", read: false },
  { id: 9, Type: "result", Message: "Semester result portal maintenance notice", Timestamp: "2026-05-05T13:45:00Z", read: false },
  { id: 10, Type: "event", Message: "NSS volunteer meeting", Timestamp: "2026-05-06T08:45:00Z", read: false },
  { id: 11, Type: "placement", Message: "Mock interview slots opened", Timestamp: "2026-05-04T11:00:00Z", read: false },
  { id: 12, Type: "result", Message: "Revaluation form reminder", Timestamp: "2026-05-06T10:05:00Z", read: false },
];

const typeWeight = {
  placement: 3,
  result: 2,
  event: 1,
};

function normalizeType(type) {
  return String(type || "event").trim().toLowerCase();
}

function getNotificationTime(notification) {
  const value = notification.Timestamp || notification.timestamp || notification.createdAt;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function scoreNotification(notification) {
  const type = normalizeType(notification.Type || notification.type);
  return {
    ...notification,
    priorityType: type,
    priorityWeight: typeWeight[type] || 1,
    priorityTime: getNotificationTime(notification),
  };
}

function comparePriority(a, b) {
  if (a.priorityWeight !== b.priorityWeight) {
    return b.priorityWeight - a.priorityWeight;
  }

  return b.priorityTime - a.priorityTime;
}

function getTopUnreadNotifications(notifications, limit = DEFAULT_LIMIT) {
  return notifications
    .filter((notification) => notification.read === false || notification.read === undefined)
    .map(scoreNotification)
    .sort(comparePriority)
    .slice(0, limit);
}

function printNotifications(notifications) {
  console.log("Top 10 Priority Notifications");
  console.log("=============================");

  notifications.forEach((notification, index) => {
    const time = notification.priorityTime
      ? new Date(notification.priorityTime).toLocaleString("en-IN")
      : "time unavailable";

    console.log(
      `${index + 1}. [${notification.priorityType}] ${notification.Message || notification.message} | weight: ${notification.priorityWeight} | ${time}`
    );
  });
}

const topNotifications = getTopUnreadNotifications(sampleNotifications, DEFAULT_LIMIT);
printNotifications(topNotifications);

module.exports = {
  comparePriority,
  getTopUnreadNotifications,
  scoreNotification,
};
