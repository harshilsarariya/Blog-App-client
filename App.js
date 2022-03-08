import React, { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import TabNavigator from "./app/navigation/TabNavigator";
import NoInternet from "./app/components/NoInternet";
import { useNetInfo } from "@react-native-community/netinfo";

const App = () => {
  const [noInternet, setNoInternet] = useState(false);
  const netInfo = useNetInfo();

  const fetchnetInfo = () => {
    const { isConnected, isInternetReachable } = netInfo;
    if (isConnected === false && isInternetReachable === false)
      setNoInternet(true);
    else setNoInternet(false);
  };

  useEffect(() => {
    fetchnetInfo();
  }, [netInfo]);

  if (noInternet) return <NoInternet onRefreshPress={fetchnetInfo} />;

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: "#fff" },
      }}
    >
      <TabNavigator />
    </NavigationContainer>
  );
};

export default App;
