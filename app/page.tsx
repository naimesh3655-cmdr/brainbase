"use client"

import { useState, useEffect } from "react"

type Note = {
  text: string
  tag: string
}

export default function Home() {

  const [note,setNote] = useState("")
  const [tag,setTag] = useState("")
  const [search,setSearch] = useState("")
  const [notes,setNotes] = useState<Note[]>([])

  useEffect(()=>{
    const stored = localStorage.getItem("brainbase_notes")
    if(stored){
      setNotes(JSON.parse(stored))
    }
  },[])

  useEffect(()=>{
    localStorage.setItem("brainbase_notes",JSON.stringify(notes))
  },[notes])

  function addNote(){
    if(note.trim()==="") return
    setNotes([...notes,{text:note,tag:tag}])
    setNote("")
    setTag("")
  }

  function deleteNote(index:number){
    const updated = notes.filter((_,i)=>i!==index)
    setNotes(updated)
  }

  const filteredNotes = notes.filter(n =>
    n.text.toLowerCase().includes(search.toLowerCase()) ||
    n.tag.toLowerCase().includes(search.toLowerCase())
  )

  return (

    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-center">
          BrainBase
        </h1>

        {/* Input Area */}

        <div className="bg-white p-6 rounded-lg shadow mb-6">

          <textarea
            className="w-full border p-3 rounded mb-3"
            value={note}
            onChange={(e)=>setNote(e.target.value)}
            placeholder="Write a note..."
          />

          <div className="flex gap-2">

            <input
              className="border p-2 rounded"
              value={tag}
              onChange={(e)=>setTag(e.target.value)}
              placeholder="Tag"
            />

            <button
              onClick={addNote}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Note
            </button>

          </div>

        </div>

        {/* Search */}

        <input
          className="w-full border p-3 rounded mb-6"
          placeholder="Search notes..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        {/* Notes List */}

        <div className="grid gap-4">

          {filteredNotes.map((n,i)=>(

            <div
              key={i}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-start"
            >

              <div>

                <p className="mb-2">{n.text}</p>

                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  #{n.tag}
                </span>

              </div>

              <button
                onClick={()=>deleteNote(i)}
                className="text-red-500"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      </div>

    </main>
  )
}