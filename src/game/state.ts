import type { GameAction, GameState, Material } from "./types";

const MATERIAL_PARAMS: Record<
  Material,
  { baseCost: number; decomposeYears: number }
> = {
  cotton: { baseCost: 20, decomposeYears: 5 },
  polyester: { baseCost: 10, decomposeYears: 200 },
};

const MISS_PRICE_PENALTY = 1;
const POLYESTER_SALARY_HIT_PER_MISS = 0.1;
const MARKDOWN_AMOUNT = 2;
export const LANDFILL_THRESHOLD = 1;
const STORE_BUDGET_MIN = 20;
const STORE_BUDGET_MAX = 30;

export function createInitialState(): GameState {
  return {
    scene: "boardroom",
    material: null,
    price: 0,
    hiddenCost: 0,
    decomposeYears: 0,
    cycles: 0,
  };
}

export function rollStoreBudget(): number {
  return (
    STORE_BUDGET_MIN + Math.random() * (STORE_BUDGET_MAX - STORE_BUDGET_MIN)
  );
}

function applyMarkdownOrLandfill(state: GameState): GameState {
  if (state.price <= LANDFILL_THRESHOLD) {
    return { ...state, scene: "landfill" };
  }
  return {
    ...state,
    price: Math.max(0, state.price - MARKDOWN_AMOUNT),
    cycles: state.cycles + 1,
    scene: "thrift",
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "CHOOSE_MATERIAL": {
      const params = MATERIAL_PARAMS[action.material];
      return {
        ...state,
        material: action.material,
        price: params.baseCost,
        hiddenCost: state.hiddenCost + params.baseCost,
        decomposeYears: params.decomposeYears,
        scene: "factory",
      };
    }

    case "FACTORY_DONE": {
      const priceAfterMisses = Math.max(
        0,
        state.price - action.misses * MISS_PRICE_PENALTY,
      );
      const salaryHit =
        state.material === "polyester"
          ? action.misses * POLYESTER_SALARY_HIT_PER_MISS
          : 0;
      return {
        ...state,
        price: priceAfterMisses,
        hiddenCost: state.hiddenCost + salaryHit,
        scene: "store",
      };
    }

    case "STORE_RESOLVED": {
      const budget = rollStoreBudget();
      return {
        ...state,
        scene: budget >= state.price ? "home" : "thrift",
      };
    }

    case "THRIFT_FOUND": {
      return { ...state, scene: "home" };
    }

    case "THRIFT_NOT_FOUND": {
      return applyMarkdownOrLandfill(state);
    }

    case "RESELL_DONE": {
      const priceAfterMisses = Math.max(
        0,
        state.price - action.misses * MISS_PRICE_PENALTY,
      );
      return applyMarkdownOrLandfill({ ...state, price: priceAfterMisses });
    }

    case "RESTART": {
      return createInitialState();
    }

    default:
      return state;
  }
}
