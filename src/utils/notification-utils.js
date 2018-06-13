export const createNotification = (title, body, cb) => {
  let myNotification = new Notification(title, {
    body
  });
  if (cb) {
    myNotification.onclick = () => cb;
  }
};
