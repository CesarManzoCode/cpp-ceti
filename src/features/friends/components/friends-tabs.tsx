"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiscoveryList } from "@/features/discovery/components/discovery-list";
import type { DiscoveryCandidate } from "@/features/discovery/queries";
import { MilestoneFeed } from "@/features/social-feed/components/milestone-feed";
import type { FeedEvent } from "@/features/social-feed/queries";
import { StreakCards } from "@/features/streaks/components/streak-cards";
import type { FriendStreakCard, StreakReminderCard } from "@/features/streaks/queries";
import { FriendsList } from "./friends-list";
import { IncomingRequests } from "./incoming-requests";
import { OutgoingRequests } from "./outgoing-requests";
import { UserSearch } from "./user-search";
import type {
  FriendCard,
  PendingRequest,
} from "@/features/friends/queries";

type TabKey = "amigos" | "solicitudes" | "buscar" | "descubrir" | "actividad" | "rachas";

interface FriendsTabsProps {
  initialTab: TabKey;
  friends: FriendCard[];
  incoming: PendingRequest[];
  outgoing: PendingRequest[];
  meUsername: string;
  meId: string;
  discovery: { candidates: DiscoveryCandidate[]; nextCursor: string | null };
  feed: FeedEvent[];
  streaks: FriendStreakCard[];
  reminders: StreakReminderCard[];
}

export function FriendsTabs({
  initialTab,
  friends,
  incoming,
  outgoing,
  meUsername,
  meId,
  discovery,
  feed,
  streaks,
  reminders,
}: FriendsTabsProps) {
  const [tab, setTab] = React.useState<TabKey>(initialTab);

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="space-y-5">
      <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto p-1">
        <TabsTrigger value="amigos" className="gap-1.5">
          Amigos
          {friends.length > 0 ? (
            <span className="text-[12px] font-bold tabular-nums text-subtle-foreground">
              {friends.length}
            </span>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="solicitudes" className="gap-1.5">
          Solicitudes
          {incoming.length > 0 ? (
            <Badge size="sm" variant="solid" className="tabular-nums">
              {incoming.length}
            </Badge>
          ) : null}
        </TabsTrigger>
        <TabsTrigger value="buscar">Buscar</TabsTrigger>
        <TabsTrigger value="descubrir">Descubrir</TabsTrigger>
        <TabsTrigger value="actividad">Actividad</TabsTrigger>
        <TabsTrigger value="rachas" className="gap-1.5">
          Rachas
          {reminders.some((r) => !r.readAt) ? (
            <Badge size="sm" variant="solid" className="tabular-nums">
              {reminders.filter((r) => !r.readAt).length}
            </Badge>
          ) : null}
        </TabsTrigger>
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

      <TabsContent value="descubrir" className="mt-5">
        <DiscoveryList initialPage={discovery} />
      </TabsContent>

      <TabsContent value="actividad" className="mt-5">
        <MilestoneFeed events={feed} viewerId={meId} />
      </TabsContent>

      <TabsContent value="rachas" className="mt-5">
        <StreakCards streaks={streaks} reminders={reminders} />
      </TabsContent>
    </Tabs>
  );
}
