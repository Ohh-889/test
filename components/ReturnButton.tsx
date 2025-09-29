import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'




const ReturnButton = () => {
    const router = useRouter()

    function handlePress() {
        router.back()
    }

    if (!router.canGoBack()) return <View className='size-10' />

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <ChevronLeft size={25} />
        </TouchableWithoutFeedback>
    )
}

export default ReturnButton