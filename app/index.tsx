import { Field, useForm } from '@/components/form/src'
import Form from '@/components/form/src/react/components/Form'
import ReturnButton from '@/components/ReturnButton'
import { useCaptcha } from '@/hooks/use-captcha'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import type { TextInputProps } from 'react-native'
import { Image, Keyboard, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type FormInput = {
    phone: string;
    code: string;
}

type InputProps = TextInputProps & {
    trailing?: React.ReactNode
}

export const Input = (props: InputProps) => {
    const { trailing, ...rest } = props

    const [focused, setFocused] = useState(false)


    function handleFocus() {
        setFocused(true)
    }

    function handleBlur() {
        setFocused(false)
    }

    return (
        <View
            className={`w-full h-[44] rounded-full px-[24] 
        flex-row items-center
      ${focused ? 'border-2 border-[#030303]' : 'border-2 border-[#dddddd]'}`}
        >
            <TextInput
                {...rest}
                className="flex-1"
                onFocus={handleFocus}
                onBlur={handleBlur}
                selectionColor="#030303"
                underlineColorAndroid="transparent" />

            {trailing}
        </View>
    )
}


const Login = () => {
    const [allow, setAllow] = useState(false)

    const [form] = useForm<FormInput>()

    const { getCaptcha, isCounting, label, } = useCaptcha()

    const router = useRouter()

    function closeKeyboard() {
        Keyboard.dismiss()
    }

    function toggleAllow() {
        setAllow(!allow)
    }

    function judgeAllow() {
        if (!allow) {

            console.log('请同意用户服务协议和隐私政策');

            return false
        }

        return true
    }

    function handleSubmit() {

        const isAllow = judgeAllow()

        if (!isAllow) {
            return
        }

        const values = form.getFieldsValue()

        console.log(values)

        router.replace('/timer')
    }

    function switchWechat() {
        const isAllow = judgeAllow()

        if (!isAllow) {
            return
        }

        console.log('切换到微信登录')
    }

    function handleGetCaptcha() {
        const phone = form.getFieldValue('phone')

        getCaptcha(phone, () => {
            console.log('请输入正确的手机号')
        })
    }

    return (
        <TouchableWithoutFeedback onPress={closeKeyboard}>
            <View className='flex-1 bg-[#fff] relative'>
                <View className='w-full h-[300] bg-red-500 z-0 absolute top-0 left-0 ' />

                <SafeAreaView className='flex-1'>
                    <View className='flex justify-between px-2 flex-row items-center'>
                        <ReturnButton />

                        <Text className='text-lg font-bold'>其他登录方式</Text>

                        <View className='size-10' />
                    </View>

                    <Form form={form} component={false}>
                        <View className='px-[40] items-center mt-[120] justify-center'>

                            <View className='size-[90] bg-[#d9d9d9]' />

                            <View className='flex items-center mt-[80] gap-y-[20] w-full'>
                                <Field trigger='onChangeText' controlMode='controlled' name='phone'>
                                    <Input />
                                </Field>

                                <Field trigger='onChangeText' controlMode='controlled' name='code'>
                                    <Input
                                        maxLength={6}
                                        trailing={<TouchableWithoutFeedback disabled={isCounting} onPress={handleGetCaptcha}>
                                            <Text suppressHighlighting style={{ textAlign: "right" }} className='text-[#030303] w-[80]  font-bold'>{label}</Text>
                                        </TouchableWithoutFeedback>}
                                    />
                                </Field>
                            </View>

                            <View className='flex flex-row h-[49]   mt-[60] gap-x-[12]'>
                                <TouchableWithoutFeedback onPress={handleSubmit}>
                                    <View className="flex-[5] rounded-full bg-[#030303] items-center justify-center">
                                        <Text className="text-[#d1f24d] font-bold">登录</Text>
                                    </View>
                                </TouchableWithoutFeedback>

                                <TouchableWithoutFeedback onPress={switchWechat}>
                                    <View className="flex-[3] flex-row gap-x-[6] rounded-full bg-[#f1f4f9] items-center justify-center">
                                        <View className='rounded-full items-center justify-center bg-[#222222] size-[25]'>
                                            <Image
                                                source={require('@/assets/images/wexin.png')}
                                                className='size-[20]' />
                                        </View>

                                        <Text className="text-[#222222] font-bold">换微信</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            <View className='flex flex-row mt-[20]  gap-x-[6] items-center flex-wrap px-[24] justify-center'>
                                <TouchableWithoutFeedback onPress={toggleAllow}>
                                    <View style={{ backgroundColor: allow ? '#030303' : '#f1f4f9' }} className='size-[20] rounded-full items-center justify-center'>
                                        <Image
                                            source={require('@/assets/images/duihao.png')}
                                            className='size-[16]' />
                                    </View>
                                </TouchableWithoutFeedback>

                                <Text className='text-[#797979]'>登录即代表您已同意</Text>

                                <TouchableWithoutFeedback>
                                    <Text suppressHighlighting className='text-[#030303] font-bold'>《用户服务协议》</Text>
                                </TouchableWithoutFeedback>

                                <Text className='text-[#797979]'>和</Text>

                                <TouchableWithoutFeedback>
                                    <Text suppressHighlighting className='text-[#030303] font-bold'>《隐私政策》</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </Form>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Login