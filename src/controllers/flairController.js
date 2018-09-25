const flairQueries = require("../db/queries.flairs.js");
const postQueries = require("../db/queries.posts.js");

module.exports = {
  new(req, res, next){
    res.render("flairs/new",
      {
        postId: req.params.postId,
        topicId: postQueries.getPost(req.params.postId, (post) => {
          return post.topicId;
    })});
  },
  create(req, res, next){
    let newFlair = {
      name: req.body.name,
      color: req.body.color,
      postId: req.params.postId
    };
    flairQueries.addFlair(newFlair, (err, flair) => {
      if(err){
        res.redirect(500, "/flairs/new");
      } else {
        res.redirect(303, `/posts/${newFlair.postId}/flairs/${flair.id}`);
      }
    });
  },
  show(req, res, next){
    flairQueries.getFlair(req.params.id, (err, flair) => {
      if(err || flair == null){
        res.redirect(404, "/");
      } else {
        let topicId=postQueries.getPost(req.params.postId, (post) => {return post.topicId;});
        res.render("flairs/show", {flair: flair, topicId: topicId});
      }
    });
  },
  destroy(req, res, next){
    flairQueries.deleteFlair(req.params.id, (err, deletedRecordsCount) => {
      let topicId=postQueries.getPost(req.params.postId, (post) => {return post.topicId;});
      if(err){
        res.redirect(500, `/topics/${topicId}/posts/${req.params.postId}/flairs/${req.params.id}`)
      } else {
        res.redirect(303, `/topics/${topicId}/posts/${req.params.postId}`)
      }
    });
  },
  edit(req, res, next){
    flairQueries.getFlair(req.params.id, (err, flair) => {
      let topicId=postQueries.getPost(req.params.postId, (post) => {return post.topicId;});
      if(err || flair == null){
        res.redirect(404, "/");
      } else {
        res.render("flairs/edit", {flair: flair, topicId: topicId});
      }
    });
  },
  update(req, res, next){
    flairQueries.updateFlair(req.params.id, req.body, (err, flair) => {
      let topicId=postQueries.getPost(req.params.postId, (post) => {return post.topicId;});
      if(err || flair == null){
        res.redirect(404, `/topics/${topicId}/posts/${req.params.postId}/flairs/${req.params.id}/edit`);
      } else {
        res.redirect(`/topics/${topicId}/posts/${req.params.postId}/flairs/${req.params.id}`);
      }
    });
  }
}
