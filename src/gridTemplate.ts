import { ConwayGrid } from "./grid"

type DOMCanvas = {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	drawSquare(x: number, y: number): void;
	drawGrid(): void;
	clear(): void;
	clickCoords(event: PointerEvent): [number, number];
	render(grid: ConwayGrid): void;
};
const square = {
  w: 10,
  h: 10,
};


class GridTemplate implements DOMCanvas {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	static instance: GridTemplate = new GridTemplate();
	constructor() {
		this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
		if (this.canvas == null) {
			throw new Error("Cannot get canvas");
		}
		this.ctx = this.canvas.getContext("2d")!;
		this.ctx.strokeStyle = "gray"
		this.ctx.lineWidth = 0.5;
	};
	clear(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawGrid();
	};
	clickCoords(event: PointerEvent): [number, number] {
		const rect = this.canvas.getBoundingClientRect();
		const x = Math.round((event.clientX - rect.left) / square.w);
		const y = Math.round((event.clientY - rect.top) / square.h);
		return [x, y];
	}
	drawGrid(): void {
		for (let gx: number = 0; gx < this.canvas.width; gx += square.w) {
			this.ctx.beginPath();
			this.ctx.moveTo(gx, 0);
			this.ctx.lineTo(gx, this.canvas.height);
			this.ctx.stroke();
		}
		for (let gy: number = 0; gy < this.canvas.height; gy += square.h) {
			this.ctx.beginPath();
			this.ctx.moveTo(0, gy);
			this.ctx.lineTo(this.canvas.width, gy);
			this.ctx.stroke();
		}
	}
	drawSquare(x: number, y: number) {
		// console.log(`Drawing square on ${x}, ${y}`)
		this.ctx.fillRect(x * square.w, y * square.h, square.w, square.h);
	};

	render(conwayGrid: ConwayGrid) {
		this.clear();
		for (const [y, gRow] of conwayGrid.grid.entries()) {
			for (const [x, gCol] of gRow.entries()) {
				if (gCol.alive) {
					// console.log(`x: ${x}, y: ${y}, gCol: ${gCol.alive}`);
					this.drawSquare(x, y);
				}
			}
		}
	};
}

export { GridTemplate, square }