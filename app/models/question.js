module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');

  class Question extends Nodal.Model {}

  Question.setDatabase(Nodal.require('db/main.js'));
  Question.setSchema(Nodal.my.Schema.models.Question);

  Question.validates('body', 'must be at least 5 characters', v => v && v.length >= 5);

  return Question;

})();
