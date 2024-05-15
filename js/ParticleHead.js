/* La clase Background encapsula todas las propiedades y métodos relacionados 
con la animación de fondo. */
class Background {
    /*Establece propiedades iniciales incluyendo los elementos de la ventana 
    y el documento, y calcula las dimensiones iniciales.*/
   constructor() {
       this.site = {
           window: $(window),
           document: $(document),
           Width: $(window).width(),
           Height: $(window).height()
       };

       this.windowHalfX = this.site.Width / 2;
       this.windowHalfY = this.site.Height / 2;

       this.mouseX = 0;
       this.mouseY = 0;
       this.p = null;
   }
    /*Inicializa los componentes de WebGL, carga modelos y configura la escena. 
    También registra los manejadores de eventos para el movimiento del ratón y el cambio de tamaño de la ventana.*/
   init() {
       if (!Modernizr.webgl) {
           alert('Your browser does not support WebGL');
       }

       this.camera = new THREE.PerspectiveCamera(35, this.site.Width / this.site.Height, 1, 2000);
       this.camera.position.z = 300;
       this.scene = new THREE.Scene();

       var manager = new THREE.LoadingManager();

       var p_geom = new THREE.Geometry();
       var p_material = new THREE.ParticleBasicMaterial({
           color: 0xFFFFFF,
           size: 1.9
       });

       var loader = new THREE.OBJLoader(manager);
       loader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/40480/head.obj', (object) => {
           object.traverse((child) => {
               if (child instanceof THREE.Mesh) {
                   var scale = 8;
                   $(child.geometry.vertices).each(function() {
                       p_geom.vertices.push(new THREE.Vector3(this.x * scale, this.y * scale, this.z * scale));
                   });
               }
           });

           this.p = new THREE.ParticleSystem(p_geom, p_material);
           this.scene.add(this.p);
       });

       this.renderer = new THREE.WebGLRenderer({ alpha: true });
       this.renderer.setSize(this.site.Width, this.site.Height);
       this.renderer.setClearColor(0x000000, 0);

       $('.particlehead').append(this.renderer.domElement);
       $('.particlehead').on('mousemove', (event) => this.onDocumentMouseMove(event));
       this.site.window.on('resize', () => this.onWindowResize());
       this.animate();
   }
   /*onWindowResize y onDocumentMouseMove actualizan la escena y 
   la cámara basándose en las interacciones del usuario.*/
   onWindowResize() {
       this.windowHalfX = this.site.Width / 2;
       this.windowHalfY = this.site.Height / 2;
       this.camera.aspect = this.site.Width / this.site.Height;
       this.camera.updateProjectionMatrix();
       this.renderer.setSize(this.site.Width, this.site.Height);
   }

   onDocumentMouseMove(event) {
       this.mouseX = (event.clientX - this.windowHalfX) / 2;
       this.mouseY = (event.clientY - this.windowHalfY) / 2;
   }
   /*El método animate se llama recursivamente para mantener la animación en funcionamiento. 
   El método render actualiza la posición de la cámara basándose en el movimiento del ratón y renderiza la escena.*/
   animate() {
       requestAnimationFrame(() => this.animate());
       this.render();
   }

   render() {
       this.camera.position.x += ((this.mouseX * .5) - this.camera.position.x) * .05;
       this.camera.position.y += (-(this.mouseY * .5) - this.camera.position.y) * .05;
       this.camera.lookAt(this.scene.position);
       this.renderer.render(this.scene, this.camera);
   }
}

const background = new Background();
background.init();
