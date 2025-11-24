import React, { useRef, useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TransformControls, Box } from '@react-three/drei';
import useSceneStore from '../../store/sceneStore';

const DraggableAsset = ({ object }) => {
    const { modelUrl, position, rotation, scale, id } = object;
    const { selectedObjectId, selectObject, updateObjectTransform } = useSceneStore();
    const isSelected = selectedObjectId === id;
    const transformRef = useRef();

    const [gltf, setGltf] = useState(null);

    useEffect(() => {
        if (modelUrl) {
            new GLTFLoader().load(
                modelUrl,
                (loadedGltf) => setGltf(loadedGltf),
                undefined,
                (error) => {
                    console.error("Error loading model:", error);
                    setGltf(null);
                }
            );
        }
    }, [modelUrl]);

    useEffect(() => {
        if (transformRef.current) {
            const controls = transformRef.current;
            const callback = () => {
                if (controls.object) {
                    updateObjectTransform(id, {
                        position: [controls.object.position.x, controls.object.position.y, controls.object.position.z],
                        rotation: [controls.object.rotation.x, controls.object.rotation.y, controls.object.rotation.z],
                        scale: [controls.object.scale.x, controls.object.scale.y, controls.object.scale.z],
                    });
                }
            };
            controls.addEventListener('dragging-changed', (event) => {
                // Disable orbit controls while dragging if needed
            });
            controls.addEventListener('change', callback);
            return () => controls.removeEventListener('change', callback);
        }
    }, [id, updateObjectTransform, isSelected]); // Re-bind when selection changes

    return (
        <group>
            {isSelected && (
                <TransformControls
                    ref={transformRef}
                    object={transformRef.current?.object} // This is tricky with R3F TransformControls, usually it attaches to the child
                    mode="translate"
                />
            )}

            {/* 
               TransformControls in R3F usually wraps the object or uses 'object' prop.
               If we wrap it, the controls appear at the object's location.
            */}

            {isSelected ? (
                <TransformControls mode="translate" onObjectChange={(e) => {
                    const o = e.target.object;
                    updateObjectTransform(id, {
                        position: [o.position.x, o.position.y, o.position.z],
                        rotation: [o.rotation.x, o.rotation.y, o.rotation.z],
                        scale: [o.scale.x, o.scale.y, o.scale.z],
                    });
                }}>
                    <AssetContent gltf={gltf} position={position} rotation={rotation} scale={scale} onClick={(e) => {
                        e.stopPropagation();
                        selectObject(id);
                    }} />
                </TransformControls>
            ) : (
                <AssetContent gltf={gltf} position={position} rotation={rotation} scale={scale} onClick={(e) => {
                    e.stopPropagation();
                    selectObject(id);
                }} />
            )}
        </group>
    );
};

const AssetContent = ({ gltf, position, rotation, scale, onClick }) => {
    if (gltf) {
        return <primitive object={gltf.scene.clone()} position={position} rotation={rotation} scale={scale} onClick={onClick} />;
    }

    // Fallback placeholder if no model
    return (
        <mesh position={position} rotation={rotation} scale={scale} onClick={onClick}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="hotpink" />
        </mesh>
    );
};

export default DraggableAsset;
