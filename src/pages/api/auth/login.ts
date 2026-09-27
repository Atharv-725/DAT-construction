import type { APIRoute } from 'astro';
import { authenticateCustomer } from '../../../lib/authStore';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email address and password are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userProfile = authenticateCustomer(email, password);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Signed in successfully. Redirecting...',
        user: userProfile
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Invalid email or password.'
      }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
