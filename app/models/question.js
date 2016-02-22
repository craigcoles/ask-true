module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');

  class Question extends Nodal.Model {}

  Question.setDatabase(Nodal.require('db/main.js'));
  Question.setSchema(Nodal.my.Schema.models.Question);

  return Question;

})();
