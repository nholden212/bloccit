const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/ads/";
const sequelize = require("../../src/db/models/index").sequelize;
const Ad = require("../../src/db/models").Ad;

describe("routes : ads", () => {
  beforeEach((done) => {
    this.ad;
    sequelize.sync({force: true}).then((res) => {

      Ad.create({
        title: "Pringles",
        description: "Salty and dank"
      })
      .then((ad) => {
        this.ad = ad;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("GET /ads", () => {
    it("should return a status code 200 and all ads", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Ads");
        expect(body).toContain("Pringles");
        done();
      });
    });
  });

  describe("GET /ads/new", () => {
    it("should render a new ad form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Ad");
        done();
      });
    });
  });

  describe("POST /ads/create", () => {
    const options = {
      url:`${base}create`,
      form: {
        title: "Chips",
        description: "What's your favorite chip?"
      }
    };
    it("should create a new ad and redirect", (done) => {
      request.post(options,
        (err, res, body) => {
          Ad.findOne({where: {title:"Chips"}})
          .then((ad) => {
            expect(res.statusCode).toBe(303);
            expect(ad.title).toBe("Chips");
            expect(ad.description).toBe("What's your favorite chip?");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });
  });

  describe("GET /ads/:id", () => {
    it("should render a view with the selected ad", (done) => {
      request.get(`${base}${this.ad.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Pringles");
        done();
      });
    });
  });

  describe("POST /ads/:id/destroy", () => {
    it("should delete the ad with the associated ID", (done) => {
      Ad.all()
      .then((ads) => {
        const adCountBeforeDelete = ads.length;
        expect(adCountBeforeDelete).toBe(1);
        request.post(`${base}${this.ad.id}/destroy`, (err, res, body) => {
          Ad.all()
          .then((ads) => {
            expect(err).toBeNull();
            expect(ads.length).toBe(adCountBeforeDelete -1);
            done();
          })
        });
      });
    });
  });

  describe("GET /ads/:id/edit", () => {
    it("should render a view with an edit ad form", (done) => {
      request.get(`${base}${this.ad.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Ad");
        expect(body).toContain("Pringles");
        done();
      });
    });
  });
});
