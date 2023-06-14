import * as THREE from "three";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function ModelViewer() {
  const containerRef = useRef(null);
  const jsonContent = useSelector((state) => state.model.jsonContent);
  const [isObjAvailable, setIsObjectAvailable] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  useEffect(() => {
    if (jsonContent) {
      const width = (window.innerWidth * 90) / 100;
      const height = (window.innerHeight * 75) / 100;
      const loader = new THREE.ObjectLoader();
      let scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      let renderer = new THREE.WebGLRenderer({ antialias: true });
      let controls = new OrbitControls(camera, renderer.domElement);

      controls.enableRotate = true;

      camera.position.set(0, 1, 1); // Adjust camera position
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      renderer.setClearColor(0xf2f2f2);
      // var light = new THREE.DirectionalLight(0xffffff, 1, 100);
      // light.position.set(0, 40, 40);
      // light.target.position.set(0, 0, 0);
      // light.castShadow = true;
      // // adjusts volume of space where shadows register
      // light.shadow.camera.right = 15;
      // light.shadow.camera.left = -15;
      // light.shadow.camera.top = 15;
      // light.shadow.camera.bottom = -15;
      // scene.add(light);
      const planeGeometry = new THREE.PlaneGeometry(20, 20);
      const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa,
        side: THREE.DoubleSide,
        map: createGridTexture(),
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      scene.add(plane);

      renderer.setSize(width, height);
      containerRef.current.appendChild(renderer.domElement);

      // Set the camera position
      camera.position.z = 5;

      // Render the scene
      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controls.update();
      }

      try {
        setIsObjectAvailable(true);

        // Load the model data into the scene
        const modelData = JSON.parse(jsonContent);
        const model = loader.parse(modelData);
        scene.add(model);

        animate();
        setIsModelLoaded(true);
      } catch (e) {
        setIsObjectAvailable(false);
        scene.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        renderer.dispose();
        controls.dispose();
        containerRef.current.innerHTML = "";
        containerRef.current.className = "";
      }
      return () => {
        scene.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        renderer.dispose();
        controls.dispose();
      };
    }
  }, [jsonContent]);

  function createGridTexture() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const size = 1024;
    canvas.width = size;
    canvas.height = size;

    context.fillStyle = "#aaaaaa";
    context.fillRect(0, 0, size, size);

    context.strokeStyle = "#000000";
    context.lineWidth = 2;

    // Draw vertical lines
    for (let i = 1; i < 10; i++) {
      const x = (size / 10) * i;
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, size);
      context.stroke();
    }

    // Draw horizontal lines
    for (let i = 1; i < 10; i++) {
      const y = (size / 10) * i;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(size, y);
      context.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    return texture;
  }

  return (
    <div>
      {!isObjAvailable && (
        <div className="text-gray-700">No preview available</div>
      )}
      <div
        className="border-2 border-gray-300"
        ref={containerRef}
        style={{ display: "block" }}
      ></div>
    </div>
  );
}

export default ModelViewer;
