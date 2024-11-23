<script lang="ts">
  import type { User } from "@clerk/astro/server";
  import { Input } from "./ui/input";
  import { Button } from "./ui/button";
  import { displayUser } from "$lib/lib/users/utils";

  export let mockUser: User;
  export let onUserSelected: (user: {
    id: string;
    displayName: string;
  }) => void;

  let searchQuery = "";

  const allUsersPromise = fetch("/api/users").then((res) => res.json());

  allUsersPromise.then((data) => {
    console.log(data);
  });
</script>

<div class="flex flex-col items-center">
  <h2 class="text-lg font-semibold">Select a user</h2>

  <Input placeholder="Search for a user" bind:value={searchQuery} />

  <div class="mt-2 flex max-h-[50vh] w-full flex-col gap-2 overflow-auto">
    {#await allUsersPromise}
      <p>Loading...</p>
    {:then users}
      {#if users.length === 0}
        <p>No users found</p>
      {:else}
        {#each users as user}
          <Button
            on:click={() =>
              onUserSelected({ id: user.id, displayName: user.displayName })}
            variant="outline"
          >
            {user.displayName}
          </Button>
        {/each}
      {/if}
    {/await}
  </div>
</div>
