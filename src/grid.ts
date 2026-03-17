import { Cell } from "./cell.ts";
type Grid = {
	rows: number;
	columns: number;
	grid: Cell[][];
	playing: boolean;
	clearGrid(): void;
	setCellAlive(x: number, y: number): void;
	setCellDead(x: number, y: number): void;
	toggleCell(x: number, y: number): void;
	setCellsAlive(x: number[], y: number[]): void;
	setCellsDead(x: number[], y: number[]): void;
	getLiveNeighbors(x: number, y: number): number;
	step(): void;
}

class ConwayGrid implements Grid {
	static instance: ConwayGrid = new ConwayGrid(50, 50);
	grid: Cell[][];
	playing: boolean;
	rows: number;
	columns: number;
	constructor(rows: number, columns: number) {
		this.grid = Array.from({length: rows}, () => Array.from({length: columns}, () => new Cell(false)));
		this.playing = false;
		this.rows = rows;
		this.columns = columns;
	}
	clearGrid(): void {
		this.grid = Array.from({length: this.rows}, () => Array.from({length: this.columns}, () => new Cell(false)));
	}
	setCellAlive(x: number, y: number): void {
		this.grid[y][x].alive = true;
	}
	setCellDead(x: number, y: number): void {
		this.grid[y][x].alive = false;
	}
	toggleCell(x: number, y: number): void {
		this.grid[y][x].alive ? this.setCellDead(x, y) : this.setCellAlive(x, y);
	}
	setCellsAlive(x: number[], y: number[]): void {
		throw new Error("Method not implemented.");
	}
	setCellsDead(x: number[], y: number[]): void {
		throw new Error("Method not implemented.");
	}
	getLiveNeighbors(x: number, y: number): number {
		let numLive = 0; 
		// left to right top to bottom
		const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
		for (const dir of dirs) {
			const [dy, dx] = dir;
			const [ny, nx] = [y + dy, x + dx]
			if (nx < this.columns && nx >= 0 && ny < this.rows && ny >= 0 && this.grid[ny][nx].alive) {
				numLive++;
			}
		}
		return numLive;
	}
	step(): void {
		const cellChanges = [];
		for (const [y, gRow] of this.grid.entries()) {
			for (const [x, gCol] of gRow.entries()) {
				const numLiveNeighbors = this.getLiveNeighbors(x, y);
				if (gCol.alive) {
					if (numLiveNeighbors < 2) {
						cellChanges.push([x, y])
					} else if (numLiveNeighbors > 3) {
						cellChanges.push([x, y])
					}
				} else {
					if (numLiveNeighbors === 3) {
						cellChanges.push([x, y])
					}
				}
			}
		}
		for (const cc of cellChanges) {
			const [x, y] = cc;
			this.toggleCell(x, y);
		}
	}
}

export { ConwayGrid };