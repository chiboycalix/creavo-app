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
  fetchMutedUsers?: () => void;
  fetchBlockedUsers?: () => void;
  mutedUsers?: any;
  blockedUsers?: any;
  setBankAccountDetails?: (bankDetails: any) => void;
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
    fetchSettings: async () => { },
    updateSetting: () => { },
  });

  const [userPrivacy, setUserPrivacy] = useState<boolean>(true);
  const [mutedUsers, setMutedUsers] = useState<any>([]);
  const [blockedUsers, setBlockedUsers] = useState<any>([]);
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
        // throw new Error("Failed to fetch privacy status");
      }

      const data = await response.json();
      setUserPrivacy(data?.data?.isPrivate);
    } catch (error) {
      console.error("Failed to fetch privacy status:", error);
    }
  }, [currentUser?.id]);

  const fetchMutedUsers = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/users/${currentUser?.id}/list-exclusions?type=MUTE`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        // throw new Error("Failed to fetch privacy status");
      }

      const data = await response.json();
      console.log("muted users", data);
      const mutedUsers = data?.data;
      return mutedUsers;
    } catch (error) {
      console.error("Failed to fetch privacy status:", error);
    }
  }, [currentUser?.id]);

  const fetchBlockedUsers = useCallback(async () => {
    try {
      const response = await fetch(
        `${baseUrl}/users/${currentUser?.id}/list-exclusions?type=BLOCK`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        // throw new Error("Failed to fetch privacy status");
      }

      const data = await response.json();
      console.log("blocked users", data);
      const blockedUsers = data?.data;
      return blockedUsers;
    } catch (error) {
      console.error("Failed to fetch privacy status:", error);
    }
  }, [currentUser?.id]);

  const setBankAccountDetails = async (bankDetails: any) => {
    const {accountNumber, bankName, accountName} = bankDetails;
    try {
      const response = await fetch(
        `${baseUrl}/users/${currentUser?.id}/create-payout-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify({
            accountName,
            accountNumber,
            bankName,
          }),
        }
      );

      console.log("bank details", bankDetails);

      console.log("response", response);

      if (!response.ok) {
        throw new Error("Failed to update bank details");
      }
    } catch (error) {
      console.error("Failed to update bank details:", error);
    }
  };

  useEffect(() => {
    if (currentUser?.id) getUserPrivacyStatus();
  }, [getUserPrivacyStatus, currentUser?.id]);

  useEffect(() => {
    const mutedUsers = async () => {
      const users = await fetchMutedUsers();
      setMutedUsers(users);
    };

    const blockedUsers = async () => {
      const users = await fetchBlockedUsers();
      setBlockedUsers(users);
    };

    mutedUsers();
    blockedUsers();
  }, [fetchMutedUsers, fetchBlockedUsers]);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        fetchSettings,
        updateSetting,
        updateUserPrivacy,
        userPrivacy,
        setUserPrivacy,
        fetchMutedUsers,
        fetchBlockedUsers,
        blockedUsers,
        mutedUsers,
        setBankAccountDetails,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
