export default [
    // Environment map
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path: 
        [
            'textures/environmentMap/px.jpg',
            'textures/environmentMap/nx.jpg',
            'textures/environmentMap/py.jpg',
            'textures/environmentMap/ny.jpg',
            'textures/environmentMap/pz.jpg',
            'textures/environmentMap/nz.jpg'
        ]
    },
    // Temple assets
    {
        name: 'templeModel',
        type: 'gltfModel',
        path: 'models/temple/test_temple_3D.glb'
    },
    {
        name: 'templeTexture',
        type: 'texture',
        path: 'textures/temple/templeTexture.jpg'
    },
    // Island assets
    {
        name: 'godIsland',
        type: 'gltfModel',
        path: 'models/island/god_island.glb'
    },
    {
        name: 'islandTexture',
        type: 'texture',
        path: 'textures/island/bakedIsland.jpg'
    },
    // Village assets
    {
        name: 'villageModel',
        type: 'gltfModel',
        path: 'models/village/village.glb'
    },
    {
        name: 'villageTexture',
        type: 'texture',
        path: 'textures/village/bakedVillage.jpg'
    },
    // Pyramid assets
    {
        name: 'pyramidModel',
        type: 'gltfModel',
        path: 'models/pyramid/pyramidResonance.glb'
    },
    {
        name: 'pyramidTexture',
        type: 'texture',
        path: 'textures/pyramid/bakedPyramid.jpg'
    },
    // Map assets
    {
        name: 'mapModel',
        type: 'gltfModel',
        path: 'models/map/mapResonance.glb'
    },
    {
        name: 'mapTexture',
        type: 'texture',
        path: 'textures/map/bakedMap.jpg'
    }
]