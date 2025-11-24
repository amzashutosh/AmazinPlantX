import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useSceneStore = create((set) => ({
    sceneObjects: [],
    selectedObjectId: null,

    // Actions
    setObjects: (objects) => set({ sceneObjects: objects }),

    addObject: (asset) => set((state) => ({
        sceneObjects: [
            ...state.sceneObjects,
            {
                id: uuidv4(),
                assetId: asset.id,
                name: asset.name,
                modelUrl: asset.file, // URL to the GLB file
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: [asset.default_scale, asset.default_scale, asset.default_scale],
            }
        ],
    })),

    updateObjectTransform: (id, transform) => set((state) => ({
        sceneObjects: state.sceneObjects.map((obj) =>
            obj.id === id ? { ...obj, ...transform } : obj
        ),
    })),

    selectObject: (id) => set({ selectedObjectId: id }),

    removeObject: (id) => set((state) => ({
        sceneObjects: state.sceneObjects.filter((obj) => obj.id !== id),
        selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
    })),
}));

export default useSceneStore;
