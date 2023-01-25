import { ActivityIndicator, useWindowDimensions, View } from "react-native";
import { Typography } from "../components/Typography";
import { Header } from "../components/Header/Header";
import { useCallback, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RemoteImage } from "../components/RemoteImage";
import { Button } from "../components/Button";
import { Icon } from "../components/Icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { useDispatch, useSelector } from "react-redux";
import { onClickFavorite } from "../action/favorite";

const ImageDetailScreen = (props) => {
  const navigation = useNavigation();
  const route = useRoute();

  const onPressBack = useCallback(() => {
    navigation.goBack();
  }, []);

  const { width } = useWindowDimensions();

  const [downloading, setDownloading] = useState(false);

  const isFavorite = useSelector((state) => {
    return (
      state.favorite.favoriteList.filter((item) => item === route.params.url)
        .length > 0
    );
  });

  const dispatch = useDispatch();

  const onPressFavorite = useCallback(() => {
    // console.log("onPressFavorite");
    dispatch(onClickFavorite(route.params.url));
  }, []);

  const onPressDownload = useCallback(async () => {
    setDownloading(true);
    const downloadResumable = FileSystem.createDownloadResumable(
      route.params.url,
      `${FileSystem.documentDirectory}${new Date().getMilliseconds()}.jpg`
    );
    try {
      const { uri } = await downloadResumable.downloadAsync();
      console.log("다운로드 완료", uri);

      const permissionResult = await MediaLibrary.getPermissionsAsync(true);
      console.log("결과", permissionResult);
      if (permissionResult.status === "denied") {
        setDownloading(false);
        return;
      }
      if (permissionResult.status === "undetermined") {
        const requestResult = await MediaLibrary.requestPermissionsAsync();
        console.log(requestResult);
        if (requestResult.status === "denied") {
          setDownloading(false);
          return;
        }
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.createAlbumAsync(
        "my first album",
        asset,
        false
      );

      console.log(album);
    } catch (ex) {}
    setDownloading(false);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header>
        <Header.Group>
          <Header.Icon iconName={"arrow-back"} onPress={onPressBack} />
          <Header.Title title="상세 이미지" />
        </Header.Group>

        <Header.Icon
          iconName={isFavorite ? "heart" : "heart-outline"}
          onPress={onPressFavorite}
        />
      </Header>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <RemoteImage
          url={route.params.url}
          width={width}
          height={width * 1.5}
        />
      </View>
      <Button onPress={onPressDownload}>
        <View style={{ paddingBottom: 24, backgroundColor: "black" }}>
          {downloading ? (
            <View
              style={{
                height: 52,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <ActivityIndicator size={"large"} color="black" />
            </View>
          ) : (
            <View
              style={{
                height: 52,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Typography fontSize={18} color={"white"}>
                다운로드
              </Typography>
              <Icon name="download" size={24} color={"white"} />
            </View>
          )}
        </View>
      </Button>
    </View>
  );
};

export default ImageDetailScreen;
