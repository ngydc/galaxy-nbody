function main() {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	window.addEventListener("resize", onWindowResize, false);

	let particles = [];

	particles = generateParticles();

	camera.position.z = 500;
	let boundary = new THREE.Box3(new THREE.Vector3(-300, -300, 0), new THREE.Vector3(300, 300, 0));
	let helper = new THREE.Box3Helper(boundary);
	scene.add(helper);
	for (let particle of particles) {
		scene.add(particle);
	}
	renderer.render(scene, camera);

	function animate() {
		requestAnimationFrame(animate);
		buildTree(particles);
		renderer.render(scene, camera);
	}
	animate();

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}
}

main();

function buildTree(particles) {
	let boundary = new THREE.Box3(new THREE.Vector3(-300, -300, 0), new THREE.Vector3(300, 300, 0));
	let quadtree = new TreeNode(boundary);
	for (let particle of particles) {
		quadtree.insert(particle);
	}
	quadtree.computeMassDistribution();
	for (let particle of particles) {
		particle.applyForce(quadtree.calculateForce(particle));
		particle.update();
	}
}

function generateParticles() {
	array = [];
	for (let i = 0; i < 10; i++) {
		let radius = getRandomVal(1, 7);
		let particle = new Particle(radius, getRandomVal(-300, 300), getRandomVal(-300, 300), 0, radius * 0.05);
		array.push(particle);
	}
	//console.log(array);
	return array;
}

function getRandomVal(min, max) {
	return Math.random() * (max - min + 1) + min;
}
