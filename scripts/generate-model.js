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
  root.name = 'HumanHero';
  scene.add(root);

  // ==========================================
  // REALISTIC HUMAN MATERIALS
  // ==========================================
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xdf9e85, // Realistic warm human skin tone
    roughness: 0.65,
    metalness: 0.05
  });

  const skinShadowMat = new THREE.MeshStandardMaterial({
    color: 0xcd8970, // Slightly darker skin tone for depth/definition
    roughness: 0.7,
    metalness: 0.05
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x221814, // Rich dark brown/black styled hair
    roughness: 0.8,
    metalness: 0.1
  });

  const eyeWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.2,
    metalness: 0.1
  });

  const eyeIrisMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a, // Striking deep blue/amber human iris
    roughness: 0.2,
    metalness: 0.4
  });

  const browMat = new THREE.MeshStandardMaterial({
    color: 0x1f1917,
    roughness: 0.9,
    metalness: 0.0
  });

  const lipsMat = new THREE.MeshStandardMaterial({
    color: 0xb57065,
    roughness: 0.5,
    metalness: 0.0
  });

  // Modern Athletic Flight Suit / Leather Aviator Jacket
  const jacketMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Tactical midnight slate leather
    roughness: 0.45,
    metalness: 0.25
  });

  const jacketTrimMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Vibrant electric cyan flight seam accents
    roughness: 0.35,
    metalness: 0.5
  });

  const leatherCollarMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.5,
    metalness: 0.2
  });

  const trousersMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Dark reinforced combat flight pants
    roughness: 0.6,
    metalness: 0.15
  });

  const bootsMat = new THREE.MeshStandardMaterial({
    color: 0x090d16, // Black tactical flight boots
    roughness: 0.4,
    metalness: 0.3
  });

  const gloveMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
    metalness: 0.2
  });

  const capeMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Flowing electric hero flight cape
    roughness: 0.3,
    metalness: 0.4,
    side: THREE.DoubleSide
  });

  // ==========================================
  // REALISTIC HUMAN BODY (In Flight Pose)
  // Coordinates in Cesium: +Y is Forward, +Z is Up/Back, +X is Right
  // ==========================================

  // --- 1. TORSO & SPINE ---
  const spineGroup = new THREE.Group();
  spineGroup.name = 'Spine';
  root.add(spineGroup);

  // Chest / Pectorals
  const chestGeo = new THREE.CylinderGeometry(0.24, 0.21, 0.42, 16);
  chestGeo.rotateX(Math.PI / 2);
  const chest = new THREE.Mesh(chestGeo, jacketMat);
  chest.name = 'Chest';
  chest.position.set(0, 0.48, 0.04);
  chest.scale.set(1.15, 1.0, 0.72);
  spineGroup.add(chest);

  // Pectoral Muscle Contours
  const lPecGeo = new THREE.SphereGeometry(0.12, 12, 12);
  lPecGeo.scale(1.1, 1.3, 0.5);
  const lPec = new THREE.Mesh(lPecGeo, jacketTrimMat);
  lPec.position.set(-0.11, 0.52, -0.09);
  spineGroup.add(lPec);

  const rPec = new THREE.Mesh(lPecGeo, jacketTrimMat);
  rPec.position.set(0.11, 0.52, -0.09);
  spineGroup.add(rPec);

  // Jacket Collar
  const collarGeo = new THREE.TorusGeometry(0.13, 0.04, 8, 16);
  collarGeo.rotateX(Math.PI / 2);
  const collar = new THREE.Mesh(collarGeo, leatherCollarMat);
  collar.position.set(0, 0.69, 0.05);
  spineGroup.add(collar);

  // Waist & Core
  const waistGeo = new THREE.CylinderGeometry(0.19, 0.18, 0.30, 16);
  waistGeo.rotateX(Math.PI / 2);
  const waist = new THREE.Mesh(waistGeo, jacketMat);
  waist.position.set(0, 0.18, 0.02);
  waist.scale.set(1.05, 1.0, 0.70);
  spineGroup.add(waist);

  // Tactical Flight Belt & Buckle
  const beltGeo = new THREE.CylinderGeometry(0.20, 0.20, 0.08, 16);
  beltGeo.rotateX(Math.PI / 2);
  const belt = new THREE.Mesh(beltGeo, bootsMat);
  belt.position.set(0, 0.02, 0.01);
  belt.scale.set(1.06, 1.0, 0.72);
  spineGroup.add(belt);

  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.03, 0.05), jacketTrimMat);
  buckle.position.set(0, 0.02, -0.14);
  spineGroup.add(buckle);

  // Pelvis / Hips
  const pelvisGeo = new THREE.CylinderGeometry(0.18, 0.19, 0.22, 16);
  pelvisGeo.rotateX(Math.PI / 2);
  const pelvis = new THREE.Mesh(pelvisGeo, trousersMat);
  pelvis.position.set(0, -0.12, 0);
  pelvis.scale.set(1.10, 1.0, 0.75);
  spineGroup.add(pelvis);

  // --- 2. REALISTIC HEAD & MASCULINE FACE ---
  const headGroup = new THREE.Group();
  headGroup.name = 'Head';
  headGroup.position.set(0, 0.72, 0.05);
  spineGroup.add(headGroup);

  // Muscular Neck
  const neckGeo = new THREE.CylinderGeometry(0.095, 0.11, 0.14, 14);
  neckGeo.rotateX(Math.PI / 2);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.set(0, 0.06, 0.01);
  headGroup.add(neck);

  // Sculpted Cranium / Head
  const craniumGeo = new THREE.SphereGeometry(0.14, 18, 18);
  craniumGeo.scale(0.88, 1.08, 1.0);
  const cranium = new THREE.Mesh(craniumGeo, skinMat);
  cranium.position.set(0, 0.22, 0.04);
  headGroup.add(cranium);

  // Sculpted Jaw and Chin
  const jawGeo = new THREE.BoxGeometry(0.16, 0.12, 0.14);
  const jaw = new THREE.Mesh(jawGeo, skinShadowMat);
  jaw.position.set(0, 0.23, -0.06);
  headGroup.add(jaw);

  const chinGeo = new THREE.SphereGeometry(0.05, 10, 10);
  chinGeo.scale(1.1, 0.9, 0.8);
  const chin = new THREE.Mesh(chinGeo, skinMat);
  chin.position.set(0, 0.28, -0.08);
  headGroup.add(chin);

  // Styled Voluminous Hair (Swept Back in Flight)
  const hairBaseGeo = new THREE.SphereGeometry(0.15, 16, 16);
  hairBaseGeo.scale(0.92, 1.15, 1.05);
  const hairBase = new THREE.Mesh(hairBaseGeo, hairMat);
  hairBase.position.set(0, 0.20, 0.09);
  headGroup.add(hairBase);

  // Front Hair Quiff / Bangs
  const hairTopGeo = new THREE.CylinderGeometry(0.08, 0.13, 0.16, 12);
  hairTopGeo.rotateX(Math.PI / 3);
  const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
  hairTop.position.set(0, 0.27, 0.14);
  headGroup.add(hairTop);

  // Left & Right Sideburns
  const lHairSide = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.08, 0.06), hairMat);
  lHairSide.position.set(-0.13, 0.20, 0.02);
  headGroup.add(lHairSide);

  const rHairSide = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.08, 0.06), hairMat);
  rHairSide.position.set(0.13, 0.20, 0.02);
  headGroup.add(rHairSide);

  // Eyes & Eyebrows
  // Left Eye
  const lEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), eyeWhiteMat);
  lEyeWhite.position.set(-0.055, 0.29, -0.02);
  headGroup.add(lEyeWhite);

  const lPupil = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), eyeIrisMat);
  lPupil.position.set(-0.055, 0.305, -0.02);
  headGroup.add(lPupil);

  const lBrow = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.012, 0.01), browMat);
  lBrow.rotation.z = -0.15; // determined expression
  lBrow.position.set(-0.055, 0.29, 0.01);
  headGroup.add(lBrow);

  // Right Eye
  const rEyeWhite = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), eyeWhiteMat);
  rEyeWhite.position.set(0.055, 0.29, -0.02);
  headGroup.add(rEyeWhite);

  const rPupil = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), eyeIrisMat);
  rPupil.position.set(0.055, 0.305, -0.02);
  headGroup.add(rPupil);

  const rBrow = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.012, 0.01), browMat);
  rBrow.rotation.z = 0.15;
  rBrow.position.set(0.055, 0.29, 0.01);
  headGroup.add(rBrow);

  // Sculpted Nose
  const noseGeo = new THREE.ConeGeometry(0.025, 0.06, 6);
  noseGeo.rotateX(-Math.PI / 2.3);
  const nose = new THREE.Mesh(noseGeo, skinShadowMat);
  nose.position.set(0, 0.31, -0.045);
  headGroup.add(nose);

  // Lips
  const lips = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.015), lipsMat);
  lips.position.set(0, 0.30, -0.07);
  headGroup.add(lips);

  // Ears
  const earGeo = new THREE.SphereGeometry(0.035, 8, 8);
  earGeo.scale(0.5, 1.2, 0.9);
  const lEar = new THREE.Mesh(earGeo, skinMat);
  lEar.position.set(-0.13, 0.20, 0.01);
  headGroup.add(lEar);

  const rEar = new THREE.Mesh(earGeo, skinMat);
  rEar.position.set(0.13, 0.20, 0.01);
  headGroup.add(rEar);

  // --- 3. REALISTIC ARMS & ARTICULATED HANDS (Aerodynamic Flight Steering) ---
  // RIGHT ARM (Reaching forward guiding trajectory)
  const rArmGroup = new THREE.Group();
  rArmGroup.name = 'RightArm';
  rArmGroup.position.set(0.28, 0.58, 0.04);
  spineGroup.add(rArmGroup);

  const rDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), jacketMat);
  rDeltoid.position.set(0.04, 0, 0);
  rArmGroup.add(rDeltoid);

  const rBicepGeo = new THREE.CylinderGeometry(0.085, 0.075, 0.40, 14);
  rBicepGeo.rotateX(Math.PI / 2);
  const rBicep = new THREE.Mesh(rBicepGeo, jacketMat);
  rBicep.position.set(0.06, 0.22, 0.01);
  rArmGroup.add(rBicep);

  const rForearmGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.42, 14);
  rForearmGeo.rotateX(Math.PI / 2);
  const rForearm = new THREE.Mesh(rForearmGeo, gloveMat);
  rForearm.position.set(0.08, 0.62, 0.02);
  rArmGroup.add(rForearm);

  // Right Hand & Spread Fingers (steering aerodynamic wind)
  const rHandPalm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.04), skinMat);
  rHandPalm.position.set(0.08, 0.88, 0.02);
  rArmGroup.add(rHandPalm);

  // 5 Fingers
  for (let f = -2; f <= 2; f++) {
    const fingerGeo = new THREE.CylinderGeometry(0.012, 0.009, 0.11, 6);
    fingerGeo.rotateX(Math.PI / 2);
    const finger = new THREE.Mesh(fingerGeo, skinMat);
    finger.position.set(0.08 + f * 0.020, 0.99, 0.02);
    rArmGroup.add(finger);
  }

  // LEFT ARM (Reaching forward in aerodynamic symmetry)
  const lArmGroup = new THREE.Group();
  lArmGroup.name = 'LeftArm';
  lArmGroup.position.set(-0.28, 0.58, 0.04);
  spineGroup.add(lArmGroup);

  const lDeltoid = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 14), jacketMat);
  lDeltoid.position.set(-0.04, 0, 0);
  lArmGroup.add(lDeltoid);

  const lBicepGeo = new THREE.CylinderGeometry(0.085, 0.075, 0.40, 14);
  lBicepGeo.rotateX(Math.PI / 2);
  const lBicep = new THREE.Mesh(lBicepGeo, jacketMat);
  lBicep.position.set(-0.06, 0.22, 0.01);
  lArmGroup.add(lBicep);

  const lForearmGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.42, 14);
  lForearmGeo.rotateX(Math.PI / 2);
  const lForearm = new THREE.Mesh(lForearmGeo, gloveMat);
  lForearm.position.set(-0.08, 0.62, 0.02);
  lArmGroup.add(lForearm);

  // Left Hand & Spread Fingers
  const lHandPalm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.04), skinMat);
  lHandPalm.position.set(-0.08, 0.88, 0.02);
  lArmGroup.add(lHandPalm);

  for (let f = -2; f <= 2; f++) {
    const fingerGeo = new THREE.CylinderGeometry(0.012, 0.009, 0.11, 6);
    fingerGeo.rotateX(Math.PI / 2);
    const finger = new THREE.Mesh(fingerGeo, skinMat);
    finger.position.set(-0.08 + f * 0.020, 0.99, 0.02);
    lArmGroup.add(finger);
  }

  // --- 4. REALISTIC ATHLETIC LEGS & FLIGHT BOOTS ---
  // Right Leg
  const rLegGroup = new THREE.Group();
  rLegGroup.name = 'RightLeg';
  rLegGroup.position.set(0.15, -0.15, 0);
  root.add(rLegGroup);

  const rThighGeo = new THREE.CylinderGeometry(0.115, 0.095, 0.58, 14);
  rThighGeo.rotateX(Math.PI / 2);
  const rThigh = new THREE.Mesh(rThighGeo, trousersMat);
  rThigh.position.set(0, -0.32, -0.02);
  rLegGroup.add(rThigh);

  const rKnee = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), trousersMat);
  rKnee.position.set(0, -0.63, -0.03);
  rLegGroup.add(rKnee);

  const rCalfGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.58, 14);
  rCalfGeo.rotateX(Math.PI / 2);
  const rCalf = new THREE.Mesh(rCalfGeo, trousersMat);
  rCalf.position.set(0, -0.95, -0.04);
  rLegGroup.add(rCalf);

  // Boot
  const rBootGeo = new THREE.BoxGeometry(0.11, 0.28, 0.12);
  rBootGeo.rotateX(Math.PI / 7);
  const rBoot = new THREE.Mesh(rBootGeo, bootsMat);
  rBoot.position.set(0, -1.30, -0.07);
  rLegGroup.add(rBoot);

  // Left Leg
  const lLegGroup = new THREE.Group();
  lLegGroup.name = 'LeftLeg';
  lLegGroup.position.set(-0.15, -0.15, 0);
  root.add(lLegGroup);

  const lThighGeo = new THREE.CylinderGeometry(0.115, 0.095, 0.58, 14);
  lThighGeo.rotateX(Math.PI / 2);
  const lThigh = new THREE.Mesh(lThighGeo, trousersMat);
  lThigh.position.set(0, -0.32, -0.02);
  lLegGroup.add(lThigh);

  const lKnee = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), trousersMat);
  lKnee.position.set(0, -0.63, -0.03);
  lLegGroup.add(lKnee);

  const lCalfGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.58, 14);
  lCalfGeo.rotateX(Math.PI / 2);
  const lCalf = new THREE.Mesh(lCalfGeo, trousersMat);
  lCalf.position.set(0, -0.95, -0.04);
  lLegGroup.add(lCalf);

  const lBootGeo = new THREE.BoxGeometry(0.11, 0.28, 0.12);
  lBootGeo.rotateX(Math.PI / 7);
  const lBoot = new THREE.Mesh(lBootGeo, bootsMat);
  lBoot.position.set(0, -1.30, -0.07);
  lLegGroup.add(lBoot);

  // --- 5. HEROIC FLOWING FLIGHT CAPE (Ripples dynamically in flight) ---
  const capeGroup = new THREE.Group();
  capeGroup.name = 'Cape';
  capeGroup.position.set(0, 0.65, 0.12);
  spineGroup.add(capeGroup);

  // 3 Segmented Cape Mesh with Wind Waves
  for (let c = 0; c < 3; c++) {
    const capeSegGeo = new THREE.PlaneGeometry(0.55 - c * 0.05, 0.45, 8, 4);
    capeSegGeo.rotateX(-Math.PI / 2.05);
    const capeSeg = new THREE.Mesh(capeSegGeo, capeMat);
    capeSeg.name = `CapeSeg_${c}`;
    capeSeg.position.set(0, -0.22 - c * 0.40, 0.05 + c * 0.04);
    capeGroup.add(capeSeg);
  }

  // ==========================================
  // REALISTIC ANIMATION TRACKS (FLUID HUMAN FLIGHT LOOP)
  // ==========================================
  const times = [0, 0.5, 1.0, 1.5, 2.0];

  // Head Scanning / Aerodynamic Micro-Tilt
  const headPosTrack = new THREE.VectorKeyframeTrack(
    'Head.position',
    times,
    [
      0, 0.72, 0.05,
      0, 0.73, 0.055,
      0, 0.72, 0.05,
      0, 0.71, 0.048,
      0, 0.72, 0.05
    ]
  );

  // Arm Micro-Corrections (Left and Right arms feeling the airflow)
  const rArmTrack = new THREE.VectorKeyframeTrack(
    'RightArm.position',
    times,
    [
      0.28, 0.58, 0.04,
      0.29, 0.59, 0.045,
      0.28, 0.58, 0.04,
      0.27, 0.57, 0.038,
      0.28, 0.58, 0.04
    ]
  );

  const lArmTrack = new THREE.VectorKeyframeTrack(
    'LeftArm.position',
    times,
    [
      -0.28, 0.58, 0.04,
      -0.27, 0.57, 0.038,
      -0.28, 0.58, 0.04,
      -0.29, 0.59, 0.045,
      -0.28, 0.58, 0.04
    ]
  );

  // Cape Wind Flutter Ripple
  const cape0Track = new THREE.VectorKeyframeTrack(
    'CapeSeg_0.position',
    times,
    [
      0, -0.22, 0.05,
      0, -0.21, 0.08,
      0, -0.22, 0.05,
      0, -0.23, 0.03,
      0, -0.22, 0.05
    ]
  );

  const cape1Track = new THREE.VectorKeyframeTrack(
    'CapeSeg_1.position',
    times,
    [
      0, -0.62, 0.09,
      0, -0.60, 0.14,
      0, -0.62, 0.09,
      0, -0.63, 0.05,
      0, -0.62, 0.09
    ]
  );

  const cape2Track = new THREE.VectorKeyframeTrack(
    'CapeSeg_2.position',
    times,
    [
      0, -1.02, 0.13,
      0, -0.99, 0.20,
      0, -1.02, 0.13,
      0, -1.04, 0.07,
      0, -1.02, 0.13
    ]
  );

  // Subtle Leg Aerodynamic Drift
  const rLegTrack = new THREE.VectorKeyframeTrack(
    'RightLeg.position',
    times,
    [
      0.15, -0.15, 0,
      0.15, -0.14, 0.02,
      0.15, -0.15, 0,
      0.15, -0.16, -0.01,
      0.15, -0.15, 0
    ]
  );

  const lLegTrack = new THREE.VectorKeyframeTrack(
    'LeftLeg.position',
    times,
    [
      -0.15, -0.15, 0,
      -0.15, -0.16, -0.01,
      -0.15, -0.15, 0,
      -0.15, -0.14, 0.02,
      -0.15, -0.15, 0
    ]
  );

  const flightClip = new THREE.AnimationClip('FlightLoop', 2.0, [
    headPosTrack,
    rArmTrack,
    lArmTrack,
    cape0Track,
    cape1Track,
    cape2Track,
    rLegTrack,
    lLegTrack
  ]);

  // Export to GLB
  const dir = path.resolve('public/models');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const exporter = new GLTFExporter();
  const glbBuffer = await exporter.parseAsync(scene, { binary: true, animations: [flightClip] });

  fs.writeFileSync(path.join(dir, 'superhero.glb'), Buffer.from(glbBuffer));
  console.log('Successfully generated Realistic Animated Human Flyer GLB! Size:', glbBuffer.byteLength, 'bytes');
});
