<script lang="ts">
  import { firestore } from "@lib/firebase";
  import {
    doc,
    collection,
    onSnapshot,
    query,
    orderBy,
    limit,
  } from "firebase/firestore";
  import { onMount } from "svelte";
  import XpLeaderboardUser from "./XPLeaderboardUser.svelte";
  import {
    type UserExperience,
    userExperienceSchema,
  } from "@lib/firebase/types";

  let experiences: UserExperience[] | null = null;

  onMount(() => {
    const experienceCollection = query(
      collection(firestore, "experience"),
      orderBy("xp", "desc"),
      limit(10),
    );

    onSnapshot(experienceCollection, (querySnapshot) => {
      experiences = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return userExperienceSchema.parse({
          id: doc.id,
          xp: data.xp,
          history: data.history,
        });
      });
    });
  });
</script>

{#if !experiences}
  <p>Loading...</p>
{:else}
  <div class="flex flex-col gap-2">
    {#each experiences as experience, i (experience.id)}
      <XpLeaderboardUser {experience} rank={i + 1} />
    {/each}
  </div>
{/if}
