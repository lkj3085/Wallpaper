import { FlatList, View } from "react-native";
import { Header } from "../components/Header/Header";
import PhotoListItem from "../components/PhotoListItem";
import { IMAGE_LIST } from "../constant/constant";

const ImageListScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Header>
        <Header.Group>
          <Header.Title title="이미지 리스트" />
        </Header.Group>
      </Header>
      <FlatList
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        data={IMAGE_LIST}
        renderItem={({ item }) => {
          return <PhotoListItem url={item} />;
        }}
      />
    </View>
  );
};

export default ImageListScreen;
