module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');
  const Question = Nodal.require('app/models/question.js');

  class V1QuestionsController extends Nodal.Controller {

    index() {

      Question.query()
        .where(this.params.query)
        .end((err, models) => {

          this.respond(err || models);

        });

    }

    show() {

      Question.find(this.params.route.id, (err, model) => {

        this.respond(err || model);

      });

    }

    create() {

      Question.create(this.params.body, (err, model) => {

        this.respond(err || model);

      });

    }

    update() {

      Question.update(this.params.route.id, this.params.body, (err, model) => {

        this.respond(err || model);

      });

    }

    destroy() {

      Question.destroy(this.params.route.id, (err, model) => {

        this.respond(err || model);

      });

    }

  }

  return V1QuestionsController;

})();
