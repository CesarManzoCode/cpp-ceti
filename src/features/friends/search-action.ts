"use server";

import { z } from "zod";

import { withActionErrorHandling } from "@/lib/action-error";
import { requireSession } from "@/lib/get-session";
import { enforceRateLimit } from "@/lib/rate-limit";
import { parseOrThrow } from "@/lib/validation";
import { searchUsers, type UserSearchResult } from "./queries";

export type SearchActionResult = UserSearchResult[];

const schema = z.object({
  query: z.string().trim().min(2, "Escribe al menos 2 caracteres").max(50),
});

/**
 * Wrap de `searchUsers` como Server Action para llamarla desde el cliente
 * con debounce. Limita a 12 resultados, mínimo 2 caracteres, 30 req/min/user.
 */
export const searchUsersAction = withActionErrorHandling(
  "searchUsersAction",
  async (input: { query: string }): Promise<SearchActionResult> => {
    const session = await requireSession();
    await enforceRateLimit(session.user.id, "search-users");
    const { query } = parseOrThrow(schema, input);
    return searchUsers(session.user.id, query, 12);
  },
);
