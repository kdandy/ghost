import { reportGlobals } from "https://enes.in/kicss/kicss.js"

reportGlobals({
  cursor: true
})

const { abs, round } = Math
const DOM = document.documentElement
const query = DOM.querySelector.bind(DOM)

const setCSSProperty = (key, value, scope = DOM) => {
  scope.style.setProperty(key, value)
}

const random = (min, max) => {
  if (!max) {
    return Math.random() * min
  }
  return min + Math.random() * (max - min)
}

const largeShapeKeys = [
  '--face-radius',
  '--face-highlight-radius',
  '--body-highlight-radius'
]

const faceShapeKeys = [
  '--right-eye-radius',
  '--left-eye-radius',
  '--mouth-radius'
]

const refresh = () => {
  setCSSProperty('--face-width', `${round(random(20, 24))}vmin`)
  setCSSProperty('--face-height', `${round(random(22, 28))}vmin`)
  largeShapeKeys.forEach(key => {
    const radii = `
      ${round(random(60, 90))}%
      ${round(random(60, 90))}%
      ${round(random(60, 100))}%
      ${round(random(60, 100))}% /
      ${round(random(60, 90))}%
      ${round(random(60, 90))}%
      ${round(random(60, 110))}%
      ${round(random(60, 110))}%
    `.replace(/\n/g, '')
    setCSSProperty(key, radii)
  })

  faceShapeKeys.forEach(key => {
    const radii = `
      ${round(random(40, 60))}%
      ${round(random(40, 60))}%
      ${round(random(40, 60))}%
      ${round(random(40, 60))}% /
      ${round(random(40, 60))}%
      ${round(random(40, 60))}%
      ${round(random(40, 60))}%
      ${round(random(40, 60))}%
    `.replace(/\n/g, '')
    setCSSProperty(key, radii)
  })

  const rightEyeTop = round(random(20, 40));
  const rightEyeLeft = round(random(55, 70));
  const rightEyeWidth = round(random(18, 28))
  const rightEyeHeight = round(random(rightEyeWidth * .8, rightEyeWidth * 1.2))
  setCSSProperty('--right-eye-top', `${rightEyeTop}%`)
  setCSSProperty('--right-eye-left', `${rightEyeLeft}%`)
  setCSSProperty('--right-eye-width', `${rightEyeWidth}%`)
  setCSSProperty('--right-eye-height', `${rightEyeHeight}%`)

  const leftEyeTop = round(random(rightEyeTop * .8, rightEyeTop * 1.2))
  const leftEyeLeft = round(random(rightEyeLeft / 5, rightEyeLeft / 2.5));
  const leftEyeWidth = round(random(rightEyeWidth * .7, rightEyeWidth * 1.3))
  const leftEyeHeight = round(random(leftEyeWidth * .8, leftEyeWidth * 1.2))
  setCSSProperty('--left-eye-top', `${leftEyeTop}%`)
  setCSSProperty('--left-eye-left', `${leftEyeLeft}%`)
  setCSSProperty('--left-eye-width', `${leftEyeWidth}%`)
  setCSSProperty('--left-eye-height', `${leftEyeHeight}%`)

  const mouthWidth = round(random(6, 16))
  const mouthHeight = round(random(mouthWidth / 2.5, mouthWidth))
  const mouthTop = round(random(rightEyeTop * 2.25, rightEyeTop * 2.35))
  const leftEyeEnd = leftEyeLeft + leftEyeWidth
  const eyesMiddle = leftEyeEnd + ((rightEyeLeft - leftEyeEnd) / 2)
  const mouthLeft = round(random(eyesMiddle * .9, eyesMiddle * 1.1)) - mouthWidth / 2
  setCSSProperty('--mouth-width', `${mouthWidth}%`)
  setCSSProperty('--mouth-left', `${mouthLeft}%`)
  setCSSProperty('--mouth-top', `${mouthTop}%`)
  setCSSProperty('--mouth-height', `${mouthHeight}%`)

  const leftEyeBottom = leftEyeTop + leftEyeHeight
  const eyesMiddleVertical = leftEyeTop + (leftEyeBottom - rightEyeTop) / 2
  const noseWidth = round(random(6, 12))
  const noseHeight = round(random(noseWidth * .6, noseWidth * .8))
  const noseTop = round(random(eyesMiddleVertical * .8, eyesMiddleVertical)) - noseHeight / 2
  const noseLeft = round(random(eyesMiddle * .95, eyesMiddle * 1.05)) - noseWidth / 2
  setCSSProperty('--nose-top', `${noseTop}%`)
  setCSSProperty('--nose-left', `${noseLeft}%`)
  setCSSProperty('--nose-width', `${noseWidth}%`)
  setCSSProperty('--nose-height', `${noseHeight}%`)
  setCSSProperty('--nose-opacity', rightEyeLeft - leftEyeEnd > 14 ? round(Math.random() > .4 ? Math.random() : 0) : 0)
}

const refreshBtn = query('.refresh')

refreshBtn.addEventListener('click', () => {
  refresh()
})

const kodama = query('.kodama')
const rotationKey = '--head-rotation'
let isRotating = true
let isAnimating = false
let animation

const getCSSProperty = (key, scope = DOM) => {
  return getComputedStyle(scope).getPropertyValue(key)
}

const rotate = () => {
  const rotation = parseFloat(getCSSProperty(rotationKey))
  const increase = (90 - rotation) / 80
  const newRotation = rotation + (increase > 0 ? increase : 0.66)
  setCSSProperty(rotationKey, `${newRotation}deg`)
  if (isRotating) {
    requestAnimationFrame(rotate)
  }
}

const rewindRotationKey = () => {
  const rotation = parseFloat(getCSSProperty(rotationKey))
  const decrease = rotation / 50
  const newRotation = rotation - (decrease > 0 ? decrease : 0.66)
  setCSSProperty(rotationKey, `${newRotation}deg`)
  if (isAnimating) {
    requestAnimationFrame(rewindRotationKey)
  }
}

const animate = () => {
  isAnimating = true
  kodama.classList.add('animating')
  animation = setTimeout(() => {
    kodama.classList.remove('animating')
    setCSSProperty(rotationKey, `0deg`)
    isAnimating = false
  }, 4000)
}

const release = () => {
  isRotating = false
  animate()
  rewindRotationKey()
}

const onPressDown = () => {
  kodama.classList.remove('animating')
  clearTimeout(animation)
  isRotating = true
  isAnimating = false
  rotate()
}

const onPressUp = () => {
  if (!isRotating || isAnimating) {
    return
  }
  release()
}

kodama.addEventListener('mousedown', onPressDown)
DOM.addEventListener('mouseup', onPressUp)

kodama.addEventListener('touchstart', onPressDown)
DOM.addEventListener('touchend', onPressUp)

rotate()
setTimeout(release, 2500)