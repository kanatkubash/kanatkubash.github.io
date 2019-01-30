/// <reference path="three.js" />
/// <reference path="require.js" />
define(["three", "tween", "views/hangar"], function(THREE, TWEEN, hangar) {
  THREE = window.THREE;
  THREE.CustomSprite = function(id, texture, isR, isG, isB, text) {
    /// <summary>
    /// Custom Sprite class using shaders
    /// </summary>
    /// <param name="id">id used to select texture from atlas</param>
    /// <param name="texture">texture object</param>
    /// <param name="isR">defines whether sprite can be painted red</param>
    /// <param name="isG">defines whether sprite can be painted green</param>
    /// <param name="isB">defines whether sprite can be painted blue</param>
    var geometry = new THREE.PlaneBufferGeometry(192, 192 / 16);
    var material = new THREE.RawShaderMaterial({
      depthTest: false,
      uniforms: {
        opacity: {
          type: "f",
          value: 0.4
        },
        scale: {
          type: "f",
          value: 1.0
        },
        color: {
          type: "c",
          value: new THREE.Color(0xffffff)
        },
        map: {
          type: "t",
          value: texture
        },
        id: {
          type: "f",
          value: id
        },
        isR: {
          type: "f",
          value: isR
        },
        isG: {
          type: "f",
          value: isG
        },
        isB: {
          type: "f",
          value: isB
        }
      },
      vertexShader: document.getElementById("textvertexshader").textContent,
      fragmentShader: document.getElementById("textshader").textContent,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    var object = new THREE.Mesh(geometry, material);
    object.isR = isR;
    object.isG = isG;
    object.isB = isB;
    object.setOpacity = function(opacity) {
      /// <summary>
      /// Set Opacity of Custom Sprite (i.e. TextSprite)
      /// </summary>
      /// <param name="opacity">opacity</param>
      /// <returns type=""></returns>
      opacity = opacity < 0 ? 0 : opacity;
      opacity = opacity > 1.0 ? 1.0 : opacity;
      object.material.uniforms.opacity.value = opacity;
      object.material.uniforms.opacity.needsUpdate = true;
    };
    return object;
  };
  var raycaster, camera, scene, renderer;
  var selectedItem = {
    isSelected: false,
    index: 0,
    position: {
      x: 0,
      y: 0
    }
  };
  window.sl = selectedItem;
  ///Last particle hit by mouse
  var lastParticle = {};
  var PARTICLE_COUNT = 10;
  var rotateAxises = [
    new THREE.Vector3(0, 1, 0).normalize(),
    new THREE.Vector3(1.73, 1, 0).normalize(),
    new THREE.Vector3(-1.73, 1, 0).normalize()
  ];
  var rotationSpeed = {
    maximum: 0.0103,
    value: 0.0103,
    isPausing: false,
    isResuming: false,
    pause: function() {
      /// <summary>
      /// Pausing pointCloud animation
      /// </summary>
      var initial = rotationSpeed.value;
      if (initial == 0 || rotationSpeed.isPausing) return;
      rotationSpeed.isPausing = true;
      new TWEEN.Tween({
        speed: initial
      })
        .to(
          {
            speed: 0
          },
          500
        )
        .onUpdate(function() {
          rotationSpeed.value = this.speed;
        })
        .onComplete(function() {
          rotationSpeed.isPausing = false;
        })
        .start();
    },
    resume: function() {
      /// <summary>
      /// Resuming pointCloud animation
      /// </summary>
      var initial = rotationSpeed.value;
      if (initial == rotationSpeed.maximum || rotationSpeed.isResuming) return;
      rotationSpeed.isResuming = true;
      new TWEEN.Tween({
        speed: initial
      })
        .to(
          {
            speed: rotationSpeed.maximum
          },
          500
        )
        .onUpdate(function() {
          rotationSpeed.value = this.speed;
        })
        .onComplete(function() {
          rotationSpeed.isResuming = false;
        })
        .start();
    }
  };
  var windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2;
  var centerR, centerG, centerB;
  var ratio = window.devicePixelRatio;
  var clock;
  var mouse = new THREE.Vector2();
  var pointClouds = [];
  var backPointClouds = [];
  var textGroup = [];
  var wordsArr = [
    //=============  R (design) =================
    {
      text: "monogram",
      href: "/service"
    }, // Monogram
    {
      text: "eponym",
      href: "/service"
    }, // Eponym
    {
      text: "wordmark",
      href: "/service"
    }, // KISS (Kepp Iit Short & Simple)
    {
      text: "wordmark",
      href: "/service"
    }, // Ideograph
    {
      text: "monogram",
      href: "/service"
    }, // Legend
    {
      text: "eponym",
      href: "/service"
    }, // Unity
    {
      text: "wordmark",
      href: "/service"
    }, // Emphasis
    {
      text: "wordmark",
      href: "/service"
    }, // Rhytm

    //-------------  R g-b ----------------------
    {
      text: "wordmark",
      href: "/service"
    }, // Proportion
    {
      text: "wordmark",
      href: "/service"
    }, // Balance
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },

    //-------------  G B ------------------------
    {
      text: "NFC",
      href: "/service"
    }, // NFC (Near Field Communication)
    {
      text: "LBS",
      href: "/service"
    }, // LBS (Location Based Services) iBeacon
    {
      text: "wordmark",
      href: "/service"
    }, // Firewall
    {
      text: "wordmark",
      href: "/service"
    }, // VPN
    {
      text: "wordmark",
      href: "/service"
    }, // DNS
    {
      text: "wordmark",
      href: "/service"
    }, // NAT
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },

    //==========   G (engineering) ==============
    {
      text: "wordmark",
      href: "/service"
    }, //
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    //------------- G r-b -----------------------
    {
      text: "wordmark",
      href: "/service"
    }, //DSP
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    //------------- R B -------------------------
    {
      text: "grid-system",
      href: "/service"
    }, // Grid-system
    {
      text: "wordmark",
      href: "/service"
    }, // media-queries
    {
      text: "wordmark",
      href: "/service"
    }, // progressive enhancement
    {
      text: "wordmark",
      href: "/service"
    }, // flexible images
    {
      text: "wordmark",
      href: "/service"
    }, // Storyboard, IxD, HCI
    {
      text: "wordmark",
      href: "/service"
    }, // WireFrame
    {
      text: "wordmark",
      href: "/service"
    }, // User Scenario
    {
      text: "wordmark",
      href: "/service"
    }, // Flowchart, Sitemap, BlockDiagram

    //=========   B (development) ===============
    {
      text: "wordmark",
      href: "/service"
    }, // Cashier
    {
      text: "wordmark",
      href: "/service"
    }, // magento cart
    {
      text: "wordmark",
      href: "/service"
    }, // Push Notifications
    {
      text: "wordmark",
      href: "/service"
    }, // ECM, CRM
    {
      text: "wordmark",
      href: "/service"
    }, // version-control
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    //------------- B r-g ------------------------
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    //-------------- R G ------------------------
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    },
    {
      text: "wordmark",
      href: "/service"
    }
  ];
  var disabled = false;

  function setRadius() {
    /// <summary>
    /// Reset radius variable according to new window size
    /// </summary>
    var radius = window.innerHeight / 6;
    window.RADIUS = radius;
    centerR = new THREE.Vector2(windowHalfX, windowHalfY - RADIUS / 1.5);
    centerG = new THREE.Vector2(
      windowHalfX - (RADIUS * 1.73) / 3.0,
      windowHalfY + RADIUS * (1 / 3.0)
    );
    centerB = new THREE.Vector2(
      windowHalfX + (RADIUS * 1.73) / 3.0,
      windowHalfY + RADIUS * (1 / 3.0)
    );
  }

  function generateFrontClouds() {
    /// <summary>
    /// Generation of active pointClouds
    /// </summary>
    /// <returns type=""></returns>
    var radius = window.RADIUS;

    function getDistance(x1, y1, x2, y2) {
      /// <summary>
      /// Gets distance between two points
      /// </summary>
      /// <param name="x1">x1</param>
      /// <param name="y1">y1</param>
      /// <param name="x2">x2</param>
      /// <param name="y2">y2</param>
      return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
    }

    function generateR() {
      /// <summary>
      /// Generates a particle within red circle
      /// </summary>
      var u = Math.random() * Math.PI * 2;
      var fi = Math.random() * Math.PI;
      var r = radius - Math.random() * radius;
      if (r < 0.2 * radius) r = radius - r;
      var object = {};
      object.x = r * Math.cos(u) * Math.sin(fi);
      object.y = r * Math.sin(u) * Math.sin(fi) + radius / 1.5;
      object.z = r * Math.cos(fi);
      return object;
    }

    function generateG() {
      /// <summary>
      /// Generates a particle within green circle
      /// </summary>
      var u = Math.random() * Math.PI * 2;
      var fi = Math.random() * Math.PI;
      var r = radius - Math.random() * radius;
      if (r < 0.2 * radius) r = radius - r;
      var object = {};
      object.x = r * Math.cos(u) * Math.sin(fi) - (radius * 1.73) / 3.0;
      object.y = r * Math.sin(u) * Math.sin(fi) - (radius * 1) / 3.0;
      object.z = r * Math.cos(fi);
      return object;
    }

    function generateB() {
      /// <summary>
      /// Generates a particle within blue circle
      /// </summary>
      var u = Math.random() * Math.PI * 2;
      var fi = Math.random() * Math.PI;
      var r = radius - Math.random() * radius;
      if (r < 0.2 * radius) r = radius - r;
      var object = {};
      object.x = r * Math.cos(u) * Math.sin(fi) + (radius * 1.73) / 3.0;
      object.y = r * Math.sin(u) * Math.sin(fi) - (radius * 1) / 3.0;
      object.z = r * Math.cos(fi);
      return object;
    }

    function isInR(x, y, coff) {
      /// <summary>
      /// checks whether point lies in red circle
      /// </summary>
      /// <param name="x">x</param>
      /// <param name="y">y</param>
      /// <param name="coff">Coefficient for setting radius. 1.0 means radius=radius</param>
      var centerX = 0;
      var centerY = radius / 1.5;
      var distance = getDistance(x, y, centerX, centerY);
      if (distance <= radius * coff) return true;
      return false;
    }

    function isInG(x, y, coff) {
      /// <summary>
      /// checks whether point lies in green circle
      /// </summary>
      /// <param name="x">x</param>
      /// <param name="y">y</param>
      /// <param name="coff">Coefficient for setting radius. 1.0 means radius=radius</param>
      var centerX = (-radius * 1.73) / 3.0;
      var centerY = (-radius * 1) / 3.0;
      var distance = getDistance(x, y, centerX, centerY);
      if (distance <= radius * coff) return true;
      return false;
    }

    function isInB(x, y, coff) {
      /// <summary>
      /// checks whether point lies in blue circle
      /// </summary>
      /// <param name="x">x</param>
      /// <param name="y">y</param>
      /// <param name="coff">Coefficient for setting radius. 1.0 means radius=radius</param>
      var centerX = (+radius * 1.73) / 3.0;
      var centerY = (-radius * 1) / 3.0;
      var distance = getDistance(x, y, centerX, centerY);
      if (distance <= radius * coff) return true;
      return false;
    }
    var pointParams;
    var textura = makeTextSprite("KU", {
      fontface: "Roboto Condensed",
      fontsize: 15,
      borderThickness: 0,
      backgroundColor: {
        r: 255,
        g: 255,
        b: 255,
        a: 1.0
      }
    });
    window.textura = textura;
    for (i = 0; i < 6; i++) {
      pointParams = {
        attributes: {
          size: {
            type: "f",
            value: null
          },
          colorAttr: {
            type: "f",
            value: null
          },
          isSelected: {
            type: "f",
            value: null
          }
        },
        uniforms: {
          ratio: {
            type: "f",
            value: ratio
          },
          color: {
            type: "c",
            value: new THREE.Color(0xffffff)
          },
          texture: {
            type: "t",
            value: THREE.ImageUtils.loadTexture("/imgs/disc.png")
          },
          radius: {
            type: "f",
            value: window.RADIUS
          },
          RGB: {
            type: "f",
            value: window.RGB
          }
        },
        geometry: new THREE.BufferGeometry()
      };
      var positionAttr = new Float32Array(PARTICLE_COUNT * 3);
      positionAttr.setNth = function(index, point) {
        /// <summary>
        /// Sets points of pointCloud geometry
        /// </summary>
        /// <param name="index">index of point</param>
        /// <param name="point">point object in form of x,y,z</param>
        positionAttr[index * 3 + 0] = point.x;
        positionAttr[index * 3 + 1] = point.y;
        positionAttr[index * 3 + 2] = point.z;
      };
      window.positionAttr = positionAttr;
      var cur = 0;
      switch (i % 3) {
        ///first cloud
        case 0:
          {
            var redOnly = 0;
            var rgb = 0;
            while (redOnly < 4) {
              var point = generateR();
              if (isInG(point.x, point.y, 1.2) || isInB(point.x, point.y, 1.2))
                continue;
              positionAttr.setNth(cur, point);
              redOnly++;
              cur++;
            }
            while (rgb < 2) {
              var point = generateR();
              if (
                !(isInG(point.x, point.y, 0.8) || isInB(point.x, point.y, 0.8))
              )
                continue;
              positionAttr.setNth(cur, point);
              rgb++;
              cur++;
            }
            var otherCircles = 0;
            while (otherCircles < 2) {
              var point = generateG();
              if (isInR(point.x, point.y, 1.1)) continue;
              positionAttr.setNth(cur, point);
              cur++;
              otherCircles++;
            }
            while (otherCircles < 4) {
              var point = generateB();
              if (isInR(point.x, point.y, 1.1)) continue;
              positionAttr.setNth(cur, point);
              cur++;
              otherCircles++;
            }
          }
          break;
        case 1:
          {
            var greenOnly = 0;
            var gbr = 0;
            while (greenOnly < 4) {
              var point = generateG();
              if (isInR(point.x, point.y, 1.2) || isInB(point.x, point.y, 1.2))
                continue;
              positionAttr.setNth(cur, point);
              greenOnly++;
              cur++;
            }
            while (gbr < 2) {
              var point = generateG();
              if (
                !(isInR(point.x, point.y, 0.8) || isInB(point.x, point.y, 0.8))
              )
                continue;
              positionAttr.setNth(cur, point);
              gbr++;
              cur++;
            }
            var otherCircles = 0;
            while (otherCircles < 2) {
              var point = generateR();
              if (isInG(point.x, point.y, 1.1)) continue;
              positionAttr.setNth(cur, point);
              cur++;
              otherCircles++;
            }
            while (otherCircles < 4) {
              var point = generateB();
              if (isInG(point.x, point.y, 1.1)) continue;
              positionAttr.setNth(cur, point);
              cur++;
              otherCircles++;
            }
          }
          break;
        case 2:
          {
            var blueOnly = 0;
            var brg = 0;
            while (blueOnly < 4) {
              var point = generateB();
              if (isInR(point.x, point.y, 1.2) || isInG(point.x, point.y, 1.2))
                continue;
              positionAttr.setNth(cur, point);
              blueOnly++;
              cur++;
            }
            while (brg < 2) {
              var point = generateB();
              if (
                !(isInR(point.x, point.y, 0.8) || isInG(point.x, point.y, 0.8))
              )
                continue;
              positionAttr.setNth(cur, point);
              brg++;
              cur++;
            }
            var otherCircles = 0;
            while (otherCircles < 2) {
              var point = generateR();
              if (isInB(point.x, point.y, 1.1)) continue;
              positionAttr.setNth(cur, point);
              cur++;
              otherCircles++;
            }
            while (otherCircles < 4) {
              var point = generateG();
              if (isInB(point.x, point.y, 1.1)) continue;
              positionAttr.setNth(cur, point);
              cur++;
              otherCircles++;
            }
          }
          break;
      }

      var n = 0;
      var sizeAttr = new Float32Array(PARTICLE_COUNT);
      var idAttr = new Float32Array(PARTICLE_COUNT);
      var colorAttr = new Float32Array(PARTICLE_COUNT);
      var isSelectedAttr = new Float32Array(PARTICLE_COUNT);
      for (var j = 0; j < sizeAttr.length; j++) {
        sizeAttr[j] = (30 + 20 * Math.random()) * ratio;
        idAttr[j] = i * PARTICLE_COUNT + j;
        colorAttr[j] = 0.0;
        isSelectedAttr[j] = 0.0;
      }

      pointParams.geometry.addAttribute(
        "position",
        new THREE.BufferAttribute(positionAttr, 3)
      );
      pointParams.geometry.addAttribute(
        "indexP",
        new THREE.BufferAttribute(idAttr, 1)
      );
      pointParams.geometry.addAttribute(
        "size",
        new THREE.BufferAttribute(sizeAttr, 1)
      );
      pointParams.geometry.addAttribute(
        "colorAttr",
        new THREE.BufferAttribute(colorAttr, 1)
      );
      pointParams.geometry.addAttribute(
        "isSelected",
        new THREE.BufferAttribute(isSelectedAttr, 1)
      );
      pointMaterial = new THREE.ShaderMaterial({
        uniforms: pointParams.uniforms,
        attributes: pointParams.attributes,
        vertexShader: document.getElementById("vertexshader").textContent,
        fragmentShader: document.getElementById("stdshader").textContent,
        transparent: true,
        alphaTest: 0.2,
        depthTest: false
      });
      var pointParticles = new THREE.PointCloud(
        pointParams.geometry,
        pointMaterial
      );
      pointParticles.sortParticles = false;
      pointParticles.particleId = i;
      scene.add(pointParticles);
      pointClouds.push(pointParticles);
      var group = new THREE.Group();
      for (
        var index = 0, id = 0;
        index < positionAttr.length;
        index += 3, id++
      ) {
        var isR = 0.0,
          isG = 0.0,
          isB = 0.0;
        if (i % 3 == 0) {
          if (id < 6) {
            isR = 1;
            if (id > 3) {
              isG = 1;
              isB = 1;
            }
          } else {
            isG = 1;
            isB = 1;
          }
        } else if (i % 3 == 1) {
          if (id < 6) {
            isG = 1;
            if (id > 3) {
              isR = 1;
              isB = 1;
            }
          } else {
            isR = 1;
            isB = 1;
          }
        } else if (i % 3 == 2) {
          if (id < 6) {
            isB = 1;
            if (id > 3) {
              isG = 1;
              isR = 1;
            }
          } else {
            isG = 1;
            isR = 1;
          }
        }
        var spr = new THREE.CustomSprite(
          id + i * PARTICLE_COUNT,
          textura,
          isR,
          isG,
          isB
        );
        //spr.scale.set(192, 192, 1);
        spr.position.set(
          positionAttr[index + 0],
          positionAttr[index + 1],
          positionAttr[index + 2]
        );
        group.add(spr);
      }
      scene.add(group);
      textGroup.push(group);
      window.pointParticles = pointClouds;
    }
  }

  function generateBackClouds() {
    /// <summary>
    /// Generation of passive point clouds
    /// </summary>
    /// <returns type=""></returns>
    for (var i = 0; i < 3; i++) {
      console.log(i);
      var geometry = new THREE.Geometry();
      var material = new THREE.PointCloudMaterial({
        size: Math.random() * 30 + 40,
        color: new THREE.Color(0xffffff),
        map: THREE.ImageUtils.loadTexture("/imgs/disc.png"),
        transparent: true,
        alphaTest: 0.05,
        opacity: 0.05
      });
      for (var j = 0; j < 30; j++) {
        //var radius=700*Math.random()/2;
        var radius = 350 * 2;
        var vertex = new THREE.Vector3();
        // vertex.x=Math.random()*700-350;
        // vertex.y=Math.random()*700-350;
        var u = Math.random() * Math.PI * 2;
        var fi = Math.random() * Math.PI;
        var r = 700 / 2 - (Math.random() * 700) / 2;
        if (r < (0.2 * 700) / 2) r = 700 / 2 - r;
        vertex.x = r * Math.cos(u) * Math.sin(fi);
        vertex.y = r * Math.sin(u) * Math.sin(fi);
        vertex.z = r * Math.cos(fi);
        geometry.vertices.push(vertex);
      }
      var cloud = new THREE.PointCloud(geometry, material);
      backPointClouds.push(cloud);
      scene.add(cloud);
    }
  }
  var vent;
  function initialize(params) {
    /// <summary>
    /// Canvas initialization, object generations are done here
    /// </summary>
    vent = params.vent;
    raycaster = new THREE.Raycaster();
    container = document.createElement("div");
    container.className = "background-wrap";
    document.getElementById("background-container").appendChild(container);
    clock = new THREE.Clock();
    camera = new THREE.OrthographicCamera(
      -window.innerWidth / 2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      1,
      3000
    );
    window.zoomIn = function() {
      new TWEEN.Tween({
        zoom: 1.0,
        opacity: 1.0
      })
        .to(
          {
            zoom: 10.0,
            opacity: 0.0
          },
          700
        )
        .onUpdate(function() {
          container.style.opacity = this.opacity;
          camera.zoom = this.zoom;
          camera.updateProjectionMatrix();
        })
        .start();
    };
    window.zoomOut = function() {
      new TWEEN.Tween({
        zoom: 10.0,
        opacity: 0.0
      })
        .to(
          {
            zoom: 1.0,
            opacity: 1.0
          },
          700
        )
        .onUpdate(function() {
          container.style.opacity = this.opacity;
          camera.zoom = this.zoom;
          camera.updateProjectionMatrix();
        })
        .start();
    };
    camera.position.z = +1000;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xefd1b5, 0.0025);
    setRadius();
    generateFrontClouds();
    generateBackClouds();
    renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    //renderer.state.setBlending(THREE.NormalBlending);
    renderer.setClearColor(0x000000, 0);
    renderer.sortObjects = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
      window.innerWidth * (ratio >= 2 ? 1 : 2),
      window.innerHeight * (ratio >= 2 ? 1 : 2)
    );
    window.renderer = renderer;
    window.scene = scene;
    container.appendChild(renderer.domElement);
    container.firstChild.style.width = window.innerWidth + "px";
    container.firstChild.style.height = window.innerHeight + "px";
    camera.lookAt(scene.position);
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    hangar.initialize({ renderer: renderer, vent: vent });
    window.addEventListener("resize", hangar.onWindowResize, false);
  }

  function drawDebugCircles() {
    /// <summary>
    /// Draws three circle to show that everything is allright
    /// </summary>
    var asphereg = new THREE.SphereGeometry(radius, 100, 100);
    var sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });
    asphereObject = new THREE.Mesh(asphereg, sphereMaterial);
    asphereObject.position.x = (radius * 1.73) / 3; // 173;
    asphereObject.position.y = -radius / 3; // -100;
    scene.add(asphereObject);
    asphereObject = new THREE.Mesh(asphereg, sphereMaterial);
    asphereObject.position.y = (radius * 2) / 3; // 200;
    scene.add(asphereObject);
    asphereObject = new THREE.Mesh(asphereg, sphereMaterial);
    asphereObject.position.x = (-radius * 1.73) / 3; // -173;
    asphereObject.position.y = -radius / 3; //-100;
    scene.add(asphereObject);
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    setRadius();
  }

  function onDocumentMouseMove(event) {
    event.preventDefault();
    var mouseX = event.clientX - windowHalfX;
    var mouseY = event.clientY - windowHalfY;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.X = mouseX;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse.Y = mouseY;
    mouse.clientX = event.clientX;
    mouse.clientY = event.clientY;
  }

  function getInFloat(x, y) {
    /// <summary>
    /// Helper function to transform circle coordinates to float -1 to 1
    /// </summary>
    /// <param name="x">x coeff</param>
    /// <param name="y">y coeff</param>
    var x = (x / window.innerWidth) * 2 - 1;
    var y = -(y / window.innerHeight) * 2 + 1;
    return new THREE.Vector2(x, y);
  }

  function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
      event.preventDefault();

      mouseX = event.touches[0].pageX - windowHalfX;
      mouseY = event.touches[0].pageY - windowHalfY;
    }
  }

  function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
      event.preventDefault();

      mouseX = event.touches[0].pageX - windowHalfX;
      mouseY = event.touches[0].pageY - windowHalfY;
    }
  }

  render = function() {
    /// <summary>
    /// Render function mock to override can be set to hangar or particleCloud
    /// </summary>
    /// <returns type=""></returns>
  };

  function animate() {
    if (disabled) return;
    render();
    TWEEN.update();
    requestAnimationFrame(animate);
  }

  function setPointsColor(circleId) {
    /// <summary>
    /// Function used to check for intersections and painting particles in R , G or B colors
    /// </summary>
    /// <param name="circleId">id of the circle meaning RGB</param>
    var center;
    var who;
    if (circleId == 1) {
      //console.log("R");
      center = centerR;
      who = 1.0;
    } else if (circleId == 2) {
      //console.log("G");
      center = centerG;
      who = 2.0;
    } else if (circleId == 3) {
      //console.log("B");
      center = centerB;
      who = 4.0;
    }
    raycaster.params.PointCloud.threshold = RADIUS;
    var point = getInFloat(center.x, center.y);
    raycaster.setFromCamera(point, camera);
    var obj = raycaster.intersectObjects(pointClouds);
    if (obj.length != 0) {
      for (var i = 0; i < obj.length; i++) {
        var object = textGroup[obj[i].object.particleId].children[obj[i].index];
        var toBePainted = false;
        switch (circleId) {
          case 1:
            toBePainted = object.isR == 1 ? true : false;
            break;
          case 2:
            toBePainted = object.isG == 1 ? true : false;
            break;
          case 3:
            toBePainted = object.isB == 1 ? true : false;
            break;
        }
        if (toBePainted) {
          object.visible = true;
          var z = obj[i].point.z;
          //pointClouds[obj[i].object.particleId].geometry.vertices.isSelected.array obj[i].index
          //if (minZ > z) minZ = z;
          //if (maxZ < z) maxZ = z;
          if (object != lastParticle.textObj) {
            //object.setOpacity(0.2 + ((z + 180) / 360.0)*0.5);
            object.setOpacity(0.4);
          }
          obj[i].object.geometry.attributes.colorAttr.array[obj[i].index] = who;
          obj[i].object.geometry.attributes.colorAttr.needsUpdate = true;
          //pointClouds[obj[i].object.particleId].geometry.attributes.isSelected.array obj[i].index
        }
      }
    }
  }

  function animateBackPointClouds() {
    /// <summary>
    /// Slow rotation of passive pointClouds
    /// </summary>
    /// <returns type=""></returns>
    for (var i = 0; i < backPointClouds.length; i++)
      backPointClouds[i].rotateOnAxis(
        rotateAxises[i],
        0.0013 * (i % 2 == 0 ? -1 : 1)
      );
  }

  function animatePointClouds() {
    /// <summary>
    /// Slow rotation of active pointClouds
    /// </summary>
    /// <returns type=""></returns>
    for (var i = 0; i < pointClouds.length; i++) {
      var speed = rotationSpeed.value;
      pointClouds[i].rotateOnAxis(rotateAxises[i % 3], i < 3 ? speed : -speed);
      textGroup[i].rotateOnAxis(rotateAxises[i % 3], i < 3 ? speed : -speed);
    }
  }

  function renderParticles() {
    /// <summary>
    /// Rendering particle systems regarding mouse position etc.
    /// </summary>
    /// <returns type=""></returns>
    animateBackPointClouds();
    animatePointClouds();
    for (var i = 0; i < pointClouds.length; i++) {
      var cloud = pointClouds[i];
      if (cloud.material.uniforms.RGB.value != RGB) {
        cloud.material.uniforms.RGB.value = RGB;
        cloud.material.uniforms.RGB.needsUpdate = true;
      }
    }
    var time = Date.now() * 0.00005;
    // document.querySelector("#graphy").style.visibility = "hidden";
    var upd = false;
    //camera.position.x += ( mouseX - camera.position.x ) * 1.545;
    // camera.position.y += ( - mouseY - camera.position.y ) * 1.545;
    if (window.RGB == 0) {
      rotationSpeed.resume();
      for (var i = 0; i < pointClouds.length; i++) {
        textGroup[i].visible = false;
        for (var j = 0; j < PARTICLE_COUNT; j++) {
          pointClouds[i].geometry.attributes.colorAttr.array[j] = 0.0;
        }
        pointClouds[i].geometry.attributes.colorAttr.needsUpdate = true;
      }
    } else if (window.RGB == 7) {
      rotationSpeed.pause();
      for (var i = 0; i < pointClouds.length; i++) {
        textGroup[i].visible = false;
        for (var j = 0; j < PARTICLE_COUNT; j++) {
          pointClouds[i].geometry.attributes.colorAttr.array[j] = 0.0;
        }
        pointClouds[i].geometry.attributes.colorAttr.needsUpdate = true;
      }
    } else {
      rotationSpeed.pause();
      for (var i = 0; i < textGroup.length; i++) {
        textGroup[i].visible = true;
      }
      for (var i = 0; i < textGroup.length; i++) {
        for (var j = 0; j < textGroup[i].children.length; j++) {
          textGroup[i].children[j].visible = false;
        }
      }
      ///R
      if (RGB & (1 << 0)) {
        setPointsColor(1);
      }
      ///G
      if (RGB & (1 << 1)) {
        setPointsColor(2);
      }
      if (RGB & (1 << 2)) {
        setPointsColor(3);
      }
      raycaster.params.PointCloud.threshold = 4.0 * 2;
      raycaster.setFromCamera(mouse, camera);
      var intersects = raycaster.intersectObjects(pointParticles);
      if (intersects.length != 0) {
        ///checking whether particle is selected on previous loop
        if (
          !(
            intersects[0].index == lastParticle.index &&
            intersects[0].object.particleId == lastParticle.particleId
          )
        ) {
          if (Object.keys(lastParticle).length != 0) {
            lastParticle.textObj.material.uniforms.color.value = new THREE.Color(
              0xffffff
            );
            pointClouds[
              lastParticle.particleId
            ].geometry.attributes.isSelected.array[lastParticle.index] = 0.0;
            pointClouds[
              lastParticle.particleId
            ].geometry.attributes.isSelected.needsUpdate = true;
          }
          var textObj =
            textGroup[intersects[0].object.particleId].children[
              intersects[0].index
            ];
          //textObj.material.uniforms.color.value = new THREE.Color(0x000000);
          {
            ///Set selected element id
            textObj.setOpacity(1.0);
            selectedItem.index =
              intersects[0].object.particleId * PARTICLE_COUNT +
              intersects[0].index;
            selectedItem.position.x = mouse.clientX;
            selectedItem.position.y = mouse.clientY;
            selectedItem.isSelected = true;
          }
          intersects[0].object.geometry.attributes.isSelected.array[
            intersects[0].index
          ] = 1.0;
          intersects[0].object.geometry.attributes.isSelected.needsUpdate = true;
          lastParticle.index = intersects[0].index;
          lastParticle.particleId = intersects[0].object.particleId;
          lastParticle.textObj = textObj;
        }
      } else {
        ///check if not first initialization
        if (Object.keys(lastParticle).length != 0) {
          lastParticle.textObj.material.uniforms.color.value = new THREE.Color(
            0xffffff
          );
          pointClouds[
            lastParticle.particleId
          ].geometry.attributes.isSelected.array[lastParticle.index] = 0.0;
          pointClouds[
            lastParticle.particleId
          ].geometry.attributes.isSelected.needsUpdate = true;
          lastParticle.textObj = null;
          lastParticle = {};
        }
        selectedItem.isSelected = false;
      }
    }
    renderer.render(scene, camera);
    // !!! EMA-E aitpaisyn ba tigilip otyrm nege dep
    //                      |
    //                      v
    //document.querySelector('#logo').style.visibility = "hidden";
    //document.querySelector('#bg-logo').style.visibility = "hidden";
  }

  function makeTextSprite(message, parameters) {
    /// <summary>
    /// Helper function to get Text texture
    /// </summary>
    /// <param name="message">Text</param>
    /// <param name="parameters">Font parameters</param>
    /// <returns type=""></returns>
    if (parameters === undefined) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface")
      ? parameters["fontface"]
      : "Segoe UI Light";
    var fontsize = parameters.hasOwnProperty("fontsize")
      ? parameters["fontsize"]
      : 30;
    var borderThickness = parameters.hasOwnProperty("borderThickness")
      ? parameters["borderThickness"]
      : 4;
    var borderColor = parameters.hasOwnProperty("borderColor")
      ? parameters["borderColor"]
      : {
          r: 255,
          g: 255,
          b: 255,
          a: 1.0
        };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor")
      ? parameters["backgroundColor"]
      : {
          r: 0,
          g: 0,
          b: 0,
          a: 1.0
        };
    // var spriteAlignment = THREE.SpriteAlignment.topLeft;
    var canvas = document.createElement("canvas");
    canvas.width = (128 * 8) / 2;
    canvas.height = (128 * 32) / 2;
    var context = canvas.getContext("2d");
    fontsize = (18 * 0.8 * 4 * 0.9) / 2;
    context.font = fontsize + "px " + fontface;
    // get size data (height depends only on font size)
    var grd = context.createLinearGradient(0, 0, 128 * 4, 0);
    grd.addColorStop(0, "rgba(0,0,160,0.15)");
    grd.addColorStop(1, "rgba(180,0,0,0.15)");
    //context.fillStyle = "rgba(0, 0, 160, 0.15)";
    context.fillStyle = grd;
    //context.fillRect(0, 0, 128 * 4, 128 * 64);

    //context.translate(64 * 8 + 40 / 2, 64 * 8 - fontsize * 0.70);
    context.fillStyle =
      "rgba(" + backgroundColor.r + "," + backgroundColor.g + ",";
    // // border color
    context.strokeStyle =
      "rgba(" +
      borderColor.r +
      "," +
      borderColor.g +
      "," +
      borderColor.b +
      "," +
      borderColor.a +
      ")";
    context.lineWidth = borderThickness;
    context.fillStyle = "rgba(255, 255, 255, 1.0)";
    context.translate(40 / 2, 0);
    for (var i = 0; i < 64; i++) {
      context.fillText(
        message + i,
        borderThickness,
        fontsize + borderThickness
      );
      context.translate(0, 64 / 2 /* - fontsize * 0.70*/);
    }
    console.info(canvas.toDataURL("image/png"));
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function enable(mode) {
    /// <summary>
    /// Enables rendering of canvas
    /// </summary>
    /// <param name="mode">Mode hangar or particles</param>
    /// <returns type=""></returns>
    disabled = true;
    setTimeout(function() {
      disabled = false;
      if (mode == "hangar") render = hangar.renderHangar;
      else if (mode == "particles") render = renderParticles;
      animate();
    }, 100);
  }

  function disable() {
    disabled = true;
  }
  function getSelectedPoint() {
    if (!selectedItem.isSelected) return null;
    return selectedItem;
  }
  function switchTo(from, to) {
    /// <summary>
    /// Function handling whether to show hangar or canvas
    /// </summary>
    /// <param name="from">From scene</param>
    /// <param name="to">To scene</param>
    /// <returns type=""></returns>
    if (from == 4 || to == 4 || from == 2 || to == 2) {
      console.log("%c " + from + " " + to, "background: #222; color: #bada55");
      if (to == 2) {
        enable("particles");
        hangar.hide("down");
      } else if (to == 4) {
        disable();
        enable("hangar");
        hangar.show("down");
      }
    }
  }

  return {
    initialize: initialize,
    switchTo: switchTo,
    getSelected: getSelectedPoint
  };
});
