import p5 from './p5.min.js'

/**
 * @param {import('p5')} s
 */
const river = s => {
	let backgroundColor = s.color('white')

	let riverPadding = 200

	let riverSpeed = 50 // pixels per second
	let riverWidthDesired = 400
	let riverHeight = s.windowHeight + riverPadding * 2
	let riverVarianceX = 15
	let riverVarianceY = 5
	let riverColor = s.color('black')
	let pointsCount = Math.ceil((15 / 1080) * riverHeight)

	// ===========================================================
	let riverWidth
	const calculateRiverWidth = () => {
		riverWidth =
			s.windowWidth >= riverWidthDesired
				? riverWidthDesired
				: s.windowWidth - 70
	}

	let pointsLeft = []
	let pointsRight = []

	const segLength = riverHeight / pointsCount

	const addNewPoints = () => {
		const r = n => Math.random() * n * 2 - n
		const rPoint = xOffset => ({
			x: r(riverVarianceX) + xOffset,
			y: r(riverVarianceY)
		})
		pointsLeft.push(rPoint(-riverWidth / 2))
		pointsRight.push(rPoint(riverWidth / 2))
	}

	const trimPoints = (originX, originY) => {
		const trimTime = arr => {
			return arr[0].y < -riverVarianceY - riverPadding - originY - segLength
		}
		if (trimTime(pointsLeft) || trimTime(pointsRight)) {
			console.log(pointsLeft[0].y)
			console.log(-riverVarianceY - riverHeight - segLength)
			pointsLeft.shift()
			pointsRight.shift()
			addNewPoints()
		}
	}

	const flowRiver = distance => {
		const c = Math.max(pointsLeft.length, pointsRight.length)
		for (let i = 0; i < c; i++) {
			if (pointsLeft[i]) pointsLeft[i].y -= distance
			if (pointsRight[i]) pointsRight[i].y -= distance
		}
	}

	const animateRiver = () => {
		flowRiver((riverSpeed * s.deltaTime) / 1000)
	}

	const refreshRiver = () => {
		pointsLeft = []
		pointsRight = []
		for (let i = 0; i < pointsCount; i++) {
			flowRiver((riverHeight + riverVarianceY * 2) / pointsCount)
			addNewPoints()
		}
	}

	// =======================================================================

	s.setup = () => {
		calculateRiverWidth()
		const canvas = s.createCanvas(s.windowWidth, s.windowHeight)
		canvas.parent('river')
		refreshRiver()
		s.smooth()
		console.log(s.windowHeight)
	}

	s.draw = () => {
		if (s.focused) {
			s.background(backgroundColor)

			const riverOriginX = s.width / 2
			const riverOriginY = s.height + riverVarianceY * 2 + segLength * 4

			s.fill('red')
			s.circle(riverOriginX, riverOriginY, 30)

			s.push()

			s.noStroke()
			s.fill(riverColor)

			s.translate(riverOriginX, riverOriginY)

			s.beginShape()

			const lastPL = pointsLeft[pointsLeft.length - 1]
			const lastPR = pointsRight[pointsRight.length - 1]
			const firstPL = pointsLeft[0]
			const firstPR = pointsRight[0]

			s.vertex(firstPL.x, firstPL.y)

			// go down the left side
			for (let i = 0; i < pointsLeft.length; i++) {
				const p = pointsLeft[i]
				s.curveVertex(p.x, p.y)
			}

			s.vertex(lastPL.x, lastPL.y)
			s.vertex(lastPL.x, lastPL.y)

			s.vertex(lastPR.x, lastPR.y)
			s.vertex(lastPR.x, lastPR.y)

			// go up the right side
			for (let i = pointsRight.length - 1; i >= 0; i--) {
				const p = pointsRight[i]
				s.curveVertex(p.x, p.y)
			}

			s.vertex(firstPR.x, firstPR.y)
			s.vertex(firstPR.x, firstPR.y)

			s.vertex(firstPL.x, firstPL.y)

			s.endShape()

			s.pop()
			animateRiver()
			trimPoints(riverOriginX, riverOriginY)

			// s.push()
			// s.color('red')
			// s.circle(0, s.height, 100)
			// s.pop()
		}
	}
	s.windowResized = () => {
		s.resizeCanvas(s.windowWidth, s.windowHeight)
		calculateRiverWidth()
		refreshRiver()
	}
}
export default river
