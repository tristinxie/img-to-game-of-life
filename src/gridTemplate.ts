import { ConwayGrid } from "./grid"

type DOMCanvas = {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	drawSquare(x: number, y: number): void;
	clear(): void;
	clickCoords(event: PointerEvent): [number, number];
	render(grid: ConwayGrid): void;
};
const square = {
  x: 50,
  y: 50,
  w: 10,
  h: 10,
}


// const update = () => {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   drawSquare();
//   square.x += square.dx;
//   requestAnimationFrame(update);
// }

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
	};
	clear(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};
	clickCoords(event: PointerEvent): [number, number] {
		const rect = this.canvas.getBoundingClientRect();
		const x = Math.ceil(event.clientX - rect.left);
		const y = Math.ceil(event.clientY - rect.top);
		return [x, y];
	}
	drawSquare(x: number, y: number) {
		this.ctx.fillStyle = "black"
		this.ctx.fillRect(x, y, square.w, square.h);
	};

	render(conwayGrid: ConwayGrid) {
		this.clear();
		console.log("rendering")
		for (const [y, gRow] of conwayGrid.grid.entries()) {
			for (const [x, gCol] of gRow.entries()) {
				if (gCol.alive) {
					console.log(`x: ${x}, y: ${y}, gCol: ${gCol.alive}`);
					this.drawSquare(x, y);
				}
			}
		}


	};
}

export { GridTemplate }