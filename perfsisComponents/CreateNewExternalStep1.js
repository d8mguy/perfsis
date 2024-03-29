
import React, {useState} from "react";
import Button from './Button.js'
import Textbox from './Textbox.js'
import Checkbox from './Checkbox.js'
import GridTable from './GridTable.js'
import UpdownDialH from './UpdownDialH.js'
import PopupTextarea from './PopupTextarea.js'
import DisplayIf from "./DisplayIf";
import FileSelect from "./FileSelect";

// CreateNewExternalStep1 accepts props `tableDataExternal:list(object)`, `frontendInfo:object`,
// `setFrontendInfo:function`, `finishExternal:function`, `trans1:function`.
// The first external transition has returned tableDataExternal; display it with controls to define a cube.
// This means a col on left of checkboxes for rows to exclude, a top row of textobxes for param+output names,
// a updown dial for the param count. Below the table are textboxes for ident & descrn, plus a Go button.

function CreateNewExternalStep1(props) {
    //console.log("CNX:", props.tableDataExternal)
    const nrows = props.tableDataExternal.length;
    const ncols = nrows === 0 ? 0 : props.tableDataExternal[0].length;
    const [curIdent, setCurIdent] = useState("");
    const [curDesc, setCurDesc] = useState("");
    const [filedir, setFiledir] = useState("");
    const [eltIdents, setEltIdents] = useState(Array(ncols).fill(""));
    const [nParams, setNParams] = useState(1);
    const [popEnabled, setPopEnabled] = useState(false);
    function setEltIdentsAt(strg, index) {
        const ei0 = eltIdents.slice();
        ei0[index] = strg;
        setEltIdents(ei0)
    }
    const colindices = [...Array(ncols).keys()];
    const [checkedRows, setCheckedRows] = useState(Array(nrows).fill(false));
    function setCheckedRowsAt(tf, inx) {
        const cr0 = checkedRows.slice();
        cr0[inx] = tf;
        setCheckedRows(cr0);
    }
    const txboxes = colindices.map(inx => {
        return <Textbox value={eltIdents[inx]} changefn={e => setEltIdentsAt(e.target.value, inx) } />
    })
    const rows = [...Array(nrows).keys()].map(rowinx => {
        return [<Checkbox clickfn={e => setCheckedRowsAt(e.target.value, rowinx)}  />].concat(props.tableDataExternal[rowinx])
    })
    //console.log("CNX2:", nrows, ncols)
    // true if some param isn't labeled
    function notReady() {
        const filledIn = eltIdents.filter((x, inx) => inx < nParams && x !== "").length;
        return filledIn < nParams
    }
    function donefn() {
        let names = [];         // names and indices are pll arrays, one entry per eltIdent
        let indices = [];
        eltIdents.forEach((x, index) => {
            if(x !== "") {
                names.push(x);
                indices.push(index);
            }
        })
        let xrows = [];
        checkedRows.forEach((x, index) => {
            if (x) xrows.push(index)
        });
        props.finishExternal(curIdent, curDesc, nParams, names, indices, xrows);
        // NOTE: I've changed my mind, the transition will return something that we'll need to add to fei with a hook.
        // Leaving this for now...
        // We've notified the server. It doesn't send anything back, the idea is we create and add the local copy here.
        const xCube = { };
        const fei0 = {}
        Object.assign(fei0, props.frontendInfo)
        fei0.externals.push({ident: curIdent, description: curDesc, cube: xCube, contexts: [], implicit: false, accessor: ""})
        props.setFrontendInfo(fei0)
        setPopEnabled(false);
    }
    function udhChanger(inx) {
        //console.log("UDHC:", inx)
        setNParams(inx)
    }
    // the UpdownDialH "value" is an index, so we need to adjust by the min, which is 1.
    const uddmax = ncols < 2 ? 1 : ncols - 1;
    //console.log("CNXS:", ncols, nParams, uddmax)
    return (
        <div>
            <DisplayIf condition={() => popEnabled}>
                <GridTable
                    width="550px"
                    columnWidths={"80px " + "1fr ".repeat(ncols)}
                    data={[["Exclude"].concat(txboxes)].concat(rows)}
                />
                <Textbox placeholder="Name for file..." value={curIdent} changefn={e => setCurIdent(e.target.value) } />
                <PopupTextarea buttonText="Description (optl)..." text={curDesc} key="1" dismissfn={(e) => setCurDesc(e.target.value)} />
                <UpdownDialH min={0} max={uddmax} curIndex={nParams} changefn={newinx => udhChanger(newinx) } />
                <Button label="Done" clickfn={() => donefn()} disabled={notReady()} />
            </DisplayIf>
            <FileSelect label="New External..." modalLabel="Get File" filepath={filedir}
                        clickfn={(path, nm) => { setPopEnabled(true); setFiledir(path); props.trans1(nm, path) }}
            />
        </div>
    )
}

export default CreateNewExternalStep1;
