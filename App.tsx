import * as React from "react";
import { View, Text, Platform, Alert } from "react-native";
import {
  LinkingOptions,
  NavigationContainer,
  getStateFromPath,
  useRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";

type RootStackParamList = {
  Home: undefined;
  Orders: { id: string };
};

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["example://", "https://example.com"],
  config: {
    screens: {
      Orders: {
        path: "orders/:id",
      },
      Home: "*",
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url !== null) {
      return url;
    }
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => {
      listener(url);
    };

    const eventListenerSubscription = Linking.addEventListener(
      "url",
      onReceiveURL
    );
    return () => {
      eventListenerSubscription.remove();
    };
  },
};

function OrdersScreen() {
  const route = useRoute<any>();

  const orderId = route?.params?.id;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Orders Screen - #{orderId}</Text>
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  const [notification, setNotification] = React.useState(false);
  const [expoPushToken, setExpoPushToken] = React.useState("");
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  return (
    <>
      <NavigationContainer
        linking={linking}
        onStateChange={(state) =>
          Alert.alert("New navigation state", JSON.stringify(state))
        }
      >
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Orders" component={OrdersScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
