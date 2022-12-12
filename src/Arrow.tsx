import React, { useState, useContext } from "react";

import {
  calculateDeltas,
  calculateCanvasDimensions,
  calculateControlPoints
} from "./arrow-utils";
import { Point } from "./Points";
import context from "./context/context";

const CONTROL_POINTS_RADIUS = 3;

type ArrowConfig = {
  strokeWidth?: number;
};

type Props = {
  startPoint: Point;
  endPoint: Point;
  UUID: string;
  Selected: boolean;
  config?: ArrowConfig;
};

export const Arrow = ({
  startPoint,
  endPoint,
  UUID,
  Selected,
  config
}: Props) => {
  const defaultConfig = {
    arrowHighlightedColor: "#4da6ff",
    controlPointsColor: "#ff4747",
    boundingBoxColor: "#ffcccc",
    dotEndingBackground: "#fff",
    dotEndingRadius: 3,
    arrowHeadEndingSize: 15,
    strokeWidth: 1
  };
  const currentConfig = {
    ...defaultConfig,
    ...config
  };

  const {
    arrowHeadEndingSize,
    strokeWidth,
    dotEndingBackground,
    dotEndingRadius
  } = currentConfig;

  const arrowHeadOffset = arrowHeadEndingSize / 2;
  const boundingBoxElementsBuffer =
    strokeWidth +
    arrowHeadEndingSize / 2 +
    dotEndingRadius +
    CONTROL_POINTS_RADIUS / 2;

  const { absDx, absDy, dx, dy } = calculateDeltas(startPoint, endPoint);
  const { p1, p2, boundingBoxBuffer } = calculateControlPoints({
    boundingBoxElementsBuffer,
    dx,
    dy,
    absDx,
    absDy
  });

  const { canvasWidth, canvasHeight } = calculateCanvasDimensions({
    absDx,
    absDy,
    boundingBoxBuffer
  });

  const canvasXOffset =
    Math.min(startPoint.x, endPoint.x) - boundingBoxBuffer.horizontal;
  const canvasYOffset =
    Math.min(startPoint.y, endPoint.y) - boundingBoxBuffer.vertical;

  const [initial, setInitial] = useState({
    active: false,
    offset: { x: 0, y: 0 }
  });

  const InitialPointDownHandler = (e: any) => {
    const el = e.target;
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    el.setPointerCapture(e.pointerId);
    setInitial({
      ...initial,
      active: true,
      offset: { x: x, y: y }
    });
  };

  const EndingPointMoveHandler = (e: any) => {
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    if (initial.active) {
      setInitial({
        ...initial
      });
      endPoint.x = endPoint.x + x - initial.offset.x;
      endPoint.y = endPoint.y + y - initial.offset.y;
    }
  };

  const EndingPointUpHandler = () => {
    setInitial({
      ...initial,
      active: false
    });
  };

  const InitialPointMoveHandler = (e: any) => {
    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    if (initial.active) {
      setInitial({
        ...initial
      });
      startPoint.x = startPoint.x + x - initial.offset.x;
      startPoint.y = startPoint.y + y - initial.offset.y;
    }
  };

  const InitialPointUpHandler = () => {
    setInitial({
      ...initial,
      active: false
    });
  };

  const arrow = useContext(context);

  const ChangeDashArray = () => {
    if (!Selected) {
      arrow.setArrows(
        arrow.arrows.map((item: any) =>
          item.UUID === UUID ? { ...item, Selected: true } : item
        )
      );
    } else {
      arrow.setArrows(
        arrow.arrows.map((item: any) =>
          item.UUID === UUID ? { ...item, Selected: false } : item
        )
      );
    }
  };

  return (
    <>
      {/* <svg
        width={canvasWidth}
        height={canvasHeight}
        style={{
          transform: `translate(${canvasXOffset}px, ${canvasYOffset}px)`,
          position: "absolute",
          top: 0,
          left: 0,
          transition: "stroke 300ms"
        }}
      >
        
      </svg> */}
      <svg
        width={canvasWidth}
        height={canvasHeight}
        style={{
          transform: `translate(${canvasXOffset}px, ${canvasYOffset}px)`,
          position: "absolute",
          top: 0,
          left: 0
        }}
      >
        <defs>
          <marker
            id="head"
            orient="auto"
            markerWidth="10"
            markerHeight="10"
            refX="0.1"
            refY="2.5"
          >
            <path d="M0,0 V5 L5,2.5 Z" fill="black" />
          </marker>
        </defs>
        <line
          x1={p1.x}
          y1={p1.y}
          x2={p2.x - arrowHeadOffset * 2}
          y2={p2.y - arrowHeadOffset}
          stroke={Selected ? "lightblue" : "black"}
          strokeWidth={strokeWidth}
          markerEnd="url(#head)"
          onPointerDown={ChangeDashArray}
        />
        <circle
          cx={p1.x}
          cy={p1.y}
          r={dotEndingRadius}
          stroke={"black"}
          strokeWidth={strokeWidth}
          fill={dotEndingBackground}
          style={{ transition: "stroke 300ms" }}
          onPointerDown={InitialPointDownHandler}
          onPointerMove={InitialPointMoveHandler}
          onPointerUp={InitialPointUpHandler}
        />

        <circle
          cx={p2.x - arrowHeadOffset * 2 + 5}
          cy={p2.y - arrowHeadOffset + 5}
          r={15}
          fill="transparent"
          onPointerDown={InitialPointDownHandler}
          onPointerMove={EndingPointMoveHandler}
          onPointerUp={EndingPointUpHandler}
        />
      </svg>
    </>
  );
};

export default Arrow;
