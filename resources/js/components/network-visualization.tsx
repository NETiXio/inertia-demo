import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NetworkVisualizationProps {
  nodeCount?: number;
  connectionCount?: number;
  dataFlowSpeed?: number;
  nodeColor?: string;
  connectionColor?: string;
  dataColor?: string;
  className?: string;
}

export default function NetworkVisualization({
  nodeCount = 15,
  connectionCount = 25,
  dataFlowSpeed = 1,
  nodeColor = '#FFFFFF',
  connectionColor = '#FFFFFF',
  dataColor = '#00f0ff',
  className = '',
}: NetworkVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesRef = useRef<THREE.Group | null>(null);
  const connectionsRef = useRef<THREE.Group | null>(null);
  const dataPacketsRef = useRef<THREE.Group | null>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Store node positions for connections
  const nodePositionsRef = useRef<THREE.Vector3[]>([]);
  
  // Store active data packets
  const activeDataPacketsRef = useRef<{
    mesh: THREE.Mesh;
    startNode: number;
    endNode: number;
    progress: number;
    speed: number;
  }[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 40;
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Transparent background
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Set renderer DOM element to fill the container
    const rendererDom = renderer.domElement;
    rendererDom.style.position = 'absolute';
    rendererDom.style.top = '0';
    rendererDom.style.left = '0';
    rendererDom.style.width = '100%';
    rendererDom.style.height = '100%';
    
    containerRef.current.appendChild(rendererDom);
    rendererRef.current = renderer;

    // Create groups for organization
    const nodesGroup = new THREE.Group();
    const connectionsGroup = new THREE.Group();
    const dataPacketsGroup = new THREE.Group();
    
    scene.add(nodesGroup);
    scene.add(connectionsGroup);
    scene.add(dataPacketsGroup);
    
    nodesRef.current = nodesGroup;
    connectionsRef.current = connectionsGroup;
    dataPacketsRef.current = dataPacketsGroup;

    // Create node geometry and material - smaller and more subtle
    const nodeGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(nodeColor),
      transparent: true,
      opacity: 0.6,
    });
    
    // Create connection material - more subtle
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(connectionColor),
      transparent: true,
      opacity: 0.2,
    });
    
    // Create data packet geometry and material - smaller
    const packetGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const packetMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(dataColor),
      transparent: true,
      opacity: 0.7,
    });

    // Create nodes in a network topology
    const nodePositions: THREE.Vector3[] = [];
    
    // Create a few central nodes
    const centralNodes = 3;
    for (let i = 0; i < centralNodes; i++) {
      const angle = (i / centralNodes) * Math.PI * 2;
      const x = Math.cos(angle) * 5;
      const y = Math.sin(angle) * 5;
      const z = 0;
      
      const position = new THREE.Vector3(x, y, z);
      nodePositions.push(position);
      
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      node.position.copy(position);
      node.scale.setScalar(1.5); // Central nodes are larger
      nodesGroup.add(node);
    }
    
    // Create outer nodes
    for (let i = centralNodes; i < nodeCount; i++) {
      // Create nodes in a more organic network structure
      const radius = 10 + Math.random() * 15;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 15;
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = height;
      
      const position = new THREE.Vector3(x, y, z);
      nodePositions.push(position);
      
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      node.position.copy(position);
      
      // Random size variation for outer nodes
      const scale = 0.7 + Math.random() * 0.6;
      node.scale.setScalar(scale);
      
      nodesGroup.add(node);
    }
    
    // Store node positions for later use
    nodePositionsRef.current = nodePositions;
    
    // Create connections between nodes
    const connectionPairs: [number, number][] = [];
    
    // Connect all central nodes to each other
    for (let i = 0; i < centralNodes; i++) {
      for (let j = i + 1; j < centralNodes; j++) {
        connectionPairs.push([i, j]);
      }
    }
    
    // Connect outer nodes to central nodes and some to each other
    for (let i = centralNodes; i < nodeCount; i++) {
      // Connect to a random central node
      const centralNodeIndex = Math.floor(Math.random() * centralNodes);
      connectionPairs.push([centralNodeIndex, i]);
      
      // Occasionally connect to another outer node
      if (Math.random() < 0.3 && connectionPairs.length < connectionCount) {
        let otherNode = Math.floor(Math.random() * (nodeCount - centralNodes)) + centralNodes;
        // Avoid self-connections
        while (otherNode === i) {
          otherNode = Math.floor(Math.random() * (nodeCount - centralNodes)) + centralNodes;
        }
        connectionPairs.push([i, otherNode]);
      }
    }
    
    // Limit to connectionCount
    const limitedPairs = connectionPairs.slice(0, connectionCount);
    
    // Create the connection lines
    for (const [startIndex, endIndex] of limitedPairs) {
      const startPos = nodePositions[startIndex];
      const endPos = nodePositions[endIndex];
      
      const points = [startPos, endPos];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const line = new THREE.Line(geometry, connectionMaterial);
      connectionsGroup.add(line);
    }
    
    // Animation function
    const animate = (time: number) => {
      frameRef.current = requestAnimationFrame(animate);
      
      // Update time reference
      timeRef.current = time;
      
      // Check if element is in viewport
      const rect = containerRef.current?.getBoundingClientRect();
      const isInViewport = rect &&
        rect.top < window.innerHeight &&
        rect.bottom > 0;
      
      // Only animate when in viewport for performance
      if (isInViewport) {
        // Rotate the entire network slightly
        if (nodesRef.current && connectionsRef.current) {
          nodesRef.current.rotation.y += 0.001;
          connectionsRef.current.rotation.y += 0.001;
          if (dataPacketsRef.current) {
            dataPacketsRef.current.rotation.y += 0.001;
          }
        }
      
        // Occasionally create new data packets
        if (Math.random() < 0.03 * dataFlowSpeed && dataPacketsRef.current) {
        // Select random connection
        const connectionIndex = Math.floor(Math.random() * limitedPairs.length);
        const [startNodeIndex, endNodeIndex] = limitedPairs[connectionIndex];
        
        // Create data packet
        const packet = new THREE.Mesh(packetGeometry, packetMaterial.clone());
        dataPacketsRef.current.add(packet);
        
        // Add to active packets
        activeDataPacketsRef.current.push({
          mesh: packet,
          startNode: startNodeIndex,
          endNode: endNodeIndex,
          progress: 0,
          speed: 0.01 + Math.random() * 0.02 * dataFlowSpeed,
        });
      }
      
      // Update data packets
      const packetsToRemove: number[] = [];
      
      activeDataPacketsRef.current.forEach((packet, index) => {
        packet.progress += packet.speed;
        
        if (packet.progress >= 1) {
          // Remove completed packets
          packetsToRemove.push(index);
        } else {
          // Update position along the path
          const startPos = nodePositionsRef.current[packet.startNode];
          const endPos = nodePositionsRef.current[packet.endNode];
          
          packet.mesh.position.lerpVectors(startPos, endPos, packet.progress);
        }
      });
      
      // Remove completed packets (in reverse order to avoid index issues)
      for (let i = packetsToRemove.length - 1; i >= 0; i--) {
        const index = packetsToRemove[i];
        const packet = activeDataPacketsRef.current[index];
        
        if (dataPacketsRef.current) {
          dataPacketsRef.current.remove(packet.mesh);
        }
        
        activeDataPacketsRef.current.splice(index, 1);
      }
      
        // Render scene
        if (rendererRef.current && cameraRef.current && sceneRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      }
    };
    
    // Start animation
    animate(0);
    
    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Clean up all meshes and materials
      if (nodesRef.current) {
        nodesRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
        scene.remove(nodesRef.current);
      }
      
      if (connectionsRef.current) {
        connectionsRef.current.traverse((child) => {
          if (child instanceof THREE.Line) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
        scene.remove(connectionsRef.current);
      }
      
      if (dataPacketsRef.current) {
        dataPacketsRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
        scene.remove(dataPacketsRef.current);
      }
      
      rendererRef.current?.dispose();
    };
  }, [nodeCount, connectionCount, dataFlowSpeed, nodeColor, connectionColor, dataColor]);
  
  return (
    <div
      ref={containerRef}
      className={`w-full h-full filter blur-[0.5px] ${className}`}
      aria-hidden="true"
    />
  );
}