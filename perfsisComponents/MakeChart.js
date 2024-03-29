import Button from "./Button.js";
import FlexWrap from "./FlexWrap";
import Textbox from "./Textbox";
import RechartWrapper0 from "./RechartWrapper0";


// MakeChart accepts props `w:integer`, `h:integer`, `params:object`,
// `data:object`, `editfn:function`, `savefn:function`, `description:string`, `descChangefn:function`.
// It passes the first 4 of these to RechartWrapper0, which does the drawing; here we retain the interactive parts.
// It is designed specifically for perfsis frontend.
// It wraps the Recharts calls for perfsis FE. Props.selinx will be the index of the chart params+data.
// Props.params will be a ChartDesc and props.data will be a ChartData.
// Editfn and savefn are the clickfns for the edit and save buttons respectively.
function MakeChart(props) {
    console.log("MC:", props.data, props.params)
    return (
        <>
            <RechartWrapper0 w={props.w} h={props.h} params={props.params} data={props.data} />
            <FlexWrap dir={"rows"} justify={"space-around"}>
                <Button clickfn={e => props.editfn()} label={"Edit"} />
                <Textbox size={30} placeholder="For saving this chart..."
                    value={props.description} changefn={x => props.descChangefn(x.target.value)} />
                <Button label={"Save"} clickfn={e => props.savefn()} />
            </FlexWrap>
        </>
    )
}


export default MakeChart;
