import { DrawState } from "../types";

export function handleMouseDown(state: DrawState) {
  state.clicked = true;
};

export function handleMouseUp(state: DrawState) {
    state.clicked = false;
};