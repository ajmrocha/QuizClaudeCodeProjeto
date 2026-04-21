const test = async () => {
  const res = await fetch("http://localhost:3000/api/results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nickname: "testuser",
      track: "beginner",
      roundSize: 10,
      timerEnabled: false,
      durationMs: 5000,
      answers: [
        { qid: "a30179a3-d31e-4099-a2f8-66a7b5fbfbe0", chosen: true, time_ms: 1000 },
        { qid: "c57f26fe-d893-469e-abdd-964c9be7a17e", chosen: true, time_ms: 1000 },
        { qid: "29a6c167-787c-4d22-8007-99b464169da3", chosen: true, time_ms: 1000 },
        { qid: "8885af35-6acf-4c66-8930-9ab434ee75e7", chosen: true, time_ms: 1000 },
        { qid: "0299cfeb-37c9-4e6d-b4e8-3248a0ac89dd", chosen: true, time_ms: 1000 },
        { qid: "625985b6-9908-492f-b243-3040cc01967d", chosen: true, time_ms: 1000 },
        { qid: "2e81be2d-e8ae-4b68-85b0-243bd93103d6", chosen: true, time_ms: 1000 },
        { qid: "604a1677-9581-43a6-85af-a3c335f381bb", chosen: false, time_ms: 1000 },
        { qid: "47f4114a-c9bb-45fd-a61d-57587f7e07aa", chosen: false, time_ms: 1000 },
        { qid: "418ae2d5-1ecc-4734-86b2-f11b3ff7b657", chosen: true, time_ms: 1000 }
      ]
    }),
  });
  console.log(res.status);
  console.log(await res.text());
};
test();
