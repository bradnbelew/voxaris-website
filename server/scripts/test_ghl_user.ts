import axios from 'axios';

const GHL_ACCESS_TOKEN = "pit-cdd58676-4330-4508-b8cf-16ec5ee18555";

async function testUser() {
    try {
        console.log("🔌 Testing GHL Token (User Endpoint)...");
        
        const response = await axios.get(
            'https://services.leadconnectorhq.com/users/me', 
            { 
                headers: { 
                    'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
                    'Version': '2021-07-28' 
                } 
            }
        );
        
        console.log("✅ SUCCESS! User Verified.");
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error: any) {
        console.error("❌ User Access Failed:", error.response?.data || error.message);
    }
}

testUser();
