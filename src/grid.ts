import { Cell } from "./cell.ts";
type Grid = {
	rows: number;
	columns: number;
	grid: Cell[][];
	clearGrid(): void;
	setCellAlive(x: number, y: number): void;
	setCellDead(x: number, y: number): void;
	toggleCell(x: number, y: number): void;
	setCellsAlive(x: number[], y: number[]): void;
	setCellsDead(x: number[], y: number[]): void;
}

class ConwayGrid implements Grid {
	static instance: ConwayGrid = new ConwayGrid(50, 50);
	grid: Cell[][];
	rows: number;
	columns: number;
	constructor(rows: number, columns: number) {
		this.grid = Array.from({length: rows}, () => Array.from({length: columns}, () => new Cell(false)));
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
}

export { ConwayGrid };