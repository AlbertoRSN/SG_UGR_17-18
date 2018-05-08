var $CONTROLS = $CONTROLS || {};

$CONTROLS.FirstPersonControls = function ( object, domElement ) {

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
