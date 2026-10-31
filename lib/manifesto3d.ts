import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Section 02 ("01 — MIND OF THE MACHINE") Interactive Three.js 3D Card Visualizer
 * Renders 4 real-time 3D robotics simulations synchronized with the active card:
 *   Mode 0 ("No tracks.")      -> Natural-Feature 3D vSLAM Triangulation & Landmark Lock
 *   Mode 1 ("No blind spots.") -> 360° Dual-LiDAR + 4× 3D Depth Camera Sensor Fusion
 *   Mode 2 ("No waiting.")     -> Sub-5ms Dynamic Obstacle Avoidance & S-Curve Bypass
 *   Mode 3 ("Just motion.")    -> 24/7 Duty Cycle: 1,000 kg Lift, Fleet Loop & 48V Auto-Dock
 */
export function initManifesto3D(container: HTMLElement): () => void {
  container.innerHTML = "";

  const getBounds = () => ({
    width: Math.max(300, container.clientWidth || 620),
    height: Math.max(220, container.clientHeight || 360),
  });

  const initialBounds = getBounds();

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(initialBounds.width, initialBounds.height);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x090a0d, 0.065);

  const camera = new THREE.PerspectiveCamera(
    36,
    initialBounds.width / initialBounds.height,
    0.1,
    60
  );
  camera.position.set(0, 3.8, 5.4);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.minDistance = 2.5;
  controls.maxDistance = 12.0;
  controls.target.set(0, 0.25, 0);

  let userInteracting = false;
  let lastInteractionTime = -100;
  const onControlStart = () => {
    userInteracting = true;
  };
  const onControlEnd = () => {
    userInteracting = false;
    lastInteractionTime = performance.now() * 0.001;
  };
  controls.addEventListener("start", onControlStart);
  controls.addEventListener("end", onControlEnd);

  // -------------------------------------------------------------------------
  // LIGHTING & INDUSTRIAL FLOOR GRID
  // -------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xdbe4f0, 0.75);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff6ec, 2.3);
  keyLight.position.set(-4.5, 6.5, 4.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  const d = 4.5;
  keyLight.shadow.camera.left = -d;
  keyLight.shadow.camera.right = d;
  keyLight.shadow.camera.top = d;
  keyLight.shadow.camera.bottom = -d;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xff8a1f, 1.4);
  rimLight.position.set(4.5, 3.5, -4.0);
  scene.add(rimLight);

  const mintFill = new THREE.PointLight(0x6ee7a8, 0.9, 8.0, 2);
  mintFill.position.set(2.0, 1.8, 2.0);
  scene.add(mintFill);

  const gridHelper = new THREE.GridHelper(14, 28, 0xff8a1f, 0x222631);
  (gridHelper.material as THREE.Material).transparent = true;
  (gridHelper.material as THREE.Material).opacity = 0.28;
  gridHelper.position.y = 0.002;
  scene.add(gridHelper);

  // -------------------------------------------------------------------------
  // SHARED MATERIALS & BRANDING TEXTURE
  // -------------------------------------------------------------------------
  const whiteShellMat = new THREE.MeshStandardMaterial({
    color: 0xf3f1ec,
    roughness: 0.24,
    metalness: 0.08,
  });
  const darkChassisMat = new THREE.MeshStandardMaterial({
    color: 0x12141a,
    roughness: 0.42,
    metalness: 0.55,
  });
  const deckMetalMat = new THREE.MeshStandardMaterial({
    color: 0x1a1d24,
    roughness: 0.32,
    metalness: 0.68,
  });
  const orangeEmitMat = new THREE.MeshStandardMaterial({
    color: 0xff8a1f,
    emissive: 0xff7a12,
    emissiveIntensity: 2.2,
    roughness: 0.2,
  });
  const mintEmitMat = new THREE.MeshStandardMaterial({
    color: 0x6ee7a8,
    emissive: 0x34d399,
    emissiveIntensity: 1.8,
    roughness: 0.2,
  });

  // Top Deck Logo Texture using /assets/logo.png
  function createDeckLogoTexture(): THREE.CanvasTexture {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    const tex = new THREE.CanvasTexture(c);

    const draw = (img?: HTMLImageElement) => {
      ctx.fillStyle = "#161920";
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = "rgba(255,138,31,0.45)";
      ctx.lineWidth = 4;
      ctx.strokeRect(24, 24, 464, 464);

      if (img && img.complete && img.naturalWidth > 0) {
        const w = 220;
        const h = w * (img.naturalHeight / img.naturalWidth);
        ctx.drawImage(img, 256 - w / 2, 225 - h / 2, w, h);
      }
      ctx.fillStyle = "#f1eee8";
      ctx.font = "bold 26px monospace";
      ctx.textAlign = "center";
      ctx.fillText("NEXUS M2", 256, 345);
      ctx.fillStyle = "#ff8a1f";
      ctx.font = "16px monospace";
      ctx.fillText("INFINITUDE ROBOTICS", 256, 374);
      tex.needsUpdate = true;
    };

    draw();
    const logoImg = new Image();
    logoImg.src = "/assets/logo.png";
    logoImg.onload = () => draw(logoImg);
    return tex;
  }

  const deckLogoMat = new THREE.MeshStandardMaterial({
    map: createDeckLogoTexture(),
    roughness: 0.3,
    metalness: 0.4,
  });

  // Helper to build a compact, high-detail 3D NEXUS M2 AMR unit
  function createNexusM2Unit(withCargo = false) {
    const root = new THREE.Group();

    const W = 0.78;
    const H = 0.28;
    const L = 1.18;

    // Lower dark bumper skirt
    const base = new THREE.Mesh(
      new RoundedBoxGeometry(W * 1.02, 0.08, L * 1.02, 3, 0.025),
      darkChassisMat
    );
    base.position.y = 0.05;
    base.castShadow = true;
    root.add(base);

    // White industrial fairing shell
    const body = new THREE.Mesh(
      new RoundedBoxGeometry(W, H, L, 4, 0.045),
      whiteShellMat
    );
    body.position.y = 0.19;
    body.castShadow = true;
    body.receiveShadow = true;
    root.add(body);

    // Front & rear dark sensor visors with orange trim
    [-1, 1].forEach((dir) => {
      const visor = new THREE.Mesh(
        new RoundedBoxGeometry(W * 0.76, 0.065, 0.03, 2, 0.01),
        darkChassisMat
      );
      visor.position.set(0, 0.21, dir * (L / 2 + 0.005));
      root.add(visor);

      const trim = new THREE.Mesh(
        new THREE.BoxGeometry(W * 0.78, 0.012, 0.032),
        orangeEmitMat
      );
      trim.position.set(0, 0.248, dir * (L / 2 + 0.006));
      root.add(trim);
    });

    // 4 Corner amber status LEDs
    [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ].forEach(([sx, sz]) => {
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.018, 0.09),
        orangeEmitMat
      );
      led.position.set(sx * (W * 0.42), 0.315, sz * (L * 0.43));
      root.add(led);
    });

    // Twin diagonal SICK safety LiDAR pucks (front-left & rear-right)
    const lidarRotors: THREE.Mesh[] = [];
    [
      [-W * 0.44, L * 0.45],
      [W * 0.44, -L * 0.45],
    ].forEach(([lx, lz]) => {
      const puck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.05, 16),
        orangeEmitMat
      );
      puck.position.set(lx, 0.12, lz);
      root.add(puck);
      lidarRotors.push(puck);
    });

    // Drive wheels (left & right)
    [-1, 1].forEach((side) => {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.05, 24),
        darkChassisMat
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(side * (W / 2 + 0.01), 0.11, 0);
      root.add(wheel);

      const rimRing = new THREE.Mesh(
        new THREE.RingGeometry(0.072, 0.085, 24),
        new THREE.MeshBasicMaterial({
          color: 0xff8a1f,
          side: THREE.DoubleSide,
        })
      );
      rimRing.rotation.y = Math.PI / 2;
      rimRing.position.set(side * (W / 2 + 0.037), 0.11, 0);
      root.add(rimRing);
    });

    // Lifting top deck
    const liftDeckGroup = new THREE.Group();
    liftDeckGroup.position.y = 0.34;

    const deckPlate = new THREE.Mesh(
      new RoundedBoxGeometry(W * 0.94, 0.035, L * 0.94, 3, 0.012),
      deckMetalMat
    );
    deckPlate.castShadow = true;
    liftDeckGroup.add(deckPlate);

    const logoPatch = new THREE.Mesh(
      new THREE.PlaneGeometry(0.46, 0.46),
      deckLogoMat
    );
    logoPatch.rotation.x = -Math.PI / 2;
    logoPatch.position.y = 0.019;
    liftDeckGroup.add(logoPatch);

    // Optional 1,000 kg Cargo Pallet on the lift deck
    const cargoGroup = new THREE.Group();
    if (withCargo) {
      const palletSkid = new THREE.Mesh(
        new THREE.BoxGeometry(W * 0.98, 0.05, L * 0.92),
        darkChassisMat
      );
      palletSkid.position.y = 0.05;
      cargoGroup.add(palletSkid);

      const cargoBox = new THREE.Mesh(
        new RoundedBoxGeometry(W * 0.92, 0.32, L * 0.86, 3, 0.02),
        new THREE.MeshStandardMaterial({
          color: 0x1b2029,
          roughness: 0.38,
          metalness: 0.45,
        })
      );
      cargoBox.position.y = 0.23;
      cargoBox.castShadow = true;
      cargoGroup.add(cargoBox);

      // Orange hazard straps around cargo
      [-0.24, 0.24].forEach((zo) => {
        const strap = new THREE.Mesh(
          new THREE.BoxGeometry(W * 0.94, 0.33, 0.025),
          orangeEmitMat
        );
        strap.position.set(0, 0.23, zo);
        cargoGroup.add(strap);
      });

      liftDeckGroup.add(cargoGroup);
    }

    // Front directional LiDAR scan cone (+Z forward direction indicator)
    const frontFan = new THREE.Mesh(
      new THREE.CircleGeometry(0.95, 24, Math.PI * 0.28, Math.PI * 0.44),
      new THREE.MeshBasicMaterial({
        color: 0xff8a1f,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      })
    );
    frontFan.rotation.x = -Math.PI / 2;
    frontFan.position.set(0, 0.018, L / 2);
    root.add(frontFan);

    root.add(liftDeckGroup);

    return { root, liftDeckGroup, cargoGroup, lidarRotors };
  }

  // Primary NEXUS M2 robot in the scene
  const primaryM2 = createNexusM2Unit(true);
  primaryM2.cargoGroup.visible = false;
  scene.add(primaryM2.root);

  // =========================================================================
  // STAGE 01 ("No tracks.") — NATURAL-FEATURE 3D vSLAM & LANDMARK TRIANGULATION
  // =========================================================================
  const mode0Group = new THREE.Group();
  scene.add(mode0Group);

  // 3D Warehouse Rack Bays & Structural Columns (Natural Landmarks)
  const rackFrameMat = new THREE.MeshStandardMaterial({
    color: 0x262c3a,
    roughness: 0.5,
    metalness: 0.6,
  });
  const landmarkPositions: THREE.Vector3[] = [
    new THREE.Vector3(-2.1, 0.65, -1.55),
    new THREE.Vector3(0.0, 0.85, -1.75),
    new THREE.Vector3(2.1, 0.65, -1.55),
    new THREE.Vector3(-2.25, 0.55, 1.35),
    new THREE.Vector3(2.25, 0.55, 1.35),
  ];

  // Build 3D industrial racks & columns at landmark positions
  landmarkPositions.forEach((pos, idx) => {
    const pillar = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 1.3, 0.28),
      rackFrameMat
    );
    pillar.position.set(pos.x, 0.65, pos.z);
    pillar.castShadow = true;
    mode0Group.add(pillar);

    const wire = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.32, 1.34, 0.32)),
      new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0xff8a1f : 0x6ee7a8,
        transparent: true,
        opacity: 0.65,
      })
    );
    wire.position.copy(pillar.position);
    mode0Group.add(wire);

    // Glowing SLAM feature node octahedron
    const node = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.11, 0),
      idx % 2 === 0 ? orangeEmitMat : mintEmitMat
    );
    node.position.copy(pos);
    mode0Group.add(node);
  });

  // Back rack crossbeams
  [-0.45, 0.95].forEach((y) => {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.06, 0.08),
      rackFrameMat
    );
    beam.position.set(0, y + 0.6, -1.62);
    mode0Group.add(beam);
  });

  // 3D LiDAR Point Cloud particles around the walls & racks
  const slamPtCount = 360;
  const slamPtPositions = new Float32Array(slamPtCount * 3);
  const slamPtColors = new Float32Array(slamPtCount * 3);
  for (let i = 0; i < slamPtCount; i++) {
    const angle = (i / slamPtCount) * Math.PI * 2;
    const rad = 1.9 + (i % 5) * 0.22;
    slamPtPositions[i * 3] = Math.cos(angle) * rad * 1.25;
    slamPtPositions[i * 3 + 1] = 0.08 + ((i * 17) % 100) * 0.013;
    slamPtPositions[i * 3 + 2] = Math.sin(angle) * rad * 0.85;

    const isMint = i % 3 === 0;
    slamPtColors[i * 3] = isMint ? 0.43 : 1.0;
    slamPtColors[i * 3 + 1] = isMint ? 0.91 : 0.54;
    slamPtColors[i * 3 + 2] = isMint ? 0.66 : 0.12;
  }
  const slamCloudGeo = new THREE.BufferGeometry();
  slamCloudGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(slamPtPositions, 3)
  );
  slamCloudGeo.setAttribute(
    "color",
    new THREE.BufferAttribute(slamPtColors, 3)
  );
  const slamCloud = new THREE.Points(
    slamCloudGeo,
    new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    })
  );
  mode0Group.add(slamCloud);

  // Dynamic 3D triangulation laser beams from robot to landmarks
  const triangulationLines: THREE.Line[] = [];
  landmarkPositions.forEach((_, idx) => {
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.25, 0),
      landmarkPositions[idx],
    ]);
    const lineMat = new THREE.LineBasicMaterial({
      color: idx % 2 === 0 ? 0xff8a1f : 0x6ee7a8,
      transparent: true,
      opacity: 0.75,
    });
    const line = new THREE.Line(lineGeo, lineMat);
    mode0Group.add(line);
    triangulationLines.push(line);
  });

  // Free-space SLAM trajectory curve on the floor
  const slamCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.1, 0.02, 0.55),
    new THREE.Vector3(-0.9, 0.02, -0.25),
    new THREE.Vector3(0.0, 0.02, 0.05),
    new THREE.Vector3(1.0, 0.02, 0.35),
    new THREE.Vector3(2.1, 0.02, -0.2),
  ]);
  const slamPathMesh = new THREE.Mesh(
    new THREE.TubeGeometry(slamCurve, 64, 0.032, 8, false),
    new THREE.MeshBasicMaterial({
      color: 0xff8a1f,
      transparent: true,
      opacity: 0.85,
    })
  );
  mode0Group.add(slamPathMesh);

  // =========================================================================
  // STAGE 02 ("No blind spots.") — 360° MULTI-SENSOR FUSION & 3D DEPTH CONES
  // =========================================================================
  const mode1Group = new THREE.Group();
  mode1Group.visible = false;
  scene.add(mode1Group);

  // Concentric 360° protection & warning rings
  const outerSafetyRing = new THREE.Mesh(
    new THREE.RingGeometry(2.15, 2.24, 64),
    new THREE.MeshBasicMaterial({
      color: 0xff8a1f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    })
  );
  outerSafetyRing.rotation.x = -Math.PI / 2;
  outerSafetyRing.position.y = 0.012;
  mode1Group.add(outerSafetyRing);

  const innerSafetyRing = new THREE.Mesh(
    new THREE.RingGeometry(1.38, 1.45, 64),
    new THREE.MeshBasicMaterial({
      color: 0x6ee7a8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    })
  );
  innerSafetyRing.rotation.x = -Math.PI / 2;
  innerSafetyRing.position.y = 0.015;
  mode1Group.add(innerSafetyRing);

  // Rotating 360° LiDAR laser sweep disc
  const radarSweep = new THREE.Mesh(
    new THREE.CircleGeometry(2.18, 48, 0, Math.PI * 0.42),
    new THREE.MeshBasicMaterial({
      color: 0xff8a1f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
  );
  radarSweep.rotation.x = -Math.PI / 2;
  radarSweep.position.y = 0.018;
  mode1Group.add(radarSweep);

  // 4× Stereo 3D RGB-D Camera Volumetric Cones (Front, Rear, Left, Right)
  const depthConesGroup = new THREE.Group();
  [
    { rotY: 0, color: 0x6ee7a8 },
    { rotY: Math.PI, color: 0x6ee7a8 },
    { rotY: Math.PI / 2, color: 0xff8a1f },
    { rotY: -Math.PI / 2, color: 0xff8a1f },
  ].forEach(({ rotY, color }) => {
    const coneHolder = new THREE.Group();
    coneHolder.rotation.y = rotY;

    const coneGeo = new THREE.ConeGeometry(0.55, 1.35, 4, 1, true);
    coneGeo.rotateY(Math.PI / 4);
    coneGeo.rotateX(Math.PI / 2);
    coneGeo.translate(0, 0.25, 0.95);

    const coneMesh = new THREE.Mesh(
      coneGeo,
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    coneHolder.add(coneMesh);

    const coneEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(coneGeo),
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.65,
      })
    );
    coneHolder.add(coneEdges);
    depthConesGroup.add(coneHolder);
  });
  mode1Group.add(depthConesGroup);

  // 3D Detected Objects around the 360° perimeter (Operator, Overhanging Forklift, Pallet)
  const detectedBoxes: THREE.LineSegments[] = [];

  // 1) Human Operator figure (front-right)
  const operatorGroup = new THREE.Group();
  operatorGroup.position.set(1.45, 0, -1.05);
  const opTorso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.14, 0.55, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0x3b4454, roughness: 0.4 })
  );
  opTorso.position.y = 0.48;
  operatorGroup.add(opTorso);
  const opHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 16, 16),
    mintEmitMat
  );
  opHead.position.y = 0.95;
  operatorGroup.add(opHead);
  const opBox = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.48, 1.15, 0.48)),
    new THREE.LineBasicMaterial({ color: 0x6ee7a8 })
  );
  opBox.position.y = 0.58;
  operatorGroup.add(opBox);
  detectedBoxes.push(opBox);
  mode1Group.add(operatorGroup);

  // 2) Overhanging Forklift Tines (rear-left)
  const forkliftGroup = new THREE.Group();
  forkliftGroup.position.set(-1.55, 0, 1.0);
  const forkMast = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.85, 0.45),
    rackFrameMat
  );
  forkMast.position.y = 0.425;
  forkliftGroup.add(forkMast);
  [-0.12, 0.12].forEach((xo) => {
    const tine = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.03, 0.55),
      orangeEmitMat
    );
    tine.position.set(xo, 0.36, -0.42);
    forkliftGroup.add(tine);
  });
  const forkBox = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.62, 0.95, 1.05)),
    new THREE.LineBasicMaterial({ color: 0xff8a1f })
  );
  forkBox.position.set(0, 0.48, -0.18);
  forkliftGroup.add(forkBox);
  detectedBoxes.push(forkBox);
  mode1Group.add(forkliftGroup);

  // 3) Industrial Pallet Stack (front-left)
  const palletObjGroup = new THREE.Group();
  palletObjGroup.position.set(-1.45, 0, -1.1);
  const pCube = new THREE.Mesh(
    new RoundedBoxGeometry(0.55, 0.52, 0.55, 2, 0.02),
    rackFrameMat
  );
  pCube.position.y = 0.26;
  palletObjGroup.add(pCube);
  const pBox = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.65, 0.6, 0.65)),
    new THREE.LineBasicMaterial({ color: 0xf1eee8 })
  );
  pBox.position.y = 0.3;
  palletObjGroup.add(pBox);
  detectedBoxes.push(pBox);
  mode1Group.add(palletObjGroup);

  // =========================================================================
  // STAGE 03 ("No waiting.") — SUB-5MS DYNAMIC RE-PLANNING & OBSTACLE BYPASS
  // =========================================================================
  const mode2Group = new THREE.Group();
  mode2Group.visible = false;
  scene.add(mode2Group);

  // Blocked straight nominal route line (Red)
  const blockedRouteGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-2.6, 0.02, -0.15),
    new THREE.Vector3(2.6, 0.02, -0.15),
  ]);
  const blockedRouteLine = new THREE.Line(
    blockedRouteGeo,
    new THREE.LineBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.7,
    })
  );
  mode2Group.add(blockedRouteLine);

  // Dropped Pallet Obstacle in the middle of the nominal route
  const obstacleGroup = new THREE.Group();
  obstacleGroup.position.set(0, 0, -0.15);
  const obsCrate = new THREE.Mesh(
    new RoundedBoxGeometry(0.76, 0.44, 0.62, 2, 0.02),
    new THREE.MeshStandardMaterial({
      color: 0x3b1619,
      emissive: 0xef4444,
      emissiveIntensity: 0.35,
      roughness: 0.4,
    })
  );
  obsCrate.position.y = 0.22;
  obsCrate.castShadow = true;
  obstacleGroup.add(obsCrate);

  const obsWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.88, 0.54, 0.74)),
    new THREE.LineBasicMaterial({ color: 0xef4444 })
  );
  obsWire.position.y = 0.27;
  obstacleGroup.add(obsWire);

  const obsHazardRing = new THREE.Mesh(
    new THREE.RingGeometry(0.62, 0.68, 36),
    new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    })
  );
  obsHazardRing.rotation.x = -Math.PI / 2;
  obsHazardRing.position.y = 0.015;
  obstacleGroup.add(obsHazardRing);
  mode2Group.add(obstacleGroup);

  // Candidate DWA Trajectory Search Fan Arcs
  [0.55, 0.85, 1.32].forEach((zApex, i) => {
    const candidateCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.4, 0.015, -0.15),
      new THREE.Vector3(-0.9, 0.015, zApex),
      new THREE.Vector3(0.9, 0.015, zApex),
      new THREE.Vector3(2.4, 0.015, -0.15),
    ]);
    const cLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(candidateCurve.getPoints(40)),
      new THREE.LineBasicMaterial({
        color: i === 1 ? 0x6ee7a8 : 0xffffff,
        transparent: true,
        opacity: i === 1 ? 0.38 : 0.16,
      })
    );
    mode2Group.add(cLine);
  });

  // Active Smooth Bypass S-Curve Spline (arcs cleanly in front of obstacle)
  const bypassCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.5, 0.02, -0.15),
    new THREE.Vector3(-1.35, 0.02, 0.05),
    new THREE.Vector3(-0.55, 0.02, 0.92),
    new THREE.Vector3(0.55, 0.02, 0.92),
    new THREE.Vector3(1.35, 0.02, 0.05),
    new THREE.Vector3(2.5, 0.02, -0.15),
  ]);
  const bypassTube = new THREE.Mesh(
    new THREE.TubeGeometry(bypassCurve, 72, 0.042, 10, false),
    new THREE.MeshBasicMaterial({
      color: 0xff8a1f,
      transparent: true,
      opacity: 0.9,
    })
  );
  mode2Group.add(bypassTube);

  // Goal Waypoint Ring at end of aisle
  const goalRing = new THREE.Mesh(
    new THREE.RingGeometry(0.28, 0.36, 32),
    new THREE.MeshBasicMaterial({
      color: 0x6ee7a8,
      side: THREE.DoubleSide,
    })
  );
  goalRing.rotation.x = -Math.PI / 2;
  goalRing.position.set(2.5, 0.02, -0.15);
  mode2Group.add(goalRing);

  // =========================================================================
  // STAGE 04 ("Just motion.") — 24/7 DUTY CYCLE: 1,000 KG LIFT, FLEET & 48V DOCK
  // =========================================================================
  const mode3Group = new THREE.Group();
  mode3Group.visible = false;
  scene.add(mode3Group);

  // Closed-loop autonomous mission track on floor
  const missionLoopCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-1.85, 0.02, -1.05),
      new THREE.Vector3(1.85, 0.02, -1.05),
      new THREE.Vector3(2.35, 0.02, 0.0),
      new THREE.Vector3(1.85, 0.02, 1.05),
      new THREE.Vector3(-1.85, 0.02, 1.05),
      new THREE.Vector3(-2.35, 0.02, 0.0),
    ],
    true
  );
  const missionLoopTube = new THREE.Mesh(
    new THREE.TubeGeometry(missionLoopCurve, 96, 0.036, 8, true),
    new THREE.MeshBasicMaterial({
      color: 0xff8a1f,
      transparent: true,
      opacity: 0.65,
    })
  );
  mode3Group.add(missionLoopTube);

  // Second Fleet NEXUS M2 Unit cruising along the closed-loop track
  const fleetM2 = createNexusM2Unit(true);
  fleetM2.root.scale.setScalar(0.82);
  mode3Group.add(fleetM2.root);

  // 3D 48V Autonomous Fast-Charging Dock Station (at right side of loop)
  const dockTowerGroup = new THREE.Group();
  dockTowerGroup.position.set(2.25, 0, -0.85);
  dockTowerGroup.rotation.y = -Math.PI * 0.25;

  const dockPedestal = new THREE.Mesh(
    new RoundedBoxGeometry(0.56, 0.92, 0.36, 3, 0.03),
    darkChassisMat
  );
  dockPedestal.position.y = 0.46;
  dockPedestal.castShadow = true;
  dockTowerGroup.add(dockPedestal);

  const dockLedBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.05, 0.02),
    mintEmitMat
  );
  dockLedBar.position.set(0, 0.78, 0.185);
  dockTowerGroup.add(dockLedBar);

  // Gold 48V fast-charge contact pads
  [-0.1, 0.1].forEach((xo) => {
    const pad = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.04, 16),
      orangeEmitMat
    );
    pad.rotation.x = Math.PI / 2;
    pad.position.set(xo, 0.2, 0.185);
    dockTowerGroup.add(pad);
  });

  // Glowing floor charging bay pad
  const chargeFloorRing = new THREE.Mesh(
    new THREE.RingGeometry(0.52, 0.6, 36),
    new THREE.MeshBasicMaterial({
      color: 0x6ee7a8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    })
  );
  chargeFloorRing.rotation.x = -Math.PI / 2;
  chargeFloorRing.position.set(0, 0.015, 0.55);
  dockTowerGroup.add(chargeFloorRing);

  mode3Group.add(dockTowerGroup);

  // =========================================================================
  // CAMERA KEYFRAMES & MODE SYNCHRONIZATION WITH SECTION 2 SCROLL / CLICKS
  // =========================================================================
  const CAMERA_VIEWS = [
    // Mode 0: "No tracks." — Angled 3/4 view showing 3D racks, point cloud & laser triangulation
    {
      pos: new THREE.Vector3(-2.35, 2.55, 3.85),
      target: new THREE.Vector3(0, 0.32, -0.15),
    },
    // Mode 1: "No blind spots." — Elevated 360° sensor halo view showing all 4 depth cones & perimeter targets
    {
      pos: new THREE.Vector3(0.0, 3.85, 3.45),
      target: new THREE.Vector3(0, 0.15, 0),
    },
    // Mode 2: "No waiting." — Dynamic aisle perspective showing blocked red pallet & smooth S-curve bypass
    {
      pos: new THREE.Vector3(-1.85, 2.65, 3.95),
      target: new THREE.Vector3(0.15, 0.18, -0.1),
    },
    // Mode 3: "Just motion." — Overview of 1,000 kg payload lift, fleet unit & 48V fast-charge dock
    {
      pos: new THREE.Vector3(-2.55, 2.85, 4.15),
      target: new THREE.Vector3(0.15, 0.25, 0),
    },
  ];

  let activeMode = 0;

  // Listen to custom event dispatched by lib/interactions.ts when Section 2 slide changes
  const onManifestoSlideChange = (e: Event) => {
    const customEvent = e as CustomEvent<{ index: number }>;
    if (customEvent.detail && typeof customEvent.detail.index === "number") {
      activeMode = Math.max(0, Math.min(3, customEvent.detail.index));
    }
  };
  window.addEventListener("manifesto-slide-change", onManifestoSlideChange);

  // Also check initial active `.mf-slide.on` in DOM
  const detectActiveFromDom = () => {
    const slides = document.querySelectorAll(".mf-slide");
    slides.forEach((s, idx) => {
      if (s.classList.contains("on")) {
        activeMode = idx;
      }
    });
  };
  detectActiveFromDom();

  // =========================================================================
  // ANIMATION LOOP
  // =========================================================================
  const clock = new THREE.Clock();

  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.getElapsedTime();
    const nowSec = performance.now() * 0.001;

    // Smoothly interpolate camera to the active card's 3D view
    const view = CAMERA_VIEWS[activeMode] || CAMERA_VIEWS[0];
    if (!userInteracting && nowSec - lastInteractionTime > 2.2) {
      camera.position.lerp(view.pos, 1 - Math.exp(-dt * 3.8));
      controls.target.lerp(view.target, 1 - Math.exp(-dt * 4.5));
    }
    controls.update();

    // Toggle 3D scenario groups based on active slide
    mode0Group.visible = activeMode === 0;
    mode1Group.visible = activeMode === 1;
    mode2Group.visible = activeMode === 2;
    mode3Group.visible = activeMode === 3;

    // Spin SICK LiDAR pucks on the primary robot
    primaryM2.lidarRotors.forEach((r) => {
      r.rotation.y += dt * 12.0;
    });

    if (activeMode === 0) {
      // Mode 0 ("No tracks."): Robot drives forward along natural-feature SLAM spline & triangulates landmarks
      primaryM2.cargoGroup.visible = false;
      primaryM2.liftDeckGroup.position.y = 0.34;
      const u = (elapsed * 0.2) % 1.0;
      const pt = slamCurve.getPointAt(u);
      const tangent = slamCurve.getTangentAt(u);
      primaryM2.root.position.set(pt.x, 0, pt.z);
      primaryM2.root.rotation.y = Math.atan2(tangent.x, tangent.z);

      // Update laser triangulation beams from robot to natural wall/rack landmarks
      triangulationLines.forEach((line, idx) => {
        const posAttr = line.geometry.getAttribute(
          "position"
        ) as THREE.BufferAttribute;
        posAttr.setXYZ(0, pt.x, 0.26, pt.z);
        posAttr.needsUpdate = true;
        (line.material as THREE.LineBasicMaterial).opacity =
          0.45 + 0.45 * Math.sin(elapsed * 5.0 + idx * 1.2);
      });
    } else if (activeMode === 1) {
      // Mode 1 ("No blind spots."): Centered robot with 360° rotating radar sweep & 4× 3D depth cones
      primaryM2.cargoGroup.visible = false;
      primaryM2.liftDeckGroup.position.y = 0.34;
      primaryM2.root.position.set(0, 0, 0);
      primaryM2.root.rotation.y = Math.sin(elapsed * 0.5) * 0.25;
      depthConesGroup.rotation.y = primaryM2.root.rotation.y;
      radarSweep.rotation.z = elapsed * 2.6;

      detectedBoxes.forEach((box, idx) => {
        box.position.y =
          (idx === 0 ? 0.58 : idx === 1 ? 0.48 : 0.3) +
          0.03 * Math.sin(elapsed * 4.0 + idx);
      });
    } else if (activeMode === 2) {
      // Mode 2 ("No waiting."): Robot continuously drives forward along the smooth S-curve bypass around the dropped pallet
      primaryM2.cargoGroup.visible = true;
      primaryM2.liftDeckGroup.position.y = 0.38;
      const u = (elapsed * 0.24) % 1.0;
      const pt = bypassCurve.getPointAt(u);
      const tangent = bypassCurve.getTangentAt(u);
      primaryM2.root.position.set(pt.x, 0, pt.z);
      primaryM2.root.rotation.y = Math.atan2(tangent.x, tangent.z);

      const pulseScale = 1 + 0.08 * Math.sin(elapsed * 5.0);
      obsHazardRing.scale.set(pulseScale, pulseScale, 1);
    } else if (activeMode === 3) {
      // Mode 3 ("Just motion."): Both fleet AMRs travel forward along the closed-loop mission track (spaced 50% apart)
      primaryM2.cargoGroup.visible = true;
      const u1 = (elapsed * 0.16) % 1.0;
      const pt1 = missionLoopCurve.getPointAt(u1);
      const tan1 = missionLoopCurve.getTangentAt(u1);
      primaryM2.root.position.set(pt1.x, 0, pt1.z);
      primaryM2.root.rotation.y = Math.atan2(tan1.x, tan1.z);
      const liftWave = 0.5 + 0.5 * Math.sin(elapsed * 2.6);
      primaryM2.liftDeckGroup.position.y = 0.34 + liftWave * 0.12;

      const u2 = (u1 + 0.5) % 1.0;
      const fPt = missionLoopCurve.getPointAt(u2);
      const fTan = missionLoopCurve.getTangentAt(u2);
      fleetM2.root.position.set(fPt.x, 0, fPt.z);
      fleetM2.root.rotation.y = Math.atan2(fTan.x, fTan.z);
      fleetM2.lidarRotors.forEach((r) => {
        r.rotation.y += dt * 12.0;
      });
    }

    renderer.render(scene, camera);
  }

  let isRunning = true;
  renderer.setAnimationLoop(animate);

  // Pause rendering when Section 2 is offscreen
  const sectionEl =
    (container.closest("#manifesto") as HTMLElement) || container;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isRunning) {
            isRunning = true;
            clock.getDelta();
            renderer.setAnimationLoop(animate);
          }
        } else if (isRunning) {
          isRunning = false;
          renderer.setAnimationLoop(null);
        }
      });
    },
    { rootMargin: "200px" }
  );
  io.observe(sectionEl);

  const resizeObserver = new ResizeObserver(() => {
    const { width, height } = getBounds();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  resizeObserver.observe(container);

  return () => {
    isRunning = false;
    renderer.setAnimationLoop(null);
    io.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener(
      "manifesto-slide-change",
      onManifestoSlideChange
    );
    controls.removeEventListener("start", onControlStart);
    controls.removeEventListener("end", onControlEnd);
    controls.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };
}

