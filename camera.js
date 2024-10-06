console.log("Camera.js loaded");

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';

// Camera movement speed and sensitivity
const moveSpeed = 200;
const lookSensitivity = 0.003;
const zoomSpeed = 1;

// Track which keys are pressed
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false,
  shift: false
};

// Movement directions
const movementVector = new THREE.Vector3();
const cameraDirection = new THREE.Vector3();
const upDirection = new THREE.Vector3(0, 1, 0);

let pitch = 0;
let yaw = 0;

function initCameraControls(camera, domElement) {
  // Lock the mouse pointer to the center of the screen
  domElement.requestPointerLock = domElement.requestPointerLock || domElement.mozRequestPointerLock;
  document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

  // Request pointer lock on click
  domElement.addEventListener('click', () => {
    domElement.requestPointerLock();
  });

  // Handle pointer lock change
  document.addEventListener('pointerlockchange', onPointerLockChange, false);
  document.addEventListener('mozpointerlockchange', onPointerLockChange, false);

  function onPointerLockChange() {
    if (document.pointerLockElement === domElement || document.mozPointerLockElement === domElement) {
      console.log('Pointer locked');
      // Start listening to mouse movement when pointer is locked
      window.addEventListener('mousemove', onMouseMove, false);
    } else {
      console.log('Pointer unlocked');
      // Stop listening to mouse movement when pointer is unlocked
      window.removeEventListener('mousemove', onMouseMove, false);
    }
  }

  // Mouse wheel event for zooming
  domElement.addEventListener('wheel', (event) => {
    camera.fov += event.deltaY * zoomSpeed * 0.05; // Adjust zoom speed
    camera.fov = Math.max(10, Math.min(100, camera.fov)); // Clamp zoom limits
    camera.updateProjectionMatrix();
  });

  // Event listeners for key presses
  window.addEventListener('keydown', (e) => onKeyDown(e), false);
  window.addEventListener('keyup', (e) => onKeyUp(e), false);

  // Key down event handler
  function onKeyDown(event) {
    switch (event.code) {
      case 'KeyW':
        keys.w = true;
        break;
      case 'KeyA':
        keys.a = true;
        break;
      case 'KeyS':
        keys.s = true;
        break;
      case 'KeyD':
        keys.d = true;
        break;
      case 'Space':
        keys.space = true;
        break;
      case 'ShiftLeft':
        keys.shift = true;
        break;
    }
  }

  // Key up event handler
  function onKeyUp(event) {
    switch (event.code) {
      case 'KeyW':
        keys.w = false;
        break;
      case 'KeyA':
        keys.a = false;
        break;
      case 'KeyS':
        keys.s = false;
        break;
      case 'KeyD':
        keys.d = false;
        break;
      case 'Space':
        keys.space = false;
        break;
      case 'ShiftLeft':
        keys.shift = false;
        break;
    }
  }

  // Mouse movement event handler (controls camera look direction)
  function onMouseMove(event) {
    yaw -= event.movementX * lookSensitivity;
    pitch -= event.movementY * lookSensitivity;

    // Clamp pitch to avoid camera flipping
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

    // Update the camera direction based on yaw and pitch
    camera.rotation.set(pitch, yaw, 0, 'YXZ');
  }

  // Update camera movement based on key inputs
  function updateCameraMovement() {
    movementVector.set(0, 0, 0);
  
    // Forward and backward movement (along the camera's forward direction in all three axes)
    if (keys.s) movementVector.z -= moveSpeed;
    if (keys.w) movementVector.z += moveSpeed;
  
    // Left and right movement (strafe)
    if (keys.d) movementVector.x -= moveSpeed;
    if (keys.a) movementVector.x += moveSpeed;
  
    // Up and down movement (along the y-axis)
    if (keys.space) movementVector.y += moveSpeed;
    if (keys.shift) movementVector.y -= moveSpeed;
  
    // Keep the camera's forward direction aligned with the negative z-axis
    cameraDirection.set(0, 0, -1);
    camera.getWorldDirection(cameraDirection);
  
    // Normalize direction vector for consistent speed
    const forward = cameraDirection.clone().normalize().multiplyScalar(movementVector.z);
    const right = new THREE.Vector3().crossVectors(upDirection, cameraDirection).normalize().multiplyScalar(movementVector.x);
    const vertical = new THREE.Vector3(0, movementVector.y, 0);
  
    // Combine movement vectors
    const finalMovement = forward.add(right).add(vertical);
  
    // Apply movement to the camera position
    camera.position.add(finalMovement);
  }
  // Call this function within your animation loop to update the camera controls
  return updateCameraMovement;
}

export { initCameraControls };