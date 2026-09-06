import type { Scene, WorldKey } from "./types";

export const SCENE_WORLD: Record<Scene, WorldKey> = {
  boardroom: "boardroom",
  factory: "factory",
  store: "store",
  thrift: "resale",
  home: "home",
  landfill: "landfill",
};

export const WORLD_ASSETS: Record<
  WorldKey,
  { environment: string; collider: string }
> = {
  boardroom: {
    environment: "/worlds/boardroom/environment.spz",
    collider: "/worlds/boardroom/collider.glb",
  },
  factory: {
    environment: "/worlds/factory/factory-env.spz",
    collider: "/worlds/factory/factory-collider.glb",
  },
  store: {
    environment: "/worlds/store/store-env.spz",
    collider: "/worlds/store/store-collider.glb",
  },
  home: {
    environment: "/worlds/home/home-env.spz",
    collider: "/worlds/home/home-collider.glb",
  },
  resale: {
    environment: "/worlds/resale/thrift-env.spz",
    collider: "/worlds/resale/thrift-collider.glb",
  },
  landfill: {
    environment: "/worlds/landfill/landfill-env.spz",
    collider: "/worlds/landfill/landfill-collider.glb",
  },
};

export const SHIRT_MODEL_PATH = "/models/shirt/Ivory-Relaxed-Tee.fbx";
export const SHIRT_MODEL_BASE_PATH = "/models/shirt/";
