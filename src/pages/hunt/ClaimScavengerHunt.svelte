<script lang="ts">
  import { Button } from "@components/ui/button";
  import type { Hunt } from "@lib/firebase/types";

  export let hunt: Hunt | undefined;

  let isClaimed = false;

  const claim = async () => {
    await fetch(`/api/hunts/${hunt?.id}/claim`, {
      method: "POST",
    });

    isClaimed = true;
  };
</script>

{#if !hunt}
  <p>Something went wrong!</p>
{:else}
  <Button on:click={claim} disabled={isClaimed}>
    {#if isClaimed}
      Claimed!
    {:else}
      Claim!
    {/if}
  </Button>
{/if}
