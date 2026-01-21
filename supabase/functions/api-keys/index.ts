import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple hash function for API key storage
async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Generate random bytes
function generateRandomBytes(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Get auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create authenticated client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user's dealership
    const { data: profile } = await supabase
      .from("profiles")
      .select("dealership_id")
      .eq("user_id", user.id)
      .single();

    if (!profile?.dealership_id) {
      return new Response(
        JSON.stringify({ error: "No dealership associated with user" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, ...body } = await req.json();

    switch (action) {
      case "generate": {
        const { name } = body;
        
        if (!name || typeof name !== "string" || name.trim().length === 0) {
          return new Response(
            JSON.stringify({ error: "Key name is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Generate the key
        const prefix = "sk_live_";
        const randomPart = generateRandomBytes(24);
        const fullKey = `${prefix}${randomPart}`;
        
        // Hash for storage
        const hash = await hashKey(fullKey);
        const displayPrefix = `${prefix}...${randomPart.slice(-8)}`;

        // Insert into database
        const { error: insertError } = await supabase.from("api_keys").insert({
          name: name.trim().slice(0, 100),
          prefix: displayPrefix,
          hash,
          organization_id: profile.dealership_id,
        });

        if (insertError) {
          console.error("Insert error:", insertError);
          return new Response(
            JSON.stringify({ error: "Failed to create API key" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, key: fullKey }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "revoke": {
        const { id } = body;
        
        if (!id) {
          return new Response(
            JSON.stringify({ error: "Key ID is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: deleteError } = await supabase
          .from("api_keys")
          .delete()
          .eq("id", id)
          .eq("organization_id", profile.dealership_id);

        if (deleteError) {
          console.error("Delete error:", deleteError);
          return new Response(
            JSON.stringify({ error: "Failed to revoke API key" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "list": {
        const { data: keys, error: listError } = await supabase
          .from("api_keys")
          .select("id, name, prefix, created_at, last_used_at")
          .eq("organization_id", profile.dealership_id)
          .is("revoked_at", null)
          .order("created_at", { ascending: false });

        if (listError) {
          console.error("List error:", listError);
          return new Response(
            JSON.stringify({ error: "Failed to fetch API keys" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ keys: keys || [] }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
