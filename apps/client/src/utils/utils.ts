import * as THREE from "three"

const center = (point) => {
	const x_vals = point.map((p) => p.x / 100);
	const y_vals = point.map((p) => p.y / 100);
	const points_for = x_vals.map((x, i) => new THREE.Vector3(x, y_vals[i], 0));

	const box = new THREE.Box3();
	points_for.forEach((point) => box.expandByPoint(point));

	const center = box.getCenter(new THREE.Vector3());
	return center;
}


