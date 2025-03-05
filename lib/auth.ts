export async function verifyToken(
  token: string
): Promise<{ username: string } | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) return null;
    const user = await response.json();
    return { username: user?.data?.username };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
