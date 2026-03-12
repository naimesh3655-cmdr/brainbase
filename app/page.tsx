"use client"

import { useState, useEffect } from "react"
import { Rnd } from "react-rnd"

type Note = {
  id: string
  text: string
  tag: string
  done: boolean
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  private: boolean
}

export default function Home() {

const [notes,setNotes] = useState<Note[]>([])
const [note,setNote] = useState("")
const [tag,setTag] = useState("")
const [dark,setDark] = useState(true)
const [search,setSearch] = useState("")
const [openNote,setOpenNote] = useState<string|null>(null)
const [privateMode,setPrivateMode] = useState(false)

const [password,setPassword] = useState("")
const [inputPassword,setInputPassword] = useState("")
const [authOpen,setAuthOpen] = useState(false)
const [firstSetup,setFirstSetup] = useState(false)

/* LOAD */

useEffect(()=>{

const storedNotes = localStorage.getItem("brainbase_notes")
const storedPass = localStorage.getItem("brainbase_password")

if(storedNotes){
setNotes(JSON.parse(storedNotes))
}

if(!storedPass){
setFirstSetup(true)
}else{
setPassword(storedPass)
}

},[])

/* SAVE */

useEffect(()=>{
localStorage.setItem("brainbase_notes",JSON.stringify(notes))
},[notes])

/* ADD NOTE */

function addNote(){

if(note.trim()==="") return

const maxZ = Math.max(...notes.map(n=>n.zIndex),0)

const newNote:Note={
id:crypto.randomUUID(),
text:note,
tag:tag||"note",
done:false,
x:120,
y:120,
width:280,
height:160,
zIndex:maxZ+1,
private:privateMode
}

setNotes(prev=>[...prev,newNote])
setNote("")
setTag("")

}

/* UPDATE */

function updateText(id:string,value:string){

setNotes(prev =>
prev.map(n=>n.id===id ? {...n,text:value} : n)
)

}

/* DELETE */

function deleteNote(id:string){

setNotes(prev => prev.filter(n=>n.id!==id))

}

/* DONE */

function toggleDone(id:string){

setNotes(prev =>
prev.map(n=>n.id===id ? {...n,done:!n.done} : n)
)

}

/* BRING FRONT */

function bringFront(id:string){

setNotes(prev=>{

const maxZ=Math.max(...prev.map(n=>n.zIndex),0)

return prev.map(n =>
n.id===id ? {...n,zIndex:maxZ+1} : n
)

})

}

/* SEARCH */

const filtered = notes.filter(n =>
n.private===privateMode &&
(
n.text.toLowerCase().includes(search.toLowerCase()) ||
n.tag.toLowerCase().includes(search.toLowerCase())
)
)

const currentNote = notes.find(n=>n.id===openNote)

/* AUTH */

function unlock(){

if(firstSetup){

localStorage.setItem("brainbase_password",inputPassword)
setPassword(inputPassword)
setFirstSetup(false)
setPrivateMode(true)
setAuthOpen(false)
setInputPassword("")
return

}

if(inputPassword===password){

setPrivateMode(true)
setAuthOpen(false)
setInputPassword("")

}else{
alert("Wrong password")
}

}

function lock(){
setPrivateMode(false)
}

/* UI */

return(

<div className={`${dark?"bg-black text-white":"bg-gray-100 text-black"} min-h-screen flex flex-col`}>

{/* HEADER */}

<div className="flex flex-wrap justify-between items-center gap-2 p-4 border-b border-gray-700">

<h1 className="text-xl font-bold">
BrainBase
</h1>

<div className="flex flex-wrap gap-2">

<input
value={search}
onChange={(e)=>setSearch(e.target.value)}
placeholder="Search"
className={`${dark
? "bg-gray-900 text-white border-gray-700"
: "bg-white text-black border-gray-300"} border px-3 py-1 rounded`}
/>

<button
onClick={()=>setDark(!dark)}
className="border px-3 py-1 rounded"
>
{dark?"Light":"Dark"}
</button>

<button
onClick={()=>{

if(privateMode){
lock()
}else{
setAuthOpen(true)
}

}}
className="border px-3 py-1 rounded"
>

{privateMode?"🔒 Private":"🔓 Public"}

</button>

</div>

</div>


{/* AUTH MODAL */}

{authOpen && (

<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

<div className="bg-white text-black p-6 rounded w-80">

<h2 className="font-bold mb-3">
{firstSetup?"Set Password":"Enter Password"}
</h2>

<input
type="password"
value={inputPassword}
onChange={(e)=>setInputPassword(e.target.value)}
className="border p-2 w-full mb-3"
/>

<button
onClick={unlock}
className="bg-blue-600 text-white w-full p-2 rounded"
>

{firstSetup?"Set Password":"Unlock"}

</button>

</div>

</div>

)}


{/* NOTE EDITOR */}

{openNote && currentNote ? (

<div className="flex-1 p-4">

<button
onClick={()=>setOpenNote(null)}
className="border px-3 py-1 rounded mb-3"
>
Close
</button>

<textarea
value={currentNote.text}
onChange={(e)=>updateText(currentNote.id,e.target.value)}
className={`w-full h-[70vh] border p-4 rounded resize-none ${
dark
? "bg-gray-900 text-white border-gray-700"
: "bg-white text-black border-gray-300"
}`}
/>
</div>

):(


/* CANVAS */

<div className="flex-1 relative overflow-hidden">

{filtered.map(n=>(

<Rnd
key={n.id}
size={{width:n.width,height:n.height}}
position={{x:n.x,y:n.y}}
style={{zIndex:n.zIndex}}
dragHandleClassName="drag-handle"
onDragStart={()=>bringFront(n.id)}
onDragStop={(e,d)=>{

setNotes(prev =>
prev.map(note =>
note.id===n.id
? {...note,x:d.x,y:d.y}
: note
)
)

}}
onResizeStop={(e,dir,ref,delta,pos)=>{

setNotes(prev =>
prev.map(note =>
note.id===n.id
? {...note,width:ref.offsetWidth,height:ref.offsetHeight,x:pos.x,y:pos.y}
: note
)
)

}}
onDoubleClick={()=>setOpenNote(n.id)}
className={`${dark?"bg-gray-900 text-white":"bg-white text-black"} border rounded shadow`}
>

<div className="drag-handle flex justify-between px-2 py-1 cursor-move">

<span className="text-xs text-blue-400">
#{n.tag}
</span>

<div className="flex gap-2">

<button onClick={()=>toggleDone(n.id)}>
✔
</button>

<button onClick={()=>deleteNote(n.id)}>
✕
</button>

</div>

</div>

<div className={`p-2 text-sm overflow-auto h-full ${n.done?"line-through opacity-50":""}`}>
{n.text}
</div>

</Rnd>

))}

</div>

)}


{/* INPUT */}

<div className="border-t p-3 md:p-4">

<div className="flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">

<textarea
value={note}
onChange={(e)=>setNote(e.target.value)}
placeholder="Write note"
rows={2}
className={`${dark
? "bg-gray-900 text-white border-gray-700"
: "bg-white text-black border-gray-300"} flex-1 border p-2 rounded resize-none`}
/>

<input
value={tag}
onChange={(e)=>setTag(e.target.value)}
placeholder="Tag"
className={`${dark
? "bg-gray-900 text-white border-gray-700"
: "bg-white text-black border-gray-300"} border p-2 rounded md:w-32`}
/>

<button
onClick={addNote}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Add
</button>

</div>

</div>

</div>

)

}