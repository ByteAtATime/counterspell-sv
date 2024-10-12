<script lang="ts">
  import type { UserExperience } from "$lib/lib/firebase/xp";
  import * as Popover from "@components/ui/popover";

  export let user: UserExperience;
  export let username: string | null;
  export let rank: number;
</script>

<Popover.Root>
  <Popover.Trigger class="w-full">
    <div
      class="flex items-center justify-between rounded-md bg-muted p-3"
    >
      <div class="flex items-center space-x-3">
        <span class="w-6 text-center text-lg font-semibold">
          {rank}
        </span>
        <span>{username ?? user.id}</span>
      </div>
      <span class="font-semibold">{user.xp} XP</span>
    </div>
  </Popover.Trigger>
  <Popover.Content>
    <h3 class="font-semibold">History</h3>

    <div class="flex flex-col gap-2">
      {#each user.history as entry}
        <div class="flex items-center gap-1">
            <span class="text-sm text-muted-foreground">{entry.reason}</span>
            <span class="ml-auto">+{entry.xp}</span>
        </div>
      {/each}
    </div>
  </Popover.Content>
</Popover.Root>
