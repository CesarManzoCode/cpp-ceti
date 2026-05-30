"use server";

import { z } from "zod";

import { withActionErrorHandling } from "@/lib/action-error";
import { requireSession } from "@/lib/get-session";
import { parseOrThrow } from "@/lib/validation";
import { searchUsers, type UserSearchResult } from "./queries";

export type SearchActionResult = UserSearchResult[];

const schema = z.object({
  query: z.string().trim().min(1).max(50),
});

/**
 * Wrap de `searchUsers` como Server Action para llamarla desde el cliente
 * con debounce. Limita a 12 resultados y require sesión.
 */
export const searchUsersAction = withActionErrorHandling(
  "searchUsersAction",
  async (input: { query: string }): Promise<SearchActionResult> => {
    const session = await requireSession();
    const { query } = parseOrThrow(schema, input);
    return searchUsers(session.user.id, query, 12);
  },
);
