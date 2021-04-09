import RadialChart from "./components/RadialChart"
import InlineChart from "./components/InLineChart"
import CircularChart from "./components/CircularChart"
import SequentialGeneric from "./components/SequentialGeneric"
import BushChart from "./components/BushChart"
import NonSequentialGeneric from "./components/NonSequentialGeneric"

export const newChart = (params) => {
    
    console.log(params.type)


    switch(params.type){
        case 'radial':
            return new RadialChart(params)
        case 'inline':
            return new InlineChart(params)
        case 'circular':
            return new CircularChart(params)
        case 'seq-generic':
            return new SequentialGeneric(params)
        case 'polygon':
            let angle_offset = 360/params.dimensions.length
            let orientations = params.dimensions.map((l,i) => i*angle_offset)
            let chart = new SequentialGeneric(params)
            chart.setOrientations(orientations)
            return chart
        case 'bush':
            return new BushChart(params)
        case 'nseq-generic':
            return new NonSequentialGeneric(params)
        case 'parallel':
            let chart2 = new NonSequentialGeneric(params)
            chart2.setOrientations(params.dimensions.map(l => 90))
            return chart2
        default:
            console.log("Chart not supported")
    }
};
