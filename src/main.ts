import { Cell } from "./cell";
import { ConwayGrid } from "./grid"
import { GridTemplate, square } from "./gridTemplate";
const init = (): void => {
  const conwayGrid = ConwayGrid.instance;
  const template = GridTemplate.instance;
  template.canvas.addEventListener("click", (event) => {
    const [x, y] = template.clickCoords(event);
    conwayGrid.toggleCell(x, y);
    console.log(`x: ${x}, y: ${y}`);
    console.log(conwayGrid.grid);
    template.render(conwayGrid);
  })
  const clearGrid = document.getElementById("clear");
  clearGrid?.addEventListener("click", (): void => {
    conwayGrid.clearGrid();
    template.clear();
  })
  template.render(conwayGrid);
}

document.addEventListener("DOMContentLoaded", init)