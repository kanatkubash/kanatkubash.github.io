define( ["snapsvg", "jquery", "backbone"],
function( Snap, $, Backbone ) {

	var
    centreX = window.innerWidth/2,
    centreY = window.innerHeight/2,


    curCircleAnim = null,

    s = Snap('#svg').attr({
    	viewBox : "0 0 " + window.innerWidth + " "+window.innerHeight
    }),

    bgs = Snap('#bgsvg').attr({
    	viewBox : "0 0 " + window.innerWidth + " "+window.innerHeight
    }),



    cradius = window.innerWidth/9.3,
    radius = cradius+5,

		svg_is = {
			scene: 's'+(cradius*1.22)/200+',T'+(centreX-80)+','+(centreY-100)

		},

		group_disk = {
			scene: 's'+(cradius*1.22)/200+',T'+(centreX)+','+(centreY)
		}
		;


		window.ssnap = s;

		var vbox = {
			left: 0,
			top: 0,
			width: window.innerWidth,
			height: window.innerHeight
		};

	var circlesRGB = {

		radius: window.innerWidth/9.3,
    oradius: window.innerWidth/9.3+5,

        group: null,

		red : {
			path: "",
	    	arc: s.path(this.path),
	    	overarc: s.path(this.path)
		},

		blue: {
			path: "",
	    	arc: s.path(this.path),
	    	overarc: s.path(this.path)
		},

		green: {
			path: "",
	    	arc: s.path(this.path),
	    	overarc: s.path(this.path)
		},

		circleAttr: {
			'fill-opacity': 0,
		    stroke: '#ffffff',
		    'stroke-opacity': .6,
		    strokeWidth: 1,
		    'class': 'outer-circle',
		    'pointer-events': 'painted'
		},

		circleArcAttr: {
			stroke: '#ffffff',
			fill: 'none',
			'fill-opacity': 0,
			strokeDasharray: 1,
			strokeWidth: 4,
			'stroke-opacity': .3,
			'class': 'dash-circle'
		},

		show: function(){
			if(this.group){
				this.group.addClass('active');
			}
		},

		hide: function(){
			if(this.group){
				this.group.removeClass('active');
			}
		},

		init: function(){
			this.red.x = centreX; this.red.y = centreY-((this.radius)/1.56);
			this.green.x = centreX-((this.radius)/1.64); this.green.y = centreY+((this.radius)/2.36);
			this.blue.x = centreX+((this.radius)/1.64); this.blue.y = centreY+((this.radius)/2.36);

			this.red.outer = s.circle(this.red.x, this.red.y, circlesRGB.radius).attr(this.circleAttr).mousemove(moveHandler).mouseout(moveHandler);
			this.green.outer = s.circle(this.green.x, this.green.y, circlesRGB.radius).attr(this.circleAttr).mousemove(moveHandler).mouseout(moveHandler);
			this.blue.outer = s.circle(this.blue.x, this.blue.y, circlesRGB.radius).attr(this.circleAttr).mousemove(moveHandler).mouseout(moveHandler);

			this.group = s.group(this.red.arc, this.green.arc, this.blue.arc, this.red.outer, this.green.outer, this.blue.outer).attr({id: "circlesRGB"});
		},

		resize: function(vb){
			// centreX = window.innerWidth/2;
			// centreY = window.innerHeight/2;
			// this.radius = window.innerWidth/9.3;
	    // this.oradius = window.innerWidth/9.3+5;
			// this.init();


			s.attr({
	    	//viewBox : "0 0 " + (vbox.width-(window.innerWidth-vbox.width)) + " " + (vbox.height-(window.innerHeight-vbox.height))
				//viewBox : "0 0 " + window.innerWidth + " " + window.innerHeight
				viewBox: ((vb) ? vb : ('0 0 '+vbox.width+' '+vbox.height))
			});
			//
			// vbox.width = window.innerWidth;
			// vbox.height = window.innerHeight;
			return ((vb) ? vb : ('0 0 '+vbox.width+' '+vbox.height));

		}
	};

	circlesRGB.init();

	window.shell = {

		cc : {      //CREATIVE CONCEPTS

			title: "Cretive Concepts",

			section: {
				bi : {  // BRanding & identity
					name: "branding-identity"
				},

				ui : {  // User Interface
					name: "user-interface"
				},

				cd : { // Circuit Design
					name: "circuit-design"
				},

				ii : { // Illustration & Infographics
					name: "illustration-infographics"
				},

				td: {  // (three)3D modelling
					name: "threeD-modelling"
				}
			},



			scene: [],
			needToDisplay: [false],

			display: function(zoom){
				console.log('display', this.title);

				if(!this.group){this.needToDisplay = [true, zoom]; return}  // Ajax-ka delegate etemiz
				this.needToDisplay = [false];

				this.group.attr({'display': ''});

				if(zoom){
					this.group.transform(this.scene[0]);
					this.group.animate({transform: this.scene[1]}, 500, function() {});
				}else{
					this.group.transform(this.scene[1]);
				}


				this.animationRing2 = this.animateRing2(0);
				this.animationRing3 = this.animateRing3(0);


			},

			conceal: function(zoom){
				var self = this;

				if(zoom){
					this.group.animate({transform: this.scene[0]}, 500, function() {
						self.group.attr({'display': 'none'});
					});
				}else{
					this.group.attr({'display': 'none'});
					this.group.transform(this.scene[0]);
				}


				// this.animationRing1.stop();
				this.animationRing2.stop();
				this.animationRing3.stop();
			},

			animateRing1: function(v){
				// var newSpeed = v === 360 ? 0 : 360;
				// var self = this;
				// this.ring2.animate({transform: 'r360,400,300'}, 12000, function() {
				// 	self.ring2.transform('r0,400,300');
				// 	self.animateRing(newSpeed);
				// });
			},


			animateRing2: function(v){
				var newSpeed = v === 360 ? 0 : 360;
				var self = this;

				return this.ring2.animate({transform: 'r360,512,384'}, 12000, function() {
					self.ring2.transform('r0,512,384');
					self.animateRing2(newSpeed);
				});
			},

			animateRing3: function(v){
				var newSpeed = v === 360 ? 0 : 360;
				var self = this;
				return this.ring3.animate({transform: 'r-360,512,384'}, 90000, function() {
					self.ring3.transform('r0,512,384');
					self.animateRing3(newSpeed);
				});
			},

		},

		cs : {    // CORPORATE SYSTEMS

			title: "Corporate Systems",

			section:{
				is: { // Information Systems
					name: "information-systems"
				},

				cn: { // Corporate networks
					name: "corporate-networks"
				},

				pt: { // Payment Terminals
					name: "payment-terminals"
				},

				cv: { // Computer Vision
					name: "computer-vision"
				},
			},


			scene: [],
			needToDisplay: [false],

			display: function(zoom){
				console.log('display', this.title);

				if(!this.group){this.needToDisplay = [true, zoom]; return}
				this.needToDisplay = [false];

				this.group.attr({'display': ''});

				if(zoom){
					this.group.transform(this.scene[0]);
					this.group.animate({transform: this.scene[1]}, 500, function() {});
				}else{
					this.group.transform(this.scene[1]);
				}

			},

			conceal: function(zoom){
				var self = this;

				if(zoom){
					this.group.animate({transform: this.scene[0]}, 500, function() {
						self.group.attr({'display': 'none'});
					});
				}else{
					this.group.attr({'display': 'none'});
					this.group.transform(this.scene[0]);
				}

			},

		},

		mw : {    // MOBILE & WEB

			title: "Mobile & Web apps",

			section: {
				cm: { // Content Management system
					name: "content-management"
				},

				ad: { // crossbrouser & Adapdive Design
					name: "adaptive-design"
				},

				ec: { // E-Commerce
					name: "electronic-commerce"
				},

				nm: { // Native Mobile apps
					name: "native-mobile"
				},

				ia: { // Information Architecture
					name: "information-architecture"
				},
			},



			scene: [],
			needToDisplay: [false],


			display: function(zoom){
				console.log('display', this.title);

				if(!this.group){this.needToDisplay = [true, zoom]; return}
				this.needToDisplay = [false];

				this.group.attr({'display': ''});

				if(zoom){
					this.group.transform(this.scene[0]);
					this.group.animate({transform: this.scene[1]}, 500, function() {});
				}else{
					this.group.transform(this.scene[1]);
				}

			},

			conceal: function(zoom){
				var self = this;

				if(zoom){
					this.group.animate({transform: this.scene[0]}, 500, function() {
						self.group.attr({'display': 'none'});
					});
				}else{
					this.group.attr({'display': 'none'});
					this.group.transform(this.scene[0]);
				}

			},


		},

		ee : {
			title: "Electronic Engineering",

			section: {
				hw: { // HardWare
					name: "hard-ware"
				},

				sw: { // Software
					name: "soft-ware"
				},

				pd: { // Platform Design
					name: "platform-design"
				},

				id: { // Industrial Design
					name: "industrial-design"
				},
			},

			scene: [],
			needToDisplay: [false],

			display: function(zoom){
				console.log('display', this.title);

				if(!this.group){this.needToDisplay = [true, zoom]; return}
				this.needToDisplay = [false];

				this.group.attr({'display': ''});

				if(zoom){
					this.group.transform(this.scene[0]);
					this.group.animate({transform: this.scene[1]}, 500, function() {});
				}else{
					this.group.transform(this.scene[1]);
				}

			},

			conceal: function(zoom){
				var self = this;

				if(zoom){
					this.group.animate({transform: this.scene[0]}, 500, function() {
						self.group.attr({'display': 'none'});
					});
				}else{
					this.group.attr({'display': 'none'});
					this.group.transform(this.scene[0]);
				}

			},
		},

		dm : {

			title: "Digital Marketing",

			section: {
				seo: { // HardWare
					name: "search-engine-optimization"
				},

				smm: { // Software
					name: "social-media-marketing"
				},

				smo: { // Platform Design
					name: "social-media-optimization"
				},
			},



			scene: [],
			needToDisplay: [false],


			display: function(zoom){
				console.log('display', this.title);

				if(!this.group){this.needToDisplay = [true, zoom]; return}
				this.needToDisplay = [false];

				this.group.attr({'display': ''});

				if(zoom){
					this.group.transform(this.scene[0]);
					this.group.animate({transform: this.scene[1]}, 500, function() {});
				}else{
					this.group.transform(this.scene[1]);
				}

			},

			conceal: function(zoom){
				var self = this;

				if(zoom){
					this.group.animate({transform: this.scene[0]}, 500, function() {
						self.group.attr({'display': 'none'});
					});
				}else{
					this.group.attr({'display': 'none'});
					this.group.transform(this.scene[0]);
				}

			},

		},

		scene: 's'+(cradius*1.22)/200+',T'+(centreX)+','+(centreY),

		pointItems: [],
		pointItemMasks: [],

		group: null,

		needInit: [false],

		style: {
			stroke: '#ffffff',
			fill: 'none',
			'fill-opacity': 0,

			strokeWidth: 1,
			'stroke-opacity': .3,

		},

		pointItemShow: function(e){
			//console.log('pointitem',e.target.parentElement);

			if(e.target.parentElement.getAttribute('data-href'))

			Backbone.history.navigate(e.target.parentElement.getAttribute('data-href'), true);
		},

		show: function(){

			// var self = this;

			function setDelays(i) {
			  	setTimeout(function(){
					window.shell.animateItem(i)
					clearTimeout(window.shell.pointItems[i].timer);
				}, i*20+100);
			};


			if(this.group) {
				this.group.attr({'display': ''});
				// this.animatePointItems(4);

				for (var i = 0; i < this.pointItems.length; i++) {
					this.pointItems[i].timer = setDelays(i);
				};

				if(this.service) {
					this[this.service].display();
				} else {
					this[this.service]
				}


				// self.animateItem(0);
			}
		},

		hide: function(){
			if(this.group) this.group.attr({'display': 'none'});

			if(this.service && this[this.service].group){
				console.info('hide',this.group,this.service);
				this[this.service].conceal(true);
				this.service = null;
			}


		},


		pointItemOver: function(){
			console.log('point-item-over');
		},

		pointItemOut: function(){
			console.log('point-item-out');
		},


		load: function(){
			var self = this;
			Snap.load("/vector/shell.svg", function(f){
				self.group      = f.select('#shell').attr({'display': 'none', 'class': 'shell'});

				self.pointItems[0] = f.select('#shell_point_items_0').attr({
					class: 'point-item',
					'data-main': '1',
					'pointer-events': 'painted'
				}).click(self.pointItemShow);

				self.pointItems[0].select('circle').attr({'pointer-events': 'none'});


				self.pointItemMasks[0]  = f.select('#shell_point_item_masks_0').attr({class: 'point-item-mask', 'data-main': '1'});
				self.path       = f.select('#shell_outline');
				self.mask       = f.select('#shell_mask');


				self.group.transform('s0.9,512,384'+'t'+(centreX - self.path.attr('cx'))+','+(centreY - self.path.attr('cy')));

				s.append(self.group);

				if (self.needInit[0]) self.init(self.needInit[1], self.needInit[2]);

			});

			Snap.load("/imgs/cc.svg", function(f){
				self.cc.group      = f.select('#cc').attr({'display': 'none'});

				self.cc.ring1      = f.select('#cc_ring1');
				self.cc.ring2      = f.select('#cc_ring2');
				self.cc.ring3      = f.select('#cc_ring3');

				self.cc.scene[0] = 's0.3,512,384'+'T'+(centreX - parseInt(self.cc.ring3.attr('cx')))+','+(centreY - parseInt(self.cc.ring3.attr('cy')));
				self.cc.scene[1] = 's0.9,512,384'+'T'+(centreX - parseInt(self.cc.ring3.attr('cx')))+','+(centreY - parseInt(self.cc.ring3.attr('cy')))
				self.cc.group.transform(self.scene[0]);

				s.append(self.cc.group);

				// shell.animateRing2();
				// shell.animateRing3();
				//self.animatePointItems(4);
				// self.init();
				if (self.cc.needToDisplay[0]) self.cc.display(self.cc.needToDisplay[1]);
			});

			Snap.load("/imgs/cs.svg", function(f){
				self.cs.group      = f.select('#cs').attr({'display': 'none'});
				self.cs.path       = f.select('#cs_path');



				self.cs.scene[0] = 's0.3,512,384'+'T'+(centreX - parseInt(self.cs.path.attr('cx')))+','+(centreY - parseInt(self.cs.path.attr('cy')));
				self.cs.scene[1] = 's0.9,512,384'+'T'+(centreX - parseInt(self.cs.path.attr('cx')))+','+(centreY - parseInt(self.cs.path.attr('cy')))
				self.cs.group.transform(self.scene[0]);

				s.append(self.cs.group);
				if (self.cs.needToDisplay[0]) self.cs.display(self.cs.needToDisplay[1]);
			});

			Snap.load("/imgs/cs.svg", function(f){
				self.mw.group      = f.select('#cs').attr({'display': 'none'});
				self.mw.path       = f.select('#cs_path');

				self.mw.scene[0] = 's0.3,512,384'+'T'+(centreX - parseInt(self.mw.path.attr('cx')))+','+(centreY - parseInt(self.mw.path.attr('cy')));
				self.mw.scene[1] = 's0.9,512,384'+'T'+(centreX - parseInt(self.mw.path.attr('cx')))+','+(centreY - parseInt(self.mw.path.attr('cy')))
				self.mw.group.transform(self.scene[0]);

				s.append(self.mw.group);
				if (self.mw.needToDisplay[0]) self.mw.display(self.mw.needToDisplay[1]);

			});

			Snap.load("/imgs/cs.svg", function(f){
				self.ee.group      = f.select('#cs').attr({'display': 'none'});
				self.ee.path       = f.select('#cs_path');

				self.ee.scene[0] = 's0.3,512,384'+'T'+(centreX - parseInt(self.ee.path.attr('cx')))+','+(centreY - parseInt(self.ee.path.attr('cy')));
				self.ee.scene[1] = 's0.9,512,384'+'T'+(centreX - parseInt(self.ee.path.attr('cx')))+','+(centreY - parseInt(self.ee.path.attr('cy')))
				self.ee.group.transform(self.scene[0]);

				s.append(self.ee.group);
				if (self.ee.needToDisplay[0]) self.ee.display(self.ee.needToDisplay[1]);

			});

			Snap.load("/imgs/cs.svg", function(f){
				self.dm.group      = f.select('#cs').attr({'display': 'none'});
				self.dm.path       = f.select('#cs_path');

				self.dm.scene[0] = 's0.3,512,384'+'T'+(centreX - parseInt(self.dm.path.attr('cx')))+','+(centreY - parseInt(self.dm.path.attr('cy')));
				self.dm.scene[1] = 's0.9,512,384'+'T'+(centreX - parseInt(self.dm.path.attr('cx')))+','+(centreY - parseInt(self.dm.path.attr('cy')))
				self.dm.group.transform(self.scene[0]);

				s.append(self.dm.group);
				if (self.dm.needToDisplay[0]) self.dm.display(self.dm.needToDisplay[1]);


			});





		},




		animateItem: function(index){
			var self = this;

			var rangeAngle = 100;
			var startAngle = rangeAngle/2;
			var endAngle = -rangeAngle/2;

			var angle = endAngle+(rangeAngle*index/this.pointItems.length)+(rangeAngle/this.pointItems.length/2);
			var timing = 2000-(angle*2*index);



			var radius = parseInt(window.shell.path.attr('r'));

			this.pointItems[index].animation = Snap.animate(startAngle, angle, function(val){

				window.shell.pointItems[index].transform('t'+(radius*Math.cos(Math.PI*val/180))+','+(radius - radius*Math.sin(Math.PI*val/180)));
				window.shell.pointItemMasks[index].transform('t'+radius*Math.cos(Math.PI*val/180)+','+(radius - radius*Math.sin(Math.PI*val/180)));

			}, timing, mina.easeinout, function(){
				// self.pointItem.transform('r10,400,300');
				// self.pointItemMask.transform('r10,400,300');
				// self.animatePointItems(newSpeed);
			});
		},

		init: function(service, section){

			var self = this;


			// if(section && (section.split('-').length > 1)) return;


			if(!this.group) {this.needInit = [true, service, section]; return}
			this.needInit = [false];


			if((this.group.attr('display')=='inline') && (section)) return;
			else this.group.attr({'display': 'inline'});
			// this.animatePointItems(4);


			if(this.service) {
				this[this.service].conceal();
				this.service = service.split('-')[0][0]+service.split('-')[1][0];
				this[this.service].display();

			} else {
				this.service = service.split('-')[0][0]+service.split('-')[1][0];
				this[this.service].display(true);
			}

			//console.log(this[this.service].scene);
			// self.animateItem(0);




			for (var i = 0; i<this.pointItems.length; i++){
				clearTimeout(this.pointItems[i].timer);
				if(this.pointItems[i].animation) this.pointItems[i].animation.stop();
				if(this.pointItemMasks[i].animation) this.pointItemMasks[i].animation.stop();
			}


			$('#shell .point-item[data-main=0]').remove();
			$('#shell .point-item-mask[data-main=0]').remove();
			$('#shell .point-item[data-main=1] .shell-point-text').remove();

			this.pointItems = [this.pointItems[0]];
			this.pointItemMasks = [this.pointItemMasks[0]];

			console.info('init', this.service);
			var sectionItems = Object.keys(this[this.service].section)


			for (var i = 0; i < sectionItems.length; i++) {

				if(i!=0){


					this.pointItems[i] = this.pointItems[0].clone().attr({
						id: "shell_outer_point_"+i,
						'data-main': '0',
						'data-href': '/services/'+service+'/'+this[this.service].section[sectionItems[i]].name
					}).click(this.pointItemShow);


					// this.pointItemMasks[i] = this.pointItemMasks[0].clone().attr({
					// 	id: "shell_point_item_masks_"+i,
					// 	'data-main': '0'
					// });

					this.pointItemMasks[i] = s.circle(-512, -266, 20).attr({
						id: "shell_point_item_masks_"+i,
						class: "point-item-mask",
						'data-main': '0'
					}).appendTo(this.mask);



					this.pointItems[i].node.getElementsByClassName('shell-point-text')[0].innerHTML = this[this.service].section[sectionItems[i]].name;

				}

				else{
					var tx = parseInt(this.pointItems[i].node.children[0].getAttribute('cx'));
					var ty = parseInt(this.pointItems[i].node.children[0].getAttribute('cy'));


					this.pointItems[i].attr({
						'data-href': '/services/'+service+'/'+this[this.service].section[sectionItems[i]].name
					});

					this.pointItems[i].append(s.text(tx, ty, this[this.service].section[sectionItems[i]].name).attr({
						class: "shell-point-text",
					}).transform('t22,4'));

				}



				this.pointItems[i].timer = setDelays(i);

			};



			function setDelays(i) {
			  	setTimeout(function(){
			  		clearTimeout(window.shell.pointItems[i].timer);
					window.shell.animateItem(i)
				}, i*20+100);
			};






		}


	}


	var logo = {

		small: null,
		big: null,

		scene1: 's'+(cradius/1.33)/200+',T'+(centreX-100)+','+(centreY-100),
		scene2: 's'+(cradius/15)+',T'+(centreX-100)+','+(centreY-100),



		scene: [
			{ // NONE
				animation: {},
				attribute: {'display': 'none'},
				timing: 0,
			},
			{ // INDEX
				animation: {fill: "#444848", opacity: 1},
				attribute: {'display': 'block'},
				timing: 300
			},
			{ // SERVICE
				animation: {fill: "#ffffff", opacity: 1},
				attribute: {'display': 'block'},
				timing: 300
			},
			{ // PORTFOLIO
				animation: {fill: "#444848", opacity: 0},
				attribute: {'display': 'block'},
				timing: 300
			},
			{ // PROJECTS
				animation: {fill: "#444848", opacity: 1},
				attribute: {'display': 'block'},
				timing: 300
			},
			{ // CONTACTS
				animation: {fill: "#444848", opacity: 1},
				attribute: {'display': 'block'},
				timing: 300
			},
			{

			},
			{ // UNDER CONSTRUCT
				animation: {fill: "#ffffff", opacity: 1},
				attribute: {'display': 'block', transform: 's'+(cradius/2)/200+',T'+(centreX-100)+','+(centreY-100)},
				timing: 300
			},
		],

		sceneBig: [
			{
				attribute: {'display': 'none'},
				animation: {},
				timing: 300
			},
			{
				attribute: {'display': 'block'},
				animation: {transform: 's'+(cradius/1.33)/200+',T'+(centreX-100)+','+(centreY-100)},
				timing: 300
			},
			{
				attribute: {'display': 'block'},
				animation: {transform: 's'+(cradius/15)+',T'+(centreX-100)+','+(centreY-100)},
				timing: 300
			}
		],

		companyPane: function(){
			console.log('About Company');
		},

		load: function(){
			var self = this;
			Snap.load("/imgs/logo.svg", function (f) {
			    self.small = f.select("#logo").click(self.companyPane);
			    self.small.transform(self.sceneBig[1].animation.transform);
			    s.append(self.small);
			    self.big = self.small.clone().attr({id:'bg-logo', 'display': 'none', fill: '#ffffff', 'fill-opacity':0.1});
			    bgs.append(self.big);
			    if(typeof self.renderArgs == 'object') self.render(self.renderArgs[0], self.renderArgs[1], self.renderArgs[2]);
			});
		},

		render: function(index, pane, section){

			if(!this.big) {this.renderArgs = [index, pane, section]; return 0};
			console.log('SVG LOGO RENDER ', (this.big)?'re':'we');
			var sceneIndex = (!pane) ? index : 0;
			var scheneBigIndex = (pane) ? 2 : 1;

			this.small.animate(this.scene[sceneIndex].animation, this.scene[sceneIndex].timing);
			this.small.attr(this.scene[sceneIndex].attribute);

			if(index == 3){
					this.big.animate(this.sceneBig[scheneBigIndex].animation, this.sceneBig[scheneBigIndex].timing);
					this.big.attr(this.sceneBig[scheneBigIndex].attribute);
			} else{
				this.big.attr(this.sceneBig[0].attribute);
			}


		},

		// index: function(){
		// 	this.small.animate({fill: "#444848"},300);
		// 	if(!this.small.hasClass('active')) this.small.addClass('active');
		//
		// 	this.big.attr({fill: "#fff", 'display': 'none'});
		// },

		service: function(){
			// this.small.animate({fill: "#ffffff"},300);
			// if(!this.small.hasClass('active')) this.small.addClass('active');

			this.big.attr({'display': 'block'});
			this.big.animate({transform: this.scene1},300);
		},

		servicepane: function(){

			if(this.small.hasClass('active')) this.small.removeClass('active');

			this.big.attr({'display': 'block'});
			this.big.animate({transform: this.scene2},300);
		},

		company: function(){

		},

		portfolio: function(){
			if(this.small.hasClass('active')) this.small.removeClass('active');


			this.big.attr({'display': 'none'});
		},

		projects: function(){
			if(this.small.hasClass('active')) this.small.removeClass('active');

		},

		contacs: function(){
			if(this.small.hasClass('active')) this.small.removeClass('active');

		}
	}


	var lenc;


	console.info('>>>',(cradius/1.33));


	var vent;





	var Flags = {
		announce:function()
		{
			window.RGB=
			((this.r)?1:0)+
			((this.g)?2:0)+
			((this.b)?4:0);
		},
		r:false,
		g:false,
		b:false,
		setR:function(state)
		{
			if (this.r==state) return;
			this.r=state;
			this.announce();
			if (this.r)
			{
				this.rIn();
			}
			else
			{
				this.rOut();
			}
		},
		setG:function(state)
		{
			if (this.g==state) return;
			this.g=state;
			this.announce();
			if (this.g)
			{
				this.gIn();
			}
			else
			{
				this.gOut();
			}
		},
		setB:function(state)
		{
			if (this.b==state) return;
			this.b=state;
			this.announce();
			if (this.b)
			{
				this.bIn();
			}
			else
			{
				this.bOut();
			}
		},
		rOut:function()
		{
			circlesRGB.red.outer.animate({stroke: '#ffffff'}, 300);
		},
		rIn:function()
		{
			circlesRGB.red.outer.animate({stroke: '#ff5050'}, 300);
		},
		bOut:function()
		{
			circlesRGB.blue.outer.animate({stroke: '#ffffff'}, 300);
		},
		bIn:function()
		{
		    circlesRGB.blue.outer.animate({ stroke: '#4e95ff' }, 300);
		},
		gOut:function()
		{
			circlesRGB.green.outer.animate({stroke: '#ffffff'}, 300);
		},
		gIn:function()
		{
		    circlesRGB.green.outer.animate({ stroke: '#5fda5f' }, 300);
		},
	};
	Flags.announce();



	function moveHandler(e){
		var rdistance = Math.sqrt((circlesRGB.red.x - e.x)*(circlesRGB.red.x - e.x)+(circlesRGB.red.y-e.y)*(circlesRGB.red.y-e.y));
		var bdistance = Math.sqrt((circlesRGB.blue.x - e.x)*(circlesRGB.blue.x - e.x)+(circlesRGB.blue.y-e.y)*(circlesRGB.blue.y-e.y));
		var gdistance = Math.sqrt((circlesRGB.green.x - e.x)*(circlesRGB.green.x - e.x)+(circlesRGB.green.y-e.y)*(circlesRGB.green.y-e.y));
		if(rdistance<=circlesRGB.radius)
		{
			Flags.setR(true);
		}
		else
		{
			Flags.setR(false);
		}
		if(gdistance<=circlesRGB.radius)
        {
            Flags.setG(true);
        }
        else
        {
            Flags.setG(false);
        }
		if(bdistance<=circlesRGB.radius)
        {
            Flags.setB(true);
        } else {
            Flags.setB(false);
        }
		// if(hovercode!=oldhovercode){


		// 	if((oldhovercode==1) || (oldhovercode==3) || (oldhovercode==5)) { redCircle.outer.animate({stroke: '#ffffff'}, 300);}
		// 	if((oldhovercode==2) || (oldhovercode==3) || (oldhovercode==6)) { blueCircle.outer.animate({stroke: '#ffffff'}, 300);}
		// 	if((oldhovercode==4) || (oldhovercode==5) || (oldhovercode==6)) { greenCircle.outer.animate({stroke: '#ffffff'}, 300);}


		// 	if((hovercode==1) || (hovercode==3) || (hovercode==5)) { redCircle.outer.animate({stroke: '#ff5050'}, 300); runOuter('r');}
		// 	if((hovercode==2) || (hovercode==3) || (hovercode==6)) { blueCircle.outer.animate({stroke: '#5fda5f'}, 300); runOuter('g');}
		// 	if((hovercode==4) || (hovercode==5) || (hovercode==6)) { greenCircle.outer.animate({stroke: '#4e95ff'}, 300); runOuter('b');}
		// }

	};



function runOuter(circ){
		return 0;
		var endpoint = 359;
	    curCircleAnim = Snap.animate(0, endpoint,   function (val) {
	        redCircle.overarc.remove();
	   		blueCircle.overarc.remove();
	   		greenCircle.overarc.remove();


	        var d = val,
	            dr = d-90;
	            rrad = Math.PI*(-245)/180,
	            grad = Math.PI*(-125)/180,
	            brad = Math.PI*(-5)/180,

	            rradians = Math.PI*(d-245)/180,
	            gradians = Math.PI*(d-125)/180,
	            bradians = Math.PI*(d-5)/180,
	            largeArc = d>180 ? 1 : 0;

	            redCircle.path = "M"+(redCircle.x + radius * Math.cos(rrad))+","+(redCircle.y + radius * Math.sin(rrad))+" A"+radius+","+radius+" 0 "+largeArc+",1 "+(redCircle.x + radius*Math.cos(rradians))+","+(redCircle.y + radius * Math.sin(rradians));
	  			blueCircle.path = "M"+(blueCircle.x + radius * Math.cos(grad))+","+(blueCircle.y + radius * Math.sin(grad))+" A"+radius+","+radius+" 0 "+largeArc+",1 "+(blueCircle.x + radius*Math.cos(gradians))+","+(blueCircle.y + radius * Math.sin(gradians));
	  			greenCircle.path = "M"+(greenCircle.x + radius * Math.cos(brad))+","+(greenCircle.y + radius * Math.sin(brad))+" A"+radius+","+radius+" 0 "+largeArc+",1 "+(greenCircle.x + radius*Math.cos(bradians))+","+(greenCircle.y + radius * Math.sin(bradians));


	  		if(circ == 'r'){
	  			redCircle.overarc = s.path(redCircle.path);
		        redCircle.overarc.attr(circleArcAttr);
		        redCircle.overarc.attr({stroke: '#ff5050'});
	  		}
	  		else if(circ == 'g'){
	  			blueCircle.overarc = s.path(blueCircle.path);
		        blueCircle.overarc.attr(circleArcAttr);
		        blueCircle.overarc.attr({stroke: '#5fda5f'});
	  		}
	  		else if(circ == 'b'){
	  			greenCircle.overarc = s.path(greenCircle.path);
		        greenCircle.overarc.attr(circleArcAttr);
		        greenCircle.overarc.attr({stroke: '#4e95ff'});
	  		}








			// blueCircle.arc.attr(circleArcAttr);
			// greenCircle.arc.attr(circleArcAttr);
	        // percDiv.innerHTML =    Math.round(val/360*100) +'%';

	    }, 1000, mina.easeinout);
	};

	function detachOuter(){
			// redCircle.overarc.attr({'stroke-opacity': 0});
			// redCircle.overarc.stop();
	        redCircle.overarc.remove();
	   		blueCircle.overarc.remove();
	   		greenCircle.overarc.remove();
	};





	function draw() {



	  var y = parseInt(Snap('#circle_duplicate_clip').attr('cy'));
	  console.log(y);
	  if(y<200){
	  	if(y>90){
	  		y--;
	  	}
	  	else{
	  		y=190;
	  	}
	  	Snap('#circle_duplicate_clip').attr({cy: y});
	  }

	};

	function animate() {
	  draw();
	  window.requestAnimationFrame(animate);
	};





	return{
		initialize: function(options){
			vent = options.vent;

			shell.load();
			logo.load();

		},

		run: function(percent) {
		    var endpoint = 359;
		    allCircleAnimation = Snap.animate(0, endpoint,   function (val) {
		        circlesRGB.red.arc.remove();
		        circlesRGB.green.arc.remove();
		        circlesRGB.blue.arc.remove();

		        var rrad = Math.PI*(-245)/180,
		            grad = Math.PI*(-125)/180,
		            brad = Math.PI*(-5)/180,

		            rradians = Math.PI*(val-245)/180,
		            gradians = Math.PI*(val-125)/180,
		            bradians = Math.PI*(val-5)/180,
		            largeArc = val>180 ? 1 : 0;


	            circlesRGB.red.path = "M"+(circlesRGB.red.x + circlesRGB.oradius * Math.cos(rrad))+","+(circlesRGB.red.y + circlesRGB.oradius * Math.sin(rrad))+" A"+circlesRGB.oradius+","+circlesRGB.oradius+" 0 "+largeArc+",1 "+(circlesRGB.red.x + circlesRGB.oradius*Math.cos(rradians))+","+(circlesRGB.red.y + circlesRGB.oradius * Math.sin(rradians));
	  			circlesRGB.blue.path = "M"+(circlesRGB.blue.x + circlesRGB.oradius * Math.cos(grad))+","+(circlesRGB.blue.y + circlesRGB.oradius * Math.sin(grad))+" A"+circlesRGB.oradius+","+circlesRGB.oradius+" 0 "+largeArc+",1 "+(circlesRGB.blue.x + circlesRGB.oradius*Math.cos(gradians))+","+(circlesRGB.blue.y + circlesRGB.oradius * Math.sin(gradians));
	  			circlesRGB.green.path = "M"+(circlesRGB.green.x + circlesRGB.oradius * Math.cos(brad))+","+(circlesRGB.green.y + circlesRGB.oradius * Math.sin(brad))+" A"+circlesRGB.oradius+","+circlesRGB.oradius+" 0 "+largeArc+",1 "+(circlesRGB.green.x + circlesRGB.oradius*Math.cos(bradians))+","+(circlesRGB.green.y + circlesRGB.oradius * Math.sin(bradians));

		        circlesRGB.red.arc = s.path(circlesRGB.red.path);
		        circlesRGB.red.arc.attr(circlesRGB.circleArcAttr);
		        circlesRGB.group.append(circlesRGB.red.arc);
		        circlesRGB.blue.arc = s.path(circlesRGB.blue.path);
		        circlesRGB.blue.arc.attr(circlesRGB.circleArcAttr);
		        circlesRGB.group.append(circlesRGB.blue.arc);
		        circlesRGB.green.arc = s.path(circlesRGB.green.path);
		        circlesRGB.green.arc.attr(circlesRGB.circleArcAttr);
		        circlesRGB.group.append(circlesRGB.green.arc);
				// blueCircle.arc.attr(circleArcAttr);
				// greenCircle.arc.attr(circleArcAttr);
		        // percDiv.innerHTML =    Math.round(val/360*100) +'%';

		    }, 2000, mina.linear);



		},


		renderScene: function(index, pane, section){

			logo.render(index, pane);

			switch (index) {

				case 7:
					// UNDER CONSTRUCTION
					circlesRGB.hide();
					shell.hide();
					break;

				case 1:
					// if(logo.big) logo.index();
					// else logo.reinit = logo.index;

					circlesRGB.hide();
					shell.hide();
					break;
				case 2:
					if(pane){

						// if(logo.big) logo.servicepane();
						// else logo.reinit = logo.servicepane;

						circlesRGB.hide(true);

						$('#graphy').addClass('pixilized');

						// shell.hide();
						shell.init(pane, section);
						// shell.show();
					} else{

						// if(logo.big) logo.service();
						// else logo.reinit = logo.service;

						Snap.selectAll('.outer-circle').attr({'display': ''});

						$('#graphy').removeClass('pixilized');

						circlesRGB.show();
						this.run();

						shell.hide();
					}
						break;

				case 3:

						// if(logo.big) logo.portfolio();
						// else logo.reinit = logo.portfolio;
						// if(allCircleAnimation) allCircleAnimation.stop();
						circlesRGB.hide();
						shell.hide();

					break;

				case 4:

					// if(logo.big) logo.projects();
					// else logo.reinit = logo.projects;


					circlesRGB.hide();
					shell.hide();

					break;

				case 5:

					// if(logo.big) logo.contacts();
					// else logo.reinit = logo.contacts;

					circlesRGB.hide();
					shell.hide();

					break;
				default:

			}

		},

		resize: function(vb){
			return circlesRGB.resize(vb);
		}


		// companyScene: function(){
		// 	if(logo.big) logo.company();
		// 	else logo.reinit = logo.company;
		//
		//
		// },



	}

		// smallCircle.mouseout( smallCircle.resetSVG );


} );
