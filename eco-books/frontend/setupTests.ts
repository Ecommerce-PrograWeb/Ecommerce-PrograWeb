// Carga tipos y matchers para Vitest (amplía expect con toBeInTheDocument, etc.)
import "@testing-library/jest-dom/vitest";

import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());
