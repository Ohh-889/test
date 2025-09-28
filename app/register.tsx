import ReturnButton from '@/components/ReturnButton';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Index = () => {
  return (
    <SafeAreaView className='flex-1'>
      <View className='ml-[20]'>
        <ReturnButton />
      </View>

      <View className='flex flex-wrap mt-[60] ml-[40] relative'>

        <View className='size-[40] bg-[red] rounded-full absolute z-[-1] top-[0] left-[0]'></View>

        <Text className='text-[#030303] font-bold pl-[15]' >hey</Text>

        <Text className='text-[#030303] font-bold '>选张靓照做头像吧</Text>

        <View className='w-[120] h-[40] bg-[blue] rounded-full absolute z-[-1] top-[15] left-[0]'></View>



      </View>

    </SafeAreaView>
  )
}

export default Index