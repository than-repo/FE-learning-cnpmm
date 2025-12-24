// lib/jwt.ts
export interface User {
  username: string;
  role: "GV" | "HV";
}

export function decodeToken(token: string): User | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    const username =
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ];
    const role =
      decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];

    if (username && (role === "GV" || role === "HV")) {
      return { username, role };
    }
    return null;
  } catch (error) {
    return null;
  }
}
