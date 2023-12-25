/* Code for communicating to Firebase */

import firebase from "../firebase";

const db = firebase.ref("/notifications");

class NotificationsDataService {
  getAll() {
    return db;
  }

  create(notification) {
    return db.push(notification);
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }
}

export default new NotificationsDataService();