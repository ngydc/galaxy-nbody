class QuadTree extends THREE.Group {
	constructor(boundary, n) {
		super();
		this.boundary = boundary;
		this.capacity = n;
		this.points = [];
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
		this.southeast = new QuadTree(se, this.capacity, this.scene);
		const sw = new THREE.Box3(
			new THREE.Vector3(x_min, y_min, 0),
			new THREE.Vector3((x_min + x_max) / 2, (y_min + y_max) / 2, 0)
		);
		this.southwest = new QuadTree(sw, this.capacity, this.scene);
		const ne = new THREE.Box3(
			new THREE.Vector3((x_min + x_max) / 2, (y_min + y_max) / 2, 0),
			new THREE.Vector3(x_max, y_max, 0)
		);
		this.northeast = new QuadTree(ne, this.capacity, this.scene);
		const nw = new THREE.Box3(
			new THREE.Vector3(x_min, (y_min + y_max) / 2, 0),
			new THREE.Vector3((x_min + x_max) / 2, y_max, 0)
		);
		this.northwest = new QuadTree(nw, this.capacity, this.scene);

		const box1 = new THREE.Box3Helper(ne, 0xffffff);
		const box2 = new THREE.Box3Helper(nw, 0xffffff);
		const box3 = new THREE.Box3Helper(se, 0xffffff);
		const box4 = new THREE.Box3Helper(sw, 0xffffff);

		this.add(box1);
		this.add(box2);
		this.add(box3);
		this.add(box4);

		this.add(this.southeast);
		this.add(this.southwest);
		this.add(this.northeast);
		this.add(this.northwest);

		/* 		this.add(this.northeast);
		this.add(this.northwest);
		this.add(this.southeast);
		this.add(this.southwest); */

		this.divided = true;
	}

	insert(point) {
		if (!this.boundary.containsPoint(point)) {
			return false;
		}

		if (this.points.length < this.capacity) {
			this.points.push(point);
			return true;
		} else {
			if (!this.divided) {
				this.subdivide();
			}
			if (this.northeast.insert(point)) {
				return true;
			} else if (this.northwest.insert(point)) {
				return true;
			} else if (this.southeast.insert(point)) {
				return true;
			} else if (this.southwest.insert(point)) {
				return true;
			}
		}
	}
}
