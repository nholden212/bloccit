const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("Topic", () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    this.user;
    sequelize.sync({force: true}).then((res) => {
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user;
        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id
          }]
        }, {
          include: {
            model: Post,
            as: "posts"
          }
        })
        .then((topic) => {
          this.topic = topic;
          this.post = topic.posts[0];
          done();
        });
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
        expect(associatedPosts[0].title).toBe("My first visit to Proxima Centauri b");
        expect(associatedPosts[0].body).toBe("I saw some rocks.");
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
