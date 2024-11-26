import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./item.style.scss";

export default function ItemPage (){
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
      alpha: true, // Transparent background
    });

    renderer.setSize(window.innerWidth * 0.5, window.innerHeight); // Half-width for 3D model
    camera.position.z = 5;

    // Geometry (Example: Rotating Torus)
    const geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff6347,
      metalness: 0.7,
      roughness: 0.2,
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handling
    const handleResize = () => {
      camera.aspect = window.innerWidth * 0.5 / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth * 0.5, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="new-item-page">
      {/* Left Side: 3D Model */}
      <div className="model-container">
        <canvas ref={canvasRef}></canvas>
      </div>

      {/* Right Side: Product Description */}
      <div className="description-container">
        <h1>New Futuristic Item</h1>
        <p>
          This innovative item is crafted with the latest technology to meet
          your needs. Its futuristic design and robust build make it a must-have
          for enthusiasts.
        </p>
        <ul>
          <li>Feature 1: Advanced design</li>
          <li>Feature 2: High durability</li>
          <li>Feature 3: Lightweight and portable</li>
        </ul>
        <button className="buy-now-btn">Buy Now</button>
      </div>
    </div>
  );
};

// export default NewItemPage;
