import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Animated, useWindowDimensions } from "react-native";

import { Button } from "./Button";
import { RemoteImage } from "./RemoteImage";

const PhotoListItem = (props) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const [animValue] = useState(new Animated.Value(0));

  const onPressItem = useCallback(() => {
    navigation.navigate("ImageDetail", { url: props.url });
  }, []);
  const onPressIn = useCallback(() => {
    console.log("in");
    Animated.timing(animValue, {
      duration: 200,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);
  const onPressOut = useCallback(() => {
    Animated.timing(animValue, {
      duration: 200,
      toValue: 0,
      useNativeDriver: true,
    }).start();
    console.log("out");
  }, []);

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1.0, 0.95],
  });

  return (
    <Button
      onPress={onPressItem}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      paddingHorizontal={20}
      paddingVertical={10}>
      <Animated.View style={{ transform: [{ scale: scale }] }}>
        <RemoteImage
          url={props.url}
          style={{ transform: [{ scale: 1 }] }}
          width={width}
          height={width * 1.2}
        />
      </Animated.View>
    </Button>
  );
};

export default PhotoListItem;
