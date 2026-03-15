import { Cell } from "./cell.ts";
type Grid = {
	rows: number,
	columns: number,
	grid: Cell[][],
	clearGrid(): void,
	setCellAlive(x: number, y: number): void,
	setCellDead(x: number, y: number): void,
	setCellsAlive(x: number[], y: number[]): void,
	setCellsDead(x: number[], y: number[]): void,
}

class ConwayGrid implements Grid {
	static instance: ConwayGrid = new ConwayGrid(500, 500);
	grid: Cell[][];
	rows: number;
	columns: number;
	constructor(rows: number, columns: number) {
		this.grid = Array.from({length: rows}, () => Array.from({length: columns}, () => new Cell(false)));
		this.rows = rows;
		this.columns = columns;
	}
	clearGrid(): void {
		throw new Error("Method not implemented.");
	}
	setCellAlive(x: number, y: number): void {
		this.grid[y][x].alive = true;
	}
	setCellDead(x: number, y: number): void {
		throw new Error("Method not implemented.");
	}
	setCellsAlive(x: number[], y: number[]): void {
		throw new Error("Method not implemented.");
	}
	setCellsDead(x: number[], y: number[]): void {
		throw new Error("Method not implemented.");
	}
}

export { ConwayGrid };