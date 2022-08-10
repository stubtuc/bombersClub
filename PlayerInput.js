class PlayerInput {
    constructor() {
        this.heldKeys = [];
        this.heldAction = null;

        // For player moving
        this.map = {
            // Arrows Input
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowRight': 'right',
            'ArrowLeft': 'left',
            // WSAD Input
            'w': 'up',
            's': 'down',
            'd': 'right',
            'a': 'left',
        }

        // For player actions
        this.actions = {
            'e': 'use',
            'Enter': 'fight',
            'ArrowUp': 'up',
            'ArrowRight': 'right',
            'ArrowLeft': 'left',
        }
    }

    get direction() {
        return this.heldKeys[0];
    }

    get action() {
        return this.heldAction;
    }

    update({ time }) {
        this.time = time;
        this.heldAction = null;

        const handleActions = (e) => {
            const action = this.actions[e.key];
            if (action && !this.heldAction) {
                this.heldAction = action;
            }
        };

        document.addEventListener('keyup', handleActions);

    }

    init() {

        // Keys for move
        document.addEventListener('keydown', e => {
            const direction = this.map[e.key];
            if (direction && this.heldKeys.indexOf(direction) === -1) {
                this.heldKeys.unshift(direction);
            }
        })
        document.addEventListener('keyup', e => {
            const direction = this.map[e.key];
            const index = this.heldKeys.indexOf(direction);
            if (index > -1) {
                this.heldKeys.splice(index, 1);
            }
        })

    }
}