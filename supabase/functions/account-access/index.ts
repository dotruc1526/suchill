import { createAccountHandler } from './handler.mjs'

const url = Deno.env.get('SUPABASE_URL')!
const secretKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const publishableKey = Deno.env.get('SUPABASE_ANON_KEY')!
const origins = (Deno.env.get('ACCOUNT_ACCESS_ORIGINS') ?? 'http://localhost:8443,http://127.0.0.1:8443,http://localhost:5173,http://127.0.0.1:5173').split(',')
const mailKey = Deno.env.get('RESEND_API_KEY')
const mailFrom = Deno.env.get('ACCOUNT_ACCESS_MAIL_FROM')
Deno.serve(createAccountHandler({ url, secretKey, publishableKey, origins, mailKey, mailFrom }))
