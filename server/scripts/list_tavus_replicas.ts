import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;

if (!TAVUS_API_KEY) {
    console.error("❌ Missing TAVUS_API_KEY in .env");
    process.exit(1);
}

async function listReplicas() {
    console.log("\n🎭 Fetching Available Tavus Replicas...\n");

    try {
        const response = await axios.get(
            'https://tavusapi.com/v2/replicas',
            {
                headers: {
                    'x-api-key': TAVUS_API_KEY
                }
            }
        );

        const replicas = response.data.data || response.data;

        if (!replicas || replicas.length === 0) {
            console.log("No replicas found. You need to create one in the Tavus dashboard first.");
            return;
        }

        console.log("═══════════════════════════════════════════════════════");
        console.log("Available Replicas:");
        console.log("═══════════════════════════════════════════════════════\n");

        replicas.forEach((replica: any, index: number) => {
            console.log(`${index + 1}. ${replica.replica_name || replica.name || 'Unnamed'}`);
            console.log(`   🆔 ID: ${replica.replica_id}`);
            console.log(`   📊 Status: ${replica.status || 'unknown'}`);
            if (replica.created_at) {
                console.log(`   📅 Created: ${new Date(replica.created_at).toLocaleDateString()}`);
            }
            console.log("");
        });

        console.log("═══════════════════════════════════════════════════════");
        console.log("\n💡 Use one of these replica IDs in your persona creation.");
        console.log("   Add to .env: TAVUS_VOXARIS_REPLICA_ID=<replica_id>");

    } catch (error: any) {
        console.error("❌ Error fetching replicas:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

async function listPersonas() {
    console.log("\n👤 Fetching Existing Personas...\n");

    try {
        const response = await axios.get(
            'https://tavusapi.com/v2/personas',
            {
                headers: {
                    'x-api-key': TAVUS_API_KEY
                }
            }
        );

        const personas = response.data.data || response.data;

        if (!personas || personas.length === 0) {
            console.log("No personas found.");
            return;
        }

        console.log("═══════════════════════════════════════════════════════");
        console.log("Existing Personas:");
        console.log("═══════════════════════════════════════════════════════\n");

        personas.forEach((persona: any, index: number) => {
            console.log(`${index + 1}. ${persona.persona_name || 'Unnamed'}`);
            console.log(`   🆔 ID: ${persona.persona_id}`);
            console.log(`   🎭 Replica: ${persona.default_replica_id || 'none'}`);
            console.log("");
        });

    } catch (error: any) {
        console.error("❌ Error fetching personas:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

async function main() {
    await listReplicas();
    await listPersonas();
}

main();
