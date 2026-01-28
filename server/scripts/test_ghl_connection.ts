import axios from 'axios';

const GHL_ACCESS_TOKEN = "pit-cdd58676-4330-4508-b8cf-16ec5ee18555";

async function testConnection() {
    try {
        console.log("🔌 Testing GHL Connection...");
        
        // Try to fetch location info. 
        // Note: For PIT, this usually returns the location the token is generated for.
        const response = await axios.get(
            'https://services.leadconnectorhq.com/locations/sso/me', // or /locations/
            { 
                headers: { 
                    'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
                    'Version': '2021-07-28' 
                } 
            }
        );
        
        console.log("✅ SUCCESS! Connection Verified.");
        console.log("📍 Location Details:");
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error: any) {
        console.error("❌ Connection Failed:", error.response?.data || error.message);
        
        // Fallback: Try fetching contacts if location endpoint fails (sometimes permissions vary)
        try {
             console.log("🔄 Retrying with Contacts endpoint...");
             const response2 = await axios.get(
                'https://services.leadconnectorhq.com/contacts/?limit=1', 
                { 
                    headers: { 
                        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
                        'Version': '2021-07-28' 
                    } 
                }
            );
            console.log("✅ SUCCESS! Contacts Access Verified.");
            console.log(JSON.stringify(response2.data, null, 2));
        } catch (err2: any) {
            console.error("❌ Contacts Access Failed:", err2.response?.data || err2.message);
        }
    }
}

testConnection();
