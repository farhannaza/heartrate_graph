import HeartRateMonitor from "./components/heart-rate-monitor"

export default function HeartMonitorPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Patient Heart Rate Monitor</h1>
      <HeartRateMonitor />
    </div>
  )
}

