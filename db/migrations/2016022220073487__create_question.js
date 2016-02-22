module.exports = (function() {

  "use strict";

  const Nodal = require('nodal');

  class CreateQuestion extends Nodal.Migration {

    constructor(db) {
      super(db);
      this.id = 2016022220073487;
    }

    up() {

      return [
        this.createTable("questions", [{"name":"body","type":"string"},{"name":"status","type":"int"}])
      ];

    }

    down() {

      return [
        this.dropTable("questions")
      ];

    }

  }

  return CreateQuestion;

})();
