import Cookies from "js-cookie";

export const fetchToken = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Agora-Signature": "stridez@123456789",
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
  const jsonResp = await response.json();
  if (!response.ok) {
    throw new Error("Could not generate room credentials from backend");
  } else {
    return jsonResp.data;
  }
};

export const agoraGetAppData = async (channel: string) => {
  try {
    const initUrl = `${process.env.NEXT_PUBLIC_BASEURL}/meetings/${channel}?action=join`;
    const response = await fetch(initUrl, {
      method: "GET",
      headers: {
        "Agora-Signature": "stridez@123456789",
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not generate room credentials from backend");
    }
    const jsonResp = await response.json();
    return jsonResp.data;
  } catch (error) {
    console.log("Internal server error:", error);
  }
};
