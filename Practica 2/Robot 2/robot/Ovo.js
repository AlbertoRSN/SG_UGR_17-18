

class Ovo extends THREE.Mesh{


	constructor(amaterial, comportamiento){
		super();

		this.material = amaterial;
		this.tamano = 8;
		this.meteorito = null;
		this.velocidad = null;
		this.tiempoPrev = null;
		this.colision = false;

        this.pos = -5;
        this.radioX = 0;

		this.compor = comportamiento;
		this.createOvo();

	}

	//Constructor de Objeto Volador
	 createOvo() {
	 	var radius = 1 + Math.random()* 3;
        this.meteorito = new THREE.Mesh (
            new THREE.SphereGeometry(this.tamano/2, 20,20), this.material);//((radius), this.material));
        this.meteorito.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 0, 0),);
        this.setPosicion();
        this.meteorito.castShadow = true;
        this.add(this.meteorito);
    }

    launch(){
    	this.tiempoPrev = Date.now();
    }

    //Funcion para colocar objeto volador al crearlo
    setPosicion(posx, posz){
    	// //Al inicio no hay colision
    	// this.colision = false;

    	// //Velocidad aleatoria
    	 this.velocidad = Math.floor((Math.random() * 100) + 50);

    	// //Posicion de partida
    	// var posZ = 1 + Math.random() * (150 + 150) - 150;
    	
    	// //Diferentes alturas para los meteoritos
    	// var posY = Math.floor((Math.random() * 10) + 5);
    	// this.meteorito.position.set(-150,posY,posZ);

    	// //Crear a la misma altura
    	// //this.meteorito.position.set(-150,15,posZ);

        this.meteorito.position.set(posx,10,posz);
        //this.velocidad = 10;
    }

    update(ext){
    	var tiempoActual = Date.now();
        
    	// this.meteorito.position.x += this.velocidad * (tiempoActual - this.tiempoPrev)/1000;
    	// this.tiempoPrev = tiempoActual;

    	// if(this.meteorito.position.x > 150 || this.colision == true)
    	// 	this.setPosicion();

        //this.meteorito.position.x += this.velocidad * (tiempoActual - this.tiempoPrev)/1000;
        //this.meteorito.position.z += this.velocidad * (tiempoActual - this.tiempoPrev)/1000;
        
        this.pos+=2;
        this.setPosicion(ext+2, ext);
        this.rotation.y += 1;
        //this.meteorito.position.x += this.velocidad * (tiempoActual - this.tiempoPrev)/100000;
        //this.setPosicion(2,2);

//         var origen = { p : 0 };
// var destino = { p : 100 };
// var movimiento = new TWEEN.Tween ( origen )
// .to (destino, 1000 )
// . easing ( TWEEN. Easing . Linear .None )
// .onStart ( function () { this.meteorito.position.y += 10; }) .onUpdate (function () { this.meteorito.position.x = origen.x }) .onComplete (function () { this.meteorito.position.y −= 10; }) .repeat ( Infinity )
// . yoyo ( true ) .start();

    }

    getParameters() {
        var parameters = {x: this.meteorito.position.x, y: this.meteorito.position.y,
            z: this.meteorito.position.z, radio: this.tamano/2, compor: this.compor};
        return parameters;
    }

    setCollision() {
        this.colision = true;
    }



	// constructor (parameters) {
 //    	super();

 //    	this.ovo = this.createOvo();

	// 	var texturaOvo = new THREE.TextureLoader().load("imgs/suelo.jpg");
 //    	this.materialOvo = new THREE.MeshPhongMaterial ({map: texturaOvo});

 //    	this.add(this.ovo);
	// }


	// createOvo(){

	// 		//Radio aleatorio 
	// 		var radius = 1 + Math.random()* 3;
	// 		var posZ = 1 + Math.random() * (150 + 150) - 150;
 //   			this.ovo = new THREE.Mesh (
 //      			new THREE.SphereGeometry (radius), this.materialOvo);
 //    		this.ovo.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (0, 0, 0));
	// 		this.ovo.castShadow = true;

	// 		//posicion inicial
	// 		this.ovo.position.set(-150,15,posZ);

	//     	return this.ovo;	
 //  		}
	

}