const functions = require('firebase-functions');

const express = require("express");
const app = express();

const { db } = require("./util/admin")
const cors=require("cors");
app.use(cors())
const FBAuth = require("./util/fbauth")

const { getAllIdeas, postOneIdea, getIdea, commentOnIdea, likeIdea, unlikeIdea, deleteIdea } = require('./handlers/ideas');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead } = require('./handlers/users')


// Idea Routes
app.get("/ideas", getAllIdeas);
app.post('/idea', FBAuth, postOneIdea);
app.get('/idea/:ideaId', getIdea)
app.post('/idea/:ideaId/comment', FBAuth, commentOnIdea)
app.get('/idea/:ideaId/unlike', FBAuth, unlikeIdea)
app.get('/idea/:ideaId/like', FBAuth, likeIdea)
app.delete('/idea/:ideaId', FBAuth, deleteIdea)

//User Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetails)
app.get('/user', FBAuth, getAuthenticatedUser)
app.get('/user/:handle', getUserDetails);
app.post('/notifications',FBAuth, markNotificationsRead)

exports.api = functions.region('asia-east2').https.onRequest(app);









exports.createNotificationOnLike = functions
  .region('asia-east2')
  .firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/ideas/${snapshot.data().ideaId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            ideaId: doc.id
          });
        }
      })
      .catch((err) => console.error(err));
  });

  exports.deleteNotificationOnUnLike = functions
  .region('asia-east2')
  .firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });
exports.createNotificationOnComment = functions
  .region('asia-east2')
  .firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/ideas/${snapshot.data().ideaId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            ideaId: doc.id
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });



exports.onUserImageChange = functions
  .region('asia-east2')
  .firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('ideas')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const idea = db.doc(`/ideas/${doc.id}`);
            batch.update(idea, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
});

exports.onIdeaDelete = functions
  .region('asia-east2')
  .firestore.document('/ideas/{ideaId}')
  .onDelete((snapshot, context) => {
    const ideaId = context.params.ideaId;
    const batch = db.batch();
    return db
      .collection('comments')
      .where('ideaId', '==', ideaId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection('likes')
          .where('ideaId', '==', ideaId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection('notifications')
          .where('ideaId', '==', ideaId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
