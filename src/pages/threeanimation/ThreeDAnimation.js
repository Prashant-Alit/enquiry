
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./threedanimation.scss";

export default function ThreeDAnimation  ()  {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true, // To make the background transparent
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    // Geometry (Dynamic Cube Example)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color:  0xffffff,
      metalness: 0.8,
      roughness: 0.2,
    });

    // Geometry (Make the cube bigger)
// const geometry = new THREE.BoxGeometry(3, 3, 3); // Increase dimensions
// const material = new THREE.MeshStandardMaterial({
//   color: 0x00aaff,
//   metalness: 0.8,
//   roughness: 0.2,
// });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Alternatively, use scaling
cube.scale.set(3, 3, 3); // Scale up by a factor of 3

    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="three-d-container">
      <canvas ref={canvasRef}></canvas>
      <div className="overlay-content">
        <h1>Creative Design</h1>
        <p>Showcasing interactive 3D elements with modern web design.</p>
      </div>
    </div>
  );
};

// export default ThreeDAnimation;
