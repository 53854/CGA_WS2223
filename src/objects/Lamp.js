import * as THREE from "three";

export default class Lamp extends THREE.Group {
  constructor() {
    super();
    this.lightsource = null;
    this.color = 0x09ed46;
    this.intensity = 1;
    this.distance = 50;
    this.loadingDone = false;
    this.name = "Lamp";
    this.addParts();
  }

  addParts() {
    var sphereGeometry = new THREE.SphereGeometry(3, 16, 16);
    var cylinderGeometry = new THREE.CylinderGeometry(2, 1, 2, 32);

    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

    var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.y = 0;
    
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.y = cylinder.position.y + sphereGeometry.parameters.radius;

    var pointlight = new THREE.PointLight(this.color, this.intensity, this.distance);
    pointlight.position.y = sphere.position.y;
    pointlight.castShadow = true;
    this.lightsource = pointlight;

    this.add(pointlight);
    this.add(sphere);
    this.add(cylinder);

    this.loadingDone = true;
  }

  addPhysics() {
    if (this.loadingDone === false) {
      window.setTimeout(this.addPhysics.bind(this), 100);
    } else {
      window.physics.addCylinder(this, 2, 3, 3, 7, 12,0,3,0);
    }
  }

  setColor(color) {
    this.color = color;
    this.lightsource.color = new THREE.Color(color);
  }

  toggleLight(){
    this.lightsource.visible = !this.lightsource.visible;
  }
}
