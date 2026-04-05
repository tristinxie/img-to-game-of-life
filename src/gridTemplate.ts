import { ConwayGrid } from "./grid"

type DOMCanvas = {
	golCanvas: HTMLCanvasElement;
	gridCanvas: HTMLCanvasElement;
	golCtx: CanvasRenderingContext2D;
	gridCtx: CanvasRenderingContext2D;
	drawSquare(x: number, y: number): void;
	drawGrid(): void;
	clear(): void;
	clickCoords(event: PointerEvent): [number, number];
	updateFps(fps: number): void;
	render(grid: ConwayGrid): void;
};
const square = {
  w: 5,
  h: 5,
};


class GridTemplate implements DOMCanvas {
	golCanvas: HTMLCanvasElement;
	gridCanvas: HTMLCanvasElement;
	golCtx: CanvasRenderingContext2D;
	gridCtx: CanvasRenderingContext2D;
	thenTime: number;
	fps: number;
	fpsInterval: number;
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
		this.gridCtx.lineWidth = 0.5;
		this.thenTime = window.performance.now();
		const speedValue = (document.getElementById("speed") as HTMLInputElement).value;
		this.fps = Number(speedValue);
		this.fpsInterval = 1000 / this.fps;
		this.drawGrid();
	};
	clear(): void {
		this.golCtx.clearRect(0, 0, this.golCanvas.width, this.golCanvas.height);
	};
	clickCoords(event: PointerEvent): [number, number] {
		const rect = this.golCanvas.getBoundingClientRect();
		let x = Math.floor((event.clientX - rect.left) / square.w);
		let y = Math.floor((event.clientY - rect.top) / square.h);
		const clamp = (val: number, min: number, max: number) => {
			return Math.min(Math.max(val, min), max);
		}
		x = clamp(x, 0, this.golCanvas.width);
		y = clamp(y, 0, this.golCanvas.height);
		return [x, y];
	}
	drawGrid(): void {
		this.gridCtx.beginPath();
		for (let gx: number = 0; gx < this.gridCanvas.width; gx += square.w) {
			this.gridCtx.moveTo(gx, 0);
			this.gridCtx.lineTo(gx, this.gridCanvas.height);
		}
		for (let gy: number = 0; gy < this.gridCanvas.height; gy += square.h) {
			this.gridCtx.moveTo(0, gy);
			this.gridCtx.lineTo(this.gridCanvas.width, gy);
		}
		this.gridCtx.stroke();
	}
	drawSquare(x: number, y: number) {
		// console.log(`Drawing square on ${x}, ${y}`)
		this.golCtx.fillRect(x * square.w, y * square.h, square.w, square.h);
	};
	updateFps(fps: number) {
		this.fps = fps;
		this.fpsInterval = 1000 / this.fps;
	};
	render(conwayGrid: ConwayGrid) {
		this.clear();
		for (let yx of conwayGrid.live) {
			const [y, x] = yx.split(",").map(Number);
			this.drawSquare(x, y);
		}
	};
}

export { GridTemplate, square }