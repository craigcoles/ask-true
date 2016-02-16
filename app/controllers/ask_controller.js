module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');
  const Question = Nodal.require('app/models/question.js');

  class AskController extends Nodal.Controller {

    index() {
      Question.query().end((err, models) => {
        var i = Math.floor(Math.random() * models.length);

        this.render(
          Nodal.Template.generate('layout.html', 'ask.html').render(
            this.params,
            {
              question: { id: models[i].get('id'), body: models[i].get('body') },
              name: 'Answer a question - Ask True'
            }
          )
        );
      });
    }

  }

  return AskController;

})();
