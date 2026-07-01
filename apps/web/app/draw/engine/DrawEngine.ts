import { getExistingShapes } from "../network/api";
import {
  createElementSender,
  deleteElementSender,
  socketMessageListener,
  updateElementSender,
} from "../network/socket";
import { clearCanvas } from "../utils/clearCanvas";
import { getCanvasCoordinates } from "../utils/getCanvasCoordinates";
import { handleMouseDown, handleMouseUp } from "../tools/mouse";
import {
  createArrow,
  previewArrow,
  isPointOnArrow,
  getArrowHandleAtPoint,
} from "../tools/arrow/ArrowTool";
import {
  createCircle,
  previewCircle,
  isPointInsideCircle,
  getCircleHandleAtPoint,
} from "../tools/circle/circleTool";
import {
  createLine,
  previewLine,
  isPointInsideLine,
  getLineHandleAtPoint,
} from "../tools/line/lineTool";
import {
  createPencil,
  previewPencil,
  isPointOnPencil,
  getPencilHandleAtPoint,
} from "../tools/pencil/pencilTool";
import {
  createRectangle,
  previewRectangle,
  isPointInsideRectangle,
  getRectangleHandleAtPoint,
  rotatePoint,
} from "../tools/rectangle/rectangleTool";
import { isPointOnText, getTextHandleAtPoint } from "../tools/text/textTool";
import { ShapeType } from "../utils/types";
import { RefObject } from "react";
import { Shape } from "../utils/types";
import { HistoryAction } from "../utils/types";

export class DrawEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public roomId: string;
  public socket: WebSocket;

  private shape: RefObject<ShapeType>;
  private onTextClick: (x: number, y: number) => void;

  public existingShapes: Shape[] = [];

  private destroyed = false;
  private attachedEvents = false;

  private History: HistoryAction[] = [];
  private redoStack: HistoryAction[] = [];

  private initialDraggedShapeProps: Shape | null = null;

  private camera = {
    x: 0,
    y: 0,
    scale: 1,
  };

  private onCameraChange: () => void;

  public state = {
    clicked: false,
    startX: 0,
    startY: 0,
    currentStroke: [] as { x: number; y: number }[],
    selectedShapeId: null as string | null,
    isDraggingShape: false,
    isResizingShape: false,
    isRotatingShape: false,
    activeHandle: null as string | null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    isMovingCamera: false,
    lastMouseX: 0,
    lastMouseY: 0,
  };

  constructor(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
    shape: RefObject<ShapeType>,
    onTextClick: (x: number, y: number) => void,
    onCameraChange: () => void,
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.roomId = roomId;
    this.socket = socket;
    this.shape = shape;
    this.onTextClick = onTextClick;
    this.onCameraChange = onCameraChange;

    this.init();
  }

  private async init() {
    if (!this.ctx) return;

    const shapes = await getExistingShapes(this.roomId);

    if (this.destroyed) return;

    this.existingShapes = shapes;

    socketMessageListener(
      this.socket,
      this.existingShapes,
      this.canvas,
      this.ctx,
      () => this.state.selectedShapeId,
      this.worldToScreen.bind(this),
      (id) => this.state.selectedShapeId === id
    );

    this.render();
    this.attachEvents();
  }

  public render() {
    clearCanvas(
      this.existingShapes,
      this.canvas,
      this.ctx,
      this.state.selectedShapeId,
      this.worldToScreen.bind(this),
    );
  }
  
  public addShape(shape: Shape) {
    this.existingShapes.push(shape);
    this.History.push({ type: "CREATE", shape: structuredClone(shape) });
    this.redoStack = [];
    this.render();
  }

  private deleteSelectedShape() {
    if (!this.state.selectedShapeId) return;

    const deletedShape = this.existingShapes.find(
      (s) => s.id === this.state.selectedShapeId,
    );

    if (!deletedShape) return;

    deleteElementSender(this.state.selectedShapeId, this.socket, this.roomId);

    this.History.push({ type: "DELETE", shape: structuredClone(deletedShape) });
    this.redoStack = [];

    const index = this.existingShapes.findIndex(
      (s) => s.id === deletedShape.id,
    );
    if (index !== -1) {
      this.existingShapes.splice(index, 1);
    }

    this.state.selectedShapeId = null;

    this.render();
  }

  public worldToScreen = (worldX: number, worldY: number) => {
    const screenX = (worldX - this.camera.x) * this.camera.scale;
    const screenY = (worldY - this.camera.y) * this.camera.scale;
    return {
      screenX,
      screenY,
      scale: this.camera.scale,
    };
  };

  public screenToWorld(screenX: number, screenY: number) {
    const worldX = screenX / this.camera.scale + this.camera.x;
    const worldY = screenY / this.camera.scale + this.camera.y;
    return {
      worldX,
      worldY,
    };
  }

  private mouseDownHandler = (e: MouseEvent) => {
    const pos = getCanvasCoordinates(e, this.canvas);
    const worldCoord = this.screenToWorld(pos.x, pos.y);

    if (this.shape.current === "text") {
      e.preventDefault();
      if (document.activeElement instanceof HTMLTextAreaElement) {
        document.activeElement.blur();
      }
      this.onTextClick(worldCoord.worldX, worldCoord.worldY);
      return;
    }

    this.state.startX = worldCoord.worldX;
    this.state.startY = worldCoord.worldY;
    handleMouseDown(this.state);

    if (this.shape.current !== "pointer") {
      this.state.selectedShapeId = null;
    }

    if (this.shape.current === "pencil") {
      this.state.currentStroke = [];

      this.state.currentStroke.push({
        x: worldCoord.worldX,
        y: worldCoord.worldY,
      });
    }

    if (this.shape.current === "move") {
      ((this.state.lastMouseX = pos.x),
        (this.state.lastMouseY = pos.y),
        (this.state.isMovingCamera = true));
    }

    if (this.shape.current === "pointer") {
      let clickedOnShape = false;

      if (this.state.selectedShapeId) {
        const selectedShape = this.existingShapes.find(
          (s) => s.id === this.state.selectedShapeId,
        );
        if (selectedShape) {
          let handle = null;
          if (selectedShape.type === "rect") {
            handle = getRectangleHandleAtPoint(
              worldCoord.worldX,
              worldCoord.worldY,
              selectedShape,
              this.camera.scale,
            );
          } else if (selectedShape.type === "circle") {
            handle = getCircleHandleAtPoint(
              worldCoord.worldX,
              worldCoord.worldY,
              selectedShape,
              this.camera.scale,
            );
          } else if (selectedShape.type === "line") {
            handle = getLineHandleAtPoint(
              worldCoord.worldX,
              worldCoord.worldY,
              selectedShape,
              this.camera.scale,
            );
          } else if (selectedShape.type === "arrow") {
            handle = getArrowHandleAtPoint(
              worldCoord.worldX,
              worldCoord.worldY,
              selectedShape,
              this.camera.scale,
            );
          } else if (selectedShape.type === "pencil") {
            handle = getPencilHandleAtPoint(
              worldCoord.worldX,
              worldCoord.worldY,
              selectedShape,
              this.camera.scale,
            );
          } else if (selectedShape.type === "text") {
            handle = getTextHandleAtPoint(
              worldCoord.worldX,
              worldCoord.worldY,
              selectedShape,
              this.camera.scale,
              this.ctx,
            );
          }

          if (handle) {
            if (handle === "rotate") {
              this.state.isRotatingShape = true;
            } else {
              this.state.isResizingShape = true;
              this.state.activeHandle = handle;
            }
            this.initialDraggedShapeProps = structuredClone(selectedShape);
            clickedOnShape = true;
          }
        }
      }

      if (!clickedOnShape) {
        for (let i = this.existingShapes.length - 1; i >= 0; i--) {
          const shape = this.existingShapes[i];

          if (!shape?.id) continue;

          switch (shape.type) {
            case "rect":
              if (
                isPointInsideRectangle(
                  worldCoord.worldX,
                  worldCoord.worldY,
                  shape,
                )
              ) {
                this.state.selectedShapeId = shape.id;
                this.state.isDraggingShape = true;

                this.initialDraggedShapeProps = structuredClone(shape);

                this.state.dragOffsetX = worldCoord.worldX - shape.x;
                this.state.dragOffsetY = worldCoord.worldY - shape.y;
                clickedOnShape = true;
              }
              break;
            case "circle":
              if (
                isPointInsideCircle(worldCoord.worldX, worldCoord.worldY, shape)
              ) {
                this.state.selectedShapeId = shape.id;
                this.state.isDraggingShape = true;

                this.initialDraggedShapeProps = structuredClone(shape);

                this.state.dragOffsetX = worldCoord.worldX - shape.centreX;
                this.state.dragOffsetY = worldCoord.worldY - shape.centreY;
                clickedOnShape = true;
              }
              break;
            case "line":
              if (
                isPointInsideLine(
                  this.ctx,
                  worldCoord.worldX,
                  worldCoord.worldY,
                  shape.startX,
                  shape.startY,
                  shape.endX,
                  shape.endY,
                )
              ) {
                this.state.dragOffsetX = worldCoord.worldX - shape.startX;
                this.state.dragOffsetY = worldCoord.worldY - shape.startY;

                this.initialDraggedShapeProps = structuredClone(shape);

                this.state.selectedShapeId = shape.id;
                this.state.isDraggingShape = true;
                clickedOnShape = true;
              }
              break;
            case "arrow":
              if (
                isPointOnArrow(
                  this.ctx,
                  worldCoord.worldX,
                  worldCoord.worldY,
                  shape.x1,
                  shape.y1,
                  shape.x2,
                  shape.y2,
                )
              ) {
                this.state.dragOffsetX = worldCoord.worldX - shape.x1;
                this.state.dragOffsetY = worldCoord.worldY - shape.y1;

                this.initialDraggedShapeProps = structuredClone(shape);

                this.state.selectedShapeId = shape.id;
                this.state.isDraggingShape = true;
                clickedOnShape = true;
              }
              break;
            case "pencil":
              if (
                isPointOnPencil(
                  this.ctx,
                  worldCoord.worldX,
                  worldCoord.worldY,
                  shape,
                )
              ) {
                this.state.dragOffsetX = worldCoord.worldX;
                this.state.dragOffsetY = worldCoord.worldY;

                this.initialDraggedShapeProps = structuredClone(shape);

                this.state.selectedShapeId = shape.id;
                this.state.isDraggingShape = true;
                clickedOnShape = true;
              }
              break;
            case "text":
              if (
                isPointOnText(
                  this.ctx,
                  worldCoord.worldX,
                  worldCoord.worldY,
                  shape,
                )
              ) {
                this.state.dragOffsetX = worldCoord.worldX - shape.x;
                this.state.dragOffsetY = worldCoord.worldY - shape.y;

                this.initialDraggedShapeProps = structuredClone(shape);

                this.state.selectedShapeId = shape.id;
                this.state.isDraggingShape = true;
                clickedOnShape = true;
              }
          }
        }
      } // close if (!clickedOnShape) around the for loop

      if (!clickedOnShape) {
        this.state.selectedShapeId = null;
      }
      this.render();
    }
  };

  private mouseMoveHandler = (e: MouseEvent) => {
    const pos = getCanvasCoordinates(e, this.canvas);
    const world = this.screenToWorld(pos.x, pos.y);

    if (this.shape.current === "pointer") {
      if (this.state.isRotatingShape && this.state.selectedShapeId) {
        const selectedShape = this.existingShapes.find(
          (shape) => shape.id === this.state.selectedShapeId,
        );
        if (selectedShape) {
          if (selectedShape.type === "rect") {
            const cx = selectedShape.x + selectedShape.width / 2;
            const cy = selectedShape.y + selectedShape.height / 2;
            selectedShape.angle =
              Math.atan2(world.worldY - cy, world.worldX - cx) + Math.PI / 2;
            this.render();
          } else if (selectedShape.type === "circle") {
            const cx = selectedShape.centreX;
            const cy = selectedShape.centreY;
            selectedShape.angle =
              Math.atan2(world.worldY - cy, world.worldX - cx) + Math.PI / 2;
            this.render();
          } else if (selectedShape.type === "line") {
            const cx = (selectedShape.startX + selectedShape.endX) / 2;
            const cy = (selectedShape.startY + selectedShape.endY) / 2;
            const length = Math.hypot(
              selectedShape.endX - selectedShape.startX,
              selectedShape.endY - selectedShape.startY,
            );
            const angle =
              Math.atan2(world.worldY - cy, world.worldX - cx) - Math.PI / 2;
            selectedShape.startX = cx - Math.cos(angle) * (length / 2);
            selectedShape.startY = cy - Math.sin(angle) * (length / 2);
            selectedShape.endX = cx + Math.cos(angle) * (length / 2);
            selectedShape.endY = cy + Math.sin(angle) * (length / 2);
            this.render();
          } else if (selectedShape.type === "arrow") {
            const cx = (selectedShape.x1 + selectedShape.x2) / 2;
            const cy = (selectedShape.y1 + selectedShape.y2) / 2;
            const length = Math.hypot(
              selectedShape.x2 - selectedShape.x1,
              selectedShape.y2 - selectedShape.y1,
            );
            const angle =
              Math.atan2(world.worldY - cy, world.worldX - cx) - Math.PI / 2;
            selectedShape.x1 = cx - Math.cos(angle) * (length / 2);
            selectedShape.y1 = cy - Math.sin(angle) * (length / 2);
            selectedShape.x2 = cx + Math.cos(angle) * (length / 2);
            selectedShape.y2 = cy + Math.sin(angle) * (length / 2);
            this.render();
          } else if (selectedShape.type === "pencil") {
            const minX = Math.min(...selectedShape.points.map((p) => p.x));
            const minY = Math.min(...selectedShape.points.map((p) => p.y));
            const maxX = Math.max(...selectedShape.points.map((p) => p.x));
            const maxY = Math.max(...selectedShape.points.map((p) => p.y));
            const cx = minX + (maxX - minX) / 2;
            const cy = minY + (maxY - minY) / 2;
            selectedShape.angle =
              Math.atan2(world.worldY - cy, world.worldX - cx) + Math.PI / 2;
            this.render();
          } else if (selectedShape.type === "text") {
            this.ctx.save();
            this.ctx.font = "24px Sniglet";
            const baseWidth = this.ctx.measureText(selectedShape.text).width;
            this.ctx.restore();
            const width = selectedShape.width ?? baseWidth;
            const height = selectedShape.height ?? 24;
            const cx = selectedShape.x + width / 2;
            const cy = selectedShape.y + height / 2;
            selectedShape.angle =
              Math.atan2(world.worldY - cy, world.worldX - cx) + Math.PI / 2;
            this.render();
          }
        }
        return;
      }

      if (
        this.state.isResizingShape &&
        this.state.selectedShapeId &&
        this.initialDraggedShapeProps
      ) {
        const selectedShape = this.existingShapes.find(
          (shape) => shape.id === this.state.selectedShapeId,
        );
        const initial = this.initialDraggedShapeProps;

        if (
          selectedShape &&
          selectedShape.type === "line" &&
          initial.type === "line"
        ) {
          if (this.state.activeHandle === "start") {
            selectedShape.startX = world.worldX;
            selectedShape.startY = world.worldY;
          } else if (this.state.activeHandle === "end") {
            selectedShape.endX = world.worldX;
            selectedShape.endY = world.worldY;
          }
          this.render();
          return;
        }

        if (
          selectedShape &&
          selectedShape.type === "arrow" &&
          initial.type === "arrow"
        ) {
          if (this.state.activeHandle === "start") {
            selectedShape.x1 = world.worldX;
            selectedShape.y1 = world.worldY;
          } else if (this.state.activeHandle === "end") {
            selectedShape.x2 = world.worldX;
            selectedShape.y2 = world.worldY;
          }
          this.render();
          return;
        }

        if (
          selectedShape &&
          selectedShape.type === "pencil" &&
          initial.type === "pencil"
        ) {
          const initialMinX = Math.min(...initial.points.map((p) => p.x));
          const initialMinY = Math.min(...initial.points.map((p) => p.y));
          const initialMaxX = Math.max(...initial.points.map((p) => p.x));
          const initialMaxY = Math.max(...initial.points.map((p) => p.y));
          const initialWidth = initialMaxX - initialMinX;
          const initialHeight = initialMaxY - initialMinY;
          const angle = initial.angle || 0;
          const cx = initialMinX + initialWidth / 2;
          const cy = initialMinY + initialHeight / 2;

          const unrotatedMouse = rotatePoint(
            world.worldX,
            world.worldY,
            cx,
            cy,
            -angle,
          );

          let newMinX = initialMinX;
          let newMinY = initialMinY;
          let newWidth = initialWidth;
          let newHeight = initialHeight;

          if (this.state.activeHandle === "se") {
            newWidth = unrotatedMouse.x - initialMinX;
            newHeight = unrotatedMouse.y - initialMinY;
          } else if (this.state.activeHandle === "nw") {
            newWidth = initialMaxX - unrotatedMouse.x;
            newHeight = initialMaxY - unrotatedMouse.y;
            newMinX = unrotatedMouse.x;
            newMinY = unrotatedMouse.y;
          } else if (this.state.activeHandle === "ne") {
            newWidth = unrotatedMouse.x - initialMinX;
            newHeight = initialMaxY - unrotatedMouse.y;
            newMinY = unrotatedMouse.y;
          } else if (this.state.activeHandle === "sw") {
            newWidth = initialMaxX - unrotatedMouse.x;
            newHeight = unrotatedMouse.y - initialMinY;
            newMinX = unrotatedMouse.x;
          }

          const scaleX = newWidth / (initialWidth || 1);
          const scaleY = newHeight / (initialHeight || 1);

          selectedShape.points = initial.points.map((p) => ({
            x: newMinX + (p.x - initialMinX) * scaleX,
            y: newMinY + (p.y - initialMinY) * scaleY,
          }));

          this.render();
          return;
        }

        if (
          selectedShape &&
          (selectedShape.type === "rect" ||
            selectedShape.type === "circle" ||
            selectedShape.type === "text") &&
          (initial.type === "rect" ||
            initial.type === "circle" ||
            initial.type === "text")
        ) {
          const getInitialWidth = () => {
            if (initial.type === "rect") return initial.width;
            if (initial.type === "circle") return initial.radiusX * 2;
            this.ctx.save();
            this.ctx.font = "24px Sniglet";
            const baseWidth = this.ctx.measureText(initial.text).width;
            this.ctx.restore();
            return initial.width ?? baseWidth;
          };
          const getInitialHeight = () => {
            if (initial.type === "rect") return initial.height;
            if (initial.type === "circle") return initial.radiusY * 2;
            return initial.height ?? 24;
          };

          const initialX =
            initial.type === "rect" || initial.type === "text"
              ? initial.x
              : initial.centreX - initial.radiusX;
          const initialY =
            initial.type === "rect" || initial.type === "text"
              ? initial.y
              : initial.centreY - initial.radiusY;
          const initialWidth = getInitialWidth();
          const initialHeight = getInitialHeight();
          const angle = initial.angle || 0;

          const cx = initialX + initialWidth / 2;
          const cy = initialY + initialHeight / 2;

          const unrotatedMouse = rotatePoint(
            world.worldX,
            world.worldY,
            cx,
            cy,
            -angle,
          );

          let newX = initialX;
          let newY = initialY;
          let newWidth = initialWidth;
          let newHeight = initialHeight;

          if (this.state.activeHandle === "se") {
            newWidth = unrotatedMouse.x - initialX;
            newHeight = unrotatedMouse.y - initialY;
          } else if (this.state.activeHandle === "nw") {
            newWidth = initialX + initialWidth - unrotatedMouse.x;
            newHeight = initialY + initialHeight - unrotatedMouse.y;
            newX = unrotatedMouse.x;
            newY = unrotatedMouse.y;
          } else if (this.state.activeHandle === "ne") {
            newWidth = unrotatedMouse.x - initialX;
            newHeight = initialY + initialHeight - unrotatedMouse.y;
            newY = unrotatedMouse.y;
          } else if (this.state.activeHandle === "sw") {
            newWidth = initialX + initialWidth - unrotatedMouse.x;
            newHeight = unrotatedMouse.y - initialY;
            newX = unrotatedMouse.x;
          }

          if (selectedShape.type === "text") {
            const scale = Math.max(Math.abs(newWidth) / initialWidth, Math.abs(newHeight) / initialHeight);
            newWidth = initialWidth * scale * Math.sign(newWidth);
            newHeight = initialHeight * scale * Math.sign(newHeight);
            
            if (this.state.activeHandle === "nw") {
              newX = initialX + initialWidth - newWidth;
              newY = initialY + initialHeight - newHeight;
            } else if (this.state.activeHandle === "ne") {
              newY = initialY + initialHeight - newHeight;
            } else if (this.state.activeHandle === "sw") {
              newX = initialX + initialWidth - newWidth;
            }
          }

          if (newWidth < 0) {
            newX += newWidth;
            newWidth = Math.abs(newWidth);
          }
          if (newHeight < 0) {
            newY += newHeight;
            newHeight = Math.abs(newHeight);
          }

          let fixedCornerX, fixedCornerY;
          if (this.state.activeHandle === "se") {
            fixedCornerX = initialX;
            fixedCornerY = initialY;
          } else if (this.state.activeHandle === "nw") {
            fixedCornerX = initialX + initialWidth;
            fixedCornerY = initialY + initialHeight;
          } else if (this.state.activeHandle === "ne") {
            fixedCornerX = initialX;
            fixedCornerY = initialY + initialHeight;
          } else {
            fixedCornerX = initialX + initialWidth;
            fixedCornerY = initialY;
          }

          const fixedWorld = rotatePoint(
            fixedCornerX,
            fixedCornerY,
            cx,
            cy,
            angle,
          );

          const newCx = newX + newWidth / 2;
          const newCy = newY + newHeight / 2;

          let newFixedCornerX, newFixedCornerY;
          if (this.state.activeHandle === "se") {
            newFixedCornerX = newX;
            newFixedCornerY = newY;
          } else if (this.state.activeHandle === "nw") {
            newFixedCornerX = newX + newWidth;
            newFixedCornerY = newY + newHeight;
          } else if (this.state.activeHandle === "ne") {
            newFixedCornerX = newX;
            newFixedCornerY = newY + newHeight;
          } else {
            newFixedCornerX = newX + newWidth;
            newFixedCornerY = newY;
          }

          const newFixedWorld = rotatePoint(
            newFixedCornerX,
            newFixedCornerY,
            newCx,
            newCy,
            angle,
          );

          const dx = fixedWorld.x - newFixedWorld.x;
          const dy = fixedWorld.y - newFixedWorld.y;

          if (selectedShape.type === "rect" || selectedShape.type === "text") {
            selectedShape.x = newX + dx;
            selectedShape.y = newY + dy;
            selectedShape.width = newWidth;
            selectedShape.height = newHeight;
          } else {
            selectedShape.centreX = newX + dx + newWidth / 2;
            selectedShape.centreY = newY + dy + newHeight / 2;
            selectedShape.radiusX = newWidth / 2;
            selectedShape.radiusY = newHeight / 2;
          }

          this.render();
        }
        return;
      }

      if (this.state.isDraggingShape && this.state.selectedShapeId) {
        const selectedShape = this.existingShapes.find(
          (shape) => shape.id === this.state.selectedShapeId,
        );

        if (selectedShape && selectedShape.type === "rect") {
          selectedShape.x = world.worldX - this.state.dragOffsetX;
          selectedShape.y = world.worldY - this.state.dragOffsetY;
        }

        if (selectedShape && selectedShape.type === "circle") {
          selectedShape.centreX = world.worldX - this.state.dragOffsetX;
          selectedShape.centreY = world.worldY - this.state.dragOffsetY;
        }
        if (selectedShape && selectedShape.type === "line") {
          const linedx = selectedShape.endX - selectedShape.startX;
          const linedy = selectedShape.endY - selectedShape.startY;

          selectedShape.startX = world.worldX - this.state.dragOffsetX;
          selectedShape.startY = world.worldY - this.state.dragOffsetY;

          selectedShape.endX = selectedShape.startX + linedx;
          selectedShape.endY = selectedShape.startY + linedy;
        }
        if (selectedShape && selectedShape.type === "arrow") {
          const linedx = selectedShape.x2 - selectedShape.x1;
          const linedy = selectedShape.y2 - selectedShape.y1;

          selectedShape.x1 = world.worldX - this.state.dragOffsetX;
          selectedShape.y1 = world.worldY - this.state.dragOffsetY;

          selectedShape.x2 = linedx + selectedShape.x1;
          selectedShape.y2 = linedy + selectedShape.y1;
        }
        if (selectedShape && selectedShape.type === "pencil") {
          const dx = world.worldX - this.state.dragOffsetX;
          const dy = world.worldY - this.state.dragOffsetY;

          for (const point of selectedShape.points) {
            point.x += dx;
            point.y += dy;
          }

          this.state.dragOffsetX = world.worldX;
          this.state.dragOffsetY = world.worldY;
        }
        if (selectedShape && selectedShape.type === "text") {
          selectedShape.x = world.worldX - this.state.dragOffsetX;
          selectedShape.y = world.worldY - this.state.dragOffsetY;
        }
        this.render();
      }
      return;
    }

    if (this.shape.current === "move" && this.state.isMovingCamera) {
      const dx = pos.x - this.state.lastMouseX;
      const dy = pos.y - this.state.lastMouseY;

      this.camera.x -= dx / this.camera.scale;
      this.camera.y -= dy / this.camera.scale;

      this.onCameraChange();
      this.render();
      console.log("x: ", this.camera.x, "y; ", this.camera.y);

      this.state.lastMouseX = pos.x;
      this.state.lastMouseY = pos.y;
    }

    if (!this.state.clicked) return;

    this.render();

    switch (this.shape.current) {
      case "rectangle":
        previewRectangle(
          this.ctx,
          this.state.startX,
          this.state.startY,
          world.worldX,
          world.worldY,
          this.worldToScreen.bind(this),
        );
        break;
      case "circle":
        previewCircle(
          this.ctx,
          this.state.startX,
          this.state.startY,
          world.worldX,
          world.worldY,
          this.worldToScreen.bind(this),
        );
        break;
      case "line":
        previewLine(
          this.ctx,
          this.state.startX,
          this.state.startY,
          world.worldX,
          world.worldY,
          this.worldToScreen.bind(this),
        );
        break;
      case "pencil":
        this.state.currentStroke.push({ x: world.worldX, y: world.worldY });
        previewPencil(
          this.ctx,
          this.state.currentStroke,
          this.worldToScreen.bind(this),
        );
        break;
      case "arrow":
        previewArrow(
          this.ctx,
          this.state.startX,
          this.state.startY,
          world.worldX,
          world.worldY,
          this.worldToScreen.bind(this),
        );
        break;
    }
  };

  private mouseUpHandler = (e: MouseEvent) => {
    handleMouseUp(this.state);
    const pos = getCanvasCoordinates(e, this.canvas);
    const world = this.screenToWorld(pos.x, pos.y);

    if (this.shape.current === "pointer") {
      if (
        (this.state.isDraggingShape ||
          this.state.isResizingShape ||
          this.state.isRotatingShape) &&
        this.state.selectedShapeId
      ) {
        const selectedShape = this.existingShapes.find(
          (shape) => shape.id === this.state.selectedShapeId,
        );

        if (selectedShape?.id && this.initialDraggedShapeProps) {
          updateElementSender(
            selectedShape.id,
            this.socket,
            selectedShape,
            this.roomId,
          );

          this.History.push({
            type: "MOVE",
            shapeId: selectedShape.id,
            oldProps: this.initialDraggedShapeProps,
            newProps: structuredClone(selectedShape),
          });

          this.redoStack = [];
        }
        this.state.isDraggingShape = false;
        this.state.isResizingShape = false;
        this.state.isRotatingShape = false;
        this.state.activeHandle = null;
      }
      return;
    }

    if (this.shape.current === "move" && this.state.isMovingCamera) {
      this.state.isMovingCamera = false;
    }

    const isClick =
      Math.abs(world.worldX - this.state.startX) < 2 &&
      Math.abs(world.worldY - this.state.startY) < 2;

    if (isClick) {
      return;
    }

    let newShape: Shape | null = null;

    switch (this.shape.current) {
      case "rectangle":
        newShape = createRectangle(
          this.state.startX,
          this.state.startY,
          world.worldX,
          world.worldY,
        );
        break;
      case "circle":
        newShape = createCircle(
          this.state.startX,
          this.state.startY,
          world.worldX,
          world.worldY,
        );
        break;
      case "line":
        newShape = createLine(
          this.state.startX,
          this.state.startY,
          world.worldX,
          world.worldY,
        );
        break;
      case "pencil":
        newShape = createPencil(this.state.currentStroke);
        break;
      case "arrow":
        newShape = createArrow(
          this.state.startX,
          this.state.startY,
          world.worldX,
          world.worldY,
        );
        break;
    }

    if (newShape) {
      this.addShape(newShape);
      createElementSender(this.socket, newShape, this.roomId);
    }
  };

  private keyDownHandler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;

    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    if (modifier && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (e.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }
    }

    if (modifier && e.key.toLowerCase() === "y") {
      e.preventDefault();
      this.redo();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      this.deleteSelectedShape();
    }
  };

  private wheelMoveEvent = (e: WheelEvent) => {
    if (!e.ctrlKey) return;

    e.preventDefault();

    const rect = this.canvas.getBoundingClientRect();

    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const worldBeforeZoom = this.screenToWorld(pos.x, pos.y);

    const zoomFactor = 1.1;
    const oldScale = this.camera.scale;

    if (e.deltaY < 0) {
      this.camera.scale *= zoomFactor;
    } else {
      this.camera.scale /= zoomFactor;
    }

    this.camera.scale = Math.min(Math.max(this.camera.scale, 0.1), 10);

    this.camera.x = worldBeforeZoom.worldX - pos.x / this.camera.scale;

    this.camera.y = worldBeforeZoom.worldY - pos.y / this.camera.scale;
    
    this.onCameraChange();
    this.render();
  };

  public undo() {
    const action = this.History.pop();
    if (!action) return;

    this.redoStack.push(action);

    switch (action.type) {
      case "CREATE":
        const createIndex = this.existingShapes.findIndex(
          (s) => s.id === action.shape.id,
        );
        if (createIndex !== -1) {
          this.existingShapes.splice(createIndex, 1);
        }
        deleteElementSender(action.shape.id, this.socket, this.roomId);
        break;
      case "DELETE":
        this.existingShapes.push(action.shape);
        createElementSender(this.socket, action.shape, this.roomId);
        break;
      case "MOVE":
        const shapeToRestore = this.existingShapes.find(
          (s) => s.id === action.shapeId,
        );
        if (shapeToRestore) {
          Object.assign(shapeToRestore, action.oldProps);
          updateElementSender(
            shapeToRestore.id,
            this.socket,
            shapeToRestore,
            this.roomId,
          );
        }
        break;
    }
    this.render();
  }

  public redo() {
    const action = this.redoStack.pop();
    if (!action) return;

    this.History.push(action);

    switch (action.type) {
      case "CREATE":
        this.existingShapes.push(action.shape);
        createElementSender(this.socket, action.shape, this.roomId);
        break;
      case "DELETE":
        const deleteIndex = this.existingShapes.findIndex(
          (s) => s.id === action.shape.id,
        );
        if (deleteIndex !== -1) {
          this.existingShapes.splice(deleteIndex, 1);
        }
        deleteElementSender(action.shape.id, this.socket, this.roomId);
        break;
      case "MOVE":
        const shapeToRestore = this.existingShapes.find(
          (s) => s.id === action.shapeId,
        );
        if (shapeToRestore) {
          Object.assign(shapeToRestore, action.newProps);
          updateElementSender(
            shapeToRestore.id,
            this.socket,
            shapeToRestore,
            this.roomId,
          );
        }
        break;
    }
    this.render();
  }

  private attachEvents() {
    if (this.attachedEvents) return;

    this.attachedEvents = true;

    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("wheel", this.wheelMoveEvent);

    window.addEventListener("keydown", this.keyDownHandler);
  }

  public destroy() {
    this.destroyed = true;

    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("wheel", this.wheelMoveEvent);

    window.removeEventListener("keydown", this.keyDownHandler);
  }
}
