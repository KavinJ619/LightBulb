const { admin, db } = require('../util/admin');
const firebase = require('firebase')
const config = require('../util/config')
firebase.initializeApp(config)

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validators')
//Signs up a user and sends back an authentication token
exports.signup = (req, res) => {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      handle: req.body.handle,
    };
  
    const { valid, errors } = validateSignupData(newUser);
  
    if (!valid) return res.status(400).json(errors);
  
    const noImg = "no-img.png";
  
    let token, userId;
    db.doc(`/users/${newUser.handle}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return res.status(400).json({ handle: "this handle is already taken" });
        } else {
          return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
      })
      .then((data) => {
        userId = data.user.uid;
        return data.user.getIdToken();
      })
      .then((idToken) => {
        token = idToken;
        const userCredentials = {
          handle: newUser.handle,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          //TODO Append token to imageUrl. Work around just add token from image in storage.
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
          userId,
        };
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
      })
      .then(() => {
        return res.status(201).json({ token });
      })
      .catch((err) => {
        console.error(err);
        if (err.code === "auth/email-already-in-use") {
          return res.status(400).json({ email: "Email is already is use" });
        } else {
          return res
            .status(500)
            .json({ general: "Something went wrong, please try again" });
        }
      });
  };
//Logs in a user and sends back an authentication token
exports.login= (req,res)=>{
    const user = {
        email:req.body.email,
        password: req.body.password
    };

    const { valid, errors } = validateLoginData(user)
    if (!valid) return res.status(400).json(errors)

    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(data => {
            return data.user.getIdToken()
        })
        .then(token => {
            return res.json({token})
        })
        .catch(err => {
            console.error(err)
            return res.status(403).json({ general: 'Wrong Credentials. Please try again!' })
        })
}

//Add user details
exports.addUserDetails= (req,res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(()=>{
            return res.json({ message: 'Details added Successfully' })
        })
        .catch(err => {
            console.error(err)
            return res.status(500).json({ error:err.code })
        })
}


//Get User Details
exports.getAuthenticatedUser = (req,res) => {
    let userData = {};
    db.doc(`/users/${req.user.handle}`).get()
        .then(doc => {
            if (doc.exists){
                userData.credentials = doc.data();
                return db.collection('likes').where('userHandle', '==', req.user.handle).get()
            }
        })
        .then(data => {
            userData.likes = [];
            data.forEach(doc => {
                userData.likes.push(doc.data())
            })
            return db.collection('notifications').where('recipient', '==', req.user.handle)
                .orderBy('createdAt', 'desc').limit(10).get();
        })
        .then(data => {
            userData.notifications =[]
            data.forEach(doc => {
                userData.notifications.push({
                    recipient: doc.data().recipient,
                    sender: doc.data().sender,
                    createdAt: doc.data().createdAt,
                    ideaId: doc.data().ideaId,
                    type: doc.data().type,
                    read: doc.data().read,
                    notification: doc.id
                })
            })
            return res.json(userData)
        })
        .catch (err => {
            console.error(err)
            return res.status(500).json({ error: err.code })
        })
}



//Upload a profile image (later actual images)
exports.uploadImage= (req,res) => {
    const BusBoy = require('busboy');
    const path = require("path");
    const os = require('os');
    const fs = require("fs")

    const busboy=new BusBoy({ headers: req.headers })

    let imageFileName;
    let ImageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return res.status(400).json({ error: "Wrong File Format... Please Submit a PNG or JPEG" })
        }
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${Math.round(Math.random() * 1000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        ImageToBeUploaded = { filepath, mimetype }
        file.pipe(fs.createWriteStream(filepath));

    });
    busboy.on('finish', () => {
        admin.storage().bucket().upload(ImageToBeUploaded.filepath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: ImageToBeUploaded.mimetype
                }
            }
        })
        .then(() => {
            const imageURL = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.handle}`).update({ imageUrl: imageURL })
        })
        .then(() => {
            return res.json({ message: "Image Upload Completed!" })
        })
        .catch (err => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
    });
    busboy.end(req.rawBody)
}

//Get any user details
exports.getUserDetails = (req,res) => {
    let userData = {};
    db.doc(`/users/${req.params.handle}`).get()
        .then(doc => {
            if (doc.exists){
                userData.user = doc.data();
                return db.collection('ideas').where('userHandle', '==', req.params.handle)
                    .orderBy('createdAt', 'desc')
                    .get();
            }
            else{
                return res.status(404).json({ error: 'User not found' })
            }
        })
        .then(data => {
            userData.ideas =[];
            data.forEach(doc => {
                userData.ideas.push({
                    body:doc.data().body,
                    createdAt:doc.data().createdAt,
                    userHandle:doc.data().userHandle,
                    userImage:doc.data().userImage,
                    likeCount:doc.data().likeCount,
                    commentCount:doc.data().commentCount,
                    ideaId: doc.id
                })
            })
            return res.json(userData);
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code })
        })
}

exports.markNotificationsRead = (req, res) => {
    let batch = db.batch();
    req.body.forEach((notificationId) => {
      const notification = db.doc(`/notifications/${notificationId}`);
      batch.update(notification, { read: true });
    });
    batch
      .commit()
      .then(() => {
        return res.json({ message: "Notifications marked read" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };