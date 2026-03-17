import { Cell } from "./cell";
import { ConwayGrid } from "./grid"
import { GridTemplate, square } from "./gridTemplate";

const init = (): void => {
  const conwayGrid = ConwayGrid.instance;
  const template = GridTemplate.instance;
  const update = () => {
    if (conwayGrid.playing) {
      template.render(conwayGrid);
      
      conwayGrid.step();
      requestAnimationFrame(update);
    } 
  }
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

  const step = document.getElementById("step");
  step?.addEventListener("click", (): void => {
    conwayGrid.step();
    template.render(conwayGrid);
  })
  const playPause = document.getElementById("playPause");
  playPause?.addEventListener("click", (): void => {
    if (conwayGrid.playing) {
      conwayGrid.playing = false;
    } else {
      conwayGrid.playing = true;
      update();
    }
  })
  template.render(conwayGrid);
}

document.addEventListener("DOMContentLoaded", init)