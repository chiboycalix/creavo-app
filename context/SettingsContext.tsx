// "use client";

// import { baseUrl } from "@/utils/constant";
// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
//   useCallback,
// } from "react";
// import { useAuth } from "./AuthContext";
// import Cookies from "js-cookie";

// // Define the shape of the settings
// interface SettingsType {
//   allowBrowserNotification: boolean;
//   allowEmailNotification: boolean;
//   allowSocialNotification: boolean;
//   allowMarketplaceNotification: boolean;
//   allowRepostNotification: boolean;
//   allowFollowNotification: boolean;
//   allowLikeNotification: boolean;
//   allowTagNotification: boolean;
//   fetchSettings: () => Promise<void>;
//   updateSetting: (key: keyof SettingsType, value: boolean) => void;
//   updateUserPrivacy?: (value: boolean) => void;
//   userPrivacy?: boolean;
//   setUserPrivacy?: (userPrivacy: boolean) => void;
// }

// // Create context with default values
// const SettingsContext = createContext<SettingsType | undefined>(undefined);

// // Custom hook to use settings
// export const useSettings = () => {
//   const context = useContext(SettingsContext);
//   if (!context) {
//     throw new Error("useSettings must be used within a SettingsProvider");
//   }
//   return context;
// };

// interface SettingsProviderProps {
//   children: ReactNode;
// }

// export const SettingsProvider: React.FC<SettingsProviderProps> = ({
//   children,
// }) => {
//   const [settings, setSettings] = useState<SettingsType>({
//     allowBrowserNotification: false,
//     allowEmailNotification: false,
//     allowSocialNotification: false,
//     allowMarketplaceNotification: false,
//     allowRepostNotification: false,
//     allowFollowNotification: false,
//     allowLikeNotification: false,
//     allowTagNotification: false,
//     fetchSettings: async () => {},
//     updateSetting: () => {},
//   });

//   const [userPrivacy, setUserPrivacy] = useState<boolean>(true);

//   const { currentUser, getCurrentUser } = useAuth();

//   const user = getCurrentUser();

//   // Function to fetch settings from API
//   const fetchSettings = useCallback(async () => {
//     try {
//       const response = await fetch(
//         `${baseUrl}/users/${getCurrentUser()?.id}/get-user-settings`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${Cookies.get("accessToken")}`,
//           },
//         }
//       );
//       const data = await response.json();

//       // setSettings((prev) => ({
//       //   ...prev,
//       //   ...data, // Merge API data with existing state
//       // }));

//       console.log("data", data);
//     } catch (error) {
//       console.error("Failed to fetch settings:", error);
//     }
//   }, [getCurrentUser]);

//   // Function to update a specific setting
//   const updateSetting = async (key: keyof SettingsType, value: boolean) => {
//     try {
//       const response = await fetch(
//         `${baseUrl}/users/${currentUser?.id}/update-user-settings`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ [key]: value }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update setting");
//       }

//       setSettings((prev) => ({
//         ...prev,
//         [key]: value,
//       }));
//     } catch (error) {
//       console.error("Failed to update setting:", error);
//     }
//   };

//   const updateUserPrivacy = async (value: boolean) => {
//     try {
//       const response = await fetch(
//         `${baseUrl}/users/${currentUser?.id}/update-user-privacy`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${Cookies.get("accessToken")}`,
//           },
//           body: JSON.stringify({
//             isPrivate: value,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update setting");
//       }
//     } catch (error) {
//       console.error("Failed to update setting:", error);
//     }
//   };

//   const getUserPrivacyStaus = async () => {
//     try {
//       const response = await fetch(
//         `${baseUrl}/profiles/${currentUser?.id}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update setting");
//       }

//       const data = await response.json();
//       console.log("data", data);
//       setUserPrivacy(data?.data?.isPrivate);

//     } catch (error) {

//     }
//   }

//   getUserPrivacyStaus()

//   // useEffect(() => {
//   //   fetchSettings();
//   // }, [fetchSettings]);

//   return (
//     <SettingsContext.Provider
//       value={{ ...settings, fetchSettings, updateSetting, updateUserPrivacy, userPrivacy, setUserPrivacy }}
//     >
//       {children}
//     </SettingsContext.Provider>
//   );
// };

"use client";

import { baseUrl } from "@/utils/constant";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import Cookies from "js-cookie";

interface SettingsType {
  allowBrowserNotification: boolean;
  allowEmailNotification: boolean;
  allowSocialNotification: boolean;
  allowMarketplaceNotification: boolean;
  allowRepostNotification: boolean;
  allowFollowNotification: boolean;
  allowLikeNotification: boolean;
  allowTagNotification: boolean;
  fetchSettings: () => Promise<void>;
  updateSetting: (key: keyof SettingsType, value: boolean) => void;
  updateUserPrivacy?: (value: boolean) => void;
  userPrivacy?: boolean;
  setUserPrivacy?: (userPrivacy: any) => void;
}

export interface PrivacyType {
  userPrivacy?: boolean;
  setUserPrivacy?: (userPrivacy: boolean) => void;
}

const SettingsContext = createContext<SettingsType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SettingsType>({
    allowBrowserNotification: false,
    allowEmailNotification: false,
    allowSocialNotification: false,
    allowMarketplaceNotification: false,
    allowRepostNotification: false,
    allowFollowNotification: false,
    allowLikeNotification: false,
    allowTagNotification: false,
    fetchSettings: async () => {},
    updateSetting: () => {},
  });

  const [userPrivacy, setUserPrivacy] = useState<boolean>(true);
  const { currentUser, getCurrentUser } = useAuth();

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/users/${getCurrentUser()?.id}/get-user-settings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      console.log("data settings", data);
      setSettings((prev) => ({
        ...prev,
        ...data?.data,
      }));
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  }, [getCurrentUser]);

  const updateSetting = async (key: keyof SettingsType, value: boolean) => {
    try {
      const updatedSettings = {
        ...settings,
        [key]: value,
      };

      const response = await fetch(
        `${baseUrl}/users/${currentUser?.id}/update-user-settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify(updatedSettings),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update setting");
      }

      setSettings(updatedSettings);
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  const updateUserPrivacy = async (value: boolean) => {
    try {
      const response = await fetch(
        `${baseUrl}/users/${currentUser?.id}/update-user-privacy`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify({
            isPrivate: value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update setting");
      }
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  const getUserPrivacyStatus = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/profiles/${currentUser?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch privacy status");
      }

      const data = await response.json();
      setUserPrivacy(data?.data?.isPrivate);
    } catch (error) {
      console.error("Failed to fetch privacy status:", error);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) getUserPrivacyStatus();
  }, [getUserPrivacyStatus, currentUser?.id]);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        fetchSettings,
        updateSetting,
        updateUserPrivacy,
        userPrivacy,
        setUserPrivacy,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
