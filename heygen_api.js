// A client for interacting with the HeyGen API.

const HEYGEN_API_KEY = 'Yjg3ZTZkZTljNjM1NGNlNWI1ZDZhY2M5NjViMDQ1ZGUtMTc1NDQ3MjIxNQ=='; // TODO: Move to a secure location
const HEYGEN_API_BASE_URL = 'https://api.heygen.com';

/**
 * Generates a video from text using the HeyGen API.
 * @param {string} text - The text to be spoken in the video.
 * @param {string} avatarId - The ID of the avatar to use.
 * @returns {Promise<string>} - A promise that resolves with the video ID.
 */
async function generateVideo(text, avatarId) {
  const url = `${HEYGEN_API_BASE_URL}/v2/video/generate`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Api-Key': HEYGEN_API_KEY,
  };
  const body = JSON.stringify({
    video_inputs: [
      {
        character: {
          type: 'avatar',
          avatar_id: avatarId,
          avatar_style: 'normal',
        },
        voice: {
          type: 'text_to_speech',
          input_text: text,
          voice_id: '1bd001e7e382424a8b4147e33527a215' // A default voice, can be changed
        },
      },
    ],
    test: true, // Use test mode to avoid consuming credits
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: body,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`HeyGen API error: ${errorData.message}`);
  }

  const data = await response.json();
  return data.data.video_id;
}

/**
 * Checks the status of a video generation task.
 * @param {string} videoId - The ID of the video to check.
 * @returns {Promise<object>} - A promise that resolves with the video status object.
 */
async function checkVideoStatus(videoId) {
  const url = `${HEYGEN_API_BASE_URL}/v1/video_status.get?video_id=${videoId}`;
  const headers = {
    'X-Api-Key': HEYGEN_API_KEY,
  };

  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`HeyGen API error: ${errorData.message}`);
  }

  return await response.json();
}
