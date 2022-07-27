import * as THREE from 'three';

			import Stats from '../jsm/libs/stats.module.js';

			import { OrbitControls } from '../jsm/controls/OrbitControls.js';
			import { FBXLoader } from '../jsm/loaders/FBXLoader.js';

			let camera, scene, renderer, stats;

			const clock = new THREE.Clock();

			let mixer;
			let stopPlane = false;
			let plane;
			init();
			animate();

			function init() {

				const container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.set( 0, 500, 0 );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xa0a0a0 );
				// scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

				const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				hemiLight.position.set( 0, 200, 0 );
				scene.add( hemiLight );

				const dirLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
				dirLight.position.set( 0, 200, 100 );
				dirLight.castShadow = true;
				dirLight.shadow.camera.top = 1180;
				dirLight.shadow.camera.bottom = - 1100;
				dirLight.shadow.camera.left = - 1120;
				dirLight.shadow.camera.right = 1120;
				scene.add( dirLight );

				// scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

				// ground
				const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
				mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
				scene.add( mesh );

				// const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
				// grid.material.opacity = 0.2;
				// grid.material.transparent = true;
				// scene.add( grid );

				// model
				const loader = new FBXLoader();
				loader.load( '../models/Cosmonaut.fbx', function ( object ) {

					mixer = new THREE.AnimationMixer( object );

					const action = mixer.clipAction( object.animations[ 0 ] );
					action.play();
					object.position.set(0,170,30);
					object.rotation.set(-160,0,0);
					object.scale.set(0.25, 0.25, 0.25);
					object.traverse( function ( child ) {

						if ( child.isMesh ) {

							child.castShadow = true;
							child.receiveShadow = true;

						}

					} );

					scene.add( object );

				} );

				// add plane
				const geometry = new THREE.PlaneGeometry( 2000, 2000 );
				const material = new THREE.MeshBasicMaterial( {color: 0x151515, side: THREE.DoubleSide} );
				plane = new THREE.Mesh( geometry, material );
				plane.position.set(15,60,0);
				plane.rotation.set(11,0,0);
				plane.receiveShadow = true;
				plane.castShadow = true;
				scene.add( plane );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.shadowMap.enabled = true;
				container.appendChild( renderer.domElement );

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.enabled = false;
				controls.target.set( 0, 100, 0 );
				controls.update();

				window.addEventListener( 'resize', onWindowResize );

				// stats
				// stats = new Stats();
				// container.appendChild( stats.dom );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				const delta = clock.getDelta();

				if ( mixer ) 
				{
					mixer.update( delta );
				}

				if (stopPlane == false)
				{
					plane.position.y += 0.2;
				}
				
				if (plane.position.y >= 160)
				{
					stopPlane = true;
				}

				renderer.render( scene, camera );

				stats.update();

			}
