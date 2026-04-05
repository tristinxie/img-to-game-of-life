import { Cell } from "./cell";
import { ConwayGrid } from "./grid"
import { GridTemplate, square } from "./gridTemplate";
const conwayGrid = ConwayGrid.instance;
const template = GridTemplate.instance;
const update = (newTime: number) => {
  if (conwayGrid.playing) {
    requestAnimationFrame(update);

    const now = newTime;
    const elapsed = now - template.thenTime;
    if (elapsed > template.fpsInterval) {
      template.thenTime = now - (elapsed % template.fpsInterval);
      template.render(conwayGrid);
      conwayGrid.stepInf();
    }
  } 
}
const init = (): void => {
  template.golCanvas.addEventListener("click", (event) => {
    const [x, y] = template.clickCoords(event);
    conwayGrid.toggleCell(x, y);
    console.log(`x: ${x}, y: ${y}`);
    template.render(conwayGrid);
  })
  const clearGrid = document.getElementById("clear");
  clearGrid?.addEventListener("click", (): void => {
    conwayGrid.clearGrid();
    template.clear();
  })

  const step = document.getElementById("step");
  step?.addEventListener("click", (): void => {
    conwayGrid.stepInf();
    template.render(conwayGrid);
  })
  const playPause = document.getElementById("playPause");
  playPause?.addEventListener("click", (): void => {
    if (conwayGrid.playing) {
      conwayGrid.playing = false;
      playPause.innerHTML = "▶";
    } else {
      conwayGrid.playing = true;
      playPause.innerHTML = "⏸";
      requestAnimationFrame(update);
    }
  })
  const speed = document.getElementById("speed");
  const speedParent = document.getElementById("speedValue");
  speed?.addEventListener("input", (event: Event): void => {
    if (!(event.target instanceof HTMLInputElement) || speedParent === null) {
      throw new Error("Speed slider or value not found");
    }
    speedParent.innerHTML = event.target.value;
    template.updateFps(Number(event.target.value));
  })
  template.render(conwayGrid);
}

document.addEventListener("DOMContentLoaded", init)