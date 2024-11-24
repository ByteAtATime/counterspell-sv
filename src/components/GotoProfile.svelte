<script lang="ts">
    import { $userStore as userStore } from "@clerk/astro/client";
    import * as Dialog from "@components/ui/dialog";
    import { Button } from "@components/ui/button";
    import SelectUser from "./SelectUser.svelte";
    import type { User } from "@clerk/astro/server";
    import { displayUser } from "@lib/users/utils";
    import { toast } from "svelte-sonner";

    $: isAdmin = $userStore?.publicMetadata.isAdmin;

    export let mockUser: User;

    let open = false;

    let selectedUser: { id: string; displayName: string } | null = null;

    const onUserSelected = (user: { id: string; displayName: string }) => {
        selectedUser = user;
    };

    const handleGotoProfile = () => {
        if (!selectedUser) {
            return;
        }

        window.location.href = `/profile/${selectedUser.id}`;
        open = false;
        selectedUser = null;
    };
</script>

{#if isAdmin}
    <Dialog.Root bind:open onOpenChange={() => (selectedUser = null)}>
        <Dialog.Trigger asChild let:builder>
            <Button builders={[builder]}>Go to Profile</Button>
        </Dialog.Trigger>
        <Dialog.Content>
            {#if !selectedUser}
                <Dialog.Title>Go to Profile</Dialog.Title>

                <SelectUser {onUserSelected} />
            {:else}
                <Dialog.Title>Going to Profile of {selectedUser.displayName}</Dialog.Title>

                <Dialog.Footer>
                    <Button on:click={handleGotoProfile}>Go!</Button>
                </Dialog.Footer>
            {/if}
        </Dialog.Content>
    </Dialog.Root>
{/if}
