module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');
  const Question = Nodal.require('app/models/question.js');

  class AskController extends Nodal.Controller {

    get() {

      var test = function() {
        Question.query()
        .end((err, models) => {

          this.respond(err || models);

        });
      };

      this.render(
        Nodal.Template.generate('layout.html', 'ask.html').render(
          this.params,
          {
            test: this.params.query.test,
            name: 'Answer a question - Ask True',
            question: test
          }
        )
      );

    }

  }

  return AskController;

})();
