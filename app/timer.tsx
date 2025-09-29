import React, { useRef, useState } from 'react'
import { Button, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Timer = () => {
    const [time, setTime] = useState(0)

    const [running, setRunning] = useState(false)

    const [record, setRecord] = useState<number[]>([])

    const interval = useRef<number | null>(null)

    function start() {
        setTime(0)
        setRecord([])
        setRunning(true)
        if (interval.current) {
            clearInterval(interval.current)
        }

        interval.current = setInterval(() => {
            setTime((t) => t + 1)
        }, 1)
    }

    function stop() {
        setRunning(false)
        if (interval.current) {
            clearInterval(interval.current)
        }
    }

    function recordTime() {

        if (running) {
            setRecord([...record, time])
        }

    }


    function formatTime(time: number) {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }


    return (
        <SafeAreaView className='flex-1'>



            <View className='flex-row gap-x-2 justify-center'>
                <Button title='Start' onPress={start} />
                <Button title='Stop' onPress={stop} />
                <Button title='Record' onPress={recordTime} />
            </View>

            <Text className='text-center text-2xl font-bold'>{formatTime(time)}</Text>

            <View className='flex-row gap-x-2 justify-center'>
                {record.map((item, index) => (
                    <Text key={index}>{formatTime(item)}</Text>
                ))}
            </View>
        </SafeAreaView>
    )
}

export default Timer