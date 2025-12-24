// lib/api.ts
export async function fetchWithToken(
  endpoint: string,
  bodyData: any = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

  const response = await fetch(
    `http://localhost:5554/api${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...bodyData,
        accessToken: token,
      }),
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Lỗi server" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}
