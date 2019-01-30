/// <reference path="require.js" />
/// <reference path="three.js" />
/// <reference path="customShaders.js" />
/// <reference path="composer.js" />
define(["three", "tween", "canvasrenderer"], function() {
  //unique for each scene
  var raycaster, camera, scene, vent;
  //same for all scenes
  var renderer;
  ///circle segments
  var constants = {
    INITGLOW_TIME: 1000,
    AFTERGLOW_DELAY_TIME: 400,
    AFTERGLOW_TIME: 800,
    HOLO_DEPLOY_TIME: 500,
    SEGMENT_COUNT: 32,
    CIRCLE_SCALE_COFF: 0.01
  };
  var windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2;
  var ratio = window.devicePixelRatio;
  var clock;
  var disabled = false;
  var composer;
  var group = new THREE.Group();
  function doSetTimeout(i) {
    setTimeout(function() {
      l[i].deploy();
    }, i * 400);
  }
  function preloadTextures(textures) {
    /// <summary>
    /// Used to preload all textures, after all the stuff is loaded setup scene occurs
    /// </summary>
    /// <param name="textures"></param>
    /// <returns type=""></returns>
    var textureCount = 0;
    window.l = [];
    var callbackFunc = function(object) {
      textureCount++;
      if (object instanceof THREE.Object3D) {
        var model = object.children[0];
        window.models[model.name] = model;
      } else if (object instanceof THREE.Texture) {
        var material = new THREE.MeshBasicMaterial({ map: object });
        material.map.repeat.x = 10;
        //scene.add(new THREE.Mesh(new THREE.SphereGeometry(2,10,10),material));
      }
      document.getElementById("logo").style.visibility = "hidden";
      if (textureCount == textures.length) setupScene();
    };
    var loader = new THREE.TextureLoader();
    for (var i = 0; i < textures.length - 1; i++) {
      loader.load(textures[i], callbackFunc);
    }
    var loader = new THREE.OBJLoader();
    loader.load("imgs/3.obj", callbackFunc);
  }
  function setupScene() {
    /// <summary>
    /// Setups , places , creates the scene objects
    /// </summary>
    /// <returns type=""></returns>
    //alert(renderer.sortObjects);
    //renderer.sortObjects = true;
    scene.fog = new THREE.Fog(0x777a79, 0, 3000);
    window.sasa = 0;
    window.re = renderer;
    console.log("done");
    window.obj = Holo;
    var map1 = {
        type: "t",
        position: {
          y: 120
        },
        material: {
          offsetX: 0,
          offsetY: 0,
          repeatX: 2,
          repeatY: 1
        },
        radius: 150,
        speed: 0.2,
        texture: "cyl1.png",
        animation: {
          tileX: 1,
          tileY: 8,
          frames: 8,
          spf: 300 / 8,
          repeat: false,
          repeatX: 2 / 2
        }
      },
      map2 = {
        type: "t",
        position: {
          y: 170
        },
        material: {
          offsetX: 0.7,
          offsetY: 0,
          repeatX: 3,
          repeatY: 1
        },
        radius: 150,
        speed: -0.2,
        texture: "cyl1.png",
        animation: {
          tileX: 1,
          tileY: 8,
          frames: 8,
          spf: 300 / 8,
          repeat: false,
          repeatX: 2 / 2
        }
      },
      map3 = {
        type: "t",
        position: {
          y: 50
        },
        material: {
          offsetX: 0.5,
          offsetY: 0,
          repeatX: 4,
          repeatY: 1
        },
        radius: 150,
        speed: 0.4,
        texture: "cyl1.png",
        animation: {
          tileX: 1,
          tileY: 8,
          frames: 8,
          spf: 300 / 8,
          repeat: false,
          repeatX: 2 / 2
        }
      },
      cylMap = {
        type: "d",
        radius: 160,
        color: 0xff9999,
        position: {
          y: 70
        },
        speed: (-0.07 * 2) / 72
      },
      cylMap2 = {
        type: "d",
        radius: 180,
        color: 0xff2266,
        position: {
          y: 250
        },
        speed: (0.05 * 2) / 72
      },
      cylMap3 = {
        type: "d",
        radius: 100,
        position: {
          y: 20
        },
        speed: 0.04 / 5
      },
      qdMap = {
        type: "q",
        radius: 130,
        position: {
          y: 10
        },
        rotation: Math.PI / 2,
        speed: 0.7
      },
      qdMap2 = {
        type: "q",
        radius: 130,
        position: {
          y: 30
        },
        speed: -0.5
      };
    var iMap = {
      type: "i",
      name: "Kuba",
      scale: 160 / 3.7,
      position: { y: 120 }
    };

    window.l = [];
    var platformParam = {
      type: "p",
      frames: 12,
      spf: 700 / 12,
      xtiles: 1,
      ytiles: 12,
      repeatX: 4,
      repeat: false
    };
    for (var i = 0; i < 5; i++) {
      var newMap1 = JSON.parse(JSON.stringify(map1));
      var newMap2 = JSON.parse(JSON.stringify(map2));
      var newMap3 = JSON.parse(JSON.stringify(map3));
      var holo = new Holo(
        [
          cylMap,
          cylMap3,
          cylMap2,
          newMap2,
          iMap,
          newMap1,
          newMap3,
          qdMap,
          qdMap2,
          platformParam
        ],
        0xaa33 + 0xaa * i
      );
      l.push(holo);
      holo.object3d.scale.set(0.8, 0.8, 0.8);
      scene.add(holo.object3d);
    }
    l[0].object3d.position.set(-187, 0, -377, 0);
    l[0].setZ(-377);
    l[1].object3d.position.set(-620, 0, -809, 0);
    l[1].setZ(-809);
    l[2].object3d.position.set(+254, 0, -600, 0);
    l[2].setZ(-600);
    l[3].object3d.position.set(+400, 0, -160, 0);
    l[3].setZ(-160);
    l[4].object3d.position.set(-350, 0, +50, 0);
    l[4].setZ(50);
    scene.add(new THREE.AxisHelper(200));
    l.deploy = function() {
      if (l.length == 0) return;
      l[0].deploy();
      for (var i = 1; i < l.length; i++) {
        doSetTimeout(i);
      }
    };
    l.collapse = function() {
      if (l.length == 0) return;
      for (var i = 0; i < l.length; i++) {
        l[i].collapse();
      }
    };
    l.setScale = function(sc) {
      for (var i = 0; i < this.length; i++) {
        l[i].setScale(sc);
      }
    };
    window.scene1 = scene;
    window.sasa = 1;
    //tre();
    vent.trigger("canvas", "complete");
  }
  function initialize(paramters) {
    /// <summary>
    /// Initalize hangar scene
    /// </summary>
    /// <param name="paramters">contains parameters such as renderer blah blah, because they're shared among two scenes</param>
    vent = paramters.vent;
    window.addEventListener("touchstart", function() {
      l.startAnimation();
    });
    window.models = {};
    preloadTextures([
      "imgs/black.png",
      "imgs/circle.png",
      "imgs/cyl.png",
      "imgs/cyl1.png",
      "imgs/cyl2.png",
      "imgs/diskGlow.png",
      "imgs/diskGlowOut.png",
      "imgs/partDisk.png",
      "imgs/stick1.png",
      "imgs/opo.png"
    ]);
    renderer = paramters.renderer;
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    window.cam = camera;
    camera.position.z = 500;
    camera.position.y = +150;
    camera.position.x = 0;
    ///look at x,y;
    camera.s = 0;
    camera.t = 175;
    //camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();
    camera.rotation.set(0.05, 0, 0);
    //camera.rotation.set(-Math.PI / 2, 0, 0);
    scene = new THREE.Scene();
    scene.position.y = -600;
    //var a = createObject();
    //scene.add(a);
  }
  var temp = function() {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 500;
    camera.position.y = +150;
    camera.position.x = 0;
    ///look at x,y;
    camera.s = 0;
    camera.t = 175;
    //camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();
    camera.rotation.set(0.05, 0, 0);
    window.cam = camera;
  };
  window.temp = temp;
  var Holo = function(map, color) {
    /// <summary>
    /// Function to create a holo stuff
    /// </summary>
    /// <param name="map">map in form of tticq where t means for example textured cylinder</param>
    /// <param name="color">color of platform.defaults to orange</param>
    /// <returns type=""></returns>
    this.map = map;
    this.color = color;
    this.object3d = group;
    this.platform = null;
    this.cylinders = [];
    this.texCylinders = [];
    this.quarterDisks = [];
    this.tweens = [];
    this.image = null;
    this.circle = null;
    this.createPlatform = function(color) {
      /// <summary>
      /// Creates static platform
      /// </summary>
      /// <param name="color">color of platform glow</param>
      /// <returns type="">Group of objects</returns>
      color = typeof color !== "undefined" ? color : 0xf0a346;
      var platformGroup = new THREE.Group();
      ///lower glow
      var glowCircleOuter = new addDisk(
        140,
        new THREE.Color(color),
        "diskGlowOut.png"
      );
      glowCircleOuter.position.y -= 15;
      platformGroup.add(glowCircleOuter);
      ///platform itself conic
      var platform = addConePlatform(100, 115, 10, "cyl.png");
      platform.position.y -= 10;
      platformGroup.add(platform);
      platformGroup.platformCone = platform;
      ///black cap of platform
      var platformCap = addDisk(100, new THREE.Color(0xffffff), "black.png");
      platformCap.position.set(0, -5, 0);
      platformGroup.add(platformCap);
      ///upper glow that initiates all animations
      var glowCircle = addDisk(100, new THREE.Color(color));
      glowCircle.position.set(0, -4, 0);
      platformGroup.add(glowCircle);
      var outerCircle = new addCircle(200, new THREE.Color(color));
      outerCircle.position.y -= 15;
      platformGroup.add(outerCircle);
      this.circle = outerCircle;
      platformGroup.glowUpper = glowCircle;
      glowCircle.visible = false;
      platformGroup.glowLower = glowCircleOuter;
      glowCircleOuter.visible = false;
      return platformGroup;
    };
    this.preorder = function() {
      /// <summary>
      ///presort and reorder to preserve correct ordering
      /// </summary>
      /// <returns type=""></returns>
      map.sort(function(a, b) {
        var aa, bb;
        if (a.type == "t") aa = 0;
        else if (a.type == "i") aa = 1;
        else aa = 2;
        if (b.type == "t") bb = 0;
        else if (b.type == "i") bb = 1;
        else bb = 2;
        if (aa < bb) return -1;
        else if (aa == bb) return 0;
        else return 1;
      });
      var length = map.length;
      ///this thing is necessary to get back cylinders from front cylinders. aka remap
      //map.prevLength=length;
      var newlength = map.length;
      for (var i = 0; i < length; i++) {
        if (map[i].type != "t") break;
        map[i].isFront = false;
        map[i].material.repeatX /= 2;
        ///cloning
        map[newlength] = JSON.parse(JSON.stringify(map[i]));
        map[newlength].isFront = true;
        ///this is done because our cylinder consist of two cylinders;
        map[newlength].material.offsetX -= map[newlength].material.repeatX;
        newlength++;
      }
    };
    this.createElements = function() {
      /// <summary>
      /// Populates group with elements
      /// </summary>
      var group = new THREE.Group();
      this.platform = this.createPlatform(this.color);
      group.add(this.platform);
      for (var i = 0; i < map.length; i++) {
        ///current
        var cur = map[i];
        switch (cur.type) {
          ///platform parameters
          case "p": {
            this.platform.animation = new THREE.TextureAnimator(
              this.platform.platformCone.material.map, //
              cur.xtiles,
              cur.ytiles,
              cur.frames,
              cur.spf,
              cur.repeat,
              cur.repeatX
            );
            break;
          }
          ///textured cylinder rotating, in fact consist of two separate cylinders
          case "t": {
            var startAngle, angle;
            if (cur.isFront) {
              startAngle = -Math.PI / 2;
              angle = Math.PI;
            } else {
              startAngle = +Math.PI / 2;
              angle = Math.PI;
            }
            var texturedCylinder = addTexturedCylinder(
              cur.radius,
              cur.texture,
              startAngle,
              angle
            );
            var anim = cur.animation;
            texturedCylinder.animation = new THREE.TextureAnimator(
              texturedCylinder.material.map, //
              anim.tileX,
              anim.tileY,
              anim.frames,
              anim.spf,
              true,
              anim.repeatX,
              true
            );
            ///setting positions
            for (var f in cur.position) {
              texturedCylinder.position[f] = cur.position[f];
            }
            ///setting material parameters
            {
              //texturedCylinder.material.map.repeat.x = cur.material.repeatX;
              //texturedCylinder.material.map.repeat.y = cur.material.repeatY;
              texturedCylinder.material.map.offset.x = cur.material.offsetX;
              //texturedCylinder.material.map.offset.y = cur.material.offsetY;
              texturedCylinder.material.map.wrapS = THREE.RepeatWrapping;
            }
            texturedCylinder.speed = cur.speed;
            if (!map[i].isFront) {
              ///we are at the front of array. this means that we are adding back cylinders.
              ///in this case we create new array element in texcylinders
              var obj = {
                back: texturedCylinder,
                front: null
              };
              this.texCylinders.push(obj);
            } else {
              ///we are now creating front sides of cylinders. Thus we dont create new array elem
              ///We put them to first cylinder elem which lacks front side. i.e. traverse
              for (var j = 0; j < this.texCylinders.length; j++) {
                ///a ty tochno null?
                if (this.texCylinders[j].front === null) {
                  this.texCylinders[j].front = texturedCylinder;
                  break;
                }
              }
            }
            group.add(texturedCylinder);
            break;
          }
          ///cylinder consisting of dashes
          case "d": {
            var cylinder = addCylinder(cur.radius, true, cur.color);
            cylinder.position.y = cur.position.y;
            cylinder.finalY = cur.position.y;
            cylinder.speed = cur.speed;
            this.cylinders.push(cylinder);
            group.add(cylinder);
            break;
          }
          ///main image that is centered
          case "i": {
            var image = addImage(cur.scale, cur.name, cur.texture);
            for (var f in cur.position) {
              image.position[f] = cur.position[f];
            }
            this.image = image;
            group.add(image);
            break;
          }
          ///circle
          ///quarter disk
          case "q": {
            var quarterDisk = addQuarterDisk(
              cur.radius,
              cur.texture,
              cur.rotation
            );
            quarterDisk.position.y = cur.position.y;
            quarterDisk.finalY = cur.position.y;
            quarterDisk.speed = cur.speed;
            group.add(quarterDisk);
            this.quarterDisks.push(quarterDisk);
            break;
          }
        }
      }
      //outer static circle

      //for (var i = 0; i < 20; i++) {
      //    var pl = new THREE.PlaneGeometry(2, 1000, 1, 1);
      //    var plMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
      //    var plMesh = new THREE.Mesh(pl, plMat);
      //    plMesh.position.x =-1000+i* 100;
      //    plMesh.rotation.x += Math.PI / 2;
      //    scene.add(plMesh);
      //}
      //for (var i = 0; i < 20; i++) {
      //    var pl = new THREE.PlaneGeometry(5000, 2, 1, 1);
      //    var plMat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
      //    var plMesh = new THREE.Mesh(pl, plMat);
      //    plMesh.position.z =- i * 100;
      //    plMesh.rotation.x += Math.PI / 2;
      //    scene.add(plMesh);
      //}
      //group.visible = false;
      for (var i = 0; i < this.cylinders.length; i++) {
        this.cylinders[i].visible = false;
      }
      for (var i = 0; i < this.texCylinders.length; i++) {
        this.texCylinders[i].back.visible = false;
        this.texCylinders[i].front.visible = false;
      }
      return group;
    };
    this.setZ = function(z) {
      /// <summary>
      /// Function to set Z uniform, used to test whether to hide pixels behind center
      /// </summary>
      /// <param name="z">Z</param>
      /// <returns type=""></returns>
      for (var i = 0; i < this.cylinders.length; i++) {
        this.cylinders[i].setZ(z);
      }
    };
    this.setScale = function(scale) {
      /// <summary>
      /// Used to scale down our holo according to window sizes
      /// </summary>
      /// <param name="scale">scale factor</param>
      /// <returns type=""></returns>
      for (var i = 0; i < this.cylinders.length; i++) {
        this.cylinders[i].setScale(scale);
      }
      //this.object3d.scale.set(scale, scale, scale);
    };
    this.deploy = function() {
      if (this.tweens.started) return;
      this.tweens.started = true;
      var poweronTween = new TWEEN.Tween({
        coff: 0,
        glowDisk: this.platform.glowUpper
      })
        .to(
          {
            coff: 1
          },
          constants.INITGLOW_TIME
        )
        .onStart(function() {
          this.glowDisk.visible = true;
        })
        .onUpdate(function() {
          if (this.coff > 0.7 && this.coff < 0.8) {
            //this.glowDisk.scale.set(0.7, 0.7, 0.7);
            this.glowDisk.material.opacity = 0.3;
          } else {
            //this.glowDisk.scale.set(this.coff, this.coff, this.coff);
            this.glowDisk.material.opacity = this.coff;
          }
        });
      var glowOut = new TWEEN.Tween({
        coff: 0.6,
        glowAfter: this.platform.glowLower
      })
        .to(
          {
            coff: 1
          },
          constants.AFTERGLOW_TIME
        )
        .onStart(function() {
          this.glowAfter.visible = true;
        })
        .onUpdate(function() {
          this.glowAfter.scale.set(this.coff, this.coff, this.coff);
        })
        .delay(constants.AFTERGLOW_DELAY_TIME);
      {
        ///adding cylinder rising anims
        for (var i = 0; i < this.cylinders.length; i++) {
          var time = 900 - constants.HOLO_DEPLOY_TIME / Math.pow(1.5, i);
          //var time = constants.HOLO_DEPLOY_TIME;
          //var delay = constants.HOLO_DEPLOY_TIME - time;
          var delay = 0;
          var tween = new TWEEN.Tween({
            cylinder: this.cylinders[i],
            y: 0,
            opacity: 0.3
          })
            .to(
              {
                y: this.cylinders[i].finalY,
                opacity: 1.0
              },
              time
            )
            .delay(delay)
            .onStart(function() {
              this.cylinder.visible = true;
              this.cylinder.material.opacity = 0.3;
              this.cylinder.scale.set(this.opacity, this.opacity, this.opacity);
            })
            .onUpdate(function() {
              this.cylinder.position.y = this.y;
              this.cylinder.material.opacity = this.opacity;
              this.cylinder.scale.set(this.opacity, this.opacity, this.opacity);
            })
            .onComplete(function() {
              this.cylinder.loop = true;
            })
            .easing(TWEEN.Easing.Sinusoidal.Out);
          this.tweens.push(tween);
        }
      }
      {
        for (var i = 0; i < this.quarterDisks.length; i++) {
          var time = constants.HOLO_DEPLOY_TIME / Math.pow(1.5, i);
          //var time = constants.HOLO_DEPLOY_TIME;
          var delay = constants.HOLO_DEPLOY_TIME - time;
          //var delay = 0;
          var tween = new TWEEN.Tween({
            disk: this.quarterDisks[i],
            y: 0,
            opacity: 0.3
          })
            .to(
              {
                y: this.quarterDisks[i].finalY,
                opacity: 1.0
              },
              time
            )
            .delay(delay)
            .onStart(function() {
              this.disk.visible = true;
              this.disk.material.opacity = 0.3;
            })
            .onUpdate(function() {
              this.disk.position.y = this.y;
              this.disk.material.opacity = this.opacity;
            })
            .onComplete(function() {
              this.disk.loop = true;
            })
            .easing(TWEEN.Easing.Sinusoidal.Out);
          this.tweens.push(tween);
        }
      }
      {
        ///adding textured cylinder
        for (var i = 0; i < this.texCylinders.length; i++) {
          var time = constants.HOLO_DEPLOY_TIME * 2;
          //var time = constants.HOLO_DEPLOY_TIME;
          var delay = constants.HOLO_DEPLOY_TIME * 0.6;
          var tween = new TWEEN.Tween({
            cylinder: this.texCylinders[i],
            opacity: 0.0
          })
            .to(
              {
                opacity: 1.0
              },
              time
            )
            .delay(delay)
            .onStart(function() {
              this.cylinder.back.material.opacity = 0.0;
              this.cylinder.back.visible = true;
              this.cylinder.front.material.opacity = 0.0;
              this.cylinder.front.visible = true;
            })
            .onUpdate(function() {
              this.cylinder.back.material.opacity = this.opacity;
              this.cylinder.front.material.opacity = this.opacity;
            })
            .onComplete(function() {
              this.cylinder.loop = true;
              this.cylinder.back.animation.play();
              this.cylinder.front.animation.play();
            })
            .easing(/*TWEEN.Easing.Sinusoidal.Out*/ TWEEN.Easing.Linear.None)
            .delay(delay);
          this.tweens.push(tween);
        }
      }
      {
        var time = constants.HOLO_DEPLOY_TIME * 2;
        //var time = constants.HOLO_DEPLOY_TIME;
        var delay = constants.HOLO_DEPLOY_TIME * 0.8;
        var tween = new TWEEN.Tween({
          image: this.image,
          opacity: 0.0
        })
          .to(
            {
              opacity: 1.0
            },
            time
          )
          .delay(delay)
          .onStart(function() {
            this.image.material.opacity = 0.0;
            this.image.visible = true;
          })
          .onUpdate(function() {
            this.image.material.opacity = this.opacity;
          })
          .easing(TWEEN.Easing.Sinusoidal.Out)
          .delay(delay);
        this.tweens.push(tween);
      }
      var currentObj = this;
      poweronTween.onComplete(function() {
        /// <summary>
        /// When power up initialisation completes run holo de
        /// </summary>
        ///start from 2 because tweens array has glow and poweron tween
        for (var i = 0; i < currentObj.tweens.length - 2; i++)
          currentObj.tweens[i].start();
        currentObj.circle.loop = true;
      });
      this.tweens.push(poweronTween);
      this.tweens.push(glowOut);
      poweronTween.start();
      glowOut.start();
      this.platform.animation.play();
    };
    this.collapse = function() {
      for (var i = 0; i < this.tweens.length; i++) {
        this.tweens[i].stop();
      }
      this.platform.glowUpper.material.opacity = 0.0;
      this.platform.glowUpper.visible = false;
      this.platform.glowLower.scale.set(0.6, 0.6, 0.6);
      for (var i = 0; i < this.cylinders.length; i++) {
        this.cylinders[i].position.y = 0;
        this.cylinders[i].material.opacity = 0.3;
        this.cylinders[i].scale.set(0.3, 0.3, 0.3);
        this.cylinders[i].visible = false;
        this.cylinders[i].loop = false;
      }
      for (var i = 0; i < this.quarterDisks.length; i++) {
        this.quarterDisks[i].position.y = 0;
        this.quarterDisks[i].material.opacity = 0.3;
        this.quarterDisks[i].scale.set(0.3, 0.3, 0.3);
        this.quarterDisks[i].visible = false;
        this.quarterDisks[i].loop = false;
      }
      for (var i = 0; i < this.texCylinders.length; i++) {
        this.texCylinders[i].back.material.opacity = 0.0;
        this.texCylinders[i].back.visible = false;
        this.texCylinders[i].front.material.opacity = 0.0;
        this.texCylinders[i].front.visible = false;
        this.texCylinders[i].loop = false;
      }
      this.image.material.opacity = 0.0;
      this.image.visible = false;
      this.circle.loop = false;
      this.tweens = [];
    };
    this.loop = function() {
      /// <summary>
      /// Function used to perform continuous i.e. infinite animations
      /// </summary>
      /// <returns type=""></returns>
      if (this.circle.loop) {
        var cur = (this.circle.scale.x + constants.CIRCLE_SCALE_COFF) % 1;
        this.circle.scale.set(cur, cur, cur);
        this.circle.material.opacity = 1 - cur;
      }
      for (var i = 0; i < this.cylinders.length; i++) {
        var curCyl = this.cylinders[i];
        if (!curCyl.loop) break;
        curCyl.rotateY(curCyl.speed);
      }
      for (var i = 0; i < this.cylinders.length; i++) {
        var curCyl = this.cylinders[i];
        if (!curCyl.loop) break;
        curCyl.rotateY(curCyl.speed / 10);
      }
      for (var i = 0; i < this.texCylinders.length; i++) {
        var curCyl = this.texCylinders[i];
        if (!curCyl.loop) break;
        curCyl.back.material.map.offset.x += curCyl.back.speed / 100;
        curCyl.front.material.map.offset.x += curCyl.back.speed / 100;
      }
      for (var i = 0; i < this.quarterDisks.length; i++) {
        var curDisk = this.quarterDisks[i];
        if (!curDisk.loop) break;
        curDisk.rotateZ(curDisk.speed / 100);
      }
    };
    this.preorder();
    this.object3d = this.createElements();
    window.a = this.texCylinders;
    return this;
  };
  function addImage(scale, name, texture) {
    /// <summary>
    ///
    /// Adds image that is centered on Holo
    /// </summary>
    /// <param name="width">width</param>
    /// <param name="height">height</param>
    /// <param name="scale">scale factor to accomplish necessary width,height</param>
    /// <param name="name">name is necessary to grab from pool of 3d-models</param>
    /// <param name="texture">Texture file</param>
    /// <returns type=""></returns>
    if (typeof texture == "undefined") texture = "90.png";
    var imageGeom = window.models[name].geometry.clone();
    var imageMesh = new THREE.Mesh(
      imageGeom,
      new THREE.MeshBasicMaterial({
        //depthWrite: false,
        opacity: 0.5,
        transparent: true,
        map: THREE.ImageUtils.loadTexture("imgs/" + texture)
      })
    );
    imageMesh.material.map.wrapS = THREE.RepeatWrapping;
    imageMesh.material.map.wrapT = THREE.RepeatWrapping;
    //imageMesh.material.map.repeat.set(20, 20);
    imageMesh.scale.set(scale, scale, 1.0);
    imageMesh.renderOrder = 5;
    imageMesh.visible = false;
    return imageMesh;
  }
  function addDisk(radius, color, texture) {
    /// <summary>
    /// Adds glow disk that's used for opacity animation
    /// </summary>
    /// <param name="radius">Radius</param>
    /// <param name="color">Color of disk</param>
    /// <param name="texture">Texture file</param>
    /// <returns type="">Disk object</returns>
    color = typeof color !== "undefined" ? color : new THREE.Color(0xffffff);
    texture =
      typeof texture !== "undefined"
        ? THREE.ImageUtils.loadTexture("imgs/" + texture)
        : THREE.ImageUtils.loadTexture("imgs/diskGlow.png");
    var diskGeom = new THREE.CircleGeometry(
      radius,
      constants.SEGMENT_COUNT * 2
    );
    var diskMesh = new THREE.Mesh(
      diskGeom,
      new THREE.MeshBasicMaterial({
        color: color,
        map: texture,
        transparent: true
      })
    );
    diskMesh.rotation.x -= Math.PI / 2;
    return diskMesh;
  }
  function addQuarterDisk(radius, texture, rotation) {
    /// <summary>
    /// Adds glow disk that's used for opacity animation
    /// </summary>
    /// <param name="radius">Radius</param>
    /// <param name="color">Color of disk</param>
    /// <returns type="">Disk object</returns>
    if (typeof texture == "undefined") texture = "imgs/partDisk.png";
    else texture = "imgs/" + texture;
    if (typeof rotation == "undefined") rotation = 0;
    var diskGeom = new THREE.CircleGeometry(
      radius,
      constants.SEGMENT_COUNT * 2
    );
    var diskMesh = new THREE.Mesh(
      diskGeom,
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(texture),
        transparent: true
      })
    );
    diskMesh.rotation.x -= Math.PI / 2;
    diskMesh.rotation.z = rotation;
    diskMesh.visible = false;
    return diskMesh;
  }
  function addCircle(radius, color, texture) {
    /// <summary>
    /// Adds outer circle
    /// </summary>
    /// <param name="radius"></param>
    /// <param name="color"></param>
    /// <param name="texture"></param>
    /// <returns type=""></returns>
    if (typeof texture == "undefined") texture = "imgs/circle.png";
    else texture = "imgs/" + texture;
    //var diskGeom = new THREE.CircleGeometry(radius, constants.SEGMENT_COUNT * 2);
    var diskGeom = new THREE.TorusGeometry(
      radius,
      2,
      2,
      constants.SEGMENT_COUNT * 2
    );
    var diskMesh = new THREE.Mesh(
      diskGeom,
      new THREE.MeshBasicMaterial({
        color: color,
        //map: THREE.ImageUtils.loadTexture(texture),
        transparent: true,
        side: THREE.DoubleSide
      })
    );
    //diskMesh.material.map.repeat.x = 1;
    diskMesh.rotation.x -= Math.PI / 2;
    //diskMesh.visible = false;
    diskMesh.scale.set(0.1, 0.1, 0.1);
    return diskMesh;
  }
  function addCylinder(radius, isCapped, color) {
    /// <summary>
    /// Adds cylinders of light
    /// </summary>
    /// <param name="radius">Radius of cylinder</param>
    /// <param name="isCapped">Whether to render caps border (circle line)</param>
    /// <param name="color">Color of our cylinder</param>
    /// <returns type="">Added cylinder object or group of objects</returns>
    color =
      typeof color !== "undefined"
        ? new THREE.Color(color)
        : new THREE.Color(0xffffff);
    var returnedObj = new THREE.Group();
    var coff = radius / 200;
    if (coff > 1.0) coff = 1;
    var dashesCount = Math.floor(constants.SEGMENT_COUNT * 4 * coff);

    var cylGeom = new THREE.CylinderGeometry(
      radius,
      radius,
      0,
      dashesCount,
      0,
      true
    );
    cylGeom.mergeVertices();
    var cylMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        z: {
          type: "f",
          value: 0.0
        },
        color: {
          type: "c",
          value: color
        },
        size: {
          type: "f",
          ///TODO: Improve this lifehack
          value: 150.0 * 2 * (window.innerHeight / 728)
        },
        center: {
          type: "v3",
          value: new THREE.Vector3(0, 0, 0)
        },
        scale: {
          type: "f",
          value: 1.0
        },
        radius: {
          type: "f",
          value: radius
        },
        texture: {
          type: "t",
          value: THREE.ImageUtils.loadTexture("imgs/stick1.png")
        }
      },
      vertexShader: document.getElementById("cylvertexshader").textContent,
      fragmentShader: document.getElementById("cylfragmentshader").textContent
    });
    renderer.state.setBlending(THREE.AdditiveBlending);
    cylMat.blending = THREE.AdditiveBlending;
    //cylMat.depthTest = false;
    var cylinder = new THREE.PointCloud(cylGeom, cylMat);
    cylinder.setScale = function(scale) {
      cylinder.material.uniforms.size.value = scale * 300;
      cylinder.material.uniforms.size.needsUpdate = true;
    };
    cylinder.setZ = function(z) {
      cylinder.material.uniforms.z.value = z;
      cylinder.material.uniforms.z.needsUpdate = true;
    };
    return cylinder;
  }
  function addTexturedCylinder(radius, textureFile, startAngle, angle) {
    if (typeof startAngle == "undefined") startAngle = 0;
    if (typeof angle == "undefined") angle = Math.PI * 2;
    if (typeof radius == "undefined") radius = 150;
    var cylGeom = new THREE.CylinderGeometry(
      radius,
      radius,
      50,
      constants.SEGMENT_COUNT * 2,
      1,
      true,
      startAngle,
      angle
    );
    var texture = THREE.ImageUtils.loadTexture("imgs/" + textureFile);
    var cylMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
      //depthTest: false
      //opacity:0.3
    });
    window.qq = texture;
    //later to be implemented
    //var animation = new TextureAnimator(texture, 2, 2, 3, 0);
    var cylMesh = new THREE.Mesh(cylGeom, cylMat);

    return cylMesh;
  }
  function addConePlatform(radiusIn, radiusOut, height, textureFile) {
    var cylGeom = new THREE.CylinderGeometry(
      radiusIn,
      radiusOut,
      height,
      constants.SEGMENT_COUNT * 2,
      1,
      true
    );
    var texture = THREE.ImageUtils.loadTexture("imgs/" + textureFile);
    var cylMat = new THREE.MeshBasicMaterial({ map: texture });
    texture.repeat.x = 4;
    texture.wrapS = THREE.RepeatWrapping;
    //later to be implemented
    //var animation = new TextureAnimator(texture, 2, 2, 3, 0);
    //TODO: animation like glow in out in texture
    var cylMesh = new THREE.Mesh(cylGeom, cylMat);
    return cylMesh;
  }
  function onWindowResize() {
    /*
            windowHalfX = window.innerWidth / 2;
            var sc = (window.innerHeight / 2) / windowHalfY;
            windowHalfY = window.innerHeight / 2;
            l.setScale(sc);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();*/
  }
  function TextureAnimator(
    texture,
    tilesHoriz,
    tilesVert,
    numTiles,
    tileDispDuration
  ) {
    // note: texture passed by reference, will be updated by the update function.

    this.tilesHorizontal = tilesHoriz;
    this.tilesVertical = tilesVert;
    // how many images does this spritesheet contain?
    //  usually equals tilesHoriz * tilesVert, but not necessarily,
    //  if there at blank tiles at the bottom of the spritesheet.
    this.numberOfTiles = numTiles;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

    // how long should each image be displayed?
    this.tileDisplayDuration = tileDispDuration;

    // how long has the current image been displayed?
    this.currentDisplayTime = 0;

    // which image is currently being displayed?
    this.currentTile = 0;

    this.update = function(milliSec) {
      this.currentDisplayTime += milliSec;
      while (this.currentDisplayTime > this.tileDisplayDuration) {
        this.currentDisplayTime -= this.tileDisplayDuration;
        this.currentTile++;
        if (this.currentTile == this.numberOfTiles) this.currentTile = 0;
        var currentColumn = this.currentTile % this.tilesHorizontal;
        texture.offset.x = currentColumn / this.tilesHorizontal;
        var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
        texture.offset.y = currentRow / this.tilesVertical;
      }
    };
  }
  ko = 0;
  function renderHangar() {
    /// <summary>
    /// Render function for hangar scene
    /// </summary>
    /// <returns type=""></returns>
    //cy.rotation.y += 0.005;
    for (var i = 0; i < window.l.length; i++) {
      l[i].loop();
    }
    var delta = clock.getDelta();
    // if (THREE.TextureAnimator.update != null)
    //     THREE.TextureAnimator.update(1000 * delta);
    renderer.render(scene, camera);
    //composer.render(0.1);
  }
  var showTween = null;
  function show(direction) {
    if (hideTween != null) {
      hideTween.stop_();
      delete hideTween.tween2;
      delete hideTween;
    }
    var ascendTween, ascendTween2;
    if (direction == "down") {
      ascendTween = new TWEEN.Tween({
        y: scene1.position.y
      })
        .to(
          {
            y: 0
          },
          700 / 1
        )
        .onStart(function() {})
        .onUpdate(function() {
          scene1.position.y = this.y;
        })
        .onComplete(function() {
          l.deploy();
          console.log("deployed");
        });
    } else if (direction == "up") {
      ascendTween2 = new TWEEN.Tween({ zoom: cam.zoom })
        .to({ zoom: 1.0 }, 300)
        .onUpdate(function() {
          cam.zoom = this.zoom;
          cam.updateProjectionMatrix();
        })
        .delay(300)
        .start();
      ascendTween = new TWEEN.Tween({
        /*z: 500, y: 150, s: 0, t: 175*/ // <--real cam position
        z: cam.position.z,
        y: cam.position.y,
        t: cam.t,
        s: cam.s,
        opacity: scene1.opacity
      })
        .to({ z: 500, y: 150, s: 0, t: 175, opacity: 0 }, 600)
        .onUpdate(function() {
          cam.position.set(0, this.y, this.z);
          cam.s = this.s;
          cam.t = this.t;
          cam.lookAt(new THREE.Vector3(0, this.t, this.s));
          scene1.opacity = this.opacity;
        })
        .start();
    } else {
      console.error("WTF?!");
      return;
    }
    showTween = ascendTween;
    showTween.tween2 = ascendTween2;
    showTween.stop_ = function() {
      if (this.tween2 != null) this.tween2.stop();
      this.stop();
    };
    showTween.start();
  }
  var hideTween = null;
  function hide(direction) {
    if (showTween != null) {
      showTween.stop_();
      delete showTween.tween2;
      delete showTween;
    }
    var descendTween, descendTween2;
    if (direction == "up") {
      descendTween2 = new TWEEN.Tween({ zoom: 1.0 })
        .to({ zoom: 0.3 }, 300)
        .onUpdate(function() {
          cam.zoom = this.zoom;
          cam.updateProjectionMatrix();
        })
        .start();
      descendTween = new TWEEN.Tween({
        /*z: 500, y: 150, s: 0, t: 175*/ // <--real cam position
        z: cam.position.z,
        y: cam.position.y,
        t: cam.t,
        s: cam.s,
        opacity: scene1.opacity
      })
        .to({ z: 0, y: 1600, s: -400, t: 0, opacity: 1.0 }, 600)
        .onUpdate(function() {
          cam.position.set(0, this.y, this.z);
          cam.s = this.s;
          cam.t = this.t;
          cam.lookAt(new THREE.Vector3(0, this.t, this.s));
          scene1.opacity = this.opacity;
        })
        .start();
    } else if (direction == "down") {
      var descendTween = new TWEEN.Tween({
        y: scene1.position.y
      })
        .to(
          {
            y: -600
          },
          700
        )
        .onStart(function() {})
        .onUpdate(function() {
          scene1.position.y = this.y;
        })
        .onComplete(function() {
          l.collapse();
          console.log("collapsed");
        });
    } else {
      console.error("WTF?");
    }
    hideTween = descendTween;
    hideTween.tween2 = descendTween2;
    hideTween.stop_ = function() {
      if (this.tween2 != null) this.tween2.stop();
      this.stop();
    };
    hideTween.start();
  }
  window.show = show;
  window.hide = hide;
  var h = window.location.href;
  var bool = false;
  var returned = {
    renderHangar: renderHangar,
    initialize: initialize,
    onWindowResize: onWindowResize,
    show: show,
    hide: hide
  };
  return returned;
});
