//****************************
// CREA LA NATURALEZA
//****************************

$WORLD.drawNature = function () {

		var nat=$WORLD.map.nature;
		//CARGAR EN MEMORIA TODOS LOS SPRITES
		var list=Object.keys(nat.patterns);
		for (var i=0;i<list.length;i++) {
			var pat=nat.patterns[list[i]];
			for (var n=0;n<pat.elements.length;n++) {
				var el=pat.elements[n];
				var mat = new THREE.SpriteMaterial( { map: $WORLD.textureLoader.load(el.object), useScreenCoordinates: false, transparent: true,fog:true} );
				var obj =new THREE.Sprite(mat);
				obj.scale.y=el.height;
				obj.scale.x=el.width;
				el._sprite = obj;
			}
		}
		//PARA CADA ZONA AÑADIR LOSaerboles
		for (var j=0;j<nat.zones.length;j++) {
			var zon=nat.zones[j];
			var pat=nat.patterns[zon.pattern];
			for (var x=zon.minX;x<zon.maxX-pat.freqX;x+=pat.freqX) {
				for (var z=zon.minZ;z<zon.maxZ-pat.freqZ;z+=pat.freqZ) {
					var i=Math.round(Math.random()*(pat.elements.length-1));
					var el=pat.elements[i];
					var obj2=el._sprite.clone();z
					obj2.position.set(x+(Math.random()*pat.freqX), el.height/2-0.05, z+(Math.random()*pat.freqZ));
					$WORLD.scene.add(obj2);
				}
			}
		}

		
};

