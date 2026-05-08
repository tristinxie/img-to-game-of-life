type Grid = {
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
	static instance: ConwayGrid = new ConwayGrid();
	playing: boolean;
	live: Set<string>;
	constructor() {
		this.playing = false;
		this.live = new Set(["33,31", "33,32", "32,32", "32,31", "35,35", "35,36", "36,36", "36,35", "33,38", "32,38", "32,39", "33,39", "49,51", "49,52", "50,51", "31,52", "31,53", "51,54", "52,54", "44,52", "44,53", "44,54", "43,52", "42,52", "41,53", "41,54", "41,56", "41,57", "42,58", "43,59", "44,58", "45,57", "43,62", "44,62", "44,63", "43,63"]);
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
}

export { ConwayGrid };