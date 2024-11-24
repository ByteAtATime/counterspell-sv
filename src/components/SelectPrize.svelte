<script lang="ts">
  import type { User } from "@clerk/astro/server";
  import { Input } from "./ui/input";
  import { Button } from "./ui/button";
  import { displayUser } from "@lib/users/utils";
    import type { Prize } from "@lib/firebase/types";

  export let onPrizeSelected: (prize: Prize) => void;

  let searchQuery = "";
  let allPrizes: Prize[] = [];
  let filteredPrizes: Prize[] = [];

  const allPrizesPromise = fetch("/api/prizes").then((res) => res.json());

  allPrizesPromise.then((data) => {
    allPrizes = data;
    filteredPrizes = allPrizes;
  });

  $: filteredPrizes = allPrizes.filter((prize) =>
    prize.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
</script>

<div class="flex flex-col items-center">
  <h2 class="text-lg font-semibold">Select a prize</h2>

  <Input placeholder="Search for a prize" bind:value={searchQuery} />

  <div class="mt-2 flex max-h-[50vh] w-full flex-col gap-2 overflow-auto">
    {#await allPrizesPromise}
      <p>Loading...</p>
    {:then prizes}
      {#if filteredPrizes.length === 0}
        <p>No prizes found</p>
      {:else}
        {#each filteredPrizes as prize}
          <Button
            on:click={() => onPrizeSelected(prize)}
            variant="outline"
          >
            {prize.name}
          </Button>
        {/each}
      {/if}
    {/await}
  </div>
</div>
