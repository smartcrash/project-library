/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http')
const chai = require('chai')
const faker = require('faker')
const assert = chai.assert
const server = require('../server')
const { Book } = require('../models')

chai.use(chaiHttp)

beforeEach(function () {
  return Book.destroy({ where: {}, truncate: true })
})

suite('Functional Tests', function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test('#example Test GET /api/books', function (done) {
    done()

    // chai
    //   .request(server)
    //   .get('/api/books')
    //   .end(function (err, res) {
    //     assert.equal(res.status, 200)
    //     assert.isArray(res.body, 'response should be an array')
    //     assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount')
    //     assert.property(res.body[0], 'title', 'Books in array should contain title')
    //     assert.property(res.body[0], '_id', 'Books in array should contain _id')
    //     done()
    //   })
  })
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite('Routing tests', function () {
    suite('POST /api/books with title => create book object/expect book object', function () {
      test('Test POST /api/books with title', function (done) {
        const title = faker.lorem.sentence()

        chai
          .request(server)
          .post('/api/books')
          .send({ title })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            assert.isObject(res.body)
            assert.isNotEmpty(res.body._id)
            assert.equal(res.body.title, title)
            done()
          })
      })

      test('Test POST /api/books with no title given', function (done) {
        chai
          .request(server)
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 422)

            assert.isString(res.text)
            assert.equal(res.text, 'missing required field title')
            done()
          })
      })
    })

    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .post('/api/books')
          .send({ title: faker.lorem.sentence() })
          .end(function (err, res) {
            assert.equal(res.status, 200)

            chai
              .request(server)
              .get('/api/books')
              .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.isArray(res.body)
                assert.lengthOf(res.body, 1)

                res.body.forEach(function (book) {
                  assert.isObject(book)
                  assert.property(book, '_id')
                  assert.property(book, 'title')
                  assert.property(book, 'commentcount')
                })

                done()
              })
          })
      })
    })

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/${faker.datatype.number()}`)
          .end(function (err, res) {
            assert.equal(res.status, 404)

            assert.isString(res.text)
            assert.equal(res.text, 'no book exists')

            done()
          })
      })

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        const title = faker.lorem.sentence()

        chai
          .request(server)
          .post('/api/books')
          .send({ title })
          .end(function (err, res) {
            assert.equal(res.status, 200)
            const { _id } = res.body

            chai
              .request(server)
              .get(`/api/books/${_id}`)
              .end(function (err, res) {
                assert.equal(res.status, 200)

                assert.isObject(res.body)
                assert.property(res.body, '_id')
                assert.equal(res.body.title, title)
                assert.isArray(res.body.comments)
                assert.isEmpty(res.body.comments)

                done()
              })
          })
      })
    })

    suite('POST /api/books/[id] => add comment/expect book object with id', function () {
      test('Test POST /api/books/[id] with comment', function (done) {
        const title = faker.lorem.sentence()
        const comment = faker.lorem.paragraph()

        chai
          .request(server)
          .post('/api/books')
          .send({ title })
          .end(function (err, res) {
            assert.equal(res.status, 200)

            const { _id } = res.body

            chai
              .request(server)
              .post(`/api/books/${_id}`)
              .send({ comment })
              .end(function (err, res) {
                assert.equal(res.status, 200)

                assert.isObject(res.body)
                assert.property(res.body, '_id')
                assert.equal(res.body.title, title)
                assert.isArray(res.body.comments)
                assert.lengthOf(res.body.comments, 1)

                done()
              })
          })
      })

      test('Test POST /api/books/[id] without comment field', function (done) {
        const title = faker.lorem.sentence()

        chai
          .request(server)
          .post('/api/books')
          .send({ title })
          .end(function (err, res) {
            assert.equal(res.status, 200)

            const { _id } = res.body

            chai
              .request(server)
              .post(`/api/books/${_id}`)
              .send({})
              .end(function (err, res) {
                assert.equal(res.status, 422)

                assert.isString(res.text)
                assert.equal(res.text, 'missing required field comment')

                done()
              })
          })
      })

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai
          .request(server)
          .post(`/api/books/${faker.datatype.number()}`)
          .send({ comment: faker.lorem.sentence() })
          .end(function (err, res) {
            assert.equal(res.status, 404)

            assert.isString(res.text)
            assert.equal(res.text, 'no book exists')

            done()
          })
      })
    })

    suite('DELETE /api/books/[id] => delete book object id', function () {
      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        const title = faker.lorem.sentence()

        chai
          .request(server)
          .post('/api/books')
          .send({ title })
          .end(function (err, res) {
            assert.equal(res.status, 200)

            const { _id } = res.body

            chai
              .request(server)
              .delete(`/api/books/${_id}`)
              .end(function (err, res) {
                assert.equal(res.status, 200)

                assert.isString(res.text)
                assert.equal(res.text, 'delete successful')

                done()
              })
          })
      })

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .delete(`/api/books/${faker.datatype.number()}`)
          .end(function (err, res) {
            assert.equal(res.status, 404)

            assert.isString(res.text)
            assert.equal(res.text, 'no book exists')

            done()
          })
      })
    })
  })
})
