const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("Flair", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Survivor",
        description: "Anything and everything Survivor"
      })
      .then((topic) => {
        this.topic = topic;
        Post.create({
          title: "Fabio is a hilarious winner",
          body: "Fabio is so funny",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          Flair.create({
            name: "Fabio's golden locks",
            color: "Yellow",
            postId: this.post.id
          })
          .then((flair) => {
            this.flair = flair;
            done();
          });
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#create()", () => {

    it("should create a flair object with a name and color, assigned to a post", (done) => {
      Flair.create({
        name: "Kelly",
        color: "Purple",
        postId: this.post.id
      })
      .then((flair) => {
        expect(flair.name).toBe("Kelly");
        expect(flair.color).toBe("Purple");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a flair with a missing name, color, or assigned post", (done) => {
      Flair.create({
        name: "Julia's personality"
      })
      .then((flair) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Flair.color cannot be null");
        expect(err.message).toContain("Flair.postId cannot be null");
        done();
      });
    });
  });

  describe("#setPost()", () => {
    it("should associate a post and a flair together", (done) => {
      Post.create({
        title: "I think Sandra is cool I guess",
        body: "I think so",
        topicId: this.topic.id
      })
      .then((newPost) => {
        expect(this.flair.postId).toBe(this.post.id);
        this.flair.setPost(newPost)
        .then((flair) => {
          expect(flair.postId).toBe(newPost.id);
          done();
        });
      });
    });
  });

  describe("#getPost()", () => {
    it("should return the associated post", (done) => {
      this.flair.getPost()
      .then((associatedPost) => {
        expect(associatedPost.title).toBe("Fabio is a hilarious winner");
        done();
      });
    });
  });
  
});
