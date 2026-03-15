import { Cell } from "./cell";
import { ConwayGrid } from "./grid"
import { GridTemplate } from "./gridTemplate";
const init = (): void => {
  const conwayGrid = ConwayGrid.instance;
  const template = GridTemplate.instance;
  template.canvas.addEventListener("click", (event) => {
    const [x, y] = template.clickCoords(event)
    conwayGrid.setCellAlive(x, y);
    console.log(`x: ${x}, y: ${y}`)
    console.log(conwayGrid.grid)
    template.render(conwayGrid);
  })
}

document.addEventListener("DOMContentLoaded", init)