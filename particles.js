const particles = {
    leafs: ({ x, y, onUpdate }) => ({
        x,
        y,
        src: '/images/particles/leafs.png',
        hitBox: { x1: 1000, y1: 1000, x2: 1000, y2: 1000, canWalk: true },
        animations: {
            'idle-down': [ [0, 0], [1, 0], [2, 0], [3, 0], [4, 0] ],
        },
        zIndex: 1,
        onUpdate,
        animationFrameLimit: 8,
    }),
}