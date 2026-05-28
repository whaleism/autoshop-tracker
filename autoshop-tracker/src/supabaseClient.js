import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kfwyihkddebzlsgszymm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmd3lpaGtkZGViemxzZ3N6eW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjMxMTAsImV4cCI6MjA5NTUzOTExMH0.PHzHeNMdz1exYMq5cx-QDRdfPNGPn72z1GGFbPGMVIM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
