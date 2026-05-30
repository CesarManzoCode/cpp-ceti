"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsList } from "./friends-list";
import { IncomingRequests } from "./incoming-requests";
import { OutgoingRequests } from "./outgoing-requests";
import { UserSearch } from "./user-search";
import type {
  FriendCard,
  PendingRequest,
} from "@/features/friends/queries";

type TabKey = "amigos" | "solicitudes" | "buscar";

interface FriendsTabsProps {
  initialTab: TabKey;
  friends: FriendCard[];
  incoming: PendingRequest[];
  outgoing: PendingRequest[];
  meUsername: string;
}

export function FriendsTabs({
  initialTab,
  friends,
  incoming,
  outgoing,
  meUsername,
}: FriendsTabsProps) {
  const [tab, setTab] = React.useState<TabKey>(initialTab);

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="space-y-5">
      <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto p-1">
        <TabsTrigger value="amigos" className="gap-1.5">
          Amigos
          {friends.length > 0 ? (
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground/80">
              {friends.length}
            </span>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="solicitudes" className="gap-1.5">
          Solicitudes
          {incoming.length > 0 ? (
            <Badge size="sm" className="px-1.5 font-mono tabular-nums">
              {incoming.length}
            </Badge>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="buscar">Buscar</TabsTrigger>
      </TabsList>

      <TabsContent value="amigos" className="mt-5">
        <FriendsList friends={friends} />
      </TabsContent>

      <TabsContent value="solicitudes" className="mt-5 space-y-8">
        <IncomingRequests requests={incoming} />
        <OutgoingRequests requests={outgoing} />
      </TabsContent>

      <TabsContent value="buscar" className="mt-5">
        <UserSearch meUsername={meUsername} />
      </TabsContent>
    </Tabs>
  );
}
