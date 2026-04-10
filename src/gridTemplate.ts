type Camera = {
	x: number;
	y: number;
	scale: number;
}
type Coords = {
	x: number;
	y: number;
}
type DOMCanvas = {
	cam: Camera;
	minScale: number;
	maxScale: number;
	dragging: boolean;
	dragged: boolean;
	lastX: number;
	lastY: number;
	golCanvas: HTMLCanvasElement;
	gridCanvas: HTMLCanvasElement;
	golCtx: CanvasRenderingContext2D;
	gridCtx: CanvasRenderingContext2D;
	gridSize: number;
	width: number;
	height: number;
	cgl: Set<string>
	screenToWorld(x: number, y: number): Coords;
	drawSquare(x: number, y: number): void;
	drawGrid(step: number, color: string, width: number, left: number, right: number, top: number, bottom: number): void;
	clearGol(): void;
	clearGrid(): void;
	gridCoords(x: number, y: number): Coords;
	updateFps(fps: number): void;
	zoom(x: number, y: number, scrollDelta: number): void;
	render(conwayGridLive: Set<string>): void;
};

class GridTemplate implements DOMCanvas {
	cam: Camera;
	minScale: number;
	maxScale: number;
	dragging: boolean;
	dragged: boolean;
	lastX: number;
	lastY: number;
	golCanvas: HTMLCanvasElement;
	gridCanvas: HTMLCanvasElement;
	golCtx: CanvasRenderingContext2D;
	gridCtx: CanvasRenderingContext2D;
	gridSize: number;
	width: number;
	height: number;
	thenTime: number;
	fps: number;
	fpsInterval: number;
	cgl: Set<string>
	static instance: GridTemplate = new GridTemplate();
	constructor() {
		this.golCanvas = document.getElementById("golCanvas") as HTMLCanvasElement;
		this.gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
		if (this.golCanvas == null || this.gridCanvas == null) {
			throw new Error("Cannot get canvas");
		}
		this.golCtx = this.golCanvas.getContext("2d")!;
		this.gridCtx = this.gridCanvas.getContext("2d")!;
		this.gridCtx.strokeStyle = "gray"
		this.gridSize = 5;
		this.width = 0;
		this.height = 0;
		this.cam = {x: 0, y: 0, scale: 1}
		this.minScale = 1;
		this.maxScale = 10;
		this.dragging = false;
		this.dragged = false;
		this.lastX = 0;
		this.lastY = 0;
		this.thenTime = window.performance.now();
		const speedValue = (document.getElementById("speed") as HTMLInputElement).value;
		this.fps = Number(speedValue);
		this.fpsInterval = 1000 / this.fps;
		this.cgl = new Set<string>();
		this.render(this.cgl);
	}
	screenToWorld(x: number, y: number): Coords {
		return {x: this.cam.x + x / this.cam.scale, y: this.cam.y + y / this.cam.scale };
	};
	snap(val: number) : number {
		return Math.floor(val / this.gridSize);
	}
	clearGol(): void {
		this.golCtx.clearRect(0, 0, this.golCanvas.width, this.golCanvas.height);
	};
	clearGrid(): void {
		this.gridCtx.clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);
	};
	gridCoords(x: number, y: number): Coords {
		const world = this.screenToWorld(x, y);
		const wx = this.snap(world.x);
		const wy = this.snap(world.y);
		// const clamp = (val: number, min: number, max: number) => {
		// 	return Math.min(Math.max(val, min), max);
		// }
		// wx = clamp(wx, 0, this.golCanvas.width);
		// wy = clamp(wy, 0, this.golCanvas.height);
		// console.log(`getCoords ${wx},${wy}`);
		return {x: wx, y: wy};
	}
	mouseCoords(event: MouseEvent): Coords{
		const rect = this.golCanvas.getBoundingClientRect();
		return {x: event.clientX - rect.left, y: event.clientY - rect.top};
	}
	drawGrid(step: number, color: string, width: number, left: number, right: number, top: number, bottom: number): void {
		// this.clearGrid();
		// console.log(this.gridSize)
		this.gridCtx.beginPath();
		this.gridCtx.strokeStyle = color;
		this.gridCtx.lineWidth = width / this.cam.scale;

		for (let gx: number = Math.floor(left / step) * step; gx <= right; gx += step) {
			this.gridCtx.moveTo(gx, top);
			this.gridCtx.lineTo(gx, bottom);
		}
		for (let gy: number = Math.floor(top / step) * step; gy <= bottom; gy += step) {
			this.gridCtx.moveTo(left, gy);
			this.gridCtx.lineTo(right, gy);
		}
		this.gridCtx.stroke();
	}
	drawSquare(x: number, y: number) {
		// console.log(`Drawing square on ${x}, ${y}`)
		// console.log(`Drawing square on ${x}, ${y}`)
		this.golCtx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
	};
	updateFps(fps: number) {
		this.fps = fps;
		this.fpsInterval = 1000 / this.fps;
	};
	clampCamera() {
		const vw = this.golCanvas.width / this.cam.scale;
		const vh = this.golCanvas.height / this.cam.scale;

		this.cam.x = Math.max(0, Math.min(this.cam.x, this.width - vw));
		this.cam.y = Math.max(0, Math.min(this.cam.y, this.height - vh));
		if (vw > this.width) this.cam.x = 0;
		if (vh > this.height) this.cam.y = 0;
	}
	zoom(x: number, y: number, scrollDelta: number) {
		const wx = this.cam.x + x / this.cam.scale;
		const wy = this.cam.y + y / this.cam.scale;
		const next = Math.max(this.minScale, Math.min(this.maxScale, this.cam.scale * Math.pow(1.1, scrollDelta)))
		this.cam.scale = next;
		this.cam.x = wx - x / this.cam.scale;
		this.cam.y = wy - y / this.cam.scale;
		this.clampCamera();
		this.render(this.cgl);
	}
	render(conwayGridLive: Set<string>) {
		this.cgl = conwayGridLive;
		this.clearGol();
		this.clearGrid();
		this.gridCtx.setTransform(this.cam.scale, 0, 0, this.cam.scale, -this.cam.x * this.cam.scale, -this.cam.y * this.cam.scale);
		this.golCtx.setTransform(this.cam.scale, 0, 0, this.cam.scale, -this.cam.x * this.cam.scale, -this.cam.y * this.cam.scale);

		const p1 = this.screenToWorld(0, 0);
		const p2 = this.screenToWorld(this.golCanvas.width, this.golCanvas.height);
		const left = Math.max(0, Math.min(p1.x, p2.x));
		const right = Math.min(this.width, Math.max(p1.x, p2.x));
		const top = Math.max(0, Math.min(p1.y, p2.y));
		const bottom = Math.min(this.height, Math.max(p1.y, p2.y));
		this.drawGrid(this.gridSize, "#e5e7eb", 1, left, right, top, bottom);
		// console.log(conwayGridLive);
		for (let yx of conwayGridLive) {
			const [y, x] = yx.split(",").map(Number);
			this.drawSquare(x, y);
		}
		this.golCtx.setTransform(1, 0, 0, 1, 0, 0);
		this.gridCtx.setTransform(1, 0, 0, 1, 0, 0);
	};
}

export { GridTemplate }