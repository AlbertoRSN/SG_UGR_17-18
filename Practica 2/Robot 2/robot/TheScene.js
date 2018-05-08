
/// The Model Facade class. The root node of the graph.
/**
 * @param renderer - The renderer to visualize the scene
 */
class TheScene extends THREE.Scene {
  
  constructor (renderer) {
    super();
    
    // Attributes

    this.esfera = null;
    this.material = null; 
    this.extension = 0;
    
    //Crear nueva luz ambiente
    this.nuevaLuz = null;

    this.ambientLight = null;
    this.spotLight = null;
    this.camera = null;
    this.trackballControls = null;
    this.ground = null;

    //Objetos voladores
    this.objetosVoladores = [];
    this.maxMeteoritos = 10;

    this.dificultad = 4; //de 1 a maxMeteoritos (- a + dificultad)
    this.comparaDificultad = 4;

    this.robot = null;

    this.vida=100;
    this.vidaFin = 100;
    this.score = 0;
    this.comparaScore = 10;

    //colocar panel esquina superior izquierda
    this.panelPositionX = -0.23;
    this.panelPositionY = 0.11;
    this.panelPositionZ = -0.35;


    this.actualCamera = 0;
    this.currentCamera = null;
    this.panel = null;
    this.panelPerspectiva = null;

    
    this.createMarcador();
    this.createLights ();
    this.createCamera (renderer);
    this.axis = new THREE.AxisHelper (50);
    this.add (this.axis);
    this.model = this.createModel ();
    this.add (this.model);
  }
  
  /**
   * @param renderer - The renderer associated with the camera
   */
  createCamera (renderer) {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set (250, 170, 0);
    var look = new THREE.Vector3 (0,10,0);
    this.camera.lookAt(look);

    this.trackballControls = new THREE.TrackballControls (this.camera, renderer);
    this.trackballControls.rotateSpeed = 5;
    this.trackballControls.zoomSpeed = -2;
    this.trackballControls.panSpeed = 0.5;
    this.trackballControls.target = look;
    

    //Creacion del Panel de vida
    this.panel = new Panel(new THREE.LineBasicMaterial({ color: 0x00ff00 }), this.vida);
    this.panelPerspectiva = new Panel(new THREE.LineBasicMaterial({ color: 0x00ff00 }), this.vida);
    //this.panel.rotation.z = Math.PI/2;
    this.camera.add(this.panel);
    this.panel.position.set(this.panelPositionX, this.panelPositionY, this.panelPositionZ);
    this.panelPerspectiva.position.set(this.panelPositionX, this.panelPositionY, this.panelPositionZ);

    this.currentCamera = this.camera;

    this.add(this.currentCamera);


    //this.add(this.camera);
  }
  
  /// It creates lights and adds them to the graph
  createLights () {
    // add subtle ambient lighting
    this.ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add (this.ambientLight);

    //NUEVA LUZ AMBIENTE
    this.nuevaLuz = new THREE.AmbientLight(0x404040, 0.6);
    this.add (this.nuevaLuz);
    
    // add spotlight for the shadows
    this.spotLight = new THREE.SpotLight( 0xffffff );
    this.spotLight.position.set( 150, 60, 0 );
    this.spotLight.castShadow = true;
    // the shadow resolution
    this.spotLight.shadow.mapSize.width=2048;
    this.spotLight.shadow.mapSize.height=2048;
    this.add (this.spotLight);
  }

  // Crea marcador textual para la puntuación.
  createMarcador() {
    var text = document.createElement('div');
    text.id = "marker";
    text.style.position = 'absolute';
    text.innerHTML = "Puntuacion: " + this.score;
    text.style.top = 20 + 'px';
    text.style.left = 150 + 'px';
    text.style.fontSize = 30 + 'px';
    document.body.appendChild(text);
  }


  //Funcion para crear la esfera.
  createEsfera(){
      var texturaEsfera = null;
      var loader = new THREE.TextureLoader();

      texturaEsfera = loader.load("imgs/fuego.jpg");
      this.material = new THREE.MeshPhongMaterial ({map: texturaEsfera});
      this.esfera= new THREE.Mesh(new THREE.SphereGeometry(3), this.material);

      this.esfera.geometry.applyMatrix(new THREE.Matrix4().makeTranslation (0, 7, 0));

      return this.esfera;
  }
  
  
  /// It creates the geometric model: robot
  /**
   * @return The model
   */
  createModel () {
    var model = new THREE.Object3D()
    var loader = new THREE.TextureLoader();
    var texturaOvo = null;

    var texturaEsfera = null;
    
    //var texturaGrua = new THREE.TextureLoader().load("imgs/tgrua.jpg");
    this.robot = new Robot({});
    this.robot.scale.set(3,3,3);
    //model.add (this.robot);

    //Crear Objetos voladores
    var comportamiento = null; //Buenos - Malos

    for (var i = 0; i < this.maxMeteoritos; ++i) {
      if (i < this.dificultad) {
        comportamiento = false;
        texturaOvo = loader.load ("imgs/cesped1.jpg");
      } else {
        comportamiento = true;
        texturaOvo = loader.load ("imgs/fuego.jpg");
      }
      this.objetosVoladores[i] = new Ovo(new THREE.MeshPhongMaterial ({map: texturaOvo}), comportamiento);
      //model.add(this.objetosVoladores[i]);


      this.esfera = new Ovo(new THREE.MeshPhongMaterial ({map: texturaOvo}), comportamiento);
      model.add(this.esfera);
      //model.add(this.createEsfera());

    }


    //var loader = new THREE.TextureLoader();
    var textura = loader.load ("imgs/suelo1.jpg");
    this.ground = new Ground (300, 300, new THREE.MeshPhongMaterial ({map: textura}), 4);
    model.add (this.ground);

    return model;
  } 




  /**
   * @controls - The GUI information
   */
  animate (controls) {
    this.axis.visible = controls.axis;

    for (var i = 0; i < this.maxMeteoritos; ++i) {
      this.objetosVoladores[i].update();
    }

    this.esfera.update(controls.extension);

    //CONTROLAR NUEVA LUZ
    this.nuevaLuz.visible = controls.nuevaLuz;
    this.spotLight.intensity = controls.lightIntensity;

    //Movimientos del Robot
    this.robot.giroCabeza(controls.rotacionCabeza);
    this.robot.giroCuerpo(controls.rotacionCuerpo);
    this.robot.escaladoBrazos(controls.escaladoBrazos);
    
    this.robot.crearCajaRobot();


    this.manageCollitions();

    //Alerta juego terminado
    if(this.vida <= 0)
      alert("FIN DEL JUEGO");

  }

  //All the Robot movement funcs
  moveForwRobot () {
    if (this.robot.position.z > -146) 
      this.robot.position.z -= 3;
    else{
      alert("FIN DEL JUEGO, te has salido!");
      this.vida = 0;
    }
  }

  moveBackRobot () {
    if (this.robot.position.z < 146) 
      this.robot.position.z += 3;
    else{
      alert("FIN DEL JUEGO, te has salido!");
      this.vida = 0;
    }
  }

  moveLeftRobot () {
    if (this.robot.position.x > -146) 
      this.robot.position.x -= 3;
    else{
      alert("FIN DEL JUEGO, te has salido");
      this.vida = 0;
    }
  }

  moveRightRobot () {
    if (this.robot.position.x < 146) 
      this.robot.position.x += 3;
    else{
      alert("FIN DEL JUEGO, te has salido");
      this.vida = 0;
    }
  }

//Cambiar la camara del juego
  changeView() {
    if (this.actualCamera == 0) {
      this.currentCamera.remove(this.panel);
      this.currentCamera = this.robot.camera;
      this.currentCamera.add(this.panelPerspectiva);

      this.actualCamera = 1;
    } else if (this.actualCamera == 1) {
      this.currentCamera.remove(this.panelPerspectiva);
      this.currentCamera = this.camera;
      this.currentCamera.add(this.panel);

      this.actualCamera = 0;
    }
  }
  

  //Cambiar textura del panel
  cambiarTexturaPanel(col) {
    this.currentCamera.remove(this.panel);
    this.currentCamera.remove(this.panelPerspectiva);

    this.panel = new Panel(new THREE.LineBasicMaterial({ color: col }), this.vida);
    this.panelPerspectiva = new Panel(new THREE.LineBasicMaterial({ color: col }), this.vida);
    this.panel.position.set(this.hudPositionX, this.hudPositionY, this.hudPositionZ);
    this.panelPerspectiva.position.set(this.hudPositionX, this.hudPositionY, this.hudPositionZ);

    if (this.actualCamera == 1) 
      this.currentCamera.add(this.panel);
    if (this.actualCamera == 0) 
      this.currentCamera.add(this.panelPerspectiva);
  }

  //Cambio color panel
  controlarPanel () {
    if (this.vidaFin < 50 && this.vida >= 50) {
      this.cambiarTexturaPanel(0x00ff00);
    }
    else if (this.vidaFin >= 20 && this.vida < 20) {
      this.cambiarTexturaPanel(0xff0000);
    }
    else if ((this.vidaFin < 20 && this.vida >=20) || ( this.vidaFin >= 50 && this.vida <= 50)) {
      this.cambiarTexturaPanel(0xffa500);
    }
  }

//IModificar puntuacion y dificultad
  setScore () {
    var text = document.getElementById("marker");
    text.innerHTML = "Puntuacion: " + this.score;

    //ISeleccionar dificultad
    if (this.dificultad == this.comparaDificultad && this.score >= this.comparaScore && this.dificultad < 9) {
      this.model.remove(this.objetosVoladores[this.dificultad]);
      var loader = new THREE.TextureLoader();
      var texture = loader.load ("imgs/fuego.jpg");
      this.objetosVoladores[this.dificultad] = new Ovo(new THREE.MeshPhongMaterial ({map: texture}), false);
      this.model.add(this.objetosVoladores[this.dificultad]);

      this.dificultad++;
      this.comparaDificultad++;
      this.comparaScore += 10;
    }
  }


  manageCollitions () {
    var paramRobot = this.robot.getParameters();
    for (var i = 0; i < this.maxMeteoritos; ++i) {
      var paramOvo = this.objetosVoladores[i].getParameters(); //Parametros del objeto
      var distance = Math.sqrt(Math.pow((paramOvo.x - paramRobot.pos.x),2) + Math.pow((paramOvo.y - paramRobot.pos.y),2)
        + Math.pow((paramOvo.z - paramRobot.pos.z),2));

      if (distance <= (paramRobot.radio + paramOvo.radio)) {
        this.objetosVoladores[i].setCollision();
        this.vidaFin = this.vida;

        if (paramOvo.compor == false) { //caso que sean malos
          this.vida -= 10;
          if (this.vida < 0) 
            this.vida = 0;
        } else if (paramOvo.compor == true) { //Caso que sean buenos
          var scorePlus = Math.floor(Math.random()*(5+1))
          this.vida += 10 - scorePlus;
          this.score += scorePlus;
          this.setScore();
          if(this.vida > 100) this.vida = 100;
        }
        this.controlarPanel();
        this.panel.changeSize(this.vida);
        this.panelPerspectiva.changeSize(this.vida);
      }
    }
  }

  rotateRobot(lado) {
    this.robot.rotateRobot(lado);
  }

  /// It returns the camera
  /**
   * @return The camera
   */
  getCamera () {
    return this.camera;
  }
  
  /// It returns the camera controls
  /**
   * @return The camera controls
   */
  getCameraControls () {
    return this.trackballControls;
  }
  
  /// It updates the aspect ratio of the camera
  /**
   * @param anAspectRatio - The new aspect ratio for the camera
   */
  setCameraAspect (anAspectRatio) {
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }
  
}

  // class variables



