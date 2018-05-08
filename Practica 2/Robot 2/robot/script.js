
/// Several functions, including the main

/// The scene graph
scene = null;

/// The GUI information
GUIcontrols = null;

/// The object for the statistics
stats = null;

/// A boolean to know if the left button of the mouse is down
mouseDown = false;


/// The current mode of the application
applicationMode = TheScene.NO_ACTION;

/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI (withStats) {
  GUIcontrols = new function() {
  
    //NUEVA LUZ
    this.nuevaLuz = false; //es un booleano para que sea un checkbox.
    this.axis = true;
    this.lightIntensity = 0.7;
    this.extension = 10;
    //this.luzOj = true;

    this.rotacionCabeza = 1.4;
    this.rotacionCuerpo = 45;

    this.escaladoBrazos = 1;


  }
  
  
  var gui = new dat.GUI();

  var controlPrincipal = gui.addFolder ('CONTROL ROBOT');
    //controlPrincipal.add(GUIcontrols, 'axis').name('Ejes on/off :');
    //controlPrincipal.add(GUIcontrols, 'lightIntensity', 0, 1.0).name('Intensidad Luz:');
    controlPrincipal.add(GUIcontrols, 'rotacionCabeza', 0, 2.8).name('Rot. Cabeza :');
    controlPrincipal.add(GUIcontrols, 'rotacionCuerpo', 0, 75).name('Rot. Cuerpo :');
    controlPrincipal.add(GUIcontrols, 'escaladoBrazos', 1, 2).name('Altura Brazos :');//listen();
    
  var accionesRobot = gui.addFolder('Luces/Ejes');
    accionesRobot.add(GUIcontrols, 'axis').name('Ejes on/off :');
    accionesRobot.add(GUIcontrols, 'lightIntensity', 0, 1.0).name('Intensidad Luz:');

  var examen = gui.addFolder("EXAMEN");
    examen.add(GUIcontrols, 'extension', 10, 20).name('Extension:');
  
  if (withStats)
    stats = initStats();
}

/// It adds statistics information to a previously created Div
/**
 * @return The statistics object
 */
function initStats() {
  
  var stats = new Stats();
  
  stats.setMode(0); // 0: fps, 1: ms
  
  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  
  $("#Stats-output").append( stats.domElement );
  
  return stats;
}

/// It shows a feed-back message for the user
/**
 * @param str - The message
 */
function setMessage (str) {
  document.getElementById ("Messages").innerHTML = "<h2>"+str+"</h2>";
}

//Informacion de Teclado
function onKeyDown (event) {
  var key = event.which;

  switch(key) {
    case 87: //w
    case 38://up
      scene.moveRightRobot();
    break;
    case 83: //S
    case 40: //Down
      scene.moveLeftRobot();
    break;
    case 65: //a
    case 37: //left
      scene.moveBackRobot();
      scene.rotateRobot("L");
    break;
    case 68: // d
    case 39: //rigth
      scene.moveForwRobot();
      scene.rotateRobot("R");
    break;
    case 86: //Tecla V
      scene.changeView();
    break;
  }

}


/// It processes the clic-down of the mouse
/**
 * @param event - Mouse information
 */
function onMouseDown (event) {
  if (event.ctrlKey) {
    // The Trackballcontrol only works if Ctrl key is pressed
    scene.getCameraControls().enabled = true;
  } else {  
    scene.getCameraControls().enabled = false;
    // if (event.button === 0) {   // Left button
    //   mouseDown = true;
    //   switch (applicationMode) {
    //     case TheScene.ADDING_BOXES :
    //       scene.addBox (event, TheScene.NEW_BOX);
    //       break;
    //     case TheScene.MOVING_BOXES :
    //       scene.moveBox (event, TheScene.SELECT_BOX);
    //       break;
    //     default :
    //       applicationMode = TheScene.NO_ACTION;
    //       break;
    //   }
    // } else {
    //   setMessage ("");
    //   applicationMode = TheScene.NO_ACTION;
    // }
  }
}

/// It processes the drag of the mouse
/**
 * @param event - Mouse information
 */
// function onMouseMove (event) {
//   if (mouseDown) {
//     switch (applicationMode) {
//       case TheScene.ADDING_BOXES :
//       case TheScene.MOVING_BOXES :
//         scene.moveBox (event, TheScene.MOVE_BOX);
//         break;
//       default :
//         applicationMode = TheScene.NO_ACTION;
//         break;
//     }
//   }
// }

/// It processes the clic-up of the mouse
/**
 * @param event - Mouse information
 */
// function onMouseUp (event) {
//   if (mouseDown) {
//     switch (applicationMode) {
//       case TheScene.ADDING_BOXES :
//         scene.addBox (event, TheScene.END_ACTION);
//         break;
//       case TheScene.MOVING_BOXES :
//         scene.moveBox (event, TheScene.END_ACTION);
//         break;
//       default :
//         applicationMode = TheScene.NO_ACTION;
//         break;
//     }
//     mouseDown = false;
//   }
// }

/// It processes the wheel rolling of the mouse
/**
 * @param event - Mouse information
 */
function onMouseWheel (event) {
  if (event.ctrlKey) {
    // The Trackballcontrol only works if Ctrl key is pressed
    scene.getCameraControls().enabled = true;
  } else {  
    scene.getCameraControls().enabled = false;
    // if (mouseDown) {
    //   switch (applicationMode) {
    //     case TheScene.MOVING_BOXES :
    //       scene.moveBox (event, TheScene.ROTATE_BOX);
    //       break;
    //   }
    // }
  }
}

/// It processes the window size changes
function onWindowResize () {
  scene.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);
}



/// It creates and configures the WebGL renderer
/**
 * @return The renderer
 */
function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
  
  renderer.setClearColor(new THREE.Color(0x7fbfff), 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.shadowMap.enabled = true;

  return renderer;  
}

/// It renders every frame
function render() {
  requestAnimationFrame(render);
  
  stats.update();
  scene.getCameraControls().update ();
  scene.animate(GUIcontrols);
  
  renderer.render(scene, scene.getCamera());
}


//----------------------------------- · M A I N · --------------------------------------
/// The MAIN function
$(function () {
  // create a render and set the size
  renderer = createRenderer();
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);
  // liseners
  window.addEventListener ("resize", onWindowResize);
  //window.addEventListener ("mousemove", onMouseMove, true);
  window.addEventListener ("mousedown", onMouseDown, true);
  //window.addEventListener ("mouseup", onMouseUp, true);
  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener ("mousewheel", onMouseWheel, true);   // For Chrome an others
  window.addEventListener ("DOMMouseScroll", onMouseWheel, true); // For Firefox
  
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new TheScene (renderer.domElement);
 
  createGUI(true);

  render();
});
