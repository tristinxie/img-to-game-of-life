type Grid = {
	rows: number;
	columns: number;
	playing: boolean;
	live: Set<string>;
	clearGrid(): void;
	setCellAlive(x: number, y: number): void;
	setCellDead(x: number, y: number): void;
	toggleCell(x: number, y: number): void;
	setCellsAlive(x: number[], y: number[]): void;
	setCellsDead(x: number[], y: number[]): void;
}

class ConwayGrid implements Grid {
	static instance: ConwayGrid = new ConwayGrid(50000, 50000);
	playing: boolean;
	rows: number;
	columns: number;
	live: Set<string>;
	constructor(rows: number, columns: number) {
		this.playing = false;
		this.rows = rows;
		this.columns = columns;
		this.live = new Set<string>();
	}
	clearGrid(): void {
		this.live.clear();
	}
	setCellAlive(x: number, y: number): void {
		this.live.add(`${y},${x}`);
	}
	setCellDead(x: number, y: number): void {
		this.live.delete(`${y},${x}`);
	}
	toggleCell(x: number, y: number): void {
		this.live.has(`${y},${x}`) ? this.setCellDead(x, y) : this.setCellAlive(x, y);
	}
	setCellsAlive(x: number[], y: number[]): void {
		throw new Error("Method not implemented.");
	}
	setCellsDead(x: number[], y: number[]): void {
		throw new Error("Method not implemented.");
	}
	stepInf(): void {
		const counts = new Map<string, number>();
		for (let yx of this.live) {
			const [y, x] = yx.split(",").map(Number);
			for (let Y = y - 1; Y < y + 2; Y++) {
				for (let X = x - 1; X < x + 2; X++) {
					if (X >= this.columns || X < 0 || Y >= this.rows || Y < 0 || (Y == y && X == x)) {
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
}

export { ConwayGrid };