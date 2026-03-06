import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that the URL is a real HTTP/HTTPS URL (not a placeholder)
const isValidUrl = (url) => {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

const isConfigured = isValidUrl(supabaseUrl) && !!supabaseAnonKey && supabaseAnonKey.length > 20;

// Simple stable mock for development
const createMockSupabase = () => {
    const mockQuery = {
        data: [],
        error: null,
        select: function () { return this; },
        eq: function () { return this; },
        order: function () { return this; },
        single: function () { return Promise.resolve({ data: null, error: null }); },
        maybeSingle: function () { return Promise.resolve({ data: null, error: null }); },
        then: function (onFullfilled) {
            return Promise.resolve({ data: [], error: null }).then(onFullfilled);
        }
    };

    return {
        from: () => mockQuery,
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } })
        }
    };
}

if (!isConfigured) {
    console.log('[Supabase] Usando cliente mock (sin credenciales válidas). Para conectar datos reales, configura .env.local con una URL y clave válidas de Supabase.');
}

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockSupabase()

export { isConfigured }
