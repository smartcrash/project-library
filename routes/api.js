/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict'

const { Book } = require('../models')

module.exports = function (app) {
  app
    .route('/api/books')

    /**
     * response will be array of book objects
     * json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
     */
    .get(function (req, res) {
      Book.findAll({ where: {} }).then(books => res.json(books))
    })

    /**
     * response will contain new book object including atleast _id and title
     */
    .post(function (req, res) {
      const { title } = req.body

      if (typeof title !== 'string' || !title.length) {
        res.status(422).send('missing required field title')
        return
      }

      Book.create({ title })
        .then(book =>
          res.json({
            ...book.toJSON(),
            _id: String(book._id),
          })
        )
        .catch(error => console.error(error))
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'

      Book.destroy({ where: {} }).then(result => {
        if (result) {
          res.send('complete delete successful')
        } else {
          res.send('something went wrong')
        }
      })
    })

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      const { id } = req.params

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.findOne({ where: { _id: id } }).then(book => {
        if (book) {
          res.json(book)
        } else {
          res.status(404).send('no book exists')
        }
      })
    })

    .post(function (req, res) {
      const { id } = req.params
      const { comment } = req.body
      //json res format same as .get

      if (typeof comment !== 'string' || !comment.length) {
        res.status(422).send('missing required field comment')
        return
      }

      Book.findOne({ where: { _id: id } }).then(book => {
        if (!book) {
          res.status(404).send('no book exists')
          return
        }

        const { comments } = book

        Book.update(
          {
            comments: [...comments, comment],
            commentcount: comments.length + 1,
          },
          { where: { _id: id } }
        ).then(result => {
          if (result[0] > 0) {
            Book.findOne({ where: { _id: id } }).then(book => res.json(book))
          } else {
            res.json('could not update')
          }
        })
      })
    })

    .delete(function (req, res) {
      const { id } = req.params

      //if successful response will be 'delete successful'

      Book.destroy({ where: { _id: id } }).then(result => {
        if (result) {
          res.send('delete successful')
        } else {
          res.status(404).send('no book exists')
        }
      })
    })
}
