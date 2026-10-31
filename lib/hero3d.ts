import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

export function initHero3D(container: HTMLElement): () => void {
  // Clear any existing canvas from previous mounts (e.g. React Strict Mode)
  container.innerHTML = "";

  const getBounds = () => ({
    width: Math.max(320, container.clientWidth || 760),
    height: Math.max(220, container.clientHeight || 475),
  });

  const initialBounds = getBounds();

  // -------------------------------------------------------------------------
  // 1. TRANSPARENT WEBGL RENDERER, SCENE, CAMERA & STUDIO LIGHTING
  // -------------------------------------------------------------------------
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
  renderer.toneMappingExposure = 1.12;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.72;

  const camera = new THREE.PerspectiveCamera(
    36,
    initialBounds.width / initialBounds.height,
    0.1,
    100
  );
  camera.position.set(-4.15, 2.15, 4.45);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.minDistance = 3.0;
  controls.maxDistance = 10.0;
  controls.target.set(0, 0.18, 0);

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

  RectAreaLightUniformsLib.init();
  const studioSoftbox = new THREE.RectAreaLight(0xfff4e8, 2.4, 2.8, 1.6);
  studioSoftbox.position.set(0, 3.2, 0.2);
  studioSoftbox.lookAt(0, 0.25, 0);
  scene.add(studioSoftbox);

  const ambientLight = new THREE.AmbientLight(0xdbe4f0, 0.45);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.1);
  keyLight.position.set(-3.5, 5.2, 3.8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 16;
  const d = 2.4;
  keyLight.shadow.camera.left = -d;
  keyLight.shadow.camera.right = d;
  keyLight.shadow.camera.top = d;
  keyLight.shadow.camera.bottom = -d;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xffb36b, 1.25);
  rimLight.position.set(4.0, 3.0, -3.6);
  scene.add(rimLight);

  const deckGlowLight = new THREE.PointLight(0xff7a1f, 1.4, 3.2, 2);
  deckGlowLight.position.set(0, 0.85, 0.15);
  scene.add(deckGlowLight);

  const underFillLight = new THREE.PointLight(0xff7722, 0.9, 3.5, 2);
  underFillLight.position.set(0, 0.22, 0);
  scene.add(underFillLight);

  function createFloorShadowTexture(): THREE.CanvasTexture {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 250);
    grad.addColorStop(0.0, "rgba(0, 0, 0, 0.78)");
    grad.addColorStop(0.45, "rgba(12, 8, 4, 0.42)");
    grad.addColorStop(0.75, "rgba(255, 122, 26, 0.06)");
    grad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(c);
  }

  const floorPad = new THREE.Mesh(
    new THREE.PlaneGeometry(5.6, 5.6),
    new THREE.MeshBasicMaterial({
      map: createFloorShadowTexture(),
      transparent: true,
      depthWrite: false,
    })
  );
  floorPad.rotation.x = -Math.PI / 2;
  floorPad.position.y = 0.001;
  scene.add(floorPad);

  const shadowCatcher = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 7),
    new THREE.ShadowMaterial({ opacity: 0.55 })
  );
  shadowCatcher.rotation.x = -Math.PI / 2;
  shadowCatcher.position.y = 0.002;
  shadowCatcher.receiveShadow = true;
  scene.add(shadowCatcher);

  // -------------------------------------------------------------------------
  // 2. PROCEDURAL HIGH-DPI CANVAS TEXTURES (BRANDING, DECALS, PCBs)
  // -------------------------------------------------------------------------
  const primaryLogoImg = new Image();
  const logoRedrawCallbacks: Array<() => void> = [];

  function registerLogoTextureRedraw(fn: () => void) {
    logoRedrawCallbacks.push(fn);
    fn();
  }

  primaryLogoImg.onload = () => {
    logoRedrawCallbacks.forEach((cb) => cb());
  };
  primaryLogoImg.src = "/assets/logo.png";

  function drawInfinitudeIcon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    scale = 1
  ) {
    const w = 96 * scale;
    const h = 46 * scale;
    if (primaryLogoImg.complete && primaryLogoImg.naturalWidth > 0) {
      ctx.drawImage(primaryLogoImg, cx - w / 2, cy - h / 2, w, h);
      return;
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    const grad = ctx.createLinearGradient(-46, 0, 46, 0);
    grad.addColorStop(0, "#ff6a1a");
    grad.addColorStop(1, "#ff9a3c");
    ctx.strokeStyle = grad;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(-20, -2);
    ctx.quadraticCurveTo(0, -24, 20, -2);
    ctx.stroke();

    ctx.lineWidth = 7.5;
    ctx.beginPath();
    ctx.moveTo(-29, 4);
    ctx.bezierCurveTo(-36, 15, -45, 13, -45, 0);
    ctx.bezierCurveTo(-45, -15, -34, -16, -24, -4);
    ctx.bezierCurveTo(-12, 10, -6, 17, 0, 17);
    ctx.bezierCurveTo(6, 17, 12, 10, 24, -4);
    ctx.bezierCurveTo(34, -16, 45, -15, 45, 0);
    ctx.bezierCurveTo(45, 13, 36, 15, 29, 4);
    ctx.stroke();
    ctx.restore();
  }

  function createPrimaryLogoMedallionMaterial(
    bgColor = "#14161c",
    withBorder = true
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;

    registerLogoTextureRedraw(() => {
      ctx.clearRect(0, 0, 512, 256);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 512, 256);

      if (withBorder) {
        ctx.strokeStyle = "rgba(255, 107, 26, 0.55)";
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, 492, 236);
      }

      drawInfinitudeIcon(ctx, 256, 128, 4.1);
      tex.needsUpdate = true;
    });

    return new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.24,
      metalness: 0.35,
    });
  }

  function createFrontBadgeTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;

    registerLogoTextureRedraw(() => {
      ctx.fillStyle = "#121318";
      ctx.fillRect(0, 0, 1024, 512);

      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      for (let i = 0; i < 512; i += 4) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(1024, i);
        ctx.stroke();
      }

      drawInfinitudeIcon(ctx, 512, 122, 2.75);

      drawInfinitudeIcon(ctx, 315, 255, 0.85);
      ctx.fillStyle = "#e5e7eb";
      ctx.font = '700 34px "Space Grotesk", sans-serif';
      ctx.fillText("INFINITUDE", 375, 254);
      ctx.fillStyle = "#9ca3af";
      ctx.font = '600 18px "JetBrains Mono", monospace';
      ctx.fillText("R O B O T I C S", 378, 280);

      ctx.font = '700 78px "Space Grotesk", sans-serif';
      ctx.fillStyle = "#f3f4f6";
      ctx.fillText("NEXUS", 295, 415);
      ctx.fillStyle = "#ff6b1a";
      ctx.fillText("M2", 600, 415);

      tex.needsUpdate = true;
    });

    return tex;
  }

  function createRearLogoTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;

    registerLogoTextureRedraw(() => {
      ctx.fillStyle = "#eceef2";
      ctx.fillRect(0, 0, 512, 256);

      drawInfinitudeIcon(ctx, 102, 128, 1.55);
      ctx.fillStyle = "#22262e";
      ctx.font = '700 44px "Space Grotesk", sans-serif';
      ctx.fillText("INFINITUDE", 190, 124);
      ctx.fillStyle = "#5c6472";
      ctx.font = '600 23px "JetBrains Mono", monospace';
      ctx.fillText("R O B O T I C S", 193, 158);

      tex.needsUpdate = true;
    });

    return tex;
  }

  function createPCBTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#0b3b24";
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 2;
    for (let i = 16; i < 500; i += 18) {
      ctx.beginPath();
      ctx.moveTo(16, i);
      ctx.lineTo(220, i);
      ctx.lineTo(256, i + 12);
      ctx.lineTo(496, i + 12);
      ctx.stroke();
    }

    ctx.fillStyle = "#eab308";
    for (let x = 32; x < 480; x += 32) {
      for (let y = 32; y < 480; y += 32) {
        ctx.fillRect(x - 3, y - 3, 6, 6);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function createBatteryLabelTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    registerLogoTextureRedraw(() => {
      ctx.fillStyle = "#141923";
      ctx.fillRect(0, 0, 1024, 512);

      ctx.strokeStyle = "#ff6b1a";
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, 984, 472);

      drawInfinitudeIcon(ctx, 118, 108, 1.45);
      ctx.fillStyle = "#ffffff";
      ctx.font = '700 44px "Space Grotesk", sans-serif';
      ctx.fillText("INFINITUDE ENERGY CORE // 48V LiFePO4", 200, 110);

      ctx.fillStyle = "#38bdf8";
      ctx.font = '600 32px "JetBrains Mono", monospace';
      ctx.fillText(
        "CAPACITY: 60 Ah (2.88 kWh)   |   PEAK DISCHARGE: 180A",
        60,
        220
      );
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        "CELL CHEMISTRY: PRISMATIC LiFePO4   |   ACTIVE BMS CAN-FD",
        60,
        280
      );

      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i < 7 ? "#22c55e" : "#ffaa2b";
        ctx.fillRect(60 + i * 110, 340, 92, 90);
      }

      tex.needsUpdate = true;
    });

    return tex;
  }

  // -------------------------------------------------------------------------
  // 3. MATERIALS LIBRARY
  // -------------------------------------------------------------------------
  const materials = {
    whiteShell: new THREE.MeshPhysicalMaterial({
      color: 0xeceef2,
      roughness: 0.26,
      metalness: 0.06,
      clearcoat: 0.4,
      clearcoatRoughness: 0.22,
    }),
    topDeckBlack: new THREE.MeshStandardMaterial({
      color: 0x16181d,
      roughness: 0.36,
      metalness: 0.42,
    }),
    bumperBlack: new THREE.MeshStandardMaterial({
      color: 0x121317,
      roughness: 0.55,
      metalness: 0.2,
    }),
    sensorBayDark: new THREE.MeshStandardMaterial({
      color: 0x0d0e12,
      roughness: 0.3,
      metalness: 0.45,
    }),
    smokedGlass: new THREE.MeshPhysicalMaterial({
      color: 0x090a0f,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.35,
      transparent: true,
      opacity: 0.92,
    }),
    redVisorTrim: new THREE.MeshStandardMaterial({
      color: 0xd9381e,
      emissive: 0xb91c1c,
      emissiveIntensity: 1.1,
      roughness: 0.25,
      metalness: 0.4,
    }),
    amberLed: new THREE.MeshStandardMaterial({
      color: 0xffb340,
      emissive: 0xff8c1a,
      emissiveIntensity: 3.8,
      roughness: 0.12,
    }),
    whiteLed: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xe0f2fe,
      emissiveIntensity: 4.0,
      roughness: 0.1,
    }),
    rubberTire: new THREE.MeshStandardMaterial({
      color: 0x141519,
      roughness: 0.78,
      metalness: 0.08,
    }),
    wheelRim: new THREE.MeshStandardMaterial({
      color: 0x1c1e24,
      roughness: 0.32,
      metalness: 0.65,
    }),
    copperAccent: new THREE.MeshStandardMaterial({
      color: 0xe86b22,
      roughness: 0.25,
      metalness: 0.82,
    }),
    chromeMetal: new THREE.MeshStandardMaterial({
      color: 0xd8dee9,
      roughness: 0.16,
      metalness: 0.92,
    }),
    brassContact: new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.22,
      metalness: 0.88,
    }),
    chassisSteel: new THREE.MeshStandardMaterial({
      color: 0x1e222a,
      roughness: 0.48,
      metalness: 0.68,
    }),
    anodizedAluminum: new THREE.MeshStandardMaterial({
      color: 0x2b303c,
      roughness: 0.3,
      metalness: 0.8,
    }),
    batteryBlue: new THREE.MeshStandardMaterial({
      color: 0x1e3a5f,
      roughness: 0.32,
      metalness: 0.55,
    }),
    lidarYellow: new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.25,
    }),
    pcbBoard: new THREE.MeshStandardMaterial({
      map: createPCBTexture(),
      roughness: 0.35,
      metalness: 0.4,
    }),
    hvOrangeCable: new THREE.MeshStandardMaterial({
      color: 0xff5a1f,
      roughness: 0.4,
      metalness: 0.15,
    }),
    statusGreenLed: new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      emissive: 0x22c55e,
      emissiveIntensity: 3.0,
    }),
  };

  // -------------------------------------------------------------------------
  // 4. BUILD HIGH-DETAIL 3D NEXUS M2 AMR & INTERNAL SUB-ASSEMBLIES
  // -------------------------------------------------------------------------
  const robotRoot = new THREE.Group();
  scene.add(robotRoot);

  const L = 2.4;
  const W = 1.36;

  const partsRegistry: Record<string, THREE.Group> = {};

  function registerPart(
    id: string,
    group: THREE.Group,
    basePos: THREE.Vector3,
    explodeOffset: THREE.Vector3
  ) {
    group.position.copy(basePos);
    group.userData = {
      partId: id,
      basePos: basePos.clone(),
      explodeOffset: explodeOffset.clone(),
    };
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    partsRegistry[id] = group;
    robotRoot.add(group);
  }

  // SUB-ASSEMBLY 1: TOP PAYLOAD & LIFTING DECK (`topDeck`)
  const topDeckGroup = new THREE.Group();
  {
    const mainDeckGeo = new RoundedBoxGeometry(
      W - 0.02,
      0.055,
      L - 0.02,
      5,
      0.022
    );
    const mainDeck = new THREE.Mesh(mainDeckGeo, materials.topDeckBlack);
    topDeckGroup.add(mainDeck);

    const padHalfL = (L - 0.18) / 2 - 0.01;
    [-1, 1].forEach((dir) => {
      const padGeo = new RoundedBoxGeometry(
        W - 0.14,
        0.014,
        padHalfL,
        3,
        0.005
      );
      const pad = new THREE.Mesh(padGeo, materials.bumperBlack);
      pad.position.set(0, 0.028, dir * (padHalfL / 2 + 0.008));
      topDeckGroup.add(pad);
    });

    const deckLogoPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.21),
      createPrimaryLogoMedallionMaterial("#13151b", true)
    );
    deckLogoPlate.rotation.x = -Math.PI / 2;
    deckLogoPlate.position.set(0, 0.036, 0);
    topDeckGroup.add(deckLogoPlate);

    const pocketPositions: Array<[number, number]> = [
      [-W * 0.34, -L * 0.26],
      [W * 0.34, -L * 0.26],
      [-W * 0.34, L * 0.26],
      [W * 0.34, L * 0.26],
    ];
    pocketPositions.forEach(([px, pz]) => {
      const pocketOuter = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.016, 0.16),
        materials.anodizedAluminum
      );
      pocketOuter.position.set(px, 0.027, pz);
      topDeckGroup.add(pocketOuter);

      const pocketInner = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.02, 16),
        materials.chromeMetal
      );
      pocketInner.position.set(px, 0.03, pz);
      topDeckGroup.add(pocketInner);
    });

    const cornerPortCoords: Array<[number, number]> = [
      [-W * 0.38, -L * 0.42],
      [W * 0.38, -L * 0.42],
      [-W * 0.38, L * 0.42],
      [W * 0.38, L * 0.42],
    ];
    cornerPortCoords.forEach(([cx, cz]) => {
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.032, 0.018, 24),
        materials.anodizedAluminum
      );
      ring.position.set(cx, 0.027, cz);
      topDeckGroup.add(ring);

      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.021, 16),
        materials.chromeMetal
      );
      cap.position.set(cx, 0.028, cz);
      topDeckGroup.add(cap);
    });

    [-1, 1].forEach((zDir) => {
      const lipNotch = new THREE.Mesh(
        new RoundedBoxGeometry(0.36, 0.038, 0.07, 2, 0.008),
        materials.topDeckBlack
      );
      lipNotch.position.set(0, -0.012, zDir * (L / 2 - 0.025));
      topDeckGroup.add(lipNotch);
    });

    const upperCollar = new THREE.Mesh(
      new RoundedBoxGeometry(W - 0.08, 0.048, L - 0.08, 4, 0.018),
      materials.topDeckBlack
    );
    upperCollar.position.set(0, -0.036, 0);
    topDeckGroup.add(upperCollar);

    for (let z = -0.8; z <= 0.8; z += 0.4) {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(W - 0.18, 0.025, 0.035),
        materials.anodizedAluminum
      );
      rib.position.set(0, -0.035, z);
      topDeckGroup.add(rib);
    }
  }
  registerPart(
    "topDeck",
    topDeckGroup,
    new THREE.Vector3(0, 0.47, 0),
    new THREE.Vector3(0, 0.65, 0)
  );

  // SUB-ASSEMBLY 2: 4 CORNER AMBER STATUS LED BARS (`cornerLeds`)
  const cornerLedsGroup = new THREE.Group();
  {
    const cornerConfigs = [
      { x: -1, z: 1 },
      { x: 1, z: 1 },
      { x: -1, z: -1 },
      { x: 1, z: -1 },
    ];
    cornerConfigs.forEach(({ x, z }) => {
      const frontBar = new THREE.Mesh(
        new RoundedBoxGeometry(0.24, 0.02, 0.035, 3, 0.008),
        materials.amberLed
      );
      frontBar.position.set(x * (W / 2 - 0.16), 0, z * (L / 2 - 0.02));
      cornerLedsGroup.add(frontBar);

      const sideBar = new THREE.Mesh(
        new RoundedBoxGeometry(0.035, 0.02, 0.24, 3, 0.008),
        materials.amberLed
      );
      sideBar.position.set(x * (W / 2 - 0.02), 0, z * (L / 2 - 0.16));
      cornerLedsGroup.add(sideBar);

      const cornerJoint = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 0.02, 16),
        materials.amberLed
      );
      cornerJoint.position.set(x * (W / 2 - 0.04), 0, z * (L / 2 - 0.04));
      cornerLedsGroup.add(cornerJoint);
    });
  }
  registerPart(
    "cornerLeds",
    cornerLedsGroup,
    new THREE.Vector3(0, 0.432, 0),
    new THREE.Vector3(0, 0.44, 0)
  );

  // SUB-ASSEMBLY 3: BALL-SCREW SCISSOR LIFT MECHANISM (`lift`)
  const liftGroup = new THREE.Group();
  const scissorArms: Array<{ mesh: THREE.Mesh; dir: number }> = [];
  {
    const frameOuterL = 1.45;
    const frameOuterW = 0.88;
    [-1, 1].forEach((xDir) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.055, 0.04, frameOuterL),
        materials.anodizedAluminum
      );
      rail.position.set(xDir * (frameOuterW / 2), 0.04, 0);
      liftGroup.add(rail);
    });

    [-1, 0, 1].forEach((zPos) => {
      const cross = new THREE.Mesh(
        new THREE.BoxGeometry(frameOuterW, 0.038, 0.055),
        materials.anodizedAluminum
      );
      cross.position.set(0, 0.04, zPos * 0.62);
      liftGroup.add(cross);
    });

    const screwShaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 1.15, 20),
      materials.chromeMetal
    );
    screwShaft.rotation.x = Math.PI / 2;
    liftGroup.add(screwShaft);

    const ballNut = new THREE.Mesh(
      new RoundedBoxGeometry(0.11, 0.08, 0.12, 3, 0.01),
      materials.brassContact
    );
    ballNut.position.set(0, 0.0, 0.12);
    liftGroup.add(ballNut);

    const liftMotor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.068, 0.24, 24),
      materials.bumperBlack
    );
    liftMotor.rotation.x = Math.PI / 2;
    liftMotor.position.set(0, 0.0, -0.52);
    liftGroup.add(liftMotor);

    const guideCoords: Array<[number, number]> = [
      [-0.38, -0.52],
      [0.38, -0.52],
      [-0.38, 0.52],
      [0.38, 0.52],
    ];
    guideCoords.forEach(([gx, gz]) => {
      const guidePost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.024, 0.024, 0.22, 16),
        materials.chromeMetal
      );
      guidePost.position.set(gx, -0.02, gz);
      liftGroup.add(guidePost);

      const bushing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 0.06, 16),
        materials.copperAccent
      );
      bushing.position.set(gx, 0.01, gz);
      liftGroup.add(bushing);
    });

    [-0.34, 0.34].forEach((sx) => {
      const arm1 = new THREE.Mesh(
        new RoundedBoxGeometry(0.028, 0.045, 0.72, 2, 0.006),
        materials.copperAccent
      );
      arm1.position.set(sx, -0.01, 0);
      arm1.rotation.x = 0.18;
      liftGroup.add(arm1);
      scissorArms.push({ mesh: arm1, dir: 1 });

      const arm2 = new THREE.Mesh(
        new RoundedBoxGeometry(0.028, 0.045, 0.72, 2, 0.006),
        materials.chromeMetal
      );
      arm2.position.set(sx + (sx > 0 ? -0.032 : 0.032), -0.01, 0);
      arm2.rotation.x = -0.18;
      liftGroup.add(arm2);
      scissorArms.push({ mesh: arm2, dir: -1 });
    });
  }
  registerPart(
    "lift",
    liftGroup,
    new THREE.Vector3(0, 0.36, 0),
    new THREE.Vector3(0, 0.38, 0)
  );

  // SUB-ASSEMBLY 4: FRONT SCULPTED FASCIA & SENSOR BAY (`frontShell`)
  const frontShellGroup = new THREE.Group();
  const frontFrustumMeshes: Array<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>> = [];
  {
    const innerCore = new THREE.Mesh(
      new RoundedBoxGeometry(W - 0.05, 0.265, 0.14, 4, 0.024),
      materials.sensorBayDark
    );
    frontShellGroup.add(innerCore);

    const fw = (W - 0.03) / 2;
    const fh = 0.135;
    const frontMaskShape = new THREE.Shape();
    frontMaskShape.moveTo(-fw, -fh + 0.02);
    frontMaskShape.lineTo(-fw + 0.2, -fh + 0.02);
    frontMaskShape.lineTo(-0.25, -0.025);
    frontMaskShape.lineTo(0.25, -0.025);
    frontMaskShape.lineTo(fw - 0.2, -fh + 0.02);
    frontMaskShape.lineTo(fw, -fh + 0.02);
    frontMaskShape.lineTo(fw, fh);
    frontMaskShape.lineTo(0.2, fh);
    frontMaskShape.lineTo(0.16, fh - 0.022);
    frontMaskShape.lineTo(-0.16, fh - 0.022);
    frontMaskShape.lineTo(-0.2, fh);
    frontMaskShape.lineTo(-fw, fh);
    frontMaskShape.closePath();

    const bayHole = new THREE.Path();
    bayHole.moveTo(-0.56, 0.005);
    bayHole.lineTo(-0.5, -0.042);
    bayHole.lineTo(-0.34, -0.042);
    bayHole.lineTo(-0.28, -0.012);
    bayHole.lineTo(0.28, -0.012);
    bayHole.lineTo(0.34, -0.042);
    bayHole.lineTo(0.5, -0.042);
    bayHole.lineTo(0.56, 0.005);
    bayHole.lineTo(0.52, 0.072);
    bayHole.lineTo(-0.52, 0.072);
    bayHole.closePath();
    frontMaskShape.holes.push(bayHole);

    const frontMaskGeo = new THREE.ExtrudeGeometry(frontMaskShape, {
      depth: 0.045,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.007,
      bevelThickness: 0.007,
    });
    const frontMaskMesh = new THREE.Mesh(frontMaskGeo, materials.whiteShell);
    frontMaskMesh.position.set(0, 0, 0.038);
    frontShellGroup.add(frontMaskMesh);

    [-1, 1].forEach((xDir) => {
      const cornerWrap = new THREE.Mesh(
        new RoundedBoxGeometry(0.085, 0.275, 0.19, 4, 0.028),
        materials.whiteShell
      );
      cornerWrap.position.set(xDir * (W / 2 - 0.042), 0.0, -0.005);
      frontShellGroup.add(cornerWrap);
    });

    [-0.255, -0.085, 0.085, 0.255].forEach((lx) => {
      const bezel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.028, 0.028, 24),
        materials.anodizedAluminum
      );
      bezel.rotation.x = Math.PI / 2;
      bezel.position.set(lx, 0.026, 0.068);
      frontShellGroup.add(bezel);

      const lens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.019, 0.019, 0.032, 24),
        materials.smokedGlass
      );
      lens.rotation.x = Math.PI / 2;
      lens.position.set(lx, 0.026, 0.071);
      frontShellGroup.add(lens);

      const pupil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.007, 0.007, 0.035, 16),
        materials.chromeMetal
      );
      pupil.rotation.x = Math.PI / 2;
      pupil.position.set(lx, 0.026, 0.073);
      frontShellGroup.add(pupil);
    });

    [-0.435, 0.435].forEach((hx) => {
      const podFrame = new THREE.Mesh(
        new RoundedBoxGeometry(0.145, 0.052, 0.035, 3, 0.008),
        materials.bumperBlack
      );
      podFrame.position.set(hx, 0.008, 0.066);
      frontShellGroup.add(podFrame);

      const ledStrip = new THREE.Mesh(
        new RoundedBoxGeometry(0.112, 0.019, 0.04, 2, 0.005),
        materials.whiteLed
      );
      ledStrip.position.set(hx, 0.008, 0.07);
      frontShellGroup.add(ledStrip);
    });

    const badgePlateMat = new THREE.MeshStandardMaterial({
      map: createFrontBadgeTexture(),
      roughness: 0.3,
      metalness: 0.25,
    });
    const badgePlate = new THREE.Mesh(
      new RoundedBoxGeometry(0.46, 0.112, 0.035, 2, 0.006),
      badgePlateMat
    );
    badgePlate.position.set(0, -0.078, 0.064);
    frontShellGroup.add(badgePlate);

    const frustumGeo = new THREE.ConeGeometry(0.48, 0.95, 4, 1, true);
    const frustumMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.0,
    });
    const frustumMesh = new THREE.Mesh(frustumGeo, frustumMat);
    frustumMesh.rotation.x = -Math.PI / 2;
    frustumMesh.rotation.y = Math.PI / 4;
    frustumMesh.position.set(0, 0.026, 0.56);
    frontShellGroup.add(frustumMesh);
    frontFrustumMeshes.push(frustumMesh);
  }
  registerPart(
    "frontShell",
    frontShellGroup,
    new THREE.Vector3(0, 0.27, L / 2 - 0.085),
    new THREE.Vector3(0, 0.04, 0.55)
  );

  // SUB-ASSEMBLY 5: REAR SCULPTED FASCIA, RED VISOR & DOCKING PADS (`rearShell`)
  const rearShellGroup = new THREE.Group();
  {
    const rearBody = new THREE.Mesh(
      new RoundedBoxGeometry(W - 0.04, 0.27, 0.16, 4, 0.026),
      materials.whiteShell
    );
    rearBody.position.set(0, 0.01, 0);
    rearShellGroup.add(rearBody);

    const redRim = new THREE.Mesh(
      new RoundedBoxGeometry(W - 0.16, 0.092, 0.045, 4, 0.025),
      materials.redVisorTrim
    );
    redRim.position.set(0, 0.055, -0.066);
    rearShellGroup.add(redRim);

    const visorGlass = new THREE.Mesh(
      new RoundedBoxGeometry(W - 0.19, 0.072, 0.052, 4, 0.02),
      materials.sensorBayDark
    );
    visorGlass.position.set(0, 0.055, -0.068);
    rearShellGroup.add(visorGlass);

    [-0.08, 0.08].forEach((rx) => {
      const rearLens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.03, 20),
        materials.chromeMetal
      );
      rearLens.rotation.x = Math.PI / 2;
      rearLens.position.set(rx, 0.055, -0.086);
      rearShellGroup.add(rearLens);
    });

    const chargeHousing = new THREE.Mesh(
      new RoundedBoxGeometry(0.42, 0.095, 0.05, 3, 0.012),
      materials.sensorBayDark
    );
    chargeHousing.position.set(0, -0.075, -0.066);
    rearShellGroup.add(chargeHousing);

    [-0.09, 0.09].forEach((cx) => {
      const padBezel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.028, 0.03, 24),
        materials.anodizedAluminum
      );
      padBezel.rotation.x = Math.PI / 2;
      padBezel.position.set(cx, -0.075, -0.084);
      rearShellGroup.add(padBezel);

      const brassPad = new THREE.Mesh(
        new THREE.CylinderGeometry(0.017, 0.017, 0.036, 20),
        materials.brassContact
      );
      brassPad.rotation.x = Math.PI / 2;
      brassPad.position.set(cx, -0.075, -0.086);
      rearShellGroup.add(brassPad);
    });

    const rearLogoMat = new THREE.MeshStandardMaterial({
      map: createRearLogoTexture(),
      roughness: 0.28,
      metalness: 0.06,
    });
    const rearLogoPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.34, 0.09),
      rearLogoMat
    );
    rearLogoPlane.rotation.y = Math.PI;
    rearLogoPlane.position.set(-0.4, -0.072, -0.082);
    rearShellGroup.add(rearLogoPlane);
  }
  registerPart(
    "rearShell",
    rearShellGroup,
    new THREE.Vector3(0, 0.27, -(L / 2 - 0.085)),
    new THREE.Vector3(0, 0.04, -0.55)
  );

  // SUB-ASSEMBLY 6: COMPOSITE SIDE FAIRINGS WITH WHEEL ARCHES (`sidePanels`)
  const sidePanelsGroup = new THREE.Group();
  const leftPanelSubGroup = new THREE.Group();
  const rightPanelSubGroup = new THREE.Group();
  {
    const sideLen = L - 0.16;
    const sideH = 0.275;
    const archR = 0.235;

    const shape = new THREE.Shape();
    shape.moveTo(-sideLen / 2, -sideH / 2);
    shape.lineTo(-archR, -sideH / 2);
    shape.absarc(0, -sideH / 2 + 0.02, archR, Math.PI, 0, true);
    shape.lineTo(sideLen / 2, -sideH / 2);
    shape.lineTo(sideLen / 2, sideH / 2);
    shape.lineTo(-sideLen / 2, sideH / 2);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.048,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.008,
      bevelThickness: 0.008,
    };
    const sideGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    sideGeo.center();

    const leftMesh = new THREE.Mesh(sideGeo, materials.whiteShell);
    leftMesh.rotation.y = -Math.PI / 2;
    leftPanelSubGroup.add(leftMesh);

    const rightMesh = new THREE.Mesh(sideGeo, materials.whiteShell);
    rightMesh.rotation.y = Math.PI / 2;
    rightPanelSubGroup.add(rightMesh);

    const archLinerGeo = new THREE.CylinderGeometry(
      archR + 0.004,
      archR + 0.004,
      0.11,
      32,
      1,
      true,
      -Math.PI / 2,
      Math.PI
    );
    [-1, 1].forEach((xDir) => {
      const targetSub = xDir < 0 ? leftPanelSubGroup : rightPanelSubGroup;
      const liner = new THREE.Mesh(archLinerGeo, materials.bumperBlack);
      liner.rotation.z = Math.PI / 2;
      liner.position.set(-xDir * 0.035, -sideH / 2 + 0.02, 0);
      targetSub.add(liner);
    });

    function createQuarterPlaque(isNexus: boolean) {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 160;
      const ctx = c.getContext("2d")!;
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;

      registerLogoTextureRedraw(() => {
        ctx.fillStyle = "#eceef2";
        ctx.fillRect(0, 0, 512, 160);

        if (isNexus) {
          ctx.font = '700 66px "Space Grotesk", sans-serif';
          ctx.fillStyle = "#1b1d22";
          ctx.fillText("NEXUS", 36, 105);
          ctx.fillStyle = "#e8641b";
          ctx.fillText("M2", 290, 105);
        } else {
          drawInfinitudeIcon(ctx, 76, 82, 1.18);
          ctx.fillStyle = "#20242c";
          ctx.font = '700 38px "Space Grotesk", sans-serif';
          ctx.fillText("INFINITUDE", 142, 78);
          ctx.fillStyle = "#5a6270";
          ctx.font = '600 20px "JetBrains Mono", monospace';
          ctx.fillText("R O B O T I C S", 145, 108);
        }
        t.needsUpdate = true;
      });

      return new THREE.MeshStandardMaterial({
        map: t,
        roughness: 0.28,
        metalness: 0.05,
      });
    }

    const nexusPlaqueMat = createQuarterPlaque(true);
    const infPlaqueMat = createQuarterPlaque(false);

    const leftNexus = new THREE.Mesh(
      new THREE.PlaneGeometry(0.54, 0.165),
      nexusPlaqueMat
    );
    leftNexus.rotation.y = -Math.PI / 2;
    leftNexus.position.set(-0.033, -0.015, -0.58);
    leftPanelSubGroup.add(leftNexus);

    const leftInf = new THREE.Mesh(
      new THREE.PlaneGeometry(0.54, 0.165),
      infPlaqueMat
    );
    leftInf.rotation.y = -Math.PI / 2;
    leftInf.position.set(-0.033, -0.015, 0.58);
    leftPanelSubGroup.add(leftInf);

    const rightNexus = new THREE.Mesh(
      new THREE.PlaneGeometry(0.54, 0.165),
      nexusPlaqueMat
    );
    rightNexus.rotation.y = Math.PI / 2;
    rightNexus.position.set(0.033, -0.015, -0.58);
    rightPanelSubGroup.add(rightNexus);

    const rightInf = new THREE.Mesh(
      new THREE.PlaneGeometry(0.54, 0.165),
      infPlaqueMat
    );
    rightInf.rotation.y = Math.PI / 2;
    rightInf.position.set(0.033, -0.015, 0.58);
    rightPanelSubGroup.add(rightInf);

    [-0.86, 0.86].forEach((sz) => {
      const leftSeam = new THREE.Mesh(
        new THREE.BoxGeometry(0.006, sideH - 0.01, 0.005),
        materials.bumperBlack
      );
      leftSeam.position.set(-0.031, 0, sz);
      leftPanelSubGroup.add(leftSeam);

      const rightSeam = new THREE.Mesh(
        new THREE.BoxGeometry(0.006, sideH - 0.01, 0.005),
        materials.bumperBlack
      );
      rightSeam.position.set(0.031, 0, sz);
      rightPanelSubGroup.add(rightSeam);
    });

    leftPanelSubGroup.position.set(-(W / 2 - 0.03), 0, 0);
    rightPanelSubGroup.position.set(W / 2 - 0.03, 0, 0);
    sidePanelsGroup.add(leftPanelSubGroup, rightPanelSubGroup);
  }
  registerPart(
    "sidePanels",
    sidePanelsGroup,
    new THREE.Vector3(0, 0.27, 0),
    new THREE.Vector3(0, 0.04, 0)
  );

  // SUB-ASSEMBLY 7: CENTER DIFFERENTIAL DRIVE WHEELS (`wheels`)
  const wheelsGroup = new THREE.Group();
  const wheelSpinMeshes: THREE.Group[] = [];
  const leftWheelSub = new THREE.Group();
  const rightWheelSub = new THREE.Group();
  {
    const wheelRadius = 0.205;
    const wheelWidth = 0.095;

    [-1, 1].forEach((xDir) => {
      const holder = xDir < 0 ? leftWheelSub : rightWheelSub;
      const spinAssembly = new THREE.Group();

      const tireGeo = new THREE.CylinderGeometry(
        wheelRadius,
        wheelRadius,
        wheelWidth,
        48
      );
      const tire = new THREE.Mesh(tireGeo, materials.rubberTire);
      tire.rotation.z = Math.PI / 2;
      spinAssembly.add(tire);

      [-0.024, 0, 0.024].forEach((tx) => {
        const groove = new THREE.Mesh(
          new THREE.CylinderGeometry(
            wheelRadius + 0.002,
            wheelRadius + 0.002,
            0.008,
            36
          ),
          materials.bumperBlack
        );
        groove.rotation.z = Math.PI / 2;
        groove.position.x = tx;
        spinAssembly.add(groove);
      });

      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.142, 0.142, wheelWidth + 0.006, 36),
        materials.wheelRim
      );
      rim.rotation.z = Math.PI / 2;
      spinAssembly.add(rim);

      const orangeRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.14, 0.0045, 12, 48),
        materials.copperAccent
      );
      orangeRing.rotation.y = Math.PI / 2;
      orangeRing.position.x = xDir * (wheelWidth / 2 + 0.003);
      spinAssembly.add(orangeRing);

      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const lug = new THREE.Mesh(
          new THREE.CylinderGeometry(0.007, 0.007, 0.015, 12),
          materials.chromeMetal
        );
        lug.rotation.z = Math.PI / 2;
        lug.position.set(
          xDir * (wheelWidth / 2 + 0.004),
          Math.cos(ang) * 0.078,
          Math.sin(ang) * 0.078
        );
        spinAssembly.add(lug);
      }

      const hubCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.046, 0.022, 28),
        materials.chromeMetal
      );
      hubCap.rotation.z = Math.PI / 2;
      hubCap.position.x = xDir * (wheelWidth / 2 + 0.008);
      spinAssembly.add(hubCap);

      wheelSpinMeshes.push(spinAssembly);
      holder.add(spinAssembly);
    });

    leftWheelSub.position.set(-(W / 2 - 0.038), 0, 0);
    rightWheelSub.position.set(W / 2 - 0.038, 0, 0);
    wheelsGroup.add(leftWheelSub, rightWheelSub);
  }
  registerPart(
    "wheels",
    wheelsGroup,
    new THREE.Vector3(0, 0.205, 0),
    new THREE.Vector3(0, 0, 0)
  );

  // SUB-ASSEMBLY 8: ARM EDGE AI COMPUTE & VSLAM CONTROLLER (`compute`)
  const computeGroup = new THREE.Group();
  {
    const pcbBase = new THREE.Mesh(
      new RoundedBoxGeometry(0.56, 0.018, 0.44, 2, 0.005),
      materials.pcbBoard
    );
    computeGroup.add(pcbBase);

    const heatsinkBase = new THREE.Mesh(
      new RoundedBoxGeometry(0.36, 0.045, 0.28, 2, 0.006),
      materials.anodizedAluminum
    );
    heatsinkBase.position.set(-0.04, 0.03, 0);
    computeGroup.add(heatsinkBase);

    for (let i = -6; i <= 6; i++) {
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.035, 0.008),
        materials.anodizedAluminum
      );
      fin.position.set(-0.04, 0.065, i * 0.02);
      computeGroup.add(fin);
    }

    [-0.05, 0.05].forEach((pz) => {
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.009, 0.009, 0.46, 16),
        materials.copperAccent
      );
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(0, 0.022, pz);
      computeGroup.add(pipe);
    });

    const chipBadge = new THREE.Mesh(
      new THREE.PlaneGeometry(0.18, 0.09),
      createPrimaryLogoMedallionMaterial("#161922", true)
    );
    chipBadge.rotation.x = -Math.PI / 2;
    chipBadge.position.set(-0.04, 0.084, 0);
    computeGroup.add(chipBadge);

    for (let i = -3; i <= 3; i++) {
      const port = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.035, 16),
        materials.brassContact
      );
      port.rotation.x = Math.PI / 2;
      port.position.set(i * 0.065, 0.025, 0.22);
      computeGroup.add(port);

      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.012, 0.012, 0.012),
        i % 2 === 0 ? materials.statusGreenLed : materials.amberLed
      );
      led.position.set(i * 0.065, 0.015, 0.21);
      computeGroup.add(led);
    }
  }
  registerPart(
    "compute",
    computeGroup,
    new THREE.Vector3(0, 0.22, 0.56),
    new THREE.Vector3(0, 0.24, 0.2)
  );

  // SUB-ASSEMBLY 9: 48V 60Ah LiFePO4 SMART BATTERY PACK (`battery`)
  const batteryGroup = new THREE.Group();
  {
    const packBox = new THREE.Mesh(
      new RoundedBoxGeometry(0.64, 0.165, 0.58, 4, 0.018),
      materials.batteryBlue
    );
    batteryGroup.add(packBox);

    const topSpecMat = new THREE.MeshStandardMaterial({
      map: createBatteryLabelTexture(),
      roughness: 0.3,
      metalness: 0.3,
    });
    const specPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(0.46, 0.24),
      topSpecMat
    );
    specPlate.rotation.x = -Math.PI / 2;
    specPlate.position.set(0, 0.084, -0.08);
    batteryGroup.add(specPlate);

    for (let row = 0; row < 2; row++) {
      for (let col = -3; col <= 3; col++) {
        const cellCap = new THREE.Mesh(
          new RoundedBoxGeometry(0.065, 0.022, 0.075, 2, 0.004),
          materials.bumperBlack
        );
        cellCap.position.set(col * 0.08, 0.085, 0.12 + row * 0.1);
        batteryGroup.add(cellCap);

        const busbar = new THREE.Mesh(
          new THREE.BoxGeometry(0.072, 0.008, 0.025),
          materials.copperAccent
        );
        busbar.position.set(col * 0.08, 0.098, 0.12 + row * 0.1);
        batteryGroup.add(busbar);
      }
    }

    [-0.18, 0.18].forEach((bx) => {
      const hvPlug = new THREE.Mesh(
        new RoundedBoxGeometry(0.075, 0.055, 0.06, 2, 0.008),
        materials.hvOrangeCable
      );
      hvPlug.position.set(bx, 0.02, 0.3);
      batteryGroup.add(hvPlug);
    });
  }
  registerPart(
    "battery",
    batteryGroup,
    new THREE.Vector3(0, 0.2, -0.44),
    new THREE.Vector3(0, 0.18, -0.18)
  );

  // SUB-ASSEMBLY 10: DUAL SERVO MOTOR DRIVERS & PDU (`pdu`)
  const pduGroup = new THREE.Group();
  {
    [-0.42, 0.42].forEach((px) => {
      const inverter = new THREE.Mesh(
        new RoundedBoxGeometry(0.16, 0.095, 0.32, 3, 0.01),
        materials.chromeMetal
      );
      inverter.position.set(px, 0, 0.05);
      pduGroup.add(inverter);

      [-0.07, 0.0, 0.07].forEach((cz) => {
        const cap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.024, 0.024, 0.045, 16),
          materials.hvOrangeCable
        );
        cap.position.set(px, 0.06, 0.05 + cz);
        pduGroup.add(cap);
      });

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(px * 0.45, -0.01, -0.22),
        new THREE.Vector3(px * 0.85, 0.01, -0.1),
        new THREE.Vector3(px, 0.01, 0.22),
        new THREE.Vector3(px * 0.8, -0.02, 0.38),
      ]);
      const cableGeo = new THREE.TubeGeometry(curve, 24, 0.013, 12, false);
      const cable = new THREE.Mesh(cableGeo, materials.hvOrangeCable);
      pduGroup.add(cable);
    });
  }
  registerPart(
    "pdu",
    pduGroup,
    new THREE.Vector3(0, 0.21, 0.02),
    new THREE.Vector3(0, 0.14, 0)
  );

  // SUB-ASSEMBLY 11: DUAL 270° SAFETY SLAM LiDAR SCANNERS (`lidar`)
  const lidarGroup = new THREE.Group();
  const lidarRotors: THREE.Mesh[] = [];
  const lidarScanMeshes: Array<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>> = [];
  {
    const lidarCorners = [
      { x: -(W / 2 - 0.14), z: L / 2 - 0.14, rotY: Math.PI * 0.75 },
      { x: W / 2 - 0.14, z: -(L / 2 - 0.14), rotY: -Math.PI * 0.25 },
    ];

    lidarCorners.forEach(({ x, z, rotY }) => {
      const unit = new THREE.Group();
      unit.position.set(x, 0, z);
      unit.rotation.y = rotY;

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.068, 0.072, 0.055, 24),
        materials.lidarYellow
      );
      base.position.y = -0.03;
      unit.add(base);

      const windowDrum = new THREE.Mesh(
        new THREE.CylinderGeometry(0.062, 0.066, 0.065, 24),
        materials.smokedGlass
      );
      windowDrum.position.y = 0.025;
      unit.add(windowDrum);

      const rotor = new THREE.Mesh(
        new THREE.BoxGeometry(0.055, 0.042, 0.055),
        materials.brassContact
      );
      rotor.position.y = 0.025;
      unit.add(rotor);
      lidarRotors.push(rotor);

      const topCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.068, 0.068, 0.022, 24),
        materials.bumperBlack
      );
      topCap.position.y = 0.068;
      unit.add(topCap);

      const fanGeo = new THREE.RingGeometry(
        0.08,
        1.45,
        48,
        1,
        -Math.PI * 0.75,
        Math.PI * 1.5
      );
      const fanMat = new THREE.MeshBasicMaterial({
        color: 0xff6b1a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.0,
      });
      const fanMesh = new THREE.Mesh(fanGeo, fanMat);
      fanMesh.rotation.x = -Math.PI / 2;
      fanMesh.position.y = 0.02;
      unit.add(fanMesh);
      lidarScanMeshes.push(fanMesh);

      lidarGroup.add(unit);
    });
  }
  registerPart(
    "lidar",
    lidarGroup,
    new THREE.Vector3(0, 0.145, 0),
    new THREE.Vector3(0, 0.08, 0)
  );

  // SUB-ASSEMBLY 12: DIFFERENTIAL SERVO MOTORS & COILOVER SUSPENSION (`drivetrain`)
  const drivetrainGroup = new THREE.Group();
  {
    [-1, 1].forEach((xDir) => {
      const unit = new THREE.Group();
      unit.position.set(xDir * 0.36, 0, 0);

      const servoMotor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.088, 0.088, 0.25, 28),
        materials.anodizedAluminum
      );
      servoMotor.rotation.z = Math.PI / 2;
      servoMotor.position.x = -xDir * 0.06;
      unit.add(servoMotor);

      const swingarm = new THREE.Mesh(
        new RoundedBoxGeometry(0.08, 0.095, 0.36, 3, 0.01),
        materials.chromeMetal
      );
      swingarm.position.set(xDir * 0.07, 0, 0);
      unit.add(swingarm);

      [-0.14, 0.14].forEach((sz) => {
        const damperShaft = new THREE.Mesh(
          new THREE.CylinderGeometry(0.014, 0.014, 0.18, 16),
          materials.chromeMetal
        );
        damperShaft.position.set(xDir * 0.07, 0.07, sz);
        unit.add(damperShaft);

        for (let s = 0; s < 6; s++) {
          const coil = new THREE.Mesh(
            new THREE.TorusGeometry(0.026, 0.006, 10, 20),
            materials.copperAccent
          );
          coil.rotation.x = Math.PI / 2;
          coil.position.set(xDir * 0.07, 0.02 + s * 0.022, sz);
          unit.add(coil);
        }
      });

      const rotor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.115, 0.115, 0.014, 28),
        materials.chromeMetal
      );
      rotor.rotation.z = Math.PI / 2;
      rotor.position.x = xDir * 0.12;
      unit.add(rotor);

      drivetrainGroup.add(unit);
    });
  }
  registerPart(
    "drivetrain",
    drivetrainGroup,
    new THREE.Vector3(0, 0.205, 0),
    new THREE.Vector3(0, -0.04, 0)
  );

  // SUB-ASSEMBLY 13: WELDED STEEL CHASSIS BASE, BUMPER SKIRT & 4 CASTERS (`chassis`)
  const chassisGroup = new THREE.Group();
  {
    const lowerSkirt = new THREE.Mesh(
      new RoundedBoxGeometry(W + 0.01, 0.068, L + 0.01, 5, 0.025),
      materials.bumperBlack
    );
    chassisGroup.add(lowerSkirt);

    const cornerBumperCoords: Array<[number, number]> = [
      [-W / 2 + 0.09, L / 2 - 0.09],
      [W / 2 - 0.09, L / 2 - 0.09],
      [-W / 2 + 0.09, -L / 2 + 0.09],
      [W / 2 - 0.09, -L / 2 + 0.09],
    ];
    cornerBumperCoords.forEach(([bx, bz]) => {
      const pad = new THREE.Mesh(
        new RoundedBoxGeometry(0.24, 0.076, 0.24, 4, 0.028),
        materials.bumperBlack
      );
      pad.position.set(bx, -0.002, bz);
      chassisGroup.add(pad);
    });

    const ladderTubing = new THREE.Mesh(
      new RoundedBoxGeometry(W - 0.18, 0.055, L - 0.22, 3, 0.01),
      materials.chassisSteel
    );
    ladderTubing.position.y = 0.035;
    chassisGroup.add(ladderTubing);

    const casterCoords: Array<[number, number]> = [
      [-W * 0.34, L * 0.36],
      [W * 0.34, L * 0.36],
      [-W * 0.34, -L * 0.36],
      [W * 0.34, -L * 0.36],
    ];
    casterCoords.forEach(([cx, cz]) => {
      const casterRig = new THREE.Group();
      casterRig.position.set(cx, -0.03, cz);

      const fork = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.035, 0.045, 16),
        materials.chromeMetal
      );
      fork.position.y = 0.015;
      casterRig.add(fork);

      [-0.022, 0.022].forEach((wx) => {
        const roller = new THREE.Mesh(
          new THREE.CylinderGeometry(0.048, 0.048, 0.018, 24),
          materials.copperAccent
        );
        roller.rotation.z = Math.PI / 2;
        roller.position.set(wx, -0.012, 0);
        casterRig.add(roller);
      });

      chassisGroup.add(casterRig);
    });
  }
  registerPart(
    "chassis",
    chassisGroup,
    new THREE.Vector3(0, 0.09, 0),
    new THREE.Vector3(0, -0.14, 0)
  );

  // -------------------------------------------------------------------------
  // 5. CLIENT CAPABILITY SHOWCASE ASSEMBLIES (PAYLOAD LIFT, SLAM NAV, SAFETY/DOCK)
  // -------------------------------------------------------------------------
  function createPayloadCrateTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;

    registerLogoTextureRedraw(() => {
      ctx.fillStyle = "#151820";
      ctx.fillRect(0, 0, 1024, 512);

      // Diagonal hazard stripes along bottom edge
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 444, 1024, 68);
      ctx.clip();
      ctx.fillStyle = "#111318";
      ctx.fillRect(0, 444, 1024, 68);
      ctx.fillStyle = "#ff8a1f";
      for (let x = -512; x < 1536; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 444);
        ctx.lineTo(x + 32, 444);
        ctx.lineTo(x + 64, 512);
        ctx.lineTo(x + 32, 512);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      ctx.strokeStyle = "rgba(255, 138, 31, 0.65)";
      ctx.lineWidth = 6;
      ctx.strokeRect(18, 18, 988, 410);

      drawInfinitudeIcon(ctx, 115, 105, 1.35);
      ctx.fillStyle = "#f1eee8";
      ctx.font = '700 42px "Space Grotesk", sans-serif';
      ctx.fillText("INFINITUDE CARGO MODULE // PALLET-NATIVE", 195, 100);
      ctx.fillStyle = "#ff8a1f";
      ctx.font = '600 24px "JetBrains Mono", monospace';
      ctx.fillText("RATED PAYLOAD: 1,000 KG   |   ACTIVE SCISSOR LIFT: +140 MM", 195, 140);

      ctx.fillStyle = "#94a3b8";
      ctx.font = '600 26px "JetBrains Mono", monospace';
      ctx.fillText("DECK INTERFACE: 4-POINT AUTO TWIST-LOCK   |   COG: STABILIZED", 54, 248);
      ctx.fillStyle = "#6ee7a8";
      ctx.fillText("STATUS: PAYLOAD ENGAGED · ZERO FLOOR MODIFICATION", 54, 304);

      // Load cell telemetry bars
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = "rgba(255, 138, 31, 0.16)";
        ctx.fillRect(54 + i * 232, 342, 210, 56);
        ctx.strokeStyle = "#ff8a1f";
        ctx.lineWidth = 2;
        ctx.strokeRect(54 + i * 232, 342, 210, 56);
        ctx.fillStyle = "#f1eee8";
        ctx.font = '600 22px "JetBrains Mono", monospace';
        ctx.fillText(`CELL 0${i + 1}: 250 KG`, 72 + i * 232, 378);
      }

      tex.needsUpdate = true;
    });

    return tex;
  }

  // A) 1,000 KG Pallet & Cargo Load Assembly
  const payloadGroup = new THREE.Group();
  const payloadLaserRingMat = new THREE.MeshBasicMaterial({
    color: 0xff8a1f,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const payloadGlowPillars: THREE.MeshBasicMaterial[] = [];
  {
    const palletW = W * 0.92;
    const palletL = L * 0.88;
    const palletMat = new THREE.MeshStandardMaterial({
      color: 0x232730,
      roughness: 0.45,
      metalness: 0.55,
    });

    // 3 heavy-duty longitudinal pallet runners
    [-palletW * 0.42, 0, palletW * 0.42].forEach((px) => {
      const runner = new THREE.Mesh(
        new RoundedBoxGeometry(0.09, 0.055, palletL, 2, 0.008),
        palletMat
      );
      runner.position.set(px, 0.028, 0);
      runner.castShadow = true;
      payloadGroup.add(runner);
    });

    // 7 top deck pallet slats
    for (let i = -3; i <= 3; i++) {
      const slat = new THREE.Mesh(
        new RoundedBoxGeometry(palletW, 0.022, 0.16, 2, 0.005),
        palletMat
      );
      slat.position.set(0, 0.066, i * 0.24);
      slat.castShadow = true;
      payloadGroup.add(slat);
    }

    // Main 1,000 kg industrial cargo container
    const crateLabelMat = new THREE.MeshStandardMaterial({
      map: createPayloadCrateTexture(),
      roughness: 0.3,
      metalness: 0.35,
    });
    const crateBodyMat = new THREE.MeshStandardMaterial({
      color: 0x181b22,
      roughness: 0.35,
      metalness: 0.5,
    });
    const crateW = palletW * 0.88;
    const crateH = 0.34;
    const crateL = palletL * 0.86;
    const crateMesh = new THREE.Mesh(
      new THREE.BoxGeometry(crateW, crateH, crateL),
      [
        crateLabelMat,
        crateLabelMat,
        crateBodyMat,
        crateBodyMat,
        crateLabelMat,
        crateLabelMat,
      ]
    );
    crateMesh.position.set(0, 0.078 + crateH / 2, 0);
    crateMesh.castShadow = true;
    crateMesh.receiveShadow = true;
    payloadGroup.add(crateMesh);

    // Metallic orange tie-down ribs over the cargo crate
    [-crateL * 0.28, crateL * 0.28].forEach((sz) => {
      const strap = new THREE.Mesh(
        new RoundedBoxGeometry(crateW + 0.02, crateH + 0.015, 0.035, 2, 0.006),
        materials.copperAccent
      );
      strap.position.set(0, 0.078 + crateH / 2, sz);
      payloadGroup.add(strap);
    });

    // 4 vertical laser alignment guide beams at corners
    const cornerCoords: Array<[number, number]> = [
      [-palletW / 2, -palletL / 2],
      [palletW / 2, -palletL / 2],
      [-palletW / 2, palletL / 2],
      [palletW / 2, palletL / 2],
    ];
    cornerCoords.forEach(([cx, cz]) => {
      const pMat = new THREE.MeshBasicMaterial({
        color: 0xff8a1f,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      payloadGlowPillars.push(pMat);
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.55, 12),
        pMat
      );
      beam.position.set(cx, 0.18, cz);
      payloadGroup.add(beam);
    });
  }
  const payloadLaserRing = new THREE.Mesh(
    new THREE.RingGeometry(0.75, 0.82, 48),
    payloadLaserRingMat
  );
  payloadLaserRing.rotation.x = -Math.PI / 2;
  payloadGroup.add(payloadLaserRing);
  payloadGroup.position.set(0, 0.5, 0);
  robotRoot.add(payloadGroup);

  // B) Autonomous SLAM Navigation Corridor & Dynamic Obstacle Bypass Assembly
  const navGroup = new THREE.Group();
  const navChevrons: Array<{ mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number }> = [];
  const slamRings: Array<{ mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number }> = [];
  const navSplineCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.012, -2.2),
    new THREE.Vector3(0, 0.012, -0.9),
    new THREE.Vector3(0, 0.012, 0.0),
    new THREE.Vector3(-0.38, 0.012, 1.05),
    new THREE.Vector3(-0.46, 0.012, 1.85),
    new THREE.Vector3(0.0, 0.012, 2.65),
  ]);
  const navTubeMat = new THREE.MeshBasicMaterial({
    color: 0xff8a1f,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const obstacleWireMat = new THREE.MeshBasicMaterial({
    color: 0xff5a1f,
    wireframe: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const obstacleFillMat = new THREE.MeshBasicMaterial({
    color: 0xff5a1f,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  {
    const tubeGeo = new THREE.TubeGeometry(navSplineCurve, 64, 0.022, 12, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, navTubeMat);
    navGroup.add(tubeMesh);

    // 14 animated directional chevrons streaming along the spline
    const chevronShape = new THREE.Shape();
    chevronShape.moveTo(-0.14, -0.08);
    chevronShape.lineTo(0, 0.1);
    chevronShape.lineTo(0.14, -0.08);
    chevronShape.lineTo(0.09, -0.12);
    chevronShape.lineTo(0, 0.02);
    chevronShape.lineTo(-0.09, -0.12);
    chevronShape.closePath();
    const chevronGeo = new THREE.ShapeGeometry(chevronShape);
    chevronGeo.rotateX(-Math.PI / 2);

    for (let i = 0; i < 14; i++) {
      const cMat = new THREE.MeshBasicMaterial({
        color: 0xffb347,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const cMesh = new THREE.Mesh(chevronGeo, cMat);
      navGroup.add(cMesh);
      navChevrons.push({ mesh: cMesh, mat: cMat, phase: i / 14 });
    }

    // 3 expanding 360° SLAM perception sonar rings
    for (let i = 0; i < 3; i++) {
      const rMat = new THREE.MeshBasicMaterial({
        color: 0xff8a1f,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const rMesh = new THREE.Mesh(new THREE.RingGeometry(0.95, 1.0, 64), rMat);
      rMesh.rotation.x = -Math.PI / 2;
      rMesh.position.y = 0.008;
      navGroup.add(rMesh);
      slamRings.push({ mesh: rMesh, mat: rMat, phase: i / 3 });
    }

    // Virtual detected obstacle box ahead-right being bypassed by the spline
    const obsBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.42, 0.46),
      obstacleFillMat
    );
    obsBox.position.set(0.42, 0.21, 1.45);
    navGroup.add(obsBox);

    const obsWire = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.44, 0.48),
      obstacleWireMat
    );
    obsWire.position.set(0.42, 0.22, 1.45);
    navGroup.add(obsWire);
  }
  scene.add(navGroup);

  // C) ISO 3691-4 PL-d 360° Safety Shield & ±5mm Auto-Dock / Fast-Charge Assembly
  const safetyDockGroup = new THREE.Group();
  const outerWarnMat = new THREE.MeshBasicMaterial({
    color: 0xff8a1f,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const innerSafeMat = new THREE.MeshBasicMaterial({
    color: 0x6ee7a8,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const dockLaserMat = new THREE.MeshBasicMaterial({
    color: 0x6ee7a8,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const radarSweepMesh = new THREE.Mesh(
    new THREE.RingGeometry(0.65, 1.92, 48, 1, 0, Math.PI * 0.35),
    new THREE.MeshBasicMaterial({
      color: 0x6ee7a8,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  {
    const outerRing = new THREE.Mesh(
      new THREE.RingGeometry(1.86, 1.92, 72),
      outerWarnMat
    );
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.009;
    safetyDockGroup.add(outerRing);

    const innerRing = new THREE.Mesh(
      new THREE.RingGeometry(1.28, 1.34, 72),
      innerSafeMat
    );
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.01;
    safetyDockGroup.add(innerRing);

    radarSweepMesh.rotation.x = -Math.PI / 2;
    radarSweepMesh.position.y = 0.008;
    safetyDockGroup.add(radarSweepMesh);

    // Precision ±5mm optical docking & 48V fast-charge station target behind rear bumper
    [-0.18, 0.18].forEach((lx) => {
      const laserBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.9, 12),
        dockLaserMat
      );
      laserBeam.rotation.x = Math.PI / 2;
      laserBeam.position.set(lx, 0.16, -L / 2 - 0.45);
      safetyDockGroup.add(laserBeam);
    });

    const dockTargetRing = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.24, 32),
      dockLaserMat
    );
    dockTargetRing.position.set(0, 0.16, -L / 2 - 0.9);
    safetyDockGroup.add(dockTargetRing);
  }
  scene.add(safetyDockGroup);

  // -------------------------------------------------------------------------
  // 6. MULTI-MODE CAPABILITY SHOWCASE TIMELINE & INTERACTIVE CONTROLLER
  // -------------------------------------------------------------------------
  interface CapabilityKeyframe {
    pos: THREE.Vector3;
    target: THREE.Vector3;
    lift: number;
    nav: number;
    safety: number;
    explode: number;
    lidar: number;
    modeIdx: number;
  }

  const bannerKeyframes: CapabilityKeyframe[] = [
    // Mode 0: 1,000 KG Payload Lift (Active Scissor Lift + Cargo Crate)
    {
      pos: new THREE.Vector3(-4.15, 2.15, 4.45),
      target: new THREE.Vector3(0, 0.2, 0),
      lift: 1.0,
      nav: 0.0,
      safety: 0.0,
      explode: 0.0,
      lidar: 0.16,
      modeIdx: 0,
    },
    // Mode 1: Autonomous SLAM Navigation & Obstacle Bypass
    {
      pos: new THREE.Vector3(3.95, 2.25, 4.55),
      target: new THREE.Vector3(0, 0.16, 0),
      lift: 0.35,
      nav: 1.0,
      safety: 0.0,
      explode: 0.0,
      lidar: 0.34,
      modeIdx: 1,
    },
    // Mode 2: ISO 3691-4 PL-d 360° Safety Shield & ±5mm Auto-Docking
    {
      pos: new THREE.Vector3(-3.85, 2.45, -4.35),
      target: new THREE.Vector3(0, 0.16, 0),
      lift: 0.0,
      nav: 0.15,
      safety: 1.0,
      explode: 0.0,
      lidar: 0.28,
      modeIdx: 2,
    },
    // Mode 3: Modular Internal Architecture (13-Part Exploded X-Ray)
    {
      pos: new THREE.Vector3(4.25, 2.65, 4.15),
      target: new THREE.Vector3(0, 0.26, 0),
      lift: 0.0,
      nav: 0.0,
      safety: 0.0,
      explode: 0.9,
      lidar: 0.2,
      modeIdx: 3,
    },
    // Loop back to Mode 0
    {
      pos: new THREE.Vector3(-4.15, 2.15, 4.45),
      target: new THREE.Vector3(0, 0.2, 0),
      lift: 1.0,
      nav: 0.0,
      safety: 0.0,
      explode: 0.0,
      lidar: 0.16,
      modeIdx: 0,
    },
  ];

  const MODE_META = [
    {
      code: "CAPABILITY 01 // ACTIVE PAYLOAD LIFT",
      title: "1,000 KG Scissor-Lift Deck",
      sub: "Ball-screw actuator lifts palletized loads +140 mm with 4-cell weight stabilization.",
      metric: "1,000 KG · +140 MM LIFT",
    },
    {
      code: "CAPABILITY 02 // NATURAL-FEATURE SLAM",
      title: "Autonomous Navigation & Bypass",
      sub: "360° LiDAR + 3D depth cameras map the room and bypass dynamic obstacles in 3.2 ms.",
      metric: "20 Hz SLAM · 0 FLOOR TAPE",
    },
    {
      code: "CAPABILITY 03 // COLLABORATIVE SAFETY & DOCK",
      title: "ISO PL-d Shield & ±5 mm Docking",
      sub: "Dual-zone 360° protective fields and optical fiducial lock for autonomous 48V fast charging.",
      metric: "ISO 3691-4 PL-d · ±5 MM",
    },
    {
      code: "CAPABILITY 04 // SERVICEABLE ARCHITECTURE",
      title: "13-Module Industrial Architecture",
      sub: "Hot-swappable 48V LiFePO4 energy core, NVIDIA Jetson Orin compute & twin SICK LiDARs.",
      metric: "48V 60Ah · 100 TOPS AI",
    },
  ];

  const CYCLE_DURATION = 24.0;
  const clock = new THREE.Clock();
  const desiredCamPos = new THREE.Vector3();
  const desiredCamTarget = new THREE.Vector3();
  let currentExplode = 0;
  let currentLift = 0;
  let currentNav = 0;
  let currentSafety = 0;
  let lockedMode: number | null = null;
  let lockedUntil = 0;
  let activeDomMode = -1;

  // Bind interactive capability buttons in HeroSection
  const capBtns = Array.from(
    document.querySelectorAll<HTMLElement>("[data-hero-mode]")
  );
  const capCodeEl = document.getElementById("heroCapCode");
  const capTitleEl = document.getElementById("heroCapTitle");
  const capSubEl = document.getElementById("heroCapSub");
  const capMetricEl = document.getElementById("heroCapMetric");

  function updateHeroDom(modeIdx: number, modeProgress: number) {
    capBtns.forEach((btn) => {
      const bIdx = Number(btn.dataset.heroMode);
      const isOn = bIdx === modeIdx;
      btn.classList.toggle("active", isOn);
      btn.setAttribute("aria-pressed", isOn ? "true" : "false");
      const bar = btn.querySelector<HTMLElement>(".hc-bar");
      if (bar) {
        bar.style.transform = `scaleX(${isOn ? modeProgress : 0})`;
      }
    });

    if (modeIdx !== activeDomMode) {
      activeDomMode = modeIdx;
      const meta = MODE_META[modeIdx] || MODE_META[0];
      if (capCodeEl) capCodeEl.textContent = meta.code;
      if (capTitleEl) capTitleEl.textContent = meta.title;
      if (capSubEl) capSubEl.textContent = meta.sub;
      if (capMetricEl) capMetricEl.textContent = meta.metric;
    }
  }

  const onCapBtnClick = (e: Event) => {
    const btn = e.currentTarget as HTMLElement;
    const idx = Number(btn.dataset.heroMode);
    if (!Number.isNaN(idx)) {
      if (lockedMode === idx && performance.now() * 0.001 < lockedUntil) {
        lockedMode = null;
      } else {
        lockedMode = idx;
        lockedUntil = performance.now() * 0.001 + 10.0;
      }
    }
  };
  capBtns.forEach((btn) => btn.addEventListener("click", onCapBtnClick));

  function sampleBannerTimeline(elapsed: number, nowSec: number) {
    if (lockedMode !== null && nowSec < lockedUntil) {
      const k = bannerKeyframes[lockedMode] || bannerKeyframes[0];
      desiredCamPos.copy(k.pos);
      desiredCamTarget.copy(k.target);
      const remainP = Math.max(0, Math.min(1, 1 - (lockedUntil - nowSec) / 10.0));
      updateHeroDom(k.modeIdx, remainP);
      return {
        lift: k.lift,
        nav: k.nav,
        safety: k.safety,
        explode: k.explode,
        lidar: k.lidar,
      };
    }
    lockedMode = null;

    const segCount = bannerKeyframes.length - 1;
    const loopT = (elapsed % CYCLE_DURATION) / CYCLE_DURATION;
    const scaled = loopT * segCount;
    const idx = Math.min(segCount - 1, Math.floor(scaled));
    const segProgress = scaled - idx;
    // Hold steady for the first 72% of each stage so the client clearly sees the feature, then transition smoothly
    const transitionT = Math.max(0, (segProgress - 0.72) / 0.28);
    const s = transitionT * transitionT * (3 - 2 * transitionT);

    const k0 = bannerKeyframes[idx];
    const k1 = bannerKeyframes[idx + 1];

    desiredCamPos.lerpVectors(k0.pos, k1.pos, s);
    desiredCamTarget.lerpVectors(k0.target, k1.target, s);

    updateHeroDom(k0.modeIdx, segProgress);

    return {
      lift: THREE.MathUtils.lerp(k0.lift, k1.lift, s),
      nav: THREE.MathUtils.lerp(k0.nav, k1.nav, s),
      safety: THREE.MathUtils.lerp(k0.safety, k1.safety, s),
      explode: THREE.MathUtils.lerp(k0.explode, k1.explode, s),
      lidar: THREE.MathUtils.lerp(k0.lidar, k1.lidar, s),
    };
  }

  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.getElapsedTime();
    const nowSec = performance.now() * 0.001;

    const state = sampleBannerTimeline(elapsed, nowSec);
    const damp = 1 - Math.exp(-dt * 5.5);
    currentExplode = THREE.MathUtils.lerp(currentExplode, state.explode, damp);
    currentLift = THREE.MathUtils.lerp(currentLift, state.lift, damp);
    currentNav = THREE.MathUtils.lerp(currentNav, state.nav, damp);
    currentSafety = THREE.MathUtils.lerp(currentSafety, state.safety, damp);

    if (!userInteracting && nowSec - lastInteractionTime > 2.5) {
      camera.position.lerp(desiredCamPos, 1 - Math.exp(-dt * 3.2));
      controls.target.lerp(desiredCamTarget, 1 - Math.exp(-dt * 4.2));
    }
    controls.update();

    const e = currentExplode;
    // Oscillating active lift stroke during Payload Lift mode (pumps smoothly between 45% and 100% of stroke)
    const activeLiftWave =
      currentLift * (0.68 + 0.32 * Math.sin(elapsed * 2.4));
    const deckLiftY = activeLiftWave * 0.145 * (1 - e);

    Object.entries(partsRegistry).forEach(([name, group]) => {
      const base = group.userData.basePos as THREE.Vector3;
      const offset = group.userData.explodeOffset as THREE.Vector3;
      let extraY = 0;
      if (name === "topDeck") extraY = deckLiftY;
      else if (name === "lift") extraY = deckLiftY * 0.5;
      group.position.set(
        base.x + offset.x * e,
        base.y + offset.y * e + extraY,
        base.z + offset.z * e
      );
    });

    // Update 1,000 kg Payload Crate visibility & physical height
    const showPayload = currentLift > 0.02 && e < 0.25;
    payloadGroup.visible = showPayload;
    if (showPayload) {
      const hoverDrop = (1 - currentLift) * 0.32;
      payloadGroup.position.set(0, 0.495 + deckLiftY + hoverDrop, 0);
      payloadLaserRing.position.y = 0.22 + 0.16 * Math.sin(elapsed * 3.2);
      payloadLaserRingMat.opacity = currentLift * 0.42;
      payloadGlowPillars.forEach((m) => {
        m.opacity = currentLift * 0.38;
      });
    }

    // Update Autonomous SLAM Navigation steering motion & floor spline
    const navSteer = currentNav * Math.sin(elapsed * 1.6);
    robotRoot.position.x = navSteer * 0.14;
    robotRoot.rotation.y = navSteer * 0.09;

    navGroup.visible = currentNav > 0.02;
    if (navGroup.visible) {
      navTubeMat.opacity = currentNav * 0.65;
      obstacleWireMat.opacity = currentNav * 0.75;
      obstacleFillMat.opacity = currentNav * 0.14;

      navChevrons.forEach((c) => {
        const u = (c.phase + elapsed * 0.28) % 1.0;
        const pt = navSplineCurve.getPointAt(u);
        const tangent = navSplineCurve.getTangentAt(u);
        c.mesh.position.copy(pt);
        c.mesh.rotation.y = Math.atan2(tangent.x, tangent.z);
        const edgeFade = Math.sin(u * Math.PI);
        c.mat.opacity = currentNav * edgeFade * 0.85;
      });

      slamRings.forEach((r) => {
        const p = (r.phase + elapsed * 0.45) % 1.0;
        const scale = 0.8 + p * 2.2;
        r.mesh.scale.set(scale, scale, 1);
        r.mat.opacity = currentNav * (1 - p) * 0.45;
      });
    }

    // Update ISO 3691-4 Safety Shield & ±5mm Docking beams
    safetyDockGroup.visible = currentSafety > 0.02;
    if (safetyDockGroup.visible) {
      outerWarnMat.opacity =
        currentSafety * (0.45 + 0.15 * Math.sin(elapsed * 4.0));
      innerSafeMat.opacity =
        currentSafety * (0.55 + 0.15 * Math.cos(elapsed * 4.0));
      dockLaserMat.opacity =
        currentSafety * (0.65 + 0.25 * Math.sin(elapsed * 6.0));
      radarSweepMesh.rotation.z = elapsed * 2.8;
      (radarSweepMesh.material as THREE.MeshBasicMaterial).opacity =
        currentSafety * 0.22;
    }

    leftPanelSubGroup.position.x = -(W / 2 - 0.03) - e * 0.42;
    rightPanelSubGroup.position.x = W / 2 - 0.03 + e * 0.42;

    leftWheelSub.position.x = -(W / 2 - 0.038) - e * 0.26;
    rightWheelSub.position.x = W / 2 - 0.038 + e * 0.26;

    scissorArms.forEach(({ mesh, dir }) => {
      mesh.rotation.x = dir * (0.16 + e * 0.34 + activeLiftWave * 0.32);
    });

    const wheelSpeed = 2.1 + currentNav * 3.4;
    wheelSpinMeshes.forEach((w) => {
      w.rotation.x -= dt * wheelSpeed;
    });
    lidarRotors.forEach((rotor) => {
      rotor.rotation.y += dt * 14.0;
    });

    const pulseOpacity = state.lidar + 0.05 * Math.sin(elapsed * 4.0);
    lidarScanMeshes.forEach((fan) => {
      fan.material.opacity = THREE.MathUtils.lerp(
        fan.material.opacity,
        pulseOpacity,
        dt * 6
      );
    });
    frontFrustumMeshes.forEach((frustum) => {
      frustum.material.opacity = THREE.MathUtils.lerp(
        frustum.material.opacity,
        pulseOpacity * 1.15,
        dt * 6
      );
    });

    renderer.render(scene, camera);
  }

  let isRunning = true;
  renderer.setAnimationLoop(animate);

  function startSimulation() {
    if (!isRunning) {
      isRunning = true;
      clock.getDelta();
      renderer.setAnimationLoop(animate);
    }
  }

  function stopSimulation() {
    if (isRunning) {
      isRunning = false;
      renderer.setAnimationLoop(null);
    }
  }

  // Pause WebGL rendering when hero banner scrolls offscreen
  const heroSection = (container.closest(".hero") as HTMLElement) || container;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startSimulation();
        } else {
          stopSimulation();
        }
      });
    },
    { rootMargin: "200px" }
  );
  io.observe(heroSection);

  const resizeObserver = new ResizeObserver(() => {
    const { width, height } = getBounds();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  resizeObserver.observe(container);

  return () => {
    stopSimulation();
    io.disconnect();
    resizeObserver.disconnect();
    capBtns.forEach((btn) => btn.removeEventListener("click", onCapBtnClick));
    controls.removeEventListener("start", onControlStart);
    controls.removeEventListener("end", onControlEnd);
    controls.dispose();
    envRT.dispose();
    pmremGenerator.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode === container) {
      container.removeChild(renderer.domElement);
    }
  };
}

