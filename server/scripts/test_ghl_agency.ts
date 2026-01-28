import axios from 'axios';

const GHL_ACCESS_TOKEN = "pit-353abe49-e5bc-445e-b56e-ee5d60900b10";

async function testAgencyToken() {
    try {
        console.log("🔌 Testing GHL Agency Token...");
        
        // 1. Verify User/Identity
        console.log("👉 Step 1: Checking User Identity...");
        const userResp = await axios.get(
            'https://services.leadconnectorhq.com/users/me', 
            { 
                headers: { 
                    'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
                    'Version': '2021-07-28' 
                } 
            }
        ).catch(err => {
            console.log("   User Endpoint Failed:", err.message);
            return null;
        });

        if (userResp) {
            console.log("   ✅ User Verified:", userResp.data.name || userResp.data.email || "Unknown User");
            // console.log(JSON.stringify(userResp.data, null, 2));
        }

        // 2. List Locations (Sub-Accounts) - This is key for Agency Tokens
        console.log("\n👉 Step 2: Listing Locations...");
        // If it's an agency token, it might have access to /locations/ search
        const locationsResp = await axios.get(
            'https://services.leadconnectorhq.com/locations/search?limit=10', 
            { 
                headers: { 
                    'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
                    'Version': '2021-07-28' 
                } 
            }
        );
        
        console.log(`   ✅ Success! Found ${locationsResp.data.locations.length} locations.`);
        locationsResp.data.locations.forEach((loc: any) => {
            console.log(`   - [${loc.id}] ${loc.name} (Business: ${loc.business?.name})`);
        });

    } catch (error: any) {
        console.error("❌ Agency Access Failed:", error.response?.data || error.message);
    }
}

testAgencyToken();
