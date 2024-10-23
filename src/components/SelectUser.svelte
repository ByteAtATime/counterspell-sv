<script lang="ts">
  import type { User } from "@clerk/astro/server";
  import { MockUserSelecter } from "@lib/users/types";

  export let mockUser: User;
  export let onUserSelected: (user: User) => void;

  const userSelector = new MockUserSelecter(mockUser);

  userSelector.selectUser().then((user) => {
    onUserSelected(user);
  });
</script>

<div class="flex flex-col items-center">
  <h2 class="text-lg font-semibold">Select a user</h2>

  <p class="text-muted-foreground">
    Tap an NFC card onto your phone to select a user.
  </p>
</div>
