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
} from "../tools/arrow/ArrowTool";
import {
  createCircle,
  previewCircle,
  isPointInsideCircle,
} from "../tools/circle/circleTool";
import {
  createLine,
  previewLine,
  isPointInsideLine,
} from "../tools/line/lineTool";
import {
  createPencil,
  previewPencil,
  isPointOnPencil,
} from "../tools/pencil/pencilTool";
import {
  createRectangle,
  previewRectangle,
  isPointInsideRectangle,
} from "../tools/rectangle/rectangleTool";
import { isPointOnText } from "../tools/text/textTool";
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

  public state = {
    clicked: false,
    startX: 0,
    startY: 0,
    currentStroke: [] as { x: number; y: number }[],
    selectedShapeId: null as string | null,
    isDraggingShape: false,
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
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.roomId = roomId;
    this.socket = socket;
    this.shape = shape;
    this.onTextClick = onTextClick;

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

  private deleteSelectedShape() {
    if (!this.state.selectedShapeId) return;

    const deletedShape = this.existingShapes.find(
      (s) => s.id === this.state.selectedShapeId,
    );

    if (!deletedShape) return;

    deleteElementSender(this.state.selectedShapeId, this.socket, this.roomId);

    this.History.push({ type: "DELETE", shape: structuredClone(deletedShape) });
    this.redoStack = [];

    this.state.selectedShapeId = null;

    this.render();
  }

  private worldToScreen = (worldX: number, worldY: number) => {
    const screenX = (worldX - this.camera.x) * this.camera.scale;
    const screenY = (worldY - this.camera.y) * this.camera.scale;
    return {
      screenX,
      screenY,
      scale: this.camera.scale,
    };
  };

  private screenToWorld(screenX: number, screenY: number) {
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
    this.state.startX = worldCoord.worldX;
    this.state.startY = worldCoord.worldY;
    handleMouseDown(this.state);

    if (this.shape.current === "pencil") {
      this.state.currentStroke = [];

      this.state.currentStroke.push({
        x: worldCoord.worldX,
        y: worldCoord.worldY,
      });
    }

    if (this.shape.current === "text") {
      this.onTextClick(worldCoord.worldX, worldCoord.worldY);
    }

    if (this.shape.current === "move") {
      ((this.state.lastMouseX = pos.x),
        (this.state.lastMouseY = pos.y),
        (this.state.isMovingCamera = true));
    }

    if (this.shape.current === "pointer") {
      let clickedOnShape = false;
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
          this.worldToScreen,
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
      if (this.state.isDraggingShape && this.state.selectedShapeId) {
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
      createElementSender(this.socket, newShape, this.roomId);
      this.History.push({ type: "CREATE", shape: structuredClone(newShape) });
      this.redoStack = [];
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

    this.render();
  };

  public undo() {
    const action = this.History.pop();
    if (!action) return;

    this.redoStack.push(action);

    switch (action.type) {
      case "CREATE":
        deleteElementSender(action.shape.id, this.socket, this.roomId);
        break;
      case "DELETE":
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
        createElementSender(this.socket, action.shape, this.roomId);
        break;
      case "DELETE":
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
