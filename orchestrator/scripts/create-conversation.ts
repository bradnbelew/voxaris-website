/**
 * Creates a Tavus CVI conversation for testing.
 * Run: npx tsx scripts/create-conversation.ts
 */

const TAVUS_API_KEY = process.env.TAVUS_API_KEY ?? "7f3c93c88c4a44c79f5d969b56bdbd75";
const PERSONA_ID = process.env.TAVUS_PERSONA_ID ?? "";

async function main() {
  if (!PERSONA_ID) {
    console.error("Set TAVUS_PERSONA_ID first. Run: npx tsx scripts/create-persona.ts");
    process.exit(1);
  }

  console.log(`Creating conversation with persona ${PERSONA_ID}...\n`);

  const response = await fetch("https://api.tavus.io/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": TAVUS_API_KEY,
    },
    body: JSON.stringify({
      persona_id: PERSONA_ID,
      conversation_name: `voxaris-demo-${Date.now()}`,
      custom_greeting: "Hey! Welcome to Voxaris. I can show you around and answer any questions. What are you interested in?",
      properties: {
        source: "self-demo",
        site: "voxaris.io",
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed: ${response.status}\n${error}`);
    process.exit(1);
  }

  const conv = await response.json();
  console.log("Conversation created!\n");
  console.log(`Conversation ID: ${conv.conversation_id}`);
  console.log(`Conversation URL: ${conv.conversation_url}`);
  console.log(`\nOpen this URL in your browser to test the avatar.`);
  console.log(`Or embed it on voxaris.io with the loader script.`);
}

main().catch(console.error);
