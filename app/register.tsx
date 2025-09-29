import GenderSelect from '@/components/GenderSelect';
import ReturnButton from '@/components/ReturnButton';
import { RefreshCw } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

const { width } = Dimensions.get('window')

const ITEM_COUNT = 3
const SPACING = 20
// 根据公式算出单个头像宽度

const ITEM_SIZE = 130

const avatars = [
  'https://picsum.photos/280/280?random=1',
  'https://picsum.photos/280/280?random=2',
  'https://picsum.photos/280/280?random=3',
]


const BORDER_SIZE = ITEM_SIZE * 1.2 // 边框比头像大一点
const BUTTON_HEIGHT = 32

const Index = () => {
  const scrollX = useSharedValue(0)
  const listRef = useRef<FlatList>(null)

  const [nickname, setNickname] = useState("天边小卖部")

  // 控制旋转的角度
  const rotation = useSharedValue(0)

  const handleRandom = () => {
    rotation.value = rotation.value + 360 // 每次点击加一圈
    // 这里也可以触发随机昵称逻辑
    setNickname("随机昵称 " + Math.floor(Math.random() * 100))
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(`${rotation.value}deg`, {
            duration: 500,
            easing: Easing.linear, // 匀速旋转
          }),
        },
      ],
    }
  })


  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  })

  useEffect(() => {
    // 等列表渲染完后，自动滚到中间
    setTimeout(() => {
      listRef.current?.scrollToIndex({ index: 1, animated: false })
    }, 0)
  }, [])



  return (
    <SafeAreaView className='flex-1 bg-[#fff]'>
      <View className='ml-[20]'>
        <ReturnButton />
      </View>

      <View className='flex flex-wrap mt-[60] ml-[40] relative'>

        <View className='size-[30] bg-[red] rounded-full absolute z-[-1] top-[0] left-[0]'></View>

        <Text style={{ fontSize: 24 }} className='text-[#030303] font-[500] pl-[35]' >hey</Text>

        <Text style={{ fontSize: 24 }} className='text-[#030303] font-[500] '>选张靓照做头像吧</Text>

        <View className='w-[200] h-[40] bg-[blue] rounded-full absolute z-[-1] top-[25] left-[0]'></View>
      </View>


      <View className='mt-[40] relative'>
        <AnimatedFlatList
          ref={listRef}
          data={avatars}
          keyExtractor={(_, i) => String(i)}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_SIZE + SPACING}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: (width - ITEM_SIZE) / 2, // ✅ 正确写法
            height: 154,
            justifyContent: 'center',
            alignItems: 'center',
            columnGap: SPACING,
          }}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: ITEM_SIZE + SPACING,
            offset: (ITEM_SIZE + SPACING) * index,
            index,
          })}
          renderItem={({ item, index }) => (
            <AvatarItem
              item={item}
              index={index}
              scrollX={scrollX}
              onPress={() => {
                listRef.current?.scrollToIndex({ index, animated: true })
              }}
            />
          )}
        />

        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
          pointerEvents="box-none" // 保证可以点击穿透 FlatList
        >
          <View
            style={{
              width: BORDER_SIZE,
              height: BORDER_SIZE,
              borderRadius: BORDER_SIZE / 2,
              borderWidth: 1.5,
              borderColor: "#000", // 黑色边框
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: BUTTON_HEIGHT / 2,
            }}
          >
            <Pressable
              style={{
                position: "absolute",
                bottom: -BUTTON_HEIGHT / 2,
                backgroundColor: '#030303',
                borderRadius: 16,
                paddingHorizontal: 12,
                height: BUTTON_HEIGHT,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => console.log("打开相册")}
            >
              <Text style={{ fontWeight: "bold", color: "#d1f24d" }}>📷 相册</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <GenderSelect />

      <View style={{ borderWidth: 0.5, borderColor: '#ddd' }} className='mt-[40] '></View>


      <View className='items-center mt-[40]'>
        <Text className='text-[#030303] font-[500]'>昵称</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ddd",
            marginTop: 10,
            marginHorizontal: 40,
            borderRadius: 24,
            paddingHorizontal: 16,
            height: 48,
          }}
        >
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="输入昵称"
            style={{ flex: 1, fontSize: 16 }}
          />
          <Pressable onPress={handleRandom}>
            <View className='flex-row items-center gap-x-[4]'>
              <Animated.View style={animatedStyle}>
                <RefreshCw size={20} color="#222" />
              </Animated.View>
              <Text className='text-[#030303] font-[500]'>随机</Text>
            </View>
          </Pressable>
        </View>

        {/* 进入按钮 */}
        <Pressable
          onPress={() => console.log("进入 →")}
          style={{
            marginTop: 100,
            backgroundColor: "#f1f4f9",
            borderRadius: 24,
            width: 200,
            paddingVertical: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>进入 →</Text>
        </Pressable>
      </View>

    </SafeAreaView>
  )
}

const PADDING = (width - ITEM_SIZE) / 2




function AvatarItem({ item, index, scrollX, onPress }) {
  const animatedStyle = useAnimatedStyle(() => {
    const itemCenter = index * (ITEM_SIZE + SPACING) + ITEM_SIZE / 2 + PADDING
    const screenCenter = scrollX.value + width / 2
    const distance = Math.abs(itemCenter - screenCenter)

    const scale = interpolate(
      distance,
      [0, ITEM_SIZE + SPACING],
      [1.2, 0.8],
      Extrapolate.CLAMP
    )

    return { transform: [{ scale }] }
  })



  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          {
            width: ITEM_SIZE,
            height: ITEM_SIZE,
            borderRadius: 999,
            justifyContent: 'center',
            alignItems: 'center',
          },
          animatedStyle,
        ]}
      >
        <Image
          source={{ uri: item }}
          className='size-full rounded-full'
          resizeMode="cover"
        />
      </Animated.View>
    </Pressable>
  )
}

export default Index