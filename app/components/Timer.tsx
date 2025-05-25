interface TimerProps {
  time: number
}

export default function Timer({ time }: TimerProps) {
  return (
    <p className="mt-2 text-white text-xl font-bold">
      You have {time} seconds!
    </p>
  )
}
