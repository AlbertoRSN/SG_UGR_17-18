/*
   CLASSE Entity3D: Es una entidad que se ha insertado en el juego partiendo de una plantilla...
*/

var $RG = $RG || {};
$RG.entities=[];

$RG.Entity3D = function (properties) {
	this.template=properties.template
	this.prop=properties;
	this.mesh=null;
	$RG.entities.push(this)
}

$RG.Entity3D.prototype.addToWorld = function () {
	var prop=this.prop;
	var templ=$RG.templates[prop.template];

	//Clonar la figura 3D, posicionar y rotar
	var mesh=templ.template3D.mesh.clone();
	
	//Añadir al mundo fisico
	//********************
	if (templ.type!=3) {
	 
		//
		//construir un objeto similar pero a base de cuadrados, o formas geometricas simples
		var bBox = new THREE.BoundingBoxHelper(mesh, 0xff0000); //Devuelve objeto con x, y, z, donde la caja esta posicionada en el centro
		bBox.update();
		this.helper = new THREE.Object3D();
        this.helper.add(new THREE.Mesh(new THREE.BoxGeometry((bBox.box.max.x - bBox.box.min.x), (bBox.box.max.y - bBox.box.min.y), (bBox.box.max.z - bBox.box.min.z)), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })));
		this.helper.children[0].position.set(bBox.position.x, bBox.position.y,  bBox.position.z);
		$WORLD.scene.add(this.helper);
		//this.helper.position.set(prop.x, ((prop.y)?prop.y:0), prop.z);

	}
	//***************
	//Fin mundo fisico
		
	var y=0
	mesh.position.set(prop.x, ((prop.y)?prop.y:0), prop.z);
	if (!(prop.rY)) prop.rY=0;
	if (templ.type==3) { //SPRITE
		mesh.translateY(templ.height/2-0.05);
	}
	
	mesh.rotateY(prop.rY * Math.PI / 180);
	this.mesh=mesh;
	
	//posicionar y mover en mundo fisico
	//************************
	if (templ.type!=3) {
		this.helper.position.set(mesh.position.x, mesh.position.y, mesh.position.z)
		this.helper.rotateY(prop.rY * Math.PI / 180);
	}
	//*************************
	// end
	
	//Animar el objeto si tienen una animación
	if (templ.animation) {
		mesh.traverse(function (child) {
			if (child instanceof THREE.SkinnedMesh) {
				var animation = new THREE.Animation(child, child.geometry.animation);
				animation.play();
			}
		})
	};
   
    //Aplicar la inteligencia artificial si hay definida
	if (templ.ai) {
		this.ai=new $AIS[templ.ai](this.mesh, this.prop);
		$WORLD.addToListUpdate (this.ai); 
	}
	$WORLD.scene.add(mesh);
	
	
	return mesh;
};
