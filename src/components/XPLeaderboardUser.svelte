<script lang="ts">
  import type { UserExperience } from "@lib/firebase/xp";
  import { displayUser } from "@lib/users/utils";
  import * as Popover from "@components/ui/popover";

  export let experience: UserExperience;
  export let rank: number;
  export let username: string|undefined = undefined;
</script>

<Popover.Root>
  <Popover.Trigger class="w-full">
    <div class="flex items-center justify-between rounded-md bg-muted p-3">
      <div class="flex items-center space-x-3">
        <span class="w-6 text-center text-lg font-semibold">
          {rank}
        </span>
        <span>
          {#if !username}
            <span class="text-muted-foreground">Loading...</span>
          {:else}
            <span class="font-semibold">{username}</span>
          {/if}
        </span>
      </div>
      <span class="font-semibold">{experience.xp} XP</span>
    </div>
  </Popover.Trigger>
  <Popover.Content>
    <h3 class="font-semibold">History</h3>

    <div class="flex flex-col gap-2">
      {#each experience.history as entry}
        <div class="flex items-center gap-1">
          <span class="text-sm text-muted-foreground">{entry.reason}</span>
          <span class="ml-auto">{entry.xp > 0 ? "+" : ""}{entry.xp}</span>
        </div>
      {/each}
    </div>
  </Popover.Content>
</Popover.Root>
