class Particle extends THREE.Mesh {
	constructor(radius, x, y, z, mass) {
		const geometry = new THREE.SphereGeometry(radius, 20, 20);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		super(geometry, material);
		this.radius = radius;
		this.position.set(x, y, z);
		this.mass = mass;
		this.a = new THREE.Vector3(0, 0, 0);
		this.v = new THREE.Vector3(0, 0, 0);
	}

	update() {
		this.v.add(this.a);
		this.position.add(this.v);
		if (!bounds.containsPoint(this.position)) {
			this.position.sub(this.v);
			this.v.multiplyScalar(-1);
		}
		this.a.set(0, 0, 0);
		//console.log(this.position);
	}

	applyForce(force) {
		let f = force;
		f.divideScalar(this.mass);
		this.a.add(f);
		//console.log(this.a);
	}
}
const bounds = new THREE.Box3(new THREE.Vector3(-300, -300, 0), new THREE.Vector3(300, 300, 0));
