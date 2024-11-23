<script lang="ts">
  import { $userStore as userStore } from "@clerk/astro/client";
  import * as Dialog from "@components/ui/dialog";
  import { Button } from "@components/ui/button";
  import SelectUser from "./SelectUser.svelte";
  import type { User } from "@clerk/astro/server";
  import { displayUser } from "@lib/users/utils";
  import { Label } from "@components/ui/label";
  import { Input } from "@components/ui/input";
  import { toast } from "svelte-sonner";

  $: isAdmin = $userStore?.publicMetadata.isAdmin;

  export let mockUser: User;

  let open = false;

  let selectedUser: { id: string; displayName: string } | null = null;
  let xpToGrant: number | null = null;
  let reason: string | null = null;

  const onUserSelected = (user: { id: string; displayName: string }) => {
    selectedUser = user;
  };

  const handleSubmit = async () => {
    if (!selectedUser || !xpToGrant || !reason) {
      return;
    }

    const resPromise = fetch(`/api/users/${selectedUser.id}/xp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: Number(xpToGrant), reason }),
    }).then((res) => {
      open = false;
      selectedUser = null;
      xpToGrant = null;
      reason = null;

      return res;
    });

    toast.promise(resPromise, {
      loading: "Granting XP...",
      success: "XP granted!",
      error: "Failed to grant XP!",
    });
  };
</script>

{#if isAdmin}
  <Dialog.Root bind:open onOpenChange={() => (selectedUser = null)}>
    <Dialog.Trigger asChild let:builder>
      <Button builders={[builder]}>Grant XP</Button>
    </Dialog.Trigger>
    <Dialog.Content>
      {#if !selectedUser}
        <Dialog.Title>Grant XP</Dialog.Title>

        <SelectUser {mockUser} {onUserSelected} />
      {:else}
        <Dialog.Title>Granting XP to {selectedUser.displayName}</Dialog.Title>

        <form class="grid gap-4 py-4" on:submit|preventDefault={handleSubmit}>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="amount" class="text-right">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="How much XP are you granting?"
              class="col-span-3"
              bind:value={xpToGrant}
              required
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="reason" class="text-right">Reason</Label>
            <Input
              id="reason"
              placeholder="Why are you granting XP?"
              class="col-span-3"
              bind:value={reason}
              required
            />
          </div>

          <Dialog.Footer>
            <Button type="submit">Grant!</Button>
          </Dialog.Footer>
        </form>
      {/if}
    </Dialog.Content>
  </Dialog.Root>
{/if}
