import { baseApi } from "./baseApi";

// Derive the file-server origin from the API base URL, e.g.
// "https://ishop.cheat.casa/api/v1" -> "https://ishop.cheat.casa".
// Uploaded avatars are often saved as a relative path ("/uploads/xyz.png")
// rather than a full URL, and a bare relative path in an <img src> resolves
// against the CURRENT page (localhost:5173) instead of the API server,
// which 404s and shows a broken-image icon.
const FILE_ORIGIN = (import.meta.env.VITE_BASE_ISHOP_URL || "").replace(
  /\/api\/v1\/?$/,
  ""
);

const toAbsoluteUrl = (value) => {
  if (!value || typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined; // treat "" as "no avatar", not a broken one
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed; // already absolute
  }
  return `${FILE_ORIGIN}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
};

// The backend's /users/me response shape isn't fully predictable (it may
// nest the user under `data`, or name the avatar field something other
// than `profile`). This normalizes whatever comes back into a consistent
// { ...user, profile } shape so components can always read `.profile`
// safely, regardless of which field the API actually used.
const extractProfileImage = (user) => {
  if (!user) return undefined;
  const raw =
    [
      user.profile,
      user.avatar,
      user.avatarUrl,
      user.image,
      user.imageUrl,
      user.photo,
      user.photoUrl,
      user.picture,
    ].find((v) => typeof v === "string" && v.trim() !== "") ?? undefined;
  return toAbsoluteUrl(raw);
};

export const profileApi = baseApi.injectEndpoints({
   
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: () => `/users/me`,
      transformResponse: (response) => {
        // some APIs wrap the user in { data: {...} } or { user: {...} },
        // others return the user object directly
        const user = response?.data ?? response?.user ?? response;
        return {
          ...user,
          profile: extractProfileImage(user),
        };
      },
    })
  })
})

export const {
  useUserProfileQuery
}= profileApi;