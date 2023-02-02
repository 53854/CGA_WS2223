import * as THREE from "three";
import { FBXLoader } from "fbxloader";

export default class TurbineFromFile extends THREE.Group {
  constructor() {
    super();
    this.fbxloader = new FBXLoader();
    this.loadingDone = false;
    this.animationState = false;
    this.animationMixer = null;
    this.animations = new Map();
    this.isInteractionGroup = true;
    this.localTimeScale = 1;
    this.efficiency = 1;
    this.load(this);
  }

  load(thisTurbine) {
    this.fbxloader.load("src/models/turbine.fbx", function (fbx) {
      fbx.parent = thisTurbine;
      fbx.traverse(function (child) {
        if (child.isMesh) {
          console.log(child.name);

        }
        child.castShadow = true;
        child.receiveShadow = true;
      });

      thisTurbine.animationMixer = new THREE.AnimationMixer(fbx);
      for (let i = 0; i < fbx.animations.length; i++) {
        let action = thisTurbine.animationMixer.clipAction(fbx.animations[i]);
        action.clampWhenFinished = true;
        action.setLoop(THREE.LoopRepeat, Infinity);
        thisTurbine.animations.set(fbx.animations[i].name, action);
      }

      thisTurbine.add(fbx);
      
    });
    this.loadingDone = true;
  }

  addPhysics() {
    if (this.loadingDone === false) {
      window.setTimeout(this.addPhysics.bind(this), 100);
    } else {
      window.physics.addCylinder(this, 100, 1, 3, 40, 12, 0,20,0);
    }
  }

  setEfficiency(efficiency) {
    this.efficiency = efficiency;
  }

  toggleAnimation(){
    if (this.animationState) {
      this.animationState = false;
      this.animations.get("Turbine|spin").paused = true;
    } else {
      this.animationState = true;
      if(this.animations.get("Turbine|spin").paused){
        this.animations.get("Turbine|spin").paused = false;
      } else {
        this.animations.get("Turbine|spin").play();
      }
      
    }
  }
}
