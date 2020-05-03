const { db }= require('../util/admin')

exports.getAllIdeas = (req,res) => {
    db
        .collection('ideas')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let ideas =[];
            data.forEach(doc=> {
                ideas.push({
                    ideaId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount,
                    userImage: doc.data().userImage
                });
            });
            return res.json(ideas);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code })
        });
}

exports.postOneIdea = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body must not be empty' });
  }

  const newIdea = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection('ideas')
    .add(newIdea)
    .then((doc) => {
      const resIdea = newIdea;
      resIdea.ideaId = doc.id;
      res.json(resIdea);
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
};



exports.getIdea = (req,res) => {
    let ideaData = {};
    db.doc(`/ideas/${req.params.ideaId}`).get()
        .then(doc => {
            if (!doc.exists){
                return res.status(404).json({ error: 'Idea not found' })
            }

            ideaData=doc.data();
            ideaData.ideaId = doc.id;
            return db.collection('comments').orderBy('createdAt', 'desc').where('ideaId', '==', req.params.ideaId).get();
        })
        .then(data => {
            ideaData.comments= [];
            data.forEach(doc => {
                ideaData.comments.push(doc.data())
            });
            return res.json(ideaData);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
}

exports.commentOnIdea = (req, res) => {
    if (req.body.body.trim() === ''){
        return res.status(400).json({ comment: 'Must Not Be empty!' })
    }

    const newComment = {
        body: req.body.body,
        createdAt: new Date().toISOString(),
        ideaId: req.params.ideaId,
        userHandle: req.user.handle,
        userImage: req.user.imageUrl
    };

    db.doc(`/ideas/${req.params.ideaId}`).get()
        .then(doc => {
            if (!doc.exists){
                res.status(404).json({ error: 'Idea not found' })
            }
            return doc.ref.update({ commentCount: doc.data().commentCount+1 });
        })
        .then(() => {
            return db.collection('comments').add(newComment);
        })
        .then(()=>{
            res.json(newComment)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'Something went wrong!' })
        })

}

//Like an Idea

exports.likeIdea = (req, res) => {
    const likeDocument = db
      .collection('likes')
      .where('userHandle', '==', req.user.handle)
      .where('ideaId', '==', req.params.ideaId)
      .limit(1);
  
    const ideaDocument = db.doc(`/ideas/${req.params.ideaId}`);
  
    let ideaData;
  
    ideaDocument
      .get()
      .then((doc) => {
        if (doc.exists) {
          ideaData = doc.data();
          ideaData.ideaId = doc.id;
          return likeDocument.get();
        } else {
          return res.status(404).json({ error: 'idea not found' });
        }
      })
      .then((data) => {
        if (data.empty) {
          return db
            .collection('likes')
            .add({
              ideaId: req.params.ideaId,
              userHandle: req.user.handle
            })
            .then(() => {
              ideaData.likeCount++;
              return ideaDocument.update({ likeCount: ideaData.likeCount });
            })
            .then(() => {
              return res.json(ideaData);
            });
        } else {
          return res.status(400).json({ error: 'idea already liked' });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.code });
      });
  };

exports.unlikeIdea = (req, res) => {
    const likeDocument = db
      .collection('likes')
      .where('userHandle', '==', req.user.handle)
      .where('ideaId', '==', req.params.ideaId)
      .limit(1);
  
    const ideaDocument = db.doc(`/ideas/${req.params.ideaId}`);
  
    let ideaData;
  
    ideaDocument
      .get()
      .then((doc) => {
        if (doc.exists) {
          ideaData = doc.data();
          ideaData.ideaId = doc.id;
          return likeDocument.get();
        } else {
          return res.status(404).json({ error: 'idea not found' });
        }
      })
      .then((data) => {
        if (data.empty) {
          return res.status(400).json({ error: 'idea not liked' });
        } else {
          return db
            .doc(`/likes/${data.docs[0].id}`)
            .delete()
            .then(() => {
              ideaData.likeCount--;
              return ideaDocument.update({ likeCount: ideaData.likeCount });
            })
            .then(() => {
              res.json(ideaData);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.code });
      });
  };

exports.deleteIdea = (req, res) => {
    const document = db.doc(`/ideas/${req.params.ideaId}`);
    document
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(404).json({ error: 'idea not found' });
        }
        if (doc.data().userHandle !== req.user.handle) {
          return res.status(403).json({ error: 'Unauthorized' });
        } else {
          return document.delete();
        }
      })
      .then(() => {
        res.json({ message: 'idea deleted successfully' });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };