
import React, {useState} from "react";
import ReactDom from "react-dom";
import Button from './Button.js'
import DropdownValue from './DropdownValue.js'
import Text from './Text.js'
import Textbox from './Textbox.js'
import GridLayout from './GridLayout.js'
import PopupTextarea from './PopupTextarea.js'
import GridTable from "./GridTable";
import HButtons from "./HButtons";
import DisplayIf from "./DisplayIf";




// CreateNewVSetStep1 accepts props `createfn:function`, `activePS:object`.
// Return a subpanel with all controls needed for creating a new homemadeDim.
// It selects versions by filtering on key/value pairs in activePS.contexts
function CreateNewVSetStep1(props) {
    const [curIdent, setCurIdent] = useState("");       // Name of new HMDim
    const [curDesc, setCurDesc] = useState("");         // Descrn for new HMDim (optonal)
    const [cntts, setCntts] = useState([]);         // list(liset(string)) of KV pairs
    const [creatingHMD, setCreatingHMD] = useState(false);
    const [selectedVersions, setSelectedVersions] = useState([]);

    // This is the changefn for the DDVs in the KVPairs table
    function addCntt(cxtinx, selinx) {
        let cntts0 = cntts.slice();
        let kvp = props.activePS.contexts[cxtinx];
        cntts0.push([kvp.key, kvp.value[selinx]])
        setCntts(cntts0);
    }
    // return a list(list(JSX)) of [key, DDV] pairs: where the DDV reflects selectable values for the key
    function genKVPairTable() {
        let ret = []
        props.activePS.contexts.forEach((kvp, cxtinx) => {
            let options = []
            kvp.value.forEach((strg, index) => {
                if (!selectedVersions.includes(index)) options.push(strg)
            })
            if (options.length > 1)
                ret.push([<Text label={kvp.key} />,
                          <DropdownValue options={options} optionLabel={"Select..."} selectValue={-1} changefn={(selinx) => addCntt(cxtinx, selinx)} />])
        })
        return ret;
    }

    function generateVersionData() {
        if (!('version' in props.activePS)) return [];
        const cxtsByIndex = [...Array(props.activePS.version + 1).keys()].map(inx => new Array(0));
        props.activePS.contexts.forEach(kvp => {
            kvp.value.forEach((s, index) => {
                if (s !== "") cxtsByIndex[index].push(`${kvp.key}:${s}`)
            })
        })
        // 2 cols: indices, string of keys+values
        return cxtsByIndex.map((kv, index) => [index, kv.join(", ")])
    }

    // Given state of KVPair table (ie the active cntts) and previously selected versions, generate list of possible versions.
    // A version is possible unless (1) it's already selected or (2) one of its cxt elts has a value diff from one of the cntts.
    function genPossibleVersionsList() {
        let ret = [];
        if (props.activePS.contexts.length === 0) return [];
        let nv = props.activePS.contexts[0].value.length;
        for (let k = 0; k < nv; k++) {
            if (selectedVersions.includes(k)) continue;
            let ok = true;
            for (let j = 0; j < props.activePS.contexts.length; j++) {
                let kvp = props.activePS.contexts[j];
                let matchingCntt = cntts.find(cnttkvp => cnttkvp[0] === kvp.key);
                if (matchingCntt !== undefined && matchingCntt[1] !== kvp.value[k]) {
                    ok = false;
                    break;
                }
            }
            if (ok) ret.push(k)
            if (ret.length > 10) break
        }
        return ret;
    }
    // Clickfn for HButtons of possible versions
    function addElement(vIndex) {
        const sv0 = selectedVersions.slice();
        sv0.push(vIndex);
        setSelectedVersions(sv0);
        //console.log("new selvns:", sv0)
    }
    function cancel() {
        setCreatingHMD(false);
        setSelectedVersions([]);
        setCntts([]);
        setCurDesc("");
        setCurIdent("");
    }
    let curVersions = genPossibleVersionsList();
    return (
        <div style={{border: "solid black 1px"}}>
            <div>
                <GridTable
                    width="900px"
                    className="VersionTable"
                    columnWidths={"1fr 12fr"}
                    colors="[#f0f080]"
                    colorfn={(_, index) => selectedVersions.includes(index) ? 0 : -1 }
                    data={generateVersionData()} />
                <DisplayIf condition={() => creatingHMD}>
                    <Textbox placeholder="Name..." value={curIdent} changefn={(e) => setCurIdent(e.target.value)} />
                    <PopupTextarea buttonText="Description..." text={curDesc} popupLevel="1" key="1" dismissfn={setCurDesc} />
                    <GridTable
                        width="400px"
                        columnWidths={"1fr 2fr"}
                        data={genKVPairTable()}
                    />
                    <HButtons label="Select:" menulabels={curVersions.map(x => x.toString())} values={curVersions} clickfn={addElement} />
                    <Button
                        label="Create"
                        clickfn={() => props.createfn(curIdent, curDesc, selectedVersions.map(x => x.toString()))}
                    />
                    <Button label="Cancel" clickfn={cancel} />
                </DisplayIf>
            </div>
            <Button label="New Sequence" disabled={curVersions.length < 2}  clickfn={e => setCreatingHMD(true)} />
        </div>
    )
}


export default CreateNewVSetStep1;
