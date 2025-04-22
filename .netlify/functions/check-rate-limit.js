exports.handler = async (event) => {
    try {
      // Parse request body safely
      let userId;
      try {
        userId = JSON.parse(event.body)?.userId;
      } catch {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid request body' })
        };
      }
  
      // Validate userId
      if (!userId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'User ID required' })
        };
      }
  
      // Simple in-memory store (resets on function restart)
      const submissions = global.submissions || new Map();
      global.submissions = submissions;
  
      const now = Date.now();
      const oneMinute = 60 * 1000;
  
      // Get user's submissions, filter to last minute
      let userSubmissions = submissions.get(userId) || [];
      userSubmissions = userSubmissions.filter(ts => now - ts < oneMinute);
  
      // Add current submission
      userSubmissions.push(now);
      submissions.set(userId, userSubmissions);
  
      const count = userSubmissions.length;
  
      // Rate limit rules
      if (count > 10) {
        return {
          statusCode: 429,
          body: JSON.stringify({
            blocked: true,
            limited: true,
            message: 'Too many submissions. Temporarily banned.'
          })
        };
      }
      if (count > 5) {
        return {
          statusCode: 429,
          body: JSON.stringify({
            blocked: false,
            limited: true,
            message: 'Warning: Slow down, nearing submission limit.'
          })
        };
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          blocked: false,
          limited: false,
          message: 'OK'
        })
      };
    } catch (error) {
      console.error('Rate limit error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' })
      };
    }
  };