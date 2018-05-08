

class Robot extends THREE.Object3D {
  
  constructor (parameters) {
    super();
    
    //Textura para el robot
    var texturaRobot = new THREE.TextureLoader().load("imgs/metalbare.jpg");
    this.material    = (parameters.material === undefined ? new THREE.MeshPhongMaterial ({map: texturaRobot}) : parameters.material);

    //Textura para el ojo
    var texturaOjo = new THREE.TextureLoader().load("imgs/ojo3.jpg");
    this.materialOjo = new THREE.MeshPhongMaterial ({map: texturaOjo});
    
    // Objetos que forman el robot
    this.cabeza       = null;
    this.ojo          = null;
    this.cuerpo       = null;
    this.pieIzq       = null;
    this.pieDer       = null;
    this.brazo        = null;
    this.hombroDer    = null;
    this.hombroIzq    = null;
    this.brazoIzq     = null;
    this.brazoDer     = null;

    this.anguloCabeza = 0;
    this.anguloCuerpo = 0;
    this.alturaHombro = 1.4;
    this.alturaBrazos = 0;  

    this.distance     = 0;
    this.distanceMin  = 1;
    this.distanceMax  = 4;

    this.camara = null;
    this.hitbox = null;

    this.radio = 0;


    //Creo la cabeza
    //this.cabeza = this.createCabeza();

    //Creo el cuerpo
    this.cuerpo = this.createCuerpo();
    this.pieDer = this.createPie();
    this.pieIzq = this.createPie();
    this.brazoIzq = this.createBrazo();
    this.brazoDer = this.createBrazo();


    //Añadir los objetos que forman el robot
    //this.add (this.cabeza);
    this.add(this.cuerpo);
    this.add(this.pieIzq);
    this.add(this.pieDer);
    this.add(this.brazoDer);
    this.add(this.brazoIzq);

    // A way of feedback, a red jail will be visible around the crane when a box is taken by it
    //this.feedBack = new THREE.BoxHelper (this.cabeza, 0xFF0000);
    //this.feedBack.visible = false;
    //this.add (this.feedBack);
    
    //Coloco los pies
    this.pieIzq.position.z = -2.5;
    this.pieDer.position.z = 2.5;

    //Coloco los brazos
    this.brazoIzq.position.z = -2.5;
    this.brazoDer.position.z = 2.5;

    this.brazoIzq.position.y = this.alturaBrazos;
    this.brazoDer.position.y = this.alturaBrazos;

    //Coloco el cuerpo
    this.cuerpo.position.y = 2.5;

  }


  createOjo(){
   this.ojo = new THREE.Mesh (
      new THREE.CylinderGeometry (0.6, 0.6, 1), this.materialOjo);
    this.ojo.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 1.5, 0));

    this.ojo.castShadow = true;
    this.ojo.autoUpdateMatrix = false;
    this.ojo.rotation.x = Math.PI/2;

    this.ojo.position.y = 0.45;

    this.ojo.add(this.createCamera());
    this.ojo.add(this.createLight());



    return this.ojo;
  }



//CREAR CABEZA
createCabeza(){
    this.cabeza = new THREE.Mesh(new THREE.SphereGeometry(1.8), this.material);
    this.cabeza.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 0, 0));
    this.cabeza.castShadow = true;
    //this.cabeza.autoUpdateMatrix = false;
    
    this.cabeza.add(this.createOjo());

    //Para que la cabeza aparezca mirando al frente
    //this.rotation.y = 2.5;
    //this.position.y = 0;

    return this.cabeza;
  }

//CREAR HOMBROS
createHombro (){
    this.hombro = new THREE.Mesh (
      new THREE.BoxGeometry (1,0.5,1.8),
                          this.material);
    this.hombro.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 0, 0));
    this.hombro.castShadow = true;
    
    return this.hombro;
  }

//CREAR PIES
createPie(){
  this.pie = new THREE.Mesh (
      new THREE.CylinderGeometry (0.5,0.9,1),
                          this.material);
    this.pie.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 0.5, 0));
    this.pie.castShadow = true;
    
    return this.pie;
}

createBrazo (){
    this.brazo = new THREE.Mesh (
      new THREE.CylinderGeometry (0.3,0.3,4),
                          this.material);
    this.brazo.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 2, 0));
    this.brazo.castShadow = true;
    
    return this.brazo;
}

// CREAR CUERPO
createCuerpo () {
    this.cuerpo = new THREE.Mesh (
      new THREE.CylinderGeometry (2,2,4),
                          this.material);
    this.cuerpo.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 0, 0));
    this.cuerpo.castShadow = true;

    this.cabeza = this.createCabeza();
    this.cuerpo.add (this.cabeza);
    this.cabeza.position.y = 2;

    this.hombroIzq = this.createHombro();
    this.hombroDer = this.createHombro();
    this.cuerpo.add (this.hombroIzq);
    this.cuerpo.add (this.hombroDer);

    this.hombroDer.position.z = 2.2;
    this.hombroIzq.position.z = -2.2;
    this.hombroIzq.position.y = 1.6;
    this.hombroDer.position.y = 1.6;


    return this.cuerpo;
  }


 //radianes a grados
  radToDeg(radianes){
    return (180*radianes)/Math.PI;
  }

  //radianes a grados
  degToRad(grados){
    return (grados*Math.PI)/180;
  }


  
  createHitbox () {
    this.hitbox = new THREE.Mesh (new THREE.SphereGeometry(5, 15,15));
    
    this.hitbox.position.y = 2;
    this.hitbox.material.transparent = true;
    this.hitbox.material.opacity = 0.0;

    return this.hitbox;
  }

   //It animates the robot
  crearCajaRobot() {
    this.cuerpo.add(this.createHitbox());
  }


createCamera() {
    this.camara = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camara.position.set(1, 1, 1);
    var look = new THREE.Vector3 (0,100,30);
    this.camara.lookAt(look);

    return this.camara;
  }


  createLight() {
    var robotLight = new THREE.SpotLight( 0xffffff );
    robotLight.castShadow = false;
    robotLight.shadow.mapSize.width=2048;
    robotLight.shadow.mapSize.height=2048;
    robotLight.angle = 0.8;
    robotLight.penumbra = 0.1;
    var targetLight = new THREE.Object3D();
    targetLight.position.set(0, 4.9, 0);
    robotLight.target = targetLight;
    
    robotLight.add(targetLight);

    return robotLight;
  }


//FUNCION GIRO CABEZA
  giroCabeza(anguloGiro){
    var limDerecha = this.anguloCabeza + anguloGiro;   //  80º
    var limIzquierda = this.anguloCabeza - anguloGiro; // -80º

    if(anguloGiro < limDerecha && anguloGiro > 80)
      this.cabeza.rotation.y = this.anguloCabeza - anguloGiro;
    else if(anguloGiro > limIzquierda && anguloGiro < 80)
      this.cabeza.rotation.y = this.anguloCabeza + anguloGiro;//(anguloGiro/Math.PI) - 0.0174;//this.anguloCabeza - anguloGiro;
    else if(anguloGiro == 80)
      this.cabeza.rotation.y = 1.4;

    // var limDerecha = this.anguloCabeza + anguloGiro; 
    // var limIzquierda = this.anguloCabeza - anguloGiro;

    // if(anguloGiro == 40) //Cabeza centrada
    //   this.cabeza.rotation.y = 1.6;
    
    // else if(anguloGiro > limIzquierda)// && anguloGiro < 40) { //Giro a la izquierda
    //   this.cabeza.rotation.y = this.anguloCabeza - this.degToRad(anguloGiro);
    
    // else if(anguloGiro < limDerecha)// && anguloGiro > 40) //Giro a la derecha
    //   this.cabeza.rotation.y = this.anguloCabeza + this.degToRad(anguloGiro);
    
  }
  
  //Rota el cuerpo siempre y cuando esté en los limites permitidos (30º adelante, 45º hacia atrás )
  giroCuerpo(rotacion) {
    
    var limiteBack = this.anguloCuerpo + 45;

    if(rotacion == 45){
      this.cuerpo.rotation.z = 0;

    }else if(rotacion < limiteBack){
          this.cuerpo.position.y = 0;
          this.cuerpo.rotation.z = 0;
          this.cuerpo.rotation.z = this.anguloCuerpo + this.degToRad(45-rotacion) ;
          this.cuerpo.position.y = 1.5+this.alturaHombro;

    }else if(rotacion > 45 ){
        this.cuerpo.position.y = 0;
        this.cuerpo.rotation.z = 0;
        this.cuerpo.rotation.z = this.anguloCuerpo-this.degToRad(rotacion-45) ;
        this.cuerpo.position.y = 1.5+this.alturaHombro;
    }

  }

  escaladoBrazos(escalado){
    if (this.distanceMin <= escalado && escalado <= this.distanceMax) {
      this.distance = escalado;
      this.brazoIzq.scale.y = this.distance;
      this.brazoDer.scale.y = this.distance;
      
      this.cuerpo.position.y = this.distance*4-1.5;
    }
  }


  //Para girar el robot
  rotateRobot(lado) { //Derecha/IZquierda
    if(lado=="L")
      this.robot.rotation.y += 3;
    else if(ladoo == "R")
      this.robot.rotation.y -= 3; 
  }

  getParameters(){
    var pos = new THREE.Vector3();
    pos.setFromMatrixPosition (this.hitbox.matrixWorld);
    var parameters = {pos: pos, radio: this.radio};
    return parameters;
  }


}

// class variables
Robot.WORLD = 0;
Robot.LOCAL = 1;
