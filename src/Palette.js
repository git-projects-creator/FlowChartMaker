import React from "react";
import { DRAG_DATA_KEY, SHAPE_TYPES } from "./constants";

const Palette = () => {
  const handleDragStart = (event) => {
    const type = event.target.dataset.shape;
    if (type) {
      const offsetX = event.nativeEvent.offsetX;
      const offsetY = event.nativeEvent.offsetY;
      const clientWidth = event.target.clientWidth;
      const clientHeight = event.target.clientHeight;
      const dragPayload = JSON.stringify({
        type,
        offsetX,
        offsetY,
        clientWidth,
        clientHeight
      });
      event.nativeEvent.dataTransfer.setData(DRAG_DATA_KEY, dragPayload);
    }
  };
  return (
    <aside className="palette">
      <h2>Shapes</h2>
      <div
        className="shape rectangle"
        data-shape={SHAPE_TYPES.RECT}
        draggable
        onDragStart={handleDragStart}
      />
      {/* <div
        className="shape circle"
        data-shape={SHAPE_TYPES.CIRCLE}
        draggable
        onDragStart={handleDragStart}
      /> */}
    </aside>
  );
};

export default Palette;
