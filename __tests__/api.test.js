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
                            expect(body).toHaveProperty("GET /api/articles/:article_id")
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
                                body.forEach((topic) => {
                                    expect(topic).toHaveProperty("slug")
                                    expect(topic).toHaveProperty("description")
                                })
                            })
                    })
                })

            })
        })
        describe("/articles", () => {
            describe("GET", () => {
                describe("200:", () => {
                    it("responds with an array of article objects", () => {
                        return request(app)
                            .get('/api/articles')
                            .expect(200)
                            .then(({ body }) => {
                                expect(body).toBeSortedBy('created_at', { descending: true });
                                body.forEach((article) => {
                                    expect(article).toHaveProperty("author")
                                    expect(article).toHaveProperty("title")
                                    expect(article).toHaveProperty("article_id")
                                    expect(article).toHaveProperty("topic")
                                    expect(article).toHaveProperty("created_at")
                                    expect(article).toHaveProperty("votes")
                                    expect(article).toHaveProperty("article_img_url")
                                    expect(article).toHaveProperty("comment_count")
                                })

                            })
                    })
                })
            })
            describe("/:article_id", () => {
                describe("GET", () => {
                    describe("200:", () => {
                        it("responds with an article object", () => {
                            return request(app)
                                .get('/api/articles/1')
                                .expect(200)
                                .then(({ body }) => {
                                    expect(body).toHaveProperty("author")
                                    expect(body).toHaveProperty("title")
                                    expect(body).toHaveProperty("article_id")
                                    expect(body).toHaveProperty("body")
                                    expect(body).toHaveProperty("topic")
                                    expect(body).toHaveProperty("created_at")
                                    expect(body).toHaveProperty("votes")
                                    expect(body).toHaveProperty("article_img_url")
                                })
                        })
                    })
                    describe("404:", () => {
                        it("responds with a 404 error of not found", () => {
                            return request(app)
                                .get('/api/articles/404')
                                .expect(404)
                                .then(({ body }) => {
                                    expect(body.msg).toBe("Article not found!")
                                })
                        })
                    })
                    describe("400:", () => {
                        it("responds with a 400 error of bad request", () => {
                            return request(app)
                                .get('/api/articles/invalid_id')
                                .expect(400)
                                .then(({ body }) => {
                                    expect(body.msg).toBe("Bad request!")
                                })
                        })
                    })
                })
                describe("/comments", () => {
                    describe("GET", () => {
                        describe("200:", () => {
                            it("responds with an array of comment objects", () => {
                                return request(app)
                                    .get('/api/articles/1/comments')
                                    .expect(200)
                                    .then(({ body }) => {
                                        expect(body).toBeSortedBy('created_at', { descending: true });
                                        body.forEach((comment) => {
                                            expect(comment).toHaveProperty("comment_id")
                                            expect(comment).toHaveProperty("votes")
                                            expect(comment).toHaveProperty("created_at")
                                            expect(comment).toHaveProperty("author")
                                            expect(comment).toHaveProperty("body")
                                            expect(comment).toHaveProperty("article_id")
                                        })
                                    })
                            })
                        })
                        describe("404:", () => {
                            it("responds with a 404 error of not found", () => {
                                return request(app)
                                    .get('/api/articles/404/comments')
                                    .expect(404)
                                    .then(({ body }) => {
                                        expect(body.msg).toBe("Comments not found!")
                                    })
                            })
                        })
                        describe("400:", () => {
                            it("responds with a 400 error of bad request", () => {
                                return request(app)
                                    .get('/api/articles/invalid_id/comments')
                                    .expect(400)
                                    .then(({ body }) => {
                                        expect(body.msg).toBe("Bad request!")
                                    })
                            })
                        })
                    })
                })
            })
        })
    })
})