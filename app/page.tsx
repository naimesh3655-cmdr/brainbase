"use client"

import { useState } from "react"

export default function Home() {

  const [note,setNote] = useState("")
  const [notes,setNotes] = useState<string[]>([])

  function addNote(){
    if(note.trim()==="") return
    setNotes([...notes,note])
    setNote("")
  }

  function deleteNote(index:number){
    const updated = notes.filter((_,i)=>i!==index)
    setNotes(updated)
  }

  return (
    <main className="p-10 max-w-2xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        BrainBase
      </h1>

      <div className="flex gap-2 mb-6">

        <input
          className="border p-2 flex-1"
          value={note}
          onChange={(e)=>setNote(e.target.value)}
          placeholder="Write a note..."
        />

        <button
          onClick={addNote}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Add
        </button>

      </div>

      <ul>

        {notes.map((n,i)=>(
          <li key={i} className="border p-3 mb-2 flex justify-between">

            <span>{n}</span>

            <button
              onClick={()=>deleteNote(i)}
              className="text-red-500"
            >
              Delete
            </button>

          </li>
        ))}

      </ul>

    </main>
  )
}