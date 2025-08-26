let isMouseDown = false
let xDeg = 65
let zDeg = 45
let isArrowsActive = true

const rubiksCube = document.getElementById('cube')

document.addEventListener('mousedown', () => {
    isMouseDown = true
})

document.addEventListener('mouseup', () => {
    isMouseDown = false
})

document.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        xDeg += - (e.movementY / 2)
        if ((xDeg % 360 >= 0 && xDeg % 360 <= 180) || (xDeg % 360 <= -180 && xDeg % 360 >= -360)) {
            zDeg += - (e.movementX / 2)
        } else {
            zDeg += e.movementX / 2
        }

        rubiksCube.style.transform = `rotateX(${xDeg}deg) rotateZ(${zDeg}deg)`
    }
})

let lastTouchX = null
let lastTouchY = null

document.addEventListener('touchstart', (e) => {
    isMouseDown = true
    lastTouchX = e.touches[0].clientX
    lastTouchY = e.touches[0].clientY
})

document.addEventListener('touchend', () => {
    isMouseDown = false
    lastTouchX = null
    lastTouchY = null
})

document.addEventListener('touchmove', (e) => {
    e.preventDefault()

    const touch = e.touches[0]
    const deltaX = touch.clientX - lastTouchX
    const deltaY = touch.clientY - lastTouchY

    xDeg += - (deltaY / 2);
    if ((xDeg % 360 >= 0 && xDeg % 360 <= 180) || (xDeg % 360 <= -180 && xDeg % 360 >= -360)) {
        zDeg += - (deltaX / 2);
    } else {
        zDeg += deltaX / 2;
    }

    rubiksCube.style.transform = `rotateX(${xDeg}deg) rotateZ(${zDeg}deg)`;
    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
}, {passive: false})

const arrowHandler = async (cubesIds, axis, isClockwise) => {
    if (isArrowsActive) {
        isArrowsActive = false
        setTimeout(() => {
            isArrowsActive = true
        }, 350)

        let cubes = []

        for (let i = 0; i < cubesIds.length; i++) {
            let row = []
            for (let j = 0; j < cubesIds[i].length; j++) {
                let cube = document.getElementById(cubesIds[i][j])

                let style = getComputedStyle(cube)
                let transform = style.transform
                let matrix = transform ? new DOMMatrixReadOnly(transform) : new DOMMatrix()

                let angle = 90 * isClockwise
                let rotationMatrix

                switch(axis) {
                    case 'X':
                        rotationMatrix = new DOMMatrix().rotateAxisAngle(1, 0, 0, angle)
                        break
                    case 'Y':
                        rotationMatrix = new DOMMatrix().rotateAxisAngle(0, 1, 0, angle)
                        break
                    case 'Z':
                        rotationMatrix = new DOMMatrix().rotateAxisAngle(0, 0, 1, angle)
                        break
                    default:
                        rotationMatrix = new DOMMatrix()
                }

                let newMatrix = rotationMatrix.multiply(matrix)
                cube.style.transform = `matrix3d(${newMatrix.toFloat64Array().join(',')})`
                row.push(cube)
            }
            cubes.push(row)
        }

        let rotatedMatrix = isClockwise == -1 ? rotateMatrixClockwise(cubesIds) : rotateMatrixCounterclockwise(cubesIds)

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                cubes[i][j].id = rotatedMatrix[i][j]
            }
        }
    }
}

const rotateMatrixClockwise = (matrix) => {
    let rotatedMatrix = [[],[],[]]
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            rotatedMatrix[j][2 - i] = matrix[i][j]
        }
    }
    return rotatedMatrix
}

const rotateMatrixCounterclockwise = (matrix) => {
    let rotatedMatrix = [[],[],[]]
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            rotatedMatrix[2 - j][i] = matrix[i][j]
        }
    }
    return rotatedMatrix
}