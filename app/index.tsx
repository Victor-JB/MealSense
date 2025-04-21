import { Redirect, type Href } from "expo-router";
import { useAuthListener } from "../hooks/useAuthListener";
import LoadingScreen from "../components/LoadingScreen";

export default function Index() {
  const { user, loading } = useAuthListener();

  if (loading) return <LoadingScreen />;

  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href={"/signin"} />;
}
