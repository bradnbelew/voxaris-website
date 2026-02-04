import axios from 'axios';

const TAVUS_API_KEY = 'd08bb24ac42f4ec4b621345a9d179f9d';
const PERSONA_ID = 'pf0d43ed3051';

async function addGreeting() {
    console.log("🎤 Adding greeting to Sophia...");

    const payload = [
        {
            op: "replace",
            path: "/greeting",
            value: "Hey! So glad you stopped by Orlando Art of Surgery. I'm Sophia - think of me as your personal guide to feeling amazing in your own skin. Are you exploring something specific today, like maybe smoothing out some lines, adding a little volume, or just curious about what's possible?"
        }
    ];

    try {
        const response = await axios.patch(
            `https://tavusapi.com/v2/personas/${PERSONA_ID}`,
            payload,
            {
                headers: {
                    'x-api-key': TAVUS_API_KEY,
                    'Content-Type': 'application/json-patch+json'
                }
            }
        );

        console.log("✅ Greeting added!");
        console.log("Greeting:", response.data.greeting);
    } catch (error: any) {
        console.error("❌ Error:", error.response?.data || error.message);
    }
}

addGreeting();
