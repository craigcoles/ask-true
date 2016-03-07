module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');
  const Question = Nodal.require('app/models/question.js');

  class AskController extends Nodal.Controller {

    index() {
      Question.query().where({status: 0}).end((err, models) => {

        var i = Math.floor(Math.random() * models.length),
            questionData = '',
            results = '';

        if(models.length) {
          results = true;
          questionData = { id: models[i].get('id'), body: models[i].get('body') }
        } else {
          results = false;
          questionData = null;
        }

        this.render(
          Nodal.Template.generate('layout.html', 'ask.html').render(
            this.params,
            {
              results: results,
              question: questionData,
              name: 'Answer a question - Ask True'
            }
          )
        );
      });
    }

  }

  return AskController;

})();
