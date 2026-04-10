import { Cell } from "./cell";
import { ConwayGrid } from "./grid"
import { GridTemplate } from "./gridTemplate";
const conwayGrid = ConwayGrid.instance;
const template = GridTemplate.instance;
template.width = conwayGrid.columns;
template.height = conwayGrid.rows;
const update = (newTime: number) => {
  if (conwayGrid.playing) {
    requestAnimationFrame(update);

    const now = newTime;
    const elapsed = now - template.thenTime;
    if (elapsed > template.fpsInterval) {
      template.thenTime = now - (elapsed % template.fpsInterval);
      template.render(conwayGrid.live);
      conwayGrid.stepInf();
    }
  } 
}
const init = (): void => {
  template.golCanvas.addEventListener("click", (event) => {
    if (template.dragged) {
      template.dragged = false;
      return;
    }
    const m = template.mouseCoords(event);
    const {x, y} = template.gridCoords(m.x, m.y);
    conwayGrid.toggleCell(x, y);
    template.render(conwayGrid.live);
  })
  template.golCanvas.addEventListener("mousedown", (event) => {
    const m = template.mouseCoords(event);
    template.dragging = true;
    template.lastX = m.x;
    template.lastY = m.y;
  })
  const thresh = 2;
  window.addEventListener("mousemove", (event) => {
    if (!template.dragging) return;
    const m = template.mouseCoords(event);
    const deltaX = m.x - template.lastX;
    const deltaY = m.y - template.lastY;
    template.lastX = m.x;
    template.lastY = m.y;
    if (Math.abs(deltaX) < thresh && Math.abs(deltaY) < thresh) {
      return;
    }
    document.body.style.cursor = "grabbing";
    template.dragged = true;
    template.cam.x -= (deltaX) / template.cam.scale;
    template.cam.y -= (deltaY) / template.cam.scale;
    template.clampCamera();
    template.render(conwayGrid.live);
  })

  window.addEventListener("mouseup", () => {
    template.dragging = false;
    document.body.style.cursor = "default";
  });

  const clearGrid = document.getElementById("clear");
  clearGrid?.addEventListener("click", (): void => {
    conwayGrid.clearGrid();
    template.clearGol();
  })

  const step = document.getElementById("step");
  step?.addEventListener("click", (): void => {
    conwayGrid.stepInf();
    template.render(conwayGrid.live);
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
  const golCanvas = document.getElementById("golCanvas");
  golCanvas?.addEventListener("wheel", (event) => {
    const m = template.mouseCoords(event);
    template.zoom(m.x, m.y, -event.deltaY / 100);
    template.render(conwayGrid.live)
  })
  template.render(conwayGrid.live);

}

document.addEventListener("DOMContentLoaded", init)