import React, { useState } from "react"
import { Pressable, Text, View } from "react-native"
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated"

const GENDER_OPTIONS = [
    { key: "male", label: "♂ " },
    { key: "female", label: "♀ " },
]

const GenderSelect = () => {
    const [selected, setSelected] = useState("male")

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 40,
            }}
        >
            {GENDER_OPTIONS.map((option) => (
                <GenderButton
                    key={option.key}
                    option={option}
                    selected={selected === option.key}
                    onPress={() => setSelected(option.key)}
                />
            ))}
        </View>
    )
}

const GenderButton = ({ option, selected, onPress }) => {
    const width = useSharedValue(selected ? 210 : 140)


    React.useEffect(() => {
        width.value = withTiming(selected ? 210 : 140, {
            duration: 300,            // 动画时长 300ms
            easing: Easing.out(Easing.ease), // 缓动函数，可选
        })

    }, [selected])

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: width.value,

        }
    })

    return (
        <Pressable onPress={onPress} style={{ marginHorizontal: 10 }}>
            <Animated.View
                style={[
                    {
                        height: 48,
                        borderRadius: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: selected ? "#030303" : "#f1f4f9",
                        paddingHorizontal: 12,
                    },
                    animatedStyle,
                ]}
            >
                <Text
                    style={{
                        color: selected ? "#d1f24d" : "#222",
                        fontWeight: "bold",
                    }}
                >
                    {option.label}
                </Text>
            </Animated.View>
        </Pressable>
    )
}

export default GenderSelect
