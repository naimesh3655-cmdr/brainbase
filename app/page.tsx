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

  // Load notes from localStorage
  useEffect(() => {
    const storedNotes = localStorage.getItem("brainbase_notes")
    if(storedNotes){
      setNotes(JSON.parse(storedNotes))
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("brainbase_notes", JSON.stringify(notes))
  }, [notes])

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
    <main className="p-10 max-w-2xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">BrainBase</h1>

      <div className="flex gap-2 mb-4">

        <input
          className="border p-2 flex-1"
          value={note}
          onChange={(e)=>setNote(e.target.value)}
          placeholder="Write a note..."
        />

        <input
          className="border p-2 w-32"
          value={tag}
          onChange={(e)=>setTag(e.target.value)}
          placeholder="Tag"
        />

        <button
          onClick={addNote}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Add
        </button>

      </div>

      <input
        className="border p-2 w-full mb-6"
        placeholder="Search notes..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />

      <ul>

        {filteredNotes.map((n,i)=>(
          <li key={i} className="border p-3 mb-2 flex justify-between">

            <div>
              <p>{n.text}</p>
              <span className="text-sm text-gray-500">#{n.tag}</span>
            </div>

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