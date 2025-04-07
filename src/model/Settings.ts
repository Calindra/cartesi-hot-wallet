export interface Settings {
    deviceOrientation: DeviceOrientation
    movementMode: 'tilt' | 'arrow'
}

export interface DeviceOrientation {
    leftRight: number
    upDown: number
    upDownAngle: number
    right: number
    left: number
    up: number
    down: number
}

export function getDefaultSettings(): Settings {
    return {
        movementMode: 'arrow',
        deviceOrientation: {
            leftRight: 100,
            upDown: 100,
            upDownAngle: (-41 - 51 / 2),
            right: 3,
            left: -3,
            up: -41,
            down: -51,
        }
    }
}