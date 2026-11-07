import fs from 'fs';
import path from 'path';

global.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = 'data:' + (blob.type || 'application/octet-stream') + ';base64,' + Buffer.from(buf).toString('base64');
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
};

import('three').then(async (THREE) => {
  const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');

  const scene = new THREE.Scene();
  const root = new THREE.Group();
  root.name = 'HumanFlyer';
  scene.add(root);

  // Materials: Sleek Spider-Hero / Modern Aerodynamic Athletic Human Suit
  const primarySuitMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Stealth slate carbon-fiber
    roughness: 0.4,
    metalness: 0.25
  });

  const spiderAccentMat = new THREE.MeshStandardMaterial({
    color: 0xe11d48, // Vibrant Spider Crimson
    roughness: 0.35,
    metalness: 0.2
  });

  const webWingMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8, // Holographic translucent aerodynamic glide membrane
    roughness: 0.2,
    metalness: 0.6,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
  });

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xf6d5c2,
    roughness: 0.7,
    metalness: 0.0
  });

  const eyeVisorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.6,
    roughness: 0.1,
    metalness: 0.9
  });

  const sneakerMat = new THREE.MeshStandardMaterial({
    color: 0xe11d48,
    roughness: 0.5,
    metalness: 0.1
  });

  // Human Frame (In flight pose: +Y is Forward flight direction, +Z is Back/Up, +X is Right)
  // 1. Torso & Athletic Chest
  const chestGeo = new THREE.BoxGeometry(0.48, 0.42, 0.28);
  const chest = new THREE.Mesh(chestGeo, primarySuitMat);
  chest.position.set(0, 0.55, 0);
  root.add(chest);

  // Spider / Chevron chest emblem
  const chestAccentGeo = new THREE.BoxGeometry(0.40, 0.26, 0.08);
  const chestAccent = new THREE.Mesh(chestAccentGeo, spiderAccentMat);
  chestAccent.position.set(0, 0.58, -0.13); // facing towards earth
  root.add(chestAccent);

  // Athletic Waist & Abs
  const absGeo = new THREE.BoxGeometry(0.38, 0.35, 0.24);
  const abs = new THREE.Mesh(absGeo, primarySuitMat);
  abs.position.set(0, 0.20, 0);
  root.add(abs);

  // Hip / Pelvis
  const pelvisGeo = new THREE.BoxGeometry(0.40, 0.22, 0.26);
  const pelvis = new THREE.Mesh(pelvisGeo, spiderAccentMat);
  pelvis.position.set(0, -0.15, 0);
  root.add(pelvis);

  // 2. Human Head & Sleek Mask/Eyes
  const neckGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.14, 12);
  neckGeo.rotateX(Math.PI / 2);
  const neck = new THREE.Mesh(neckGeo, primarySuitMat);
  neck.position.set(0, 0.82, 0.02);
  root.add(neck);

  const headGeo = new THREE.SphereGeometry(0.15, 16, 16);
  headGeo.scale(0.88, 1.05, 1.0);
  const head = new THREE.Mesh(headGeo, spiderAccentMat);
  head.position.set(0, 0.96, 0.06);
  root.add(head);

  // Expressive Spider-Man style mask lenses
  const leftEyeGeo = new THREE.BoxGeometry(0.08, 0.06, 0.02);
  leftEyeGeo.rotateZ(0.2);
  const leftEye = new THREE.Mesh(leftEyeGeo, eyeVisorMat);
  leftEye.position.set(0.06, 0.96, -0.08);
  root.add(leftEye);

  const rightEyeGeo = new THREE.BoxGeometry(0.08, 0.06, 0.02);
  rightEyeGeo.rotateZ(-0.2);
  const rightEye = new THREE.Mesh(rightEyeGeo, eyeVisorMat);
  rightEye.position.set(-0.06, 0.96, -0.08);
  root.add(rightEye);

  // 3. Human Arms & Spider-Man Web-Wing Glider Membranes
  // Right Arm (Reaching forward guiding the flight path)
  const rShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), spiderAccentMat);
  rShoulder.position.set(0.32, 0.68, 0.02);
  root.add(rShoulder);

  const rArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.44, 12);
  rArmGeo.rotateX(Math.PI / 2);
  const rArm = new THREE.Mesh(rArmGeo, primarySuitMat);
  rArm.position.set(0.34, 0.92, 0.04);
  root.add(rArm);

  const rForearmGeo = new THREE.CylinderGeometry(0.07, 0.065, 0.44, 12);
  rForearmGeo.rotateX(Math.PI / 2);
  const rForearm = new THREE.Mesh(rForearmGeo, spiderAccentMat);
  rForearm.position.set(0.36, 1.34, 0.06);
  root.add(rForearm);

  const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.08), primarySuitMat);
  rHand.position.set(0.36, 1.60, 0.06);
  root.add(rHand);

  // Left Arm (Outstretched in dynamic glide)
  const lShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), spiderAccentMat);
  lShoulder.position.set(-0.32, 0.68, 0.02);
  root.add(lShoulder);

  const lArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.44, 12);
  lArmGeo.rotateX(Math.PI / 2);
  const lArm = new THREE.Mesh(lArmGeo, primarySuitMat);
  lArm.position.set(-0.34, 0.92, 0.04);
  root.add(lArm);

  const lForearmGeo = new THREE.CylinderGeometry(0.07, 0.065, 0.44, 12);
  lForearmGeo.rotateX(Math.PI / 2);
  const lForearm = new THREE.Mesh(lForearmGeo, spiderAccentMat);
  lForearm.position.set(-0.36, 1.34, 0.06);
  root.add(lForearm);

  const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.08), primarySuitMat);
  lHand.position.set(-0.36, 1.60, 0.06);
  root.add(lHand);

  // --- SPIDER-MAN WEB WINGS (Under-Arm Aerodynamic Glider Membranes) ---
  // Right Wing Membrane (Torso rib to right wrist)
  const rWingShape = new THREE.Shape();
  rWingShape.moveTo(0.24, 0.10);  // at waist
  rWingShape.lineTo(0.24, 0.65);  // at armpit
  rWingShape.lineTo(0.48, 1.35);  // at forearm
  rWingShape.quadraticCurveTo(0.46, 0.60, 0.24, 0.10);
  const rWingGeo = new THREE.ShapeGeometry(rWingShape);
  const rWing = new THREE.Mesh(rWingGeo, webWingMat);
  rWing.position.set(0, 0, 0.02);
  root.add(rWing);

  // Left Wing Membrane (Torso rib to left wrist)
  const lWingShape = new THREE.Shape();
  lWingShape.moveTo(-0.24, 0.10); // at waist
  lWingShape.lineTo(-0.24, 0.65); // at armpit
  lWingShape.lineTo(-0.48, 1.35); // at forearm
  lWingShape.quadraticCurveTo(-0.46, 0.60, -0.24, 0.10);
  const lWingGeo = new THREE.ShapeGeometry(lWingShape);
  const lWing = new THREE.Mesh(lWingGeo, webWingMat);
  lWing.position.set(0, 0, 0.02);
  root.add(lWing);

  // 4. Human Legs (Athletic human flight posture with slight knee flexion)
  // Right Leg
  const rThighGeo = new THREE.CylinderGeometry(0.10, 0.085, 0.58, 12);
  rThighGeo.rotateX(Math.PI / 2);
  const rThigh = new THREE.Mesh(rThighGeo, primarySuitMat);
  rThigh.position.set(0.14, -0.48, -0.02);
  root.add(rThigh);

  const rKnee = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), spiderAccentMat);
  rKnee.position.set(0.14, -0.80, -0.04);
  root.add(rKnee);

  const rShinGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.62, 12);
  rShinGeo.rotateX(Math.PI / 2);
  const rShin = new THREE.Mesh(rShinGeo, primarySuitMat);
  rShin.position.set(0.13, -1.14, -0.05);
  root.add(rShin);

  const rFootGeo = new THREE.BoxGeometry(0.09, 0.22, 0.08);
  rFootGeo.rotateX(Math.PI / 6);
  const rFoot = new THREE.Mesh(rFootGeo, sneakerMat);
  rFoot.position.set(0.13, -1.50, -0.08);
  root.add(rFoot);

  // Left Leg
  const lThighGeo = new THREE.CylinderGeometry(0.10, 0.085, 0.58, 12);
  lThighGeo.rotateX(Math.PI / 2);
  const lThigh = new THREE.Mesh(lThighGeo, primarySuitMat);
  lThigh.position.set(-0.14, -0.48, -0.02);
  root.add(lThigh);

  const lKnee = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), spiderAccentMat);
  lKnee.position.set(-0.14, -0.80, -0.04);
  root.add(lKnee);

  const lShinGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.62, 12);
  lShinGeo.rotateX(Math.PI / 2);
  const lShin = new THREE.Mesh(lShinGeo, primarySuitMat);
  lShin.position.set(-0.13, -1.14, -0.05);
  root.add(lShin);

  const lFootGeo = new THREE.BoxGeometry(0.09, 0.22, 0.08);
  lFootGeo.rotateX(Math.PI / 6);
  const lFoot = new THREE.Mesh(lFootGeo, sneakerMat);
  lFoot.position.set(-0.13, -1.50, -0.08);
  root.add(lFoot);

  // Export to GLB
  const dir = path.resolve('public/models');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const exporter = new GLTFExporter();
  const glbBuffer = await exporter.parseAsync(scene, { binary: true });
  
  fs.writeFileSync(path.join(dir, 'superhero.glb'), Buffer.from(glbBuffer));
  console.log('Successfully generated Human Spider Flyer GLB! Size:', glbBuffer.byteLength, 'bytes');
});
