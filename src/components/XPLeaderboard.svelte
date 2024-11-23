<script lang="ts">
  import { firestore } from "@lib/firebase";
  import {
    doc,
    collection,
    onSnapshot,
    query,
    orderBy,
    limit,
    getDocs,
    getDoc,
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
    const experiencesCollection = collection(firestore, "experience");
    const experiencesQuery = query(
      experiencesCollection,
      orderBy("xp", "desc"),
      limit(10)
    );
    // read once, no snapshot
    getDocs(experiencesQuery).then(data => {
      experiences = data.docs.map(doc => {
        const data = doc.data();
        return userExperienceSchema.parse({
          id: doc.id,
          ...data,
        });
      });
    })
    
    const cumulativeDoc = doc(firestore, "experience/cumulative");

    getDoc(cumulativeDoc).then(doc => {
      const data = doc.data();

      cumulativeXp = data?.xp ?? null;
    })
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
