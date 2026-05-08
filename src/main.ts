import { ConwayGrid } from "./grid"
import { GridTemplate } from "./gridTemplate";
const conwayGrid = ConwayGrid.instance;
const template = GridTemplate.instance;
const update = (newTime: number) => {
  if (conwayGrid.playing) {
    requestAnimationFrame(update);

    const now = newTime;
    const elapsed = now - template.thenTime;
    if (elapsed > template.fpsInterval) {
      template.thenTime = now - (elapsed % template.fpsInterval);
      template.render(conwayGrid.live);
      template.updateCounters(conwayGrid.live);
      conwayGrid.stepInf();
    }
  } else {
    // Render last frame to avoid update after pause
    template.render(conwayGrid.live);
  }
}
const init = (): void => {
  // Window listeners
  const thresh = 2;
  window.addEventListener("mousemove", (event) => {
    document.body.style.cursor = "default";
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
    template.render(conwayGrid.live);
  })

  window.addEventListener("mouseup", () => {
    template.dragging = false;
    document.body.style.cursor = "default";
  });
  const resizeCanvas = () => {
    template.golCanvas.style.width = "100%";
    template.golCanvas.style.height = "100%";
    template.golCanvas.width = template.golCanvas.offsetWidth;
    template.golCanvas.height = template.golCanvas.offsetHeight;

    template.gridCanvas.style.width = "100%";
    template.gridCanvas.style.height = "100%";
    template.gridCanvas.width = template.golCanvas.offsetWidth;
    template.gridCanvas.height = template.golCanvas.offsetHeight;
    template.render(conwayGrid.live);
  }
  window.addEventListener("resize", resizeCanvas);
  // End Window listeners
  template.golCanvas.addEventListener("click", (event) => {
    if (template.dragged) {
      template.dragged = false;
      return;
    }
    const m = template.mouseCoords(event);
    const {x, y} = template.gridCoords(m.x, m.y);
    conwayGrid.toggleCell(x, y);
    template.render(conwayGrid.live);
    template.updateCounters(conwayGrid.live, false, true);
  })
  template.golCanvas.addEventListener("mousedown", (event) => {
    const m = template.mouseCoords(event);
    template.dragging = true;
    template.lastX = m.x;
    template.lastY = m.y;
  })

  const clearGrid = document.getElementById("clear");
  clearGrid?.addEventListener("click", (): void => {
    conwayGrid.clearGrid();
    template.clearGol();
    template.updateCounters(conwayGrid.live, true);
  })

  const step = document.getElementById("step");
  step?.addEventListener("click", (): void => {
    conwayGrid.stepInf();
    template.render(conwayGrid.live);
    template.updateCounters(conwayGrid.live);
  })
  const playPause = document.getElementById("playPause");
  playPause?.addEventListener("click", (): void => {
    if (conwayGrid.playing) {
      conwayGrid.playing = false;
      playPause.innerHTML = "▶ Play";
      requestAnimationFrame(update);
    } else {
      conwayGrid.playing = true;
      playPause.innerHTML = "⏸ Pause";
      requestAnimationFrame(update);
    }
  })
  const speed = document.getElementById("speed");
  const speedValue = document.getElementById("speedValue");
  speed?.addEventListener("input", (event: Event): void => {
    if (!(event.target instanceof HTMLInputElement) || speedValue === null) {
      throw new Error("Speed slider or value not found");
    }
    speedValue.innerHTML = `${event.target.value} fps`;
    template.updateFps(Number(event.target.value));
  })
  const golCanvas = document.getElementById("golCanvas");
  golCanvas?.addEventListener("wheel", (event) => {
    event.preventDefault();
    document.body.style.cursor = "ns-resize";
    const m = template.mouseCoords(event);
    template.zoom(m.x, m.y, -event.deltaY / 100);
    template.render(conwayGrid.live)
  })
  // template.render(conwayGrid.live);
  resizeCanvas();
  template.updateCounters(conwayGrid.live);
}

document.addEventListener("DOMContentLoaded", init)