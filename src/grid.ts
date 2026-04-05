import { Cell } from "./cell.ts";
type Grid = {
	rows: number;
	columns: number;
	grid: Cell[][];
	playing: boolean;
	live: Set<string>;
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
	static instance: ConwayGrid = new ConwayGrid(5000, 5000);
	grid: Cell[][];
	playing: boolean;
	rows: number;
	columns: number;
	live: Set<string>;
	constructor(rows: number, columns: number) {
		this.grid = Array.from({length: rows}, () => Array.from({length: columns}, () => new Cell(false)));
		this.playing = false;
		this.rows = rows;
		this.columns = columns;
		this.live = new Set<string>();
	}
	clearGrid(): void {
		this.grid = Array.from({length: this.rows}, () => Array.from({length: this.columns}, () => new Cell(false)));
		this.live.clear();
	}
	setCellAlive(x: number, y: number): void {
		this.grid[y][x].alive = true;
		this.live.add(`${y},${x}`)
	}
	setCellDead(x: number, y: number): void {
		this.grid[y][x].alive = false;
		this.live.delete(`${y},${x}`)
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
	stepInf(): void {
		const counts = new Map<string, number>();
		for (let yx of this.live) {
			const [y, x] = yx.split(",").map(Number);
			for (let Y = y - 1; Y < y + 2; Y++) {
				for (let X = x - 1; X < x + 2; X++) {
					if (Y == y && X == x) {
						continue
					}
					const key = `${Y},${X}`;
					counts.set(key, (counts.get(key) || 0) + 1);
				}
			}
		}
		const newLive = new Set<string>();
		for (const [yx, numNeighbors] of counts) {
			const [y, x] = yx.split(",").map(Number);
			if (numNeighbors === 3 || (numNeighbors == 2 && this.live.has(yx))) {
				newLive.add(yx);
			} else {
				this.setCellDead(x, y);
			}
		}
		this.live = newLive;
		for (let yx of this.live) {
			const [y, x] = yx.split(",").map(Number);
			this.setCellAlive(x, y);
		}
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