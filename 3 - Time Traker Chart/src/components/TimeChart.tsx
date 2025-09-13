import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS , ArcElement , Tooltip , Legend } from 'chart.js'

ChartJS.register(ArcElement , Tooltip , Legend);

interface Props {
    data: { activity:string, hours:number }[]
}

function TimeChart({ data }:Props) {
    
    const chartData = {
        labels: data.map((d) => d.activity),
        datasets:[
            {
                label:"Hours",
                data:data.map((d) => d.hours),
                backgroundColor: [
                    '#FF6384' , '#36A2EB' , '#FFCE56' , '#34D399' , '#A78BFA',
                ],
                borderWidth: 1,
            }
        ]
    }
    
  return <Pie data={chartData} />
}

export default TimeChart