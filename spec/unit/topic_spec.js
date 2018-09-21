const sequelize = require("sequelize");
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "How to write these tests",
        description: "You got some stuff to do"
      })
      .then((topic) => {
        this.topic = topic;
        Post.create({
          title: "You have to create some test data first"
          body: "Make a topic and an associated post before each test",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#create()", () => {
    it("should create a topic with a title and description that is stored in the database", (done) => {
      Topic.create({
        title: "How to write a test for createTopic",
        description: "Tips on how to get this done"
      })
      .then((topic) => {
        expect(topic.title).toBe("How to write a test for createTopic");
        expect(title.description).toBe("Tips on how to get this done");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a topic with a missing title or description", (done) => {
      Topic.create({
        title: "Hahaha this topic only has a title"
      })
      .then((topic) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Topic.description cannot be null");
        done();
      });
    });
  });

  describe("#getPosts()", () => {
    it("should return an array of the associated posts for the topic the method is called on", (done) => {
      this.topic.getPosts().then(associatedPosts => {
        expect(associatedPosts[0].title).toBe("You have to create some test data first");
        expect(associatedPosts[0].body).toBe("Make a topic and an associated post before each test");
        expect(associatedPosts[0].topicId).toBe(this.topic.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
});
