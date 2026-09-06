export type Material = "cotton" | "polyester";

export type WorldKey =
  | "boardroom"
  | "factory"
  | "store"
  | "home"
  | "resale"
  | "landfill";

export type Scene =
  | "boardroom"
  | "factory"
  | "store"
  | "thrift"
  | "home"
  | "landfill";

export interface GameState {
  scene: Scene;
  material: Material | null;
  price: number;
  hiddenCost: number;
  decomposeYears: number;
  cycles: number;
}

export type GameAction =
  | { type: "CHOOSE_MATERIAL"; material: Material }
  | { type: "FACTORY_DONE"; misses: number }
  | { type: "STORE_RESOLVED" }
  | { type: "THRIFT_FOUND" }
  | { type: "THRIFT_NOT_FOUND" }
  | { type: "RESELL_DONE"; misses: number }
  | { type: "RESTART" };
