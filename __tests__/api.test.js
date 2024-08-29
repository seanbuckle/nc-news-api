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
                            expect(body).toHaveProperty("GET /api/articles/:article_id/comments")
                            expect(body).toHaveProperty("POST /api/articles/:article_id/comments")
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
            describe("/sort_by=:sort_value&order=:order_value", () => {
                describe("GET", () => {
                    describe("200:", () => {
                        it("responds with an array of sorted article objects", () => {
                            return request(app)
                                .get('/api/articles?sort_by=author&order=asc')
                                .expect(200)
                                .then(({ body }) => {
                                    expect(body).toBeSortedBy('author', { descending: false });
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
                        it("responds with an array of sorted article objects with no order set only sort_by", () => {
                            return request(app)
                                .get('/api/articles?sort_by=author')
                                .expect(200)
                                .then(({ body }) => {
                                    expect(body).toBeSortedBy('author', { descending: true });
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
                        it("responds with an array of sorted article objects order set and no sort_by", () => {
                            return request(app)
                                .get('/api/articles?order=asc')
                                .expect(200)
                                .then(({ body }) => {
                                    expect(body).toBeSortedBy('created_at', { descending: false });
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
                    describe("400:", () => {
                        it("responds with a 400 error of bad request when both sort_by and order invalid", () => {
                            return request(app)
                                .get('/api/articles/?sort_by=400&order=400')
                                .expect(400)
                                .then(({ body }) => {
                                    expect(body.msg).toBe("Bad request!")
                                })
                        })
                        it("responds with a 400 error of bad request when order invalid", () => {
                            return request(app)
                                .get('/api/articles/?sort_by=author&order=400')
                                .expect(400)
                                .then(({ body }) => {
                                    expect(body.msg).toBe("Bad request!")
                                })
                        })
                        it("responds with a 400 error of bad request when sort_by invalid", () => {
                            return request(app)
                                .get('/api/articles/?sort_by=404&order=asc')
                                .expect(400)
                                .then(({ body }) => {
                                    expect(body.msg).toBe("Bad request!")
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
                                    expect(body).toHaveProperty("article_id", 1)
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
                describe("PATCH", () => {
                    describe("200:", () => {
                        it("responds with a updated article", () => {
                            return request(app)
                                .patch('/api/articles/1')
                                .send({ inc_votes: 1 })
                                .expect(200)
                                .then(({ body }) => {
                                    expect(body).toHaveProperty("author")
                                    expect(body).toHaveProperty("title")
                                    expect(body).toHaveProperty("article_id", 1)
                                    expect(body).toHaveProperty("body")
                                    expect(body).toHaveProperty("topic")
                                    expect(body).toHaveProperty("created_at")
                                    expect(body).toHaveProperty("votes", 101)
                                    expect(body).toHaveProperty("article_img_url")
                                })
                        })
                    })
                    describe("404:", () => {
                        it("responds with a 404 error of not found", () => {
                            return request(app)
                                .patch('/api/articles/404')
                                .send({ inc_votes: 1 })
                                .expect(404)
                                .then(({ body }) => {
                                    expect(body.msg).toBe("Article not found!")
                                })
                        })
                    })
                    describe("400:", () => {
                        it("responds with a 400 error of bad request", () => {
                            return request(app)
                                .patch('/api/articles/invalid_id')
                                .send({ inc_votes: 1 })
                                .expect(400)
                                .then(({ body }) => {
                                    expect(body.msg).toBe("Bad request!")
                                })
                        })
                    })
                    describe("400:", () => {
                        it("responds with a 400 error when inc_vote missing", () => {
                            return request(app)
                                .patch('/api/articles/1')
                                .send({})
                                .expect(400)
                                .then(({ body }) => {
                                    expect(body.msg).toBe("Bad request!")
                                })
                        })
                    })
                    describe("400:", () => {
                        it("responds with a 400 error when inc_vote results in less than 0 votes", () => {
                            return request(app)
                                .patch('/api/articles/1')
                                .send({ inc_votes: -400 })
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
                    describe("POST", () => {
                        describe("201:", () => {
                            it("responds with an array of comment objects", () => {
                                return request(app)
                                    .post('/api/articles/1/comments')
                                    .send({ username: 'icellusedkars', body: 'Re-reading this article. Again!' })
                                    .expect(201)
                                    .then(({ body }) => {
                                        expect(body).toHaveProperty("comment_id")
                                        expect(body).toHaveProperty("votes")
                                        expect(body).toHaveProperty("created_at")
                                        expect(body).toHaveProperty("author", "icellusedkars")
                                        expect(body).toHaveProperty("body", "Re-reading this article. Again!")
                                        expect(body).toHaveProperty("article_id", 1)
                                    })
                            })
                        })
                        describe("400:", () => {
                            it("responds with a 400 of bad request when missing username", () => {
                                return request(app)
                                    .post('/api/articles/1/comments')
                                    .send({ body: 'Re-reading this article. Again!' })
                                    .expect(400)
                                    .then(({ body }) => {
                                        expect(body.msg).toBe("Bad request!")
                                    })
                            })
                            it("responds with a 400 of bad request when missing body", () => {
                                return request(app)
                                    .post('/api/articles/1/comments')
                                    .send({ username: 'icellusedkars' })
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
        describe("/comments/:comment_id", () => {
            describe("DELETE", () => {
                describe("204:", () => {
                    it("responds with a 204 error", () => {
                        return request(app)
                            .delete('/api/comments/1')
                            .expect(204)
                    })
                })
                describe("400:", () => {
                    it("responds with a 400 error of bad request", () => {
                        return request(app)
                            .delete('/api/comments/invalid_id')
                            .expect(400)
                            .then(({ body }) => {
                                expect(body.msg).toBe("Bad request!")
                            })
                    })
                })
            })
        })
        describe("/users", () => {
            describe("GET", () => {
                describe("200:", () => {
                    it("responds with an array of user objects", () => {
                        return request(app)
                            .get('/api/users')
                            .expect(200)
                            .then(({ body }) => {
                                body.forEach((user) => {
                                    expect(user).toHaveProperty("username")
                                    expect(user).toHaveProperty("name")
                                    expect(user).toHaveProperty("avatar_url")
                                })
                            })
                    })
                })
                describe("404:", () => {
                    it("responds with 404 error", () => {
                        return request(app)
                            .get('/api/404')
                            .expect(404)
                    })
                })
            })
        })
    })
})