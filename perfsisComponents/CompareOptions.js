
import {useState} from 'react';
import VRadioButton from "./VRadioButton";
import Dropdown from "./Dropdown";
import Button from "./Button";
import FlexWrap from "./FlexWrap";
import Boxspring from "./Boxspring";
import VSpace from "./VSpace";

// CompareOptions accepts props `srcgen:function`, `srcfn:function`, `vrblabels:list(string)`, `csoption:string`, `cursubstn:string`,
// `rbclick:function`, `disabled:boolean`.
// It serves for selecting options for comparing 2 dataseries, including which is the second series.
// The srcgen function returns two things in an object, labeled with srclabels and srcvalues, these are the labels and values
// for the dropdown to select a substn. The cursubstn helps the dropdown show the selectValue.
// It appears as a popup at [100,200] (see css class CompareOptions).
function CompareOptions(props) {
    const [hovered, setHovered] = useState('hidden');
    const generated = props.srcgen()
    //console.log("CO:", props, generated)
    const srcddv = <FlexWrap>
        <span>Compare with:</span>
        <Dropdown options={generated.srclabels} values={generated.srcvalues} selectValue={props.cursubstn} changefn={props.srcfn} />
    </FlexWrap>
    return (
        <span style={{border: "2px", fontSize: "16px"}}>
            <button disabled={props.disabled} onClick={() => setHovered('visible')} >Compare?</button>
            <div className="CompareOptions" style={{visibility: hovered, minHeight:"200px", minWidth:"200px"}}>
                <VSpace height={"9px"} />
                <Boxspring  dir={"V"} springV={"L"} springH={"L"} >
                    {generated.srclabels.length === 0 ? [] : srcddv}
                    <VSpace height={"9px"} />
                    <VRadioButton labels={props.vrblabels} value={props.csoption} clickfn={ev => props.rbclick(ev)} />
                    <VSpace height={"9px"} />
                    <Button label="Done" clickfn={() => setHovered('hidden')} />
                    <VSpace height={"9px"} />
                </Boxspring>
            </div>
        </span>
    )
}

export default CompareOptions;
