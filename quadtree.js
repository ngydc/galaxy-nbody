class TreeNode {
	constructor(boundary) {
		this.boundary = boundary;
		this.body = undefined;
		this.particle_amount = 0;
		this.mass = 0;
		this.centerOfMass = new THREE.Vector3(0, 0, 0);
		this.quadrants = [];
		this.divided = false;
	}

	reset() {
		this.body = undefined;
		this.particle_amount = 0;
		this.mass = 0;
		this.centerOfMass = new THREE.Vector3(0, 0, 0);
		this.quadrants = [];
		this.divided = false;
	}

	subdivide() {
		const x_min = this.boundary.min.x;
		const y_min = this.boundary.min.y;
		const x_max = this.boundary.max.x;
		const y_max = this.boundary.max.y;

		const se = new THREE.Box3(
			new THREE.Vector3((x_min + x_max) / 2, y_min, 0),
			new THREE.Vector3(x_max, (y_min + y_max) / 2, 0)
		);
		const sw = new THREE.Box3(
			new THREE.Vector3(x_min, y_min, 0),
			new THREE.Vector3((x_min + x_max) / 2, (y_min + y_max) / 2, 0)
		);
		const ne = new THREE.Box3(
			new THREE.Vector3((x_min + x_max) / 2, (y_min + y_max) / 2, 0),
			new THREE.Vector3(x_max, y_max, 0)
		);
		const nw = new THREE.Box3(
			new THREE.Vector3(x_min, (y_min + y_max) / 2, 0),
			new THREE.Vector3((x_min + x_max) / 2, y_max, 0)
		);

		this.quadrants.push(new TreeNode(se));
		this.quadrants.push(new TreeNode(sw));
		this.quadrants.push(new TreeNode(ne));
		this.quadrants.push(new TreeNode(nw));

		this.divided = true;
	}

	insert(newParticle) {
		if (this.particle_amount > 1) {
			let quadrant = this.getQuadrant(newParticle);
			quadrant.insert(newParticle);
		} else if (this.particle_amount === 1) {
			this.subdivide();
			let quadrant1 = this.getQuadrant(newParticle);
			quadrant1.insert(newParticle);
			let quadrant2 = this.getQuadrant(this.body);
			quadrant2.insert(this.body);
			this.body = undefined;
		} else if (typeof this.body === "undefined") {
			this.body = newParticle;
		} else {
			console.log(newParticle);
		}

		this.particle_amount += 1;
	}

	getQuadrant(particle) {
		for (let quad of this.quadrants) {
			if (quad.boundary.containsPoint(particle.position)) {
				return quad;
			}
		}
		return undefined;
	}

	computeMassDistribution() {
		if (this.particle_amount === 1) {
			this.centerOfMass = this.body.position;
			this.mass = this.body.mass;
		} else {
			for (let quad of this.quadrants) {
				if (quad.particle_amount === 0) {
					return;
				}
				quad.computeMassDistribution();
				// add mass of each quadrant to the total
				this.mass += quad.mass;

				// calculate the center

				this.centerOfMass.set(
					this.centerOfMass.x + quad.mass * quad.centerOfMass.x,
					this.centerOfMass.y + quad.mass * quad.centerOfMass.y,
					this.centerOfMass.z + quad.mass * quad.centerOfMass.z
				);
			}

			this.centerOfMass.divideScalar(this.mass);
		}
	}

	calculateForce(targetParticle) {
		if (this.particle_amount === 1) {
			if (targetParticle.id === this.body.id) return new THREE.Vector3(0, 0, 0);
			return this.calc(this.body.mass, targetParticle.mass, this.body.position, targetParticle.position);
		} else {
			let r = Math.abs(this.centerOfMass.distanceTo(targetParticle.position));
			let d = Math.abs(this.boundary.max.x - this.boundary.min.x);

			if (d / r < 0.5) {
				return this.calc(this.mass, targetParticle.mass, this.centerOfMass, targetParticle.position);
			} else {
				let force = new THREE.Vector3(0, 0, 0);
				for (let quad of this.quadrants) {
					force.add(quad.calculateForce(targetParticle));
				}
				return force;
			}
		}
	}

	calc(curr_mass, target_mass, curr_pos, target_pos) {
		let force = new THREE.Vector3(0, 0, 0);
		let ds = curr_pos.distanceTo(target_pos);
		force.subVectors(curr_pos, target_pos);
		force.normalize();
		// gravity force, softening for avoiding extreme numerical deviation
		let acc = (10 * curr_mass * target_mass) / Math.sqrt(ds * ds + 0.01 * 0.01);
		force.multiplyScalar(acc);
		return force;
	}

	traverse() {
		if (this.particle_amount === 1) {
			console.log(this.particle_amount, this.mass, this.centerOfMass);
		} else {
			if (this.quadrants.length > 0) {
				for (let quad of this.quadrants) {
					quad.traverse();
				}
				console.log(this.particle_amount, this.mass, this.centerOfMass);
			}
		}
	}
}
