const app = require('../app')
const request = require('supertest')
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data")

beforeEach(() => seed(testData))

afterAll(() => db.end())

describe("NC news api", () => {
    describe("/api", () => {
        describe("GET", () => {
            describe("200:", () => {
                it("responds with a json file of all the api endpoint information", () => {
                    return request(app)
                        .get('/api')
                        .expect(200)
                        .then(({ body }) => {
                            expect(body).toHaveProperty("GET /api")
                            expect(body).toHaveProperty("GET /api/topics")
                            expect(body).toHaveProperty("GET /api/articles")
                        })
                })
            })
        })
        describe("/topics", () => {
            describe("GET", () => {
                describe("200:", () => {
                    it("responds with an array of topic objects", () => {
                        return request(app)
                            .get('/api/topics')
                            .expect(200)
                            .then(({ body }) => {
                                expect(Array.isArray(body)).toBe(true)
                                body.forEach((topic) => {
                                    expect(topic).toHaveProperty("slug")
                                    expect(topic).toHaveProperty("description")
                                })
                            })
                    })
                })

            })
        })
    })

})