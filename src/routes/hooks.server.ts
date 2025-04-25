import { supabase } from '$lib/supabase';
import type { Session } from '@supabase/supabase-js';

const PROTECTED_ROUTES = ['/gallery', '/create'];
const ADMIN_EMAIL = 'w.v.seminsky@gmail.com';

// Custom logger to control verbosity based on user
function createLogger(isAdmin: boolean) {
  return {
    log: (...args: any[]) => {
      if (isAdmin) {
        console.log(...args);
      }
    },
    error: (...args: any[]) => {
      console.error(...args); // Errors always logged for debugging
    },
    info: (...args: any[]) => {
      console.info(...args); // General info always logged
    }
  };
}

export const handle = async ({ event, resolve }) => {
  let session: Session | null = null;

  // Create logger based on whether the user is admin (determined after session is set)
  let logger = createLogger(false);

  try {
    const cookieHeader = event.request.headers.get('cookie');
    logger.info('Hooks session check at:', new Date().toISOString());

    const cookies = cookieHeader
      ? Object.fromEntries(
          cookieHeader.split('; ').map((c) => {
            const [key, value] = c.split('=');
            return [key, value];
          })
        )
      : {};
    const sbAccessToken = cookies['sb-access-token'];
    const sbRefreshToken = cookies['sb-refresh-token'];

    // Verbose logging for admin only (will check after session is set)
    if (sbAccessToken && sbRefreshToken) {
      logger.log('Supabase cookies:', {
        sbAccessToken: !!sbAccessToken,
        sbRefreshToken: !!sbRefreshToken
      });
      logger.log('Cookie lengths:', {
        accessToken: sbAccessToken.length,
        refreshToken: sbRefreshToken.length
      });
    }

    if (event.url.pathname === '/auth/callback') {
      logger.log('Handling auth callback');
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        logger.error('Callback session error:', error.message);
      } else {
        session = data.session;
        logger.log('Callback session:', !!session, session?.user?.email);
      }
    }

    if (!session && sbAccessToken && sbRefreshToken) {
      logger.log('Attempting to set session with cookies');
      const { data, error } = await supabase.auth.setSession({
        access_token: sbAccessToken,
        refresh_token: sbRefreshToken
      });
      if (error) {
        logger.error('Error setting session:', error.message);
        const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          logger.error('Error refreshing session:', refreshError.message);
        } else {
          session = refreshedData.session;
          logger.log('Session refreshed:', !!session, session?.user?.email);
        }
      } else {
        session = data.session;
        logger.log('Session set:', !!session, session?.user?.email);
      }
    }

    if (!session) {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        logger.error('Error fetching session:', error.message);
      } else {
        session = data.session;
        logger.log('Supabase session data:', session ? 'Session exists' : 'No session');
      }
    }

    // Update logger based on admin status
    const isAdmin = session?.user?.email === ADMIN_EMAIL;
    logger = createLogger(isAdmin);

    logger.log('Session details:', session?.user ? {
      user: true,
      email: session.user.email
    } : 'No valid user in session.');

    event.locals.session = session;
    logger.info('Final locals.session:', session?.user ? 'Valid user session set' : 'Null or invalid');

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      event.url.pathname.startsWith(route)
    );

    if (
      isProtectedRoute &&
      (!session || !session.user) &&
      event.url.pathname !== '/' &&
      !event.url.searchParams.has('redirected')
    ) {
      logger.info('Redirecting: No valid session for protected route', event.url.pathname);
      const redirectTo = encodeURIComponent(event.url.pathname + event.url.search);
      return new Response(null, {
        status: 303,
        headers: { Location: `/?redirect=${redirectTo}&redirected=true` }
      });
    }
  } catch (err) {
    logger.error('Unexpected error in auth check:', err);
    session = null;
    event.locals.session = null;
  }

  const response = await resolve(event);

  if (session) {
    const { data: { session: updatedSession } } = await supabase.auth.getSession();
    if (updatedSession) {
      const cookieOptions = 'Path=/; SameSite=Lax; Max-Age=31536000';
      response.headers.append('set-cookie', `sb-access-token=${updatedSession.access_token}; ${cookieOptions}`);
      response.headers.append('set-cookie', `sb-refresh-token=${updatedSession.refresh_token}; ${cookieOptions}`);
      logger.log('Cookies set in response:', {
        accessToken: !!updatedSession.access_token,
        refreshToken: !!updatedSession.refresh_token
      });
    }
  }

  return response;
};