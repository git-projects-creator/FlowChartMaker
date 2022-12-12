import { Point } from "../src/Points";

export const calculateDeltas = (
  startPoint: Point,
  endPoint: Point
): {
  dx: number;
  dy: number;
  absDx: number;
  absDy: number;
} => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  return { dx, dy, absDx, absDy };
};

export const calculateCanvasDimensions = ({
  absDx,
  absDy,
  boundingBoxBuffer
}: {
  absDx: number;
  absDy: number;
  boundingBoxBuffer: { vertical: number; horizontal: number };
}): {
  canvasWidth: number;
  canvasHeight: number;
} => {
  const canvasWidth = absDx + 2 * boundingBoxBuffer.horizontal;
  const canvasHeight = absDy + 2 * boundingBoxBuffer.vertical;

  return { canvasWidth, canvasHeight };
};

export const calculateControlPointsWithoutBoundingBox = ({
  absDx,
  absDy,
  dx,
  dy
}: {
  absDx: number;
  absDy: number;
  dx: number;
  dy: number;
}): {
  p1: Point;
  p2: Point;
} => {
  let leftTopX = 0;
  let leftTopY = 0;
  let rightBottomX = absDx;
  let rightBottomY = absDy;
  if (dx < 0) [leftTopX, rightBottomX] = [rightBottomX, leftTopX];
  if (dy < 0) [leftTopY, rightBottomY] = [rightBottomY, leftTopY];

  const p1 = {
    x: leftTopX,
    y: leftTopY
  };

  const p2 = {
    x: rightBottomX,
    y: rightBottomY
  };

  return { p1, p2 };
};
export const calculateControlPoints = ({
  boundingBoxElementsBuffer,
  absDx,
  absDy,
  dx,
  dy
}: {
  boundingBoxElementsBuffer: number;
  absDx: number;
  absDy: number;
  dx: number;
  dy: number;
}): {
  p1: Point;
  p2: Point;
  boundingBoxBuffer: {
    vertical: number;
    horizontal: number;
  };
} => {
  const { p1, p2 } = calculateControlPointsWithoutBoundingBox({
    absDx,
    absDy,
    dx,
    dy
  });

  const topBorder = Math.min(p1.y, p2.y);
  const bottomBorder = Math.max(p1.y, p2.y);
  const leftBorder = Math.min(p1.x, p2.x);
  const rightBorder = Math.max(p1.x, p2.x);

  const verticalBuffer =
    (bottomBorder - topBorder - absDy) / 2 + boundingBoxElementsBuffer;
  const horizontalBuffer =
    (rightBorder - leftBorder - absDx) / 2 + boundingBoxElementsBuffer;

  const boundingBoxBuffer = {
    vertical: verticalBuffer,
    horizontal: horizontalBuffer
  };
  return {
    p1: {
      x: p1.x + horizontalBuffer + 10,
      y: p1.y + verticalBuffer
    },
    p2: {
      x: p2.x + horizontalBuffer + 10,
      y: p2.y + verticalBuffer + 4
    },
    boundingBoxBuffer
  };
};
