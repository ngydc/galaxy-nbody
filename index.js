function main() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	window.addEventListener("resize", onWindowResize, false);

	const particles = [];

	for (let i = 0; i < 100; i++) {
		let particle = new Particle(getRandomInt(1, 3), getRandomInt(-100, 100), getRandomInt(-100, 100), 0, 0);
		particles.push(particle);
		scene.add(particle);
	}

	let boundary = new THREE.Box3(new THREE.Vector3(-150, -150, 0), new THREE.Vector3(100, 100, 0));
	let helper = new THREE.Box3Helper(boundary, 0xffffff);
	let quadtree = new QuadTree(boundary, 1);

	for (particle of particles) {
		let position = new THREE.Vector3(particle.position.x, particle.position.y, particle.position.z);
		quadtree.insert(position);
	}

	scene.add(quadtree);
	scene.add(helper);

	camera.position.z = 300;
	renderer.render(scene, camera);
	/* 	const animate = function () {
		requestAnimationFrame(animate);

		renderer.render(scene, camera);
	};

	animate(); */

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
	}
}

main();

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
