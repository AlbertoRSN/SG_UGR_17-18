var $CONTROLS = $CONTROLS || {};

$CONTROLS.WebcamControls = function ( object, domElement ) {

	var temp = document.createElement('div');
	temp.innerHTML='<video id="monitor" autoplay style="display: none; width: 320px; height: 240px;"></video>'+
	'<div id="canvasLayers" width="320" height="240" style="position: absolute; right: 0px; top: 0px; width: 320px; height: 240px; overflow:hidden;">'+
	'<canvas id="videoCanvas" width="320" height="240" style="z-index: 1; position: absolute; left:0px; top:0px;width: 320px; height: 240px; overflow:hidden;"></canvas>'+
	'<canvas id="buttonsLayer" width="320" height="240" style="z-index: 2; position: absolute; left:0px; top:0px; opacity:0.5;width: 320px; height: 240px; overflow:hidden;"></canvas>'+
	'</div>'+
	'<canvas id="blendCanvas"  width="320" height="240" style="display: none; position: absolute; right: 320px; top: 0px; width: 320px; height: 240px;"></canvas>';
	document.body.appendChild(temp);
	var camvideo = document.getElementById('monitor');
	var video = document.getElementById( 'monitor' );
	var videoCanvas = document.getElementById( 'videoCanvas' );
	var videoContext = videoCanvas.getContext( '2d' );

	var buttonsLayerCanvas = document.getElementById( 'buttonsLayer' );
	var buttonsLayerContext = buttonsLayerCanvas.getContext( '2d' );

	var blendCanvas  = document.getElementById( "blendCanvas" );
	var blendContext = blendCanvas.getContext('2d');

	videoContext.translate(320, 0);
	videoContext.scale(-1, 1);
		
	videoContext.fillStyle = '#005337';
	videoContext.fillRect( 0, 0, videoCanvas.width, videoCanvas.height );				

	var buttons = [];

	var button1 = new Image();
	button1.src ="../data/graphics/ui/ico/wait-icon.png";
	var buttonData1 = { name:"wait", image:button1, x:64 + 10, y:10, w:32, h:32, pressed:false  };
	buttons.push( buttonData1 );

	var button2 = new Image();
	button2.src ="../data/graphics/ui/ico/walking-icon.png";
	var buttonData2 = { name:"walking", image:button2, x: 32 + 10, y:10, w:32, h:32, pressed:false };
	buttons.push( buttonData2 );

	var button3 = new Image();
	button3.src ="../data/graphics/ui/ico/running-icon.png";
	var buttonData3 = { name:"runing", image:button3, x:10, y:10, w:32, h:32, pressed:false };
	buttons.push( buttonData3 );

	var button4 = new Image();
	button4.src ="../data/graphics/ui/ico/left-icon.png";
	var buttonData4 = { name:"left", image:button4, x:320 - 96 - 10, y:10, w:32, h:32, pressed:false  };
	buttons.push( buttonData4 );

	var button5 = new Image();
	button5.src ="../data/graphics/ui/ico/up-icon.png";
	var buttonData5 = { name:"forward", image:button5, x: 320 - 64 -10 , y:10, w:32, h:32, pressed:false };
	buttons.push( buttonData5 );

	var button6 = new Image();
	button6.src ="../data/graphics/ui/ico/right-icon.png";
	var buttonData6 = { name:"right", image:button6, x:320 - 32 - 10, y:10, w:32, h:32, pressed:false };
	buttons.push( buttonData6 );
	
	
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	window.URL = window.URL || window.webkitURL;

	if (!navigator.getUserMedia) 
	{
		//document.getElementById('messageError').innerHTML = 'Sorry. <code>navigator.getUserMedia()</code> no esta disponible.';
	}
	navigator.getUserMedia({video: true}, gotStream, noStream);

	function gotStream(stream) 
	{
		if (window.URL) 
		{   camvideo.src = window.URL.createObjectURL(stream);   } 
		else // Opera
		{   camvideo.src = stream;   }

		camvideo.onerror = function(e) 
		{   stream.stop();   };
		stream.onended = noStream;
	}

	function noStream(e) 
	{
		var msg = 'No hay camara disponible.';
		if (e.code == 1) 
		{   msg = 'El usuario ha denegado el acceso a la cámara.';   }
	//document.getElementById('errorMessage').textContent = msg;
	}
	
	
	function render() 
	{	
		if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
		{

		videoContext.drawImage( video, 0, 0, videoCanvas.width, videoCanvas.height );
		for ( var i = 0; i < buttons.length; i++ )
				buttonsLayerContext.drawImage( buttons[i].image, buttons[i].x, buttons[i].y, buttons[i].w, buttons[i].h );		
		}
	}

	var lastImageData;

	function blend() 
	{
		var width  = videoCanvas.width;
		var height = videoCanvas.height;
		var sourceData = videoContext.getImageData(0, 0, width, height);
		if (!lastImageData) lastImageData = videoContext.getImageData(0, 0, width, height);
		var blendedData = videoContext.createImageData(width, height);
		differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
		blendContext.putImageData(blendedData, 0, 0);
		lastImageData = sourceData;
	}
	function differenceAccuracy(target, data1, data2) 
	{
	if (data1.length != data2.length) return null;
	var i = 0;
	while (i < (data1.length * 0.25)) 
	{
		var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
		var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
		var diff = threshold(fastAbs(average1 - average2));
		target[4*i]   = diff;
		target[4*i+1] = diff;
		target[4*i+2] = diff;
		target[4*i+3] = 0xFF;
		++i;
	}
	}
	function fastAbs(value) 
	{
		return (value ^ (value >> 31)) - (value >> 31);
	}
	function threshold(value) 
	{
		return (value > 0x15) ? 0xFF : 0;
	}

	function checkAreas() 
	{
	for (var b = 0; b < buttons.length; b++)
	{
		var blendedData = blendContext.getImageData( buttons[b].x, buttons[b].y, buttons[b].w, buttons[b].h );
		var i = 0;
		var sum = 0;
		var countPixels = blendedData.data.length * 0.25;
		while (i < countPixels) 
		{
			sum += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]);
			++i;
		}
		var average = Math.round(sum / (3 * countPixels));
		if (average > 50)
		{
			buttons[b].pressed=true;
		} else {
			buttons[b].pressed=false;
		}
	}
	}

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.enabled = true;

	this.eyeY=2;
	this.movementSpeed = 3.5;
	this.movementSpeedRun = 6.0;
	this.lookSpeed = 0.02;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lon = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.run = false;
	this.jump = false;
	this.showPosition=false;
	
	this.minX=0;
	this.maxX=256;
	this.minZ=0;
	this.maxZ=256;

	this.viewHalfX = 0;

	if ( this.domElement !== document ) {
		this.domElement.setAttribute( 'tabindex', - 1 );
	}



	this.handleResize = function () {

		if ( this.domElement === document ) {
			this.viewHalfX = window.innerWidth / 2;
		} else {
			this.viewHalfX = this.domElement.offsetWidth / 2;
		}

	};

	this.getPosition = function ( ) {
		return this.object.position;
	}
	
	this.showPosition = function () {
		var o=document.createElement('div');
		o.id="panelInfoControls";
		document.body.appendChild(o);
		this.panelInfo=o;
		this.showPosition=true;
	}

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;


		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;

		}

	};

	this.onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;
			
			case 16: /*shift*/ this.run = true; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 16: /*shift*/ this.run = false; break;

		}

	};

	this.update = function( delta ) {

		if ( this.enabled === false ) return;
		
	render();	
	blend();	
	checkAreas();


	if (buttonData3.pressed) {
		action="corriendo";
		this.run=true;
		this.moveForward = true;
	} else if (buttonData2.pressed) {
		this.run=false;
		this.moveForward = true;
		action="andando";
	} else if (buttonData1.pressed) {
		this.run=false;
		this.moveForward = false;
		action="parados";
	};
	
	if (buttonData6.pressed) {
		this.mouseX = this.viewHalfX;
		action2="la derecha";
	} else if (buttonData4.pressed) {
		action2="la izquierda";
		this.mouseX = -1 * this.viewHalfX;
	} else if (buttonData5.pressed) {
		action2="adelante";
		this.mouseX = 0;
	};


		var actualMoveSpeed = delta * (this.run?this.movementSpeedRun:this.movementSpeed);

		if ( this.moveForward) this.object.translateZ( - (actualMoveSpeed) );
		if ( this.moveBackward) this.object.translateZ( actualMoveSpeed );

		if ( this.moveLeft) this.object.translateX( - actualMoveSpeed );
		if ( this.moveRight) this.object.translateX( actualMoveSpeed );

		this.object.position.y=this.eyeY;
		if (this.minX>this.object.position.x) {
			this.object.position.x=this.minX;
		} else if (this.maxX<this.object.position.x) {
			this.object.position.x=this.maxX;
		}
		if (this.minZ>this.object.position.z) {
			this.object.position.z=this.minZ;
		} else if (this.maxZ<this.object.position.z) {
			this.object.position.z=this.maxZ;
		}
		if (this.showPosition) {
			this.panelInfo.innerHTML=" x: "+Math.round(this.object.position.x,0.1)+" z: "+Math.round(this.object.position.z,0.1)+" ";
		}
		var actualLookSpeed = delta * this.lookSpeed;

		this.lon += this.mouseX * actualLookSpeed;
		this.theta = THREE.Math.degToRad( this.lon );

		var targetPosition = this.target,
		position = this.object.position;

		targetPosition.x = position.x + 100 * Math.cos( this.theta );
		targetPosition.z = position.z + 100 * Math.sin( this.theta );

		this.object.lookAt( targetPosition );

	};

	this.dispose = function() {
		this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
		window.removeEventListener( 'keydown', _onKeyDown, false );
		window.removeEventListener( 'keyup', _onKeyUp, false );
	}

	var _onMouseMove = bind( this, this.onMouseMove );
	var _onKeyDown = bind( this, this.onKeyDown );
	var _onKeyUp = bind( this, this.onKeyUp );

	this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
	window.addEventListener( 'keydown', _onKeyDown, false );
	window.addEventListener( 'keyup', _onKeyUp, false );

	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		};
	}

	this.handleResize();

};

