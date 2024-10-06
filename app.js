console.log("App.js loaded");

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { initCameraControls } from './camera.js';

// Constants for celestial mechanics
const AU= 14959780.7; // Astronomical Unit in km
const G = 6.67430e-11; // Gravitational constant in m^3 kg^(-1) s^(-2)
const DAY = 86400; // One day in seconds
const SCALE = 1e-6; // Scale to make the solar system manageable in 3D space
const DEG2RAD = Math.PI / 180;

const h = 10;

// Planetary and moon data (Keplerian elements, radii, mass, etc.)
const planets = [
  {
    name: 'Mercury',
    radius: 2439.7, // km
    mass: 3.3011e23, // kg
    semiMajorAxis: 0.387 * AU * SCALE, // km
    eccentricity: 0.2056,
    inclination: 7.005, // degrees
    axialTilt: 0.034, // degrees
    orbitalPeriod: 88 * DAY, // seconds
    texture: 'textures/mercury.jpg',
    color: 0xffffff
  },
  {
    name: 'Venus',
    radius: 6051.8, // km
    mass: 4.8675e24, // kg
    semiMajorAxis: 0.723 * AU * SCALE, // km
    eccentricity: 0.0067,
    inclination: 3.394, // degrees
    axialTilt: 177.4, // degrees
    orbitalPeriod: 224.7 * DAY, // seconds
    texture: 'textures/venus.jpg',
    color: 0xffffff
  },
  {
    name: 'Earth',
    radius: 6371, // km
    mass: 5.972e24, // kg
    semiMajorAxis: 1 * AU * SCALE, // km
    eccentricity: 0.0167,
    inclination: 0, // degrees
    axialTilt: 23.44, // degrees
    orbitalPeriod: 365.25 * DAY, // seconds
    texture: 'textures/earth.jpg',
    color: 0xffffff
  },
  {
    name: 'Moon',
    radius: 1737.1, // km
    mass: 7.342e22, // kg
    semiMajorAxis: 384400 , // km (Distance from Earth to Moon)
    eccentricity: 0.0549,
    inclination: 5.145, // degrees relative to Earth's orbit
    axialTilt: 6.68, // degrees
    orbitalPeriod: 27.3 * DAY, // seconds
    texture: 'textures/moon.jpg',
    color: 0xffffff
  },
  {
    name: 'Mars',
    radius: 3389.5, // km
    mass: 6.4171e23, // kg
    semiMajorAxis: 1.524 * AU * SCALE, // km
    eccentricity: 0.0934,
    inclination: 1.85, // degrees
    axialTilt: 25.19, // degrees
    orbitalPeriod: 687 * DAY, // seconds
    texture: 'textures/mars.jpg',
    color: 0xffffff
  },
  {
    name: 'Jupiter',
    radius: 69911, // km
    mass: 1.8982e27, // kg
    semiMajorAxis: 5.203 * AU * SCALE, // km
    eccentricity: 0.0489,
    inclination: 1.305, // degrees
    axialTilt: 3.13, // degrees
    orbitalPeriod: 4333 * DAY, // seconds
    texture: 'textures/jupiter.jpg',
    color: 0xffffff,
    rings: { innerRadius: 70000, outerRadius: 120000, color: 0xcccccc }
  },
  {
    name: 'Saturn',
    radius: 58232, // km
    mass: 5.6834e26, // kg
    semiMajorAxis: 9.537 * AU * SCALE, // km
    eccentricity: 0.0565,
    inclination: 2.485, // degrees
    axialTilt: 26.73, // degrees
    orbitalPeriod: 10759 * DAY, // seconds
    texture: 'textures/saturn.jpg',
    color: 0xffffff,
    rings: { innerRadius: 60000, outerRadius: 140000, color: 0xffffaa }
  },
  {
    name: 'Uranus',
    radius: 25362, // km
    mass: 8.6810e25, // kg
    semiMajorAxis: 19.191 * AU , // km
    eccentricity: 0.046,
    inclination: 0.772, // degrees
    axialTilt: 97.77, // degrees
    orbitalPeriod: 30687 * DAY, // seconds
    texture: 'textures/uranus.jpg',
    color: 0xffffff
  },
  {
    name: 'Neptune',
    radius: 24622, // km
    mass: 1.02413e26, // kg
    semiMajorAxis: 30.069 * AU * SCALE, // km
    eccentricity: 0.0086,
    inclination: 1.769, // degrees
    axialTilt: 28.32, // degrees
    orbitalPeriod: 60190 * DAY, // seconds
    texture: 'textures/neptune.jpg',
    color: 0xffffff
  },
  {
    name: 'Halley’s Comet',
    radius: 11 * h, // km
    mass: 2.2e14, // kg
    semiMajorAxis: 17.8 * AU * SCALE, // km
    eccentricity: 0.967,
    inclination: 162.26, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 75 * 365.25 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  },
  {
    name: 'Comet Hale-Bopp',
    radius: 30 * h, // km
    mass: 4.2e14, // kg
    semiMajorAxis: 3750 * AU * SCALE, // km
    eccentricity: 0.995,
    inclination: 5.25, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 2533 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  },
  {
    name: 'Comet NEOWISE',
    radius: 10 * h, // km
    mass: 1.0e14, // kg
    semiMajorAxis: 5800 * AU * SCALE, // km
    eccentricity: 0.999,
    inclination: 23.5, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 6880 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  },
  {
    name: 'Comet Lovejoy',
    radius: 20 * h, // km
    mass: 3.6e14, // kg
    semiMajorAxis: 5000 * AU * SCALE, // km
    eccentricity: 0.997,
    inclination: 40.1, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 6280 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  },
  {
    name: 'Comet Hyakutake',
    radius: 30 * h, // km
    mass: 1.4e14, // kg
    semiMajorAxis: 12000 * AU * SCALE, // km
    eccentricity: 0.999,
    inclination: 30.1, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 1800 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  },
  {
    name: 'Comet 67P/Churyumov–Gerasimenko',
    radius: 4 * h, // km
    mass: 1.0e14, // kg
    semiMajorAxis: 3258 * AU * SCALE, // km
    eccentricity: 0.810,
    inclination: 7.04, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 6580 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  },
  {
    name: 'Comet Tempel 1',
    radius: 7 * h, // km
    mass: 1.0e14, // kg
    semiMajorAxis: 1335 * AU * SCALE, // km
    eccentricity: 0.915,
    inclination: 42.6, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 5900 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  },
  {
    name: 'Comet 2P/Encke',
    radius: 4 * h, // km
    mass: 1.0e14, // kg
    semiMajorAxis: 3050 * AU * SCALE, // km
    eccentricity: 0.847,
    inclination: 7.5, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 1200 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  },
  {
    name: 'Comet 3D/Borisov',
    radius: 6 * h, // km
    mass: 5.0e13, // kg
    semiMajorAxis: 3350 * AU * SCALE, // km
    eccentricity: 0.954,
    inclination: 53.8, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 2400 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  },
  {
    name: 'Comet C/2013 US10 (Catalina)',
    radius: 8 * h, // km
    mass: 1.2e14, // kg
    semiMajorAxis: 4200 * AU * SCALE, // km
    eccentricity: 0.994,
    inclination: 34.5, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 1300 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  },
  {
    name: 'Comet C/2020 F3 (NEOWISE)',
    radius: 10 * h, // km
    mass: 1.5e14, // kg
    semiMajorAxis: 5800 * AU * SCALE, // km
    eccentricity: 0.999,
    inclination: 36.8, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 6880 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  },
  {
    name: 'Comet 41P/Tuttle–Giacobini–Kresák',
    radius: 5 * h, // km
    mass: 5.0e13, // kg
    semiMajorAxis: 5000 * AU * SCALE, // km
    eccentricity: 0.775,
    inclination: 21.3, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 2800 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  },
  {
    name: 'Comet 8P/Tuttle',
    radius: 6 * h, // km
    mass: 4.0e13, // kg
    semiMajorAxis: 8500 * AU * SCALE, // km
    eccentricity: 0.81,
    inclination: 13.0, // degrees
    axialTilt: 0, // degrees
    orbitalPeriod: 1350 * DAY, // seconds
    texture: 'textures/comet.jpg',
    color: 0xffffff
  }
];

// Scene setup
let scene, camera, renderer, sun;
let planetMeshes = [];
let trajectoryLines = [];
let cometMeshes = [];
let time = 0;
let updateCameraMovement;
let isListVisible = false;

const objectListDiv = document.getElementById('objectList');

function init() {
  // Set up the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Set up the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.00001, 1000000);
  camera.position.set(0, 100, 10000);

  // Set up the renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  updateCameraMovement = initCameraControls(camera, renderer.domElement);

  // Add sunlight (the Sun as a light source)
  const light = new THREE.PointLight(0xffffff, 10, 0);
  light.position.set(0, 0, 0);
  scene.add(light);

  // Create the Sun
  const sunGeometry = new THREE.SphereGeometry(6957 * 1, 32, 32); // Radius of the sun scaled
  const sunMaterial = new THREE.MeshBasicMaterial({ 
    map: new THREE. TextureLoader().load('textures/sun.jpg')
  });
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // Create comets
  planets.forEach((planet) => {
    if (planet.name.includes('Comet')) {
      const cometGeometry = new THREE.SphereGeometry(planet.radius * h, 32, 32);
      const cometMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(planet.texture)
      });
      const cometMesh = new THREE.Mesh(cometGeometry, cometMaterial);
      cometMesh.userData = planet;
      cometMeshes.push(cometMesh);
      scene.add(cometMesh);
    }
  });

  planets.forEach((planet) => {
    console.log(`Creating planet: ${planet.name}`);
    const planetGeometry = new THREE.SphereGeometry(planet.radius * h, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(planet.texture)
    });
  
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.userData = planet;
  
    // Calculate initial position using Kepler's laws
    const initialPosition = calculateOrbitalPosition(planet, 0);
    planetMesh.position.copy(initialPosition);
  
    planetMeshes.push(planetMesh);
    scene.add(planetMesh);
  
    // Create a Line object for each trajectory
    const trajectoryPoints = new THREE.BufferGeometry();
    trajectoryPoints.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 }); // Set the color and linewidth
    const line = new THREE.Line(trajectoryPoints, lineMaterial);
    scene.add(line);
    trajectoryLines.push({ line, points: trajectoryPoints });
  
    // Add rings if the planet has them
    if (planet.rings) {
      const ringGeometry = new THREE.RingGeometry(planet.rings.innerRadius * SCALE, planet.rings.outerRadius * SCALE, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: planet.rings.color, side: THREE.DoubleSide });
      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      ringMesh.position.copy(planetMesh.position);
      ringMesh.rotation.x = Math.PI / 2; // Align ring with planet's equatorial plane
      ringMesh.userData = planet.rings; // Store the ring data
      scene.add(ringMesh);
      planet.ringMesh = ringMesh; // Store the ring mesh
    }
    console.log(`Added planet to scene: ${planet.name}`); 
  
    planetMaterial.map.onload = function() {
      planetMeshesLoaded = true;
    };
  });

  // Resize listener
  window.addEventListener('resize', onWindowResize, false);

  function toggleObjectList() {
    isListVisible = !isListVisible;
    objectListDiv.style.display = isListVisible ? 'block' : 'none';
  
    if (isListVisible) {
      objectListDiv.innerHTML = ''; // Clear existing list
      // Add the Sun to the list
      const sunItem = document.createElement('div');
      sunItem.innerText = 'Sun';
      sunItem.style.cursor = 'pointer';
      sunItem.onclick = () => lookAtObject(sun); // Use the sun mesh
      objectListDiv.appendChild(sunItem);
  
      // Add planets to the list
      planets.forEach((planet, index) => {
        const item = document.createElement('div');
        item.innerText = planet.name;
        item.style.cursor = 'pointer';
        item.onclick = () => lookAtObject(planetMeshes[index]);
        objectListDiv.appendChild(item);
      });
    }
  }
  
  let desiredDistance = null;

  function lookAtObject(planetMesh) {
    followObject = planetMesh;
    const targetPosition = new THREE.Vector3();
    planetMesh.getWorldPosition(targetPosition);

    // Calculate the desired distance from the camera to the object
    const objectRadius = planetMesh.userData.radius * SCALE;
    desiredDistance = objectRadius * 1.5; // 1.5 times the radius

    // Calculate the desired FOV based on the object's size and the desired screen coverage
    const desiredFOV = 2 * Math.atan2(objectRadius, desiredDistance) * (180 / Math.PI);

    // Update the camera's position and FOV
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(targetPosition).add(new THREE.Vector3(0, desiredDistance, 0));
    camera.position.copy(cameraPosition);
    camera.fov = desiredFOV;
    camera.updateProjectionMatrix();

    // Make the camera look at the target object
    camera.lookAt(targetPosition);
  }

  document.getElementById('toggleList').addEventListener('click', toggleObjectList);
  
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Function to calculate distance between 2 bodies
function dist(x0,y0,z0,x1,y1,z1){

  const deltaX = x1 - x0;
  const deltaY = y1 - y0;
  const deltaZ = z1 - z0;
  
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ) * AU;
  
  return distance;
}

// Gravitational force between two bodies
function calculateGravity(mesh1, mesh2) {
  const distance = dist(mesh1.position.x, mesh1.position.y, mesh1.position.z, mesh2.position.x, mesh2.position.y, mesh2.position.z);
  const force = (G * mesh1.userData.mass * mesh2.userData.mass) / (distance * distance);
  const direction = new THREE.Vector3().subVectors(mesh2.position, mesh1.position).normalize();
  return direction.multiplyScalar(force);
}

// Calculate position based on time using Kepler's laws
function calculateOrbitalPosition(planet, time) {
  const a = planet.semiMajorAxis * SCALE; // Semi-major axis
  const e = planet.eccentricity; // Eccentricity
  const P = planet.orbitalPeriod; // Orbital period in seconds

  // Mean anomaly
  const meanAnomaly = (2 * Math.PI / P) * time;

  // Eccentric anomaly calculation using Newton's method
  let eccentricAnomaly = meanAnomaly; // Initial guess
  for (let i = 0; i < 10; i++) {
    eccentricAnomaly = meanAnomaly + e * Math.sin(eccentricAnomaly);
  }

  // True anomaly
  const trueAnomaly = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(eccentricAnomaly / 2), Math.sqrt(1 - e) * Math.cos(eccentricAnomaly / 2));

  // Calculate radius
  const radius = a * (1 - e * Math.cos(eccentricAnomaly));

  // Calculate x and z positions
  const x = radius * Math.cos(trueAnomaly);
  const z = radius * Math.sin(trueAnomaly);
  
  // Create a 3D vector for the position
  return new THREE.Vector3(x, 0, z);
}

// Draw trajectories
function drawTrajectory(trajectory, position) {
  const { line, points } = trajectory;
  const vertices = points.getAttribute('position').array;
  if (!vertices || vertices.length === 0) {
    const newVertices = new Float32Array([position.x, position.y, position.z]);
    points.setAttribute('position', new THREE.Float32BufferAttribute(newVertices, 3));
  } else {
    const newLength = vertices.length + 3;
    const newVertices = new Float32Array(newLength);
    newVertices.set(vertices, 0);
    newVertices[newLength - 3] = position.x;
    newVertices[newLength - 2] = position.y;
    newVertices[newLength - 1] = position.z;
    points.setAttribute('position', new THREE.Float32BufferAttribute(newVertices, 3));
  }
  line.geometry = points;
}

let startTime = performance.now();

// Animate everything
function animate(timestamp) {
  requestAnimationFrame(animate);

  updateCameraMovement();

  const elapsedTime = (timestamp - startTime) / 1000;
  time = elapsedTime;

  // Reset accelerations
  const accelerations = planetMeshes.map(() => new THREE.Vector3(0, 0, 0));

  // Calculate gravitational interactions
  planetMeshes.forEach((mesh1, index1) => {
    planetMeshes.forEach((mesh2, index2) => {
      if (index1 !== index2) {
        const force = calculateGravity(mesh1, mesh2);
        accelerations[index1].add(force.clone().divideScalar(mesh1.userData.mass)); // Acceleration = Force / Mass
      }
    });
  });

  planetMeshes.forEach((mesh, index) => {
    const planet = mesh.userData;

    // Calculate new position using Kepler's laws
    const newPosition = calculateOrbitalPosition(planet, time);

    // Adjust the new position with acceleration due to gravity
    const acceleration = accelerations[index].clone().multiplyScalar(0.5 * (DAY * DAY)); // scale the time step
    newPosition.add(acceleration);

    // Apply inclination to the orbit
    const inclination = planet.inclination * DEG2RAD;
    newPosition.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclination);
    mesh.position.copy(newPosition);

    // Update trajectory
    const trajectory = trajectoryLines[index];
    drawTrajectory(trajectory, mesh.position); // Call the drawTrajectory function here
  });

  // Comet simulation
  cometMeshes.forEach((cometMesh, index) => {
    const comet = cometMesh.userData;
    const cometPosition = calculateOrbitalPosition(comet, time);
    cometMesh.position.copy(cometPosition);

    // Draw comet trajectory
    const trajectory = trajectoryLines[planets.indexOf(comet)];
    drawTrajectory(trajectory, cometMesh.position); // Call the drawTrajectory function here
  });

  renderer.render(scene, camera);
}

// Initialize and run the app
init();
animate();

/*
Once upon a time, was a fool who thought he'd find
Purpose in his life along the way
Don't you run and hide from the truth, you decide
Everything that lives is gone to waste

Once upon a time, was a fool who thought he'd find
Purpose in his life along the way
Don't you run and hide from the truth, you decide
Everything that lives is gone to waste
*/

// https://chatgpt.com/share/670268f4-e8f8-800e-b983-1163880e7733