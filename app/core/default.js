require.config({
  paths: {
    //
    // ------------------------ Third Party ------------------------
    jquery: "../../vendor/jquery/dist/jquery",
    underscore: "../../vendor/underscore-amd/underscore",
    backbone: "../../vendor/backbone-amd/backbone",

    //----------------------- Backbone Extensions ------------------

    layoutmanager: "../../vendor/backbone-amd-ext/backbone.layoutmanager",

    // --------------- Other Jquery Vendor Collections  ------------

    bootstrap: "../../app/bootstrap",
    fullpage: "../../vendor/lib/jquery.fullPage",
    datepicker: "../../vendor/lib/bdatepicker",
    nouislider: "../../vendor/lib/jquery.nouislider.all",

    snapsvg: "../../vendor/lib/snap.svg-min",
    imagesLoaded: "../../vendor/lib/imagesLoaded",

    three: "../../vendor/lib/three",
    canvasrenderer: "../../vendor/lib/CanvasRenderer",
    projectors: "../../vendor/lib/Projectors",
    tween: "../../vendor/lib/tween.min",
    customshaders: "../../vendor/lib/customShaders",
    composer: "../../vendor/lib/composer",
    particleengine: "../../vendor/lib/ParticleEngine",
    particleengineexamples: "../../vendor/lib/ParticleEngineExamples",
    // 'jquery-ujs'        : '../../vendor/jquery/jquery-ujs',
    // 'jquery-remotipart' : '../../vendor/jquery/jquery-remotipart',
    // 'jquery-iframe'     : '../../vendor/jquery/jquery-iframe',

    models: "../models",
    views: "../views",
    collections: "../collections",
    templates: "../../templates"
  },

  shim: {
    bootstrap: {
      deps: ["jquery"],
      exports: "Bootstrap"
    },

    fullpage: {
      deps: ["jquery"],
      exports: "FullPage"
    },

    snapsvg: {
      exports: "SnapSVG"
    },

    imagesLoaded: {
      exports: "imagesLoaded"
    },

    three: {
      exports: "THREE"
    },

    canvasrenderer: {
      deps: ["three"],
      exports: "THREE"
    },

    projectors: {
      deps: ["three"],
      exports: "THREE"
    },

    tween: {
      deps: ["three"],
      exports: "TWEEN"
    },

    particleengine: {
      deps: ["three"],
      exports: "TWEEN"
    },

    particleengineexamples: {
      deps: ["three", "particleengine"],
      exports: "TWEEN"
    },

    datepicker: {
      deps: ["jquery"],
      exports: "Datepicker"
    },

    nouislider: {
      deps: ["jquery"],
      exports: "UISlider"
    },

    layoutmanager: {
      deps: ["backbone"],
      exports: "LayoutManager"
    }

    // "jquery-remotipart": {
    // 	"deps": ["jquery"],
    // 	"exports": "jQuery-REMOTIPART"
    // },

    // "jquery-iframe": {
    // 	"deps": ["jquery"],
    // 	"exports": "jQuery-IFRAME"
    // },
  }
});

require(["../api/default"], function(api) {
  window.api = api;
  window.api.initialize();

  // BGCanvas.init();
  // BGCanvas.animate();
});
