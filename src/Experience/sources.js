export default [
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
    {
        name: 'mapModel',
        type: 'gltfModel',
        path: 'models/map/map_test.glb'
    }
]