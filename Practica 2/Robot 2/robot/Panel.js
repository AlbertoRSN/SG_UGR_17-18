
class Panel extends THREE.Object3D {

  constructor (aMaterial, vida) {
    super();

    this.sizeX = 0.1;
    this.sizeY = 0.02;
    this.material = aMaterial;
    this.barra = null;
    
    this.add (this.createRoot(vida));
  }
  
  //Crea el nodo raiz
  createRoot(vida) {
    var root = new THREE.Object3D();
    root.castShadow = false;
    root.autoUpdateMatrix = false;
    root.updateMatrix();
    root.add(this.createLifeBar(vida));
    root.add(this.createContainer());
    return root;
  }

  // Crear Barra Vida
  createLifeBar(vida) {
    this.barra = new THREE.Mesh(new THREE.BoxGeometry (this.sizeX, this.sizeY, 0.0), this.material);
    this.barra.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.sizeX/2, 0, 0));
    
    this.barra.scale.x = vida/100;
    this.barra.castShadow = false;

    return this.barra;
  }

  // Crea el marco contenedor de la barra de vida
  createContainer() {
    var container = new THREE.Mesh(new THREE.BoxGeometry (this.sizeX*1.025, this.sizeY*1.1, 0.0), new THREE.LineBasicMaterial({ color: 0x000000 }));
    container.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (this.sizeX/2., 0, -0.0001));
    
    container.castShadow = false;

    return container;
  }

  changeSize(vida) {
    this.barra.scale.x = vida/100;
  }
  
}