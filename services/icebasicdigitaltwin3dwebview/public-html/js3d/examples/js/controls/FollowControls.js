/*
 * @author zz85 / https://github.com/zz85
 * @author mrdoob / http://mrdoob.com
 
 Adapted forICE by ChrisO
 
 * Running this will allow you to follow three.js objects around the screen.
 */

THREE.FollowControls = function ( _objectMove, _objectTarget, _camera, _domElement ) {


	var _plane = new THREE.Plane();
	var _raycaster = new THREE.Raycaster();

	var _mouse = new THREE.Vector2();
	var _offset = new THREE.Vector3();
	var _intersection = new THREE.Vector3();

	var _followed = null, _hovered = null;

	//

	var scope = this;

	function activate() {

		_domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );


	}

	function deactivate() {

		_domElement.removeEventListener( 'mousemove', onDocumentMouseMove, false );

	}

	function dispose() {

		deactivate();

	}

	function onDocumentMouseMove( event ) {

		event.preventDefault();

		var rect = _domElement.getBoundingClientRect();

		_mouse.x = ( (event.clientX - rect.left) / rect.width ) * 2 - 1;
		_mouse.y = - ( (event.clientY - rect.top) / rect.height ) * 2 + 1;

		_raycaster.setFromCamera( _mouse, _camera );

	    var hits = _raycaster.intersectObject(_objectTarget)
	   //scope.dispatchEvent( { type: 'followMoving', meep:{ 'object': _objectMove, "position":  hits[0].point}            }  );
	    if ( hits.length>0  ){
		    scope.dispatchEvent( { type: 'followMoving', meep:{ 'object': _objectMove, "position":  hits[0].point}            }  );
	        _objectMove.position.x = hits[0].point.x;
	        _objectMove.position.y = hits[0].point.y;
	        _objectMove.position.z = hits[0].point.z;
	    }
	}


	activate();

	// API

	this.enabled = true;

	this.activate = activate;
	this.deactivate = deactivate;
	this.dispose = dispose;



};

THREE.FollowControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.FollowControls.prototype.constructor = THREE.FollowControls;
