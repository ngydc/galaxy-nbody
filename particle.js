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
		let tmp = new THREE.Vector3().addVectors(this.v, this.position);

		// scuffed bounds detection
		if (!bounds.containsPoint(tmp)) {
			if (tmp.x >= bounds.max.x || tmp.x <= bounds.min.x) {
				this.v.reflect(new THREE.Vector3(1, 0, 0));
			} else if (tmp.y >= bounds.max.y || tmp.y <= bounds.min.y) {
				this.v.reflect(new THREE.Vector3(0, 1, 0));
			}
			this.position.sub(this.v);
		}

		this.position.add(this.v);

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
const bounds = new THREE.Box3(new THREE.Vector3(-500, -500, 0), new THREE.Vector3(500, 500, 0));
