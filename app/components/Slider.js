import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Image,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";

const width = Dimensions.get("window").width - 20;

let cureentSlideIndex = 0;
let intervalId;

export default function Slider({ data, title, onSlidePress }) {
  const [dataToRender, setDataToRender] = useState([]);
  const [visibleSideIndex, setVisibleSideIndex] = useState(0);
  const [activeSideIndex, setActiveSideIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    cureentSlideIndex = viewableItems[0]?.index || 0;
    setVisibleSideIndex(cureentSlideIndex);
  });

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const flatList = useRef();

  const handleScrollTo = (index) => {
    flatList.current.scrollToIndex({ animated: false, index });
  };

  const startSlider = () => {
    if (cureentSlideIndex <= dataToRender.length - 2) {
      intervalId = setInterval(() => {
        flatList.current.scrollToIndex({
          animated: true,
          index: cureentSlideIndex + 1,
        });
      }, 4000);
    } else {
      pausSlider();
    }
  };

  const pausSlider = () => {
    clearInterval(intervalId);
  };

  useEffect(() => {
    if (dataToRender.length && flatList.current) {
      startSlider();
    }

    return () => {
      pausSlider();
    };
  }, [dataToRender.length]);

  useEffect(() => {
    const newData = [[...data].pop(), ...data, [...data].shift()];
    setDataToRender([...newData]);
  }, [data.length]);

  useEffect(() => {
    const length = dataToRender.length;
    // reset slide to first item
    if (visibleSideIndex === length - 1 && length) handleScrollTo(1);

    // reset slide to last item
    if (visibleSideIndex === 0 && length) handleScrollTo(length - 2);

    const firstSlide = cureentSlideIndex === 0;
    const lastSlide = cureentSlideIndex === length - 1;

    if (lastSlide && length) setActiveSideIndex(0);
    else if (firstSlide && length) setActiveSideIndex(length - 2);
    else setActiveSideIndex(cureentSlideIndex - 1);
  }, [visibleSideIndex]);

  const renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={() => onSlidePress(item)}>
        <View>
          <Image source={{ uri: item.thumbnail }} style={styles.sliderImage} />
          <View style={{ width, marginTop: 5 }}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderHead}>
        <Text style={{ fontWeight: "700", color: "#383838", fontSize: 22 }}>
          {title}
        </Text>
        <View style={styles.slideIndicatorContainer}>
          <SlideIndicators data={data} activeSideIndex={activeSideIndex} />
        </View>
      </View>
      <FlatList
        ref={flatList}
        data={dataToRender}
        keyExtractor={(item, index) => item.id + index}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={1}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        onScrollBeginDrag={pausSlider}
        onScrollEndDrag={startSlider}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={renderItem}
      />
    </View>
  );
}

const SlideIndicators = ({ data, activeSideIndex }) =>
  data.map((item, index) => {
    return (
      <View
        style={[
          styles.slides,
          {
            backgroundColor:
              activeSideIndex === index ? "#383838" : "transparent",
          },
        ]}
        key={item.id}
      ></View>
    );
  });

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width,
  },
  sliderHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  title: {
    fontWeight: "700",
    color: "#383838",
    fontSize: 20,
  },
  slideIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  slides: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    marginLeft: 5,
  },
  sliderImage: {
    width,
    height: width / 1.7,
    borderRadius: 7,
  },
});
