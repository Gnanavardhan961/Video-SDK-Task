export const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI3M2ZiZTcxNy0wZTc5LTRjNTEtYTAxZC1kZTM1MzM2ZDdmMDIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIiwiYWxsb3dfbW9kIiwiYWxsb3dfY3JlYXRlIl0sImlhdCI6MTc3MDc5MzUwOCwiZXhwIjoxNzcxMzk4MzA4fQ.NrtiihaFEdJNczWFUkVzunkR1PBgbaEsWn2-6cbVLx0";

export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${token}`, 
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  
  const { roomId } = await res.json();
  return roomId;
};