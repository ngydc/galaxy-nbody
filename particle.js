class Particle extends THREE.Mesh {
	constructor(radius, x, y, z, mass) {
		const geometry = new THREE.SphereGeometry(radius, 20, 20);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		super(geometry, material);
		this.radius = radius;
		this.position.x = x;
		this.position.y = y;
		this.position.z = z;
		this.mass = mass;
	}
}
