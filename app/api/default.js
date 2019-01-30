// global window variable that can
// accesible by api keyword
// ----------------------------------
//
//           API  defaultJS
//
// ----------------------------------

define([
  "jquery",
  "underscore",
  "backbone",
  "bootstrap",
  "fullpage",
  "views/svg",
  "views/canvas",
  //'views/hangar',
  //'views/default/ShellView',

  "views/default/MainView"

  //'jquery-ujs',
  //'jquery-remotipart',
  //'jquery-iframe',
], function($, _, Backbone, Bootstrap, Fullpage, SnapSVG, BGCanvas, MainView) {
  var APIRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      // ''                        : 'defaultRoute',
      // '*actions'                : 'defaultRoute',

      "": "indexRoute",
      services: "serviceRoute",
      "services/": "serviceRoute",
      "services/:pane": "serviceRoute",
      "services/:pane/": "serviceRoute",
      "services/:pane/:section": "serviceRoute",

      briefcase: "portfolioRoute",
      "briefcase/": "portfolioRoute",
      "briefcase/:pane": "portfolioRoute",

      projects: "projectsRoute",
      contacts: "contactRoute",
      "*actions": "defaultRoute"
    }
  });

  var ventio = _.extend({}, Backbone.Events);

  var inspector = {};

  var navInfo = (function() {
    var ua = navigator.userAgent,
      tem,
      M =
        ua.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return "IE " + (tem[1] || "");
    }
    if (M[1] === "Chrome") {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null)
        return tem
          .slice(1)
          .join(" ")
          .replace("OPR", "Opera");
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M;
  })();

  var initialize = function() {
    console.log(
      "%c [ROUTE] INITIALIZING %c Navigator: " + navInfo.join(" "),
      "background: #2b69b1; color: #c6dee9",
      "background: #c7e0fa; color: #1d7bd1"
    );
    var apiRouter = new APIRouter();
    var aspectRatio = window.innerWidth / window.innerHeight;
    var aspectUnit =
      aspectRatio > 1.33
        ? window.innerHeight / 7
        : window.innerWidth / (1.33 * 7);

    console.log("ASPECT UNIT: ", aspectUnit);

    $.ajaxSetup({
      headers: {
        "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content")
      }
    });

    SnapSVG.initialize({ vent: ventio, aspect: aspectUnit });

    // if((navInfo[0] == 'Chrome') && (window.clientInformation.platform  != "MacIntel")){

    BGCanvas.initialize({ vent: ventio });
    // }

    //BGCanvas.enable('particles');
    // Hangar.initialize();
    // Hangar.enable();
    // BGCanvas.disable();
    // HangarCanvas.initialize({vent: ventio});

    // console.log(SVGs.redCircle);
    // inspector.snapSVG = new SnapSVG({vent: ventio});

    inspector.mainView = new MainView({ vent: ventio });

    inspector.mainView.render();

    $("#main .main-wrapper").fullpage({
      verticalCentered: false,
      onLeave: function(index, nextIndex, direction) {
        console.log("onLeave:", index, nextIndex, direction);
        BGCanvas.switchTo(index, nextIndex);

        switch (nextIndex) {
          case 1:
            //hide fast fast if 4
            Backbone.history.navigate("", true);
            break;
          case 2:
            //hide fast if 4
            Backbone.history.navigate("services", true);
            break;
          case 3:
            //hide if 4
            Backbone.history.navigate("briefcase", true);
            break;
          case 4:
            //show
            Backbone.history.navigate("projects", true);
            break;
          case 5:
            // hide if 4
            Backbone.history.navigate("contacts", true);
            break;
        }
      },
      afterLoad: function() {
        // console.log('======================SVG==============================');
        // console.log('Window     : ', window.innerWidth, window.innerHeight, window.innerWidth/window.innerHeight);
        // console.log('circlesRGB : ', $('#circlesRGB')[0].getBoundingClientRect().width, $('#circlesRGB')[0].getBoundingClientRect().height, $('#circlesRGB')[0].getBoundingClientRect().width/$('#circlesRGB')[0].getBoundingClientRect().height);
        // console.log('Ratio      : ', window.innerWidth/$('#circlesRGB')[0].getBoundingClientRect().width, window.innerHeight/$('#circlesRGB')[0].getBoundingClientRect().height);
        // console.log('ClientRect : ', $('#svg')[0].getBoundingClientRect().width, $('#svg')[0].getBoundingClientRect().height);
      },
      afterResize: function() {
        //SnapSVG.resize();
        //SnapSVG.renderScene(2);
        // console.log('----------------------SVG------------------------------');
        // console.log('Window     : ', window.innerWidth, window.innerHeight, window.innerWidth/window.innerHeight);
        // console.log('circlesRGB : ', $('#circlesRGB')[0].getBoundingClientRect().width, $('#circlesRGB')[0].getBoundingClientRect().height, $('#circlesRGB')[0].getBoundingClientRect().width/$('#circlesRGB')[0].getBoundingClientRect().height);
        // console.log('Ratio      : ', window.innerWidth/$('#circlesRGB')[0].getBoundingClientRect().width, window.innerHeight/$('#circlesRGB')[0].getBoundingClientRect().height);
        // console.log('ClientRect : ', $('#svg')[0].getBoundingClientRect().width, $('#svg')[0].getBoundingClientRect().height);
      }
    });

    // vent.bind("circle:red", function(){
    //   // apiRouter.navigate("/tours", {trigger: true});
    //   console.log('circle')
    // });

    // $(SVGs.redCircle.node).click(function(){console.log('asdaaaaaa')});
    // SVGs.redCircle.node.mouseover = function(){console.log('----')};

    apiRouter.on("route:underConstructRoute", function(pane) {
      console.log(
        "%c [ROUTE] UNDER CONSTRUCTION!",
        "background: #2b69b1; color: #c6dee9"
      );
      // console.log('indexRoute');
      inspector.mainView.renderPane(1, "");
      //  SnapSVG.indexScene();
      SnapSVG.renderScene(7);
    });

    apiRouter.on("route:indexRoute", function(pane) {
      console.log("%c [ROUTE] INDEX", "background: #2b69b1; color: #c6dee9");
      // console.log('indexRoute');
      inspector.mainView.renderPane(1, "");
      //  SnapSVG.indexScene();
      SnapSVG.renderScene(1);
    });

    apiRouter.on("route:serviceRoute", function(pane, section) {
      console.log(
        "%c [ROUTE] SERVICE %c URI: " + (pane ? pane : "index"),
        "background: #2b69b1; color: #c6dee9",
        "background: #c7e0fa; color: #1d7bd1"
      );
      inspector.mainView.renderPane(2, "services", pane, section);
      //SnapSVG.serviceScene(pane, section);
      SnapSVG.renderScene(2, pane, section);
    });

    apiRouter.on("route:portfolioRoute", function(pane) {
      console.log(
        "%c [ROUTE] PORTFOLIO %c URI: " + (pane ? pane : "index"),
        "background: #2b69b1; color: #c6dee9",
        "background: #c7e0fa; color: #1d7bd1"
      );
      // console.log('briefRoute', pane);
      inspector.mainView.renderPane(3, "briefcase", pane);
      //SnapSVG.portfolioScene();
      SnapSVG.renderScene(3);
    });

    apiRouter.on("route:projectsRoute", function(pane) {
      console.log(
        "%c [ROUTE] PROJECTS %c URI: " + (pane ? pane : "index"),
        "background: #2b69b1; color: #c6dee9",
        "background: #c7e0fa; color: #1d7bd1"
      );
      // console.log('indexRoute');
      inspector.mainView.renderPane(4, "projects");
      SnapSVG.renderScene(4);
    });

    apiRouter.on("route:contactRoute", function(pane) {
      console.log(
        "%c [ROUTE] CONTACTS %c URI: " + (pane ? pane : "index"),
        "background: #2b69b1; color: #c6dee9",
        "background: #c7e0fa; color: #1d7bd1"
      );
      // console.log('indexRoute');
      inspector.mainView.renderPane(5, "contacts");
      SnapSVG.renderScene(5);
    });

    apiRouter.on("route:defaultRoute", function() {
      console.log(
        "%c [ROUTE] NOT_FOUND %c",
        "background: #2b69b1; color: #c6dee9"
      );
      // this.navigate("#error_500", true)
      console.log("500 ssInternal Server Error");
      console.log("API for this page not included yet");
    });

    Backbone.history.start({ pushState: true });
  };

  return {
    initialize: initialize,
    vent: ventio,
    resize: function(vb) {
      return SnapSVG.resize(vb);
    }
  };
});
