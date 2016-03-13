var autosizeTextarea = (function ($) {

  autosize($('textarea'));

})(jQuery);

var characterLimit = (function ($) {

  var $textarea = $('textarea'),
      $form = $textarea.parents('form');

  $textarea.each(function() {
    var charLimit = $(this).attr('maxlength');
    if (charLimit) {
      $form.find('.form__options').append( "<div class='form-field form-field--count'><span>" + charLimit + "</span> characters remaining</div>" );
    }
  });

  $textarea.on("keyup focus", function() {
      var $counter = $form.find('.form-field--count'),
          charLimit = $(this).attr('maxlength'),
          textLength = $(this).val().length,
          textRemaining = charLimit - textLength;

      $counter.find('span').html(textRemaining);

      if (textRemaining <= 20) {
        $counter.addClass('form-field--warn');
      } else {
        $counter.removeClass('form-field--warn');
      }

  });

})(jQuery);

var askForm = (function ($) {

  $('[data-ask-form]').submit(function(event) {

    event.preventDefault();

    var $form = $(this),
        question = $form.find('textarea[name="body"]').val(),
        status = $form.find('input[name="status"]').val();

    var ajaxRequest = $.ajax({
      method: 'POST',
      url: '/v1/questions',
      data: JSON.stringify({ "body": question, "status": status }),
      dataType: "json",
      contentType: "application/json"
    });

    // When the request successfully finished, execute passed in function
    ajaxRequest.done(function(msg){
      console.log(msg);
      $('.form--ask [data-button]').prop('disabled', true);
      $('.form--ask').addClass('form--processed');
      $('body').addClass('response--shown');
      setTimeout(function(){ $('.response--success').addClass('response--active') }, 600);
    });

    // When the request failed, execute the passed in function
    ajaxRequest.fail(function(jqXHR, status){
      console.log( status );
      console.log( jqXHR.responseText );
      $('.form--ask [data-button]').prop('disabled', true);
      $('.form--ask').addClass('form--processed');
      $('body').addClass('response--shown');
      setTimeout(function(){ $('.response--error').addClass('response--active') }, 600);
    });

  });

  $('[data-show-ask-form]').on('click', function() {
    if ( $(this).data("show-ask-form") == 'success' ) {
      var resetValue = $('.form--ask textarea').attr('maxlength');
      $('.form--ask textarea').val('');
      $('.form--ask .form-field--count span').text(resetValue);
    }
    $('.form--ask [data-button]').prop('disabled', false);
    autosize.update($('textarea'));
    $('.response--active').removeClass('response--active');
    $('body').removeClass('response--shown');
    setTimeout(function(){ $('.form--processed').removeClass('form--processed'); }, 600);
  });

})(jQuery);

var answerForm = (function ($) {

  $('[data-answer-form]').submit(function(event) {

    event.preventDefault();

    var $form = $(this),
        url = $form.attr('action'),
        status = $form.find('input[name="status"]').val();

    var ajaxRequest = $.ajax({
      method: 'PUT',
      url: url,
      data: JSON.stringify({ "status": status }),
      dataType: "json",
      contentType: "application/json"
    });

    //When the request successfully finished, execute passed in function
    ajaxRequest.done(function(msg){
      console.log(msg);
      getNewQuestion();
    });

    //When the request failed, execute the passed in function
    ajaxRequest.fail(function(jqXHR, status){
      console.log( status );
      console.log( jqXHR.responseText );
    });

  });

  function getNewQuestion() {

    var questionRequest = $.ajax({
      method: 'GET',
      url: '/v1/questions?status=0',
      dataType: "json",
      contentType: "application/json"
    });

    //When the request successfully finished, execute passed in function
    questionRequest.done(function(msg){
      if (msg.data.length) {
        // Lets show another question and keep this movin'
        var i = Math.floor(Math.random() * msg.data.length);
        $('.question--answer').addClass('question--processed');
        setTimeout(function(){
          $('.question__body').text(msg.data[i].body);
          $('.form--answer form').prop('action', '/v1/questions/' + msg.data[i].id);
        }, 400);
        setTimeout(function(){ $('.question--processed').removeClass('question--processed'); }, 600);
      } else {
        // There are no questions
        $('.form--answer [data-button]').prop('disabled', true);
        $('.question--answer').addClass('question--processed');
        setTimeout(function(){ $('.dat-empty-state--modal').addClass('dat-empty-state--active'); }, 600);
      }
    });

    //When the request failed, execute the passed in function
    questionRequest.fail(function(jqXHR, status){
      console.log( status );
      console.log( jqXHR.responseText );
    });

  }

})(jQuery);


var particlesCanvas = (function ($) {

    if ( $('#canvas__particles').length ){
        initCanvas();
    }

    function initCanvas(){

        var container, scene, camera, renderer, Obj3D, concentricsParticles = [], mouse = { x: 0, y: 0, lastCameraX: 0, lastCameraY: 0, lastCameraZ: 500 }, theta = 0, radius = 400,
        particles = 700, speed = 0.10, orbit = 40, depth = 1000;

        var context2D = function(context) {

            context.save();
            context.beginPath();
            context.arc(0, 0, 1, 0, Math.PI * 2);
            context.fill();
            context.restore();

        }

        window.addEventListener ? window.addEventListener('load', init, false) : window.onload = init;

        /*
         * Init.
         */

        function init() {

            var body = document.querySelector('body');

            container = document.createElement('div');

            canvas = document.getElementById('canvas__particles');
            bgColor = canvas.getAttribute('data-bg-color');

            container.width = innerWidth;
            container.height = innerHeight;

            container.style.position = 'absolute';
            container.style.top = 0;
            container.style.bottom = 0;
            container.style.left = 0;
            container.style.right = 0;
            container.style.zIndex = 0;
            // container.style.zIndex = -1;
            container.style.overflow = 'hidden';

            container.style.background = bgColor;

            canvas.appendChild(container);

            // Setup
            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
            camera.position.z = depth;

            scene = new THREE.Scene();
            scene.add(camera);

            renderer = new THREE.CanvasRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);

            Obj3D = new THREE.Object3D();
            scene.add(Obj3D);

            var geometry = new THREE.Geometry();
            geometry.dynamic = true;

            populate(geometry);

            window.onresize = onResize;

            render();

        }

        function getRandomInt(min, max) {
            var rand = Math.random();

            return rand * (max - min) + min;
        }

        /*
         * Let's create the fluctuating particles.
         */

        function populate(geometry) {

            for(var quantity = 0, len = particles; quantity < len; quantity++) {

                var particle = new THREE.Particle(new THREE.ParticleCanvasMaterial(({ color: 0xffffff, opacity: getRandomInt(0.1,0.3), program: context2D })));

                particle.position.x = Math.random() * 3000 - 1500;
                particle.position.y = Math.random() * 3000 - 1500;
                particle.position.z = Math.random() * 3000 - 1500;

                particle.scale.x = particle.scale.y = 10;

                concentricsParticles.push({

                    originX: particle.position.x,
                    originY: particle.position.y,
                    angle: 0,
                    speed: speed - 0.15 + Math.random() * speed,

                    particle: particle

                });

                geometry.vertices.push(particle.position);
                Obj3D.add(particle);

            }

        }

        /*
         * On resize event.
         */

        function onResize(event) {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);

        }

        /*
         * Render the animation.
         */

        function render() {

            requestAnimationFrame(render);

            [].forEach.call(concentricsParticles, function(concentrics, index) {

                concentrics.particle.position.x = concentrics.originX + Math.sin(index + concentrics.angle) * orbit;
                concentrics.particle.position.y = concentrics.originY + Math.cos(index + concentrics.angle) * orbit;

                concentrics.particle.scale.x = concentrics.particle.scale.y = 1 + Math.sin(concentrics.angle * 0.5) * 10;

                concentrics.angle += concentrics.speed;

            });

            theta += 1;

            camera.position.x = mouse.lastCameraX + radius * Math.sin(theta * Math.PI / 360);
            camera.position.y = mouse.lastCameraY + radius * Math.sin(theta * Math.PI / 360);


            mouse.lastCameraZ += (depth - mouse.lastCameraZ) * 0.08;
            camera.position.z = mouse.lastCameraZ + radius * Math.cos(theta * Math.PI / 360);

            camera.lookAt(scene.position);

            renderer.render(scene, camera);

        }

    }

})(jQuery);