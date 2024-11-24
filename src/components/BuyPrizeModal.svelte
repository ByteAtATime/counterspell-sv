<script lang="ts">
    import { $userStore as userStore } from "@clerk/astro/client";
    import * as Dialog from "@components/ui/dialog";
    import { Button } from "@components/ui/button";
    import SelectUser from "./SelectUser.svelte";
    import { toast } from "svelte-sonner";
    import SelectPrize from "./SelectPrize.svelte";
    import type { Prize } from "@lib/firebase/types";
  
    $: isAdmin = $userStore?.publicMetadata.isAdmin;
  
    let open = false;
  
    let selectedUser: { id: string; displayName: string } | null = null;
    let selectedPrize: Prize | null = null;
  
    const onUserSelected = (user: { id: string; displayName: string }) => {
      selectedUser = user;
    };
  
    const handleSubmit = async () => {
      if (!selectedUser || !selectedPrize) {
        return;
      }
  
      const resPromise = fetch(`/api/users/${selectedUser.id}/prize?prizeId=${selectedPrize.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        open = false;
        selectedUser = null;
  
        return res;
      });
  
      toast.promise(resPromise, {
        loading: "Buying prize...",
        success: "Prize purchased!",
        error: "Failed to purchase prize!",
      });
    };
  </script>
  
  {#if isAdmin}
    <Dialog.Root bind:open onOpenChange={() => (selectedUser = null)}>
      <Dialog.Trigger asChild let:builder>
        <Button builders={[builder]}>Buy Prize</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        {#if !selectedUser}
          <Dialog.Title>Buy Prize</Dialog.Title>
  
          <SelectUser {onUserSelected} />
        {:else}
          <Dialog.Title>Buying prize for {selectedUser.displayName}</Dialog.Title>
  
          <form on:submit|preventDefault={handleSubmit}>
            <SelectPrize onPrizeSelected={(prize) => selectedPrize = prize} />
  
            <Dialog.Footer>
              <Button type="submit" disabled={!selectedPrize}>Buy!</Button>
            </Dialog.Footer>
          </form>
        {/if}
      </Dialog.Content>
    </Dialog.Root>
  {/if}
  