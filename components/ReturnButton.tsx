import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
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
            <ArrowLeft size={20} />
        </TouchableWithoutFeedback>
    )
}

export default ReturnButton