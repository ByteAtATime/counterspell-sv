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
  let cumulativeXp: number | null = null;

  onMount(() => {
    const experienceCollection = query(
      collection(firestore, "experience"),
      orderBy("xp", "desc"),
      limit(10),
    );

    onSnapshot(experienceCollection, (querySnapshot) => {
      experiences = querySnapshot.docs.map((doc) => {
        if (doc.id === "cumulative") return null;

        const data = doc.data();

        return userExperienceSchema.parse({
          id: doc.id,
          xp: data.xp,
          history: data.history,
        });
      }).filter(x => x !== null);
    });

    const cumulativeDoc = doc(firestore, "experience/cumulative");

    onSnapshot(cumulativeDoc, (doc) => {
      const data = doc.data();

      cumulativeXp = data?.xp ?? null;
    });
  });
</script>

{#if !experiences}
  <p>Loading...</p>
{:else}
  <h2 class="font-semibold text-xl">Leaderboard</h2>

  {#if cumulativeXp !== null}
    <p class="text-muted-foreground mb-2">Global XP Total: {cumulativeXp}</p>
  {/if}

  <div class="flex flex-col gap-2">
    {#each experiences as experience, i (experience.id)}
      <XpLeaderboardUser {experience} rank={i + 1} />
    {/each}
  </div>
{/if}
