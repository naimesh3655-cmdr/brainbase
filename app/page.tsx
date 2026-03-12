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
  const [dark,setDark] = useState(false)

  // Load notes
  useEffect(()=>{
    const stored = localStorage.getItem("brainbase_notes")
    if(stored){
      setNotes(JSON.parse(stored))
    }
  },[])

  // Save notes
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

    <div className={dark ? "bg-black text-white min-h-screen flex" : "bg-white text-black min-h-screen flex"}>

      {/* SIDEBAR */}

      <aside className="w-64 border-r p-4 overflow-y-auto">

        <h2 className="text-xl font-bold mb-4">
          Notes
        </h2>

        {notes.map((n,i)=>(
          <div
            key={i}
            className="mb-3 p-2 border rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {n.text.substring(0,40)}...
          </div>
        ))}

      </aside>


      {/* MAIN AREA */}

      <main className="flex-1 p-8 max-w-3xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            BrainBase
          </h1>

          <button
            onClick={()=>setDark(!dark)}
            className="border px-4 py-2 rounded cursor-pointer"
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>

        </div>


        {/* INPUT BOX */}

        <div className="border p-4 rounded mb-6 shadow">

          <textarea
            className="w-full border p-3 rounded mb-3 bg-transparent"
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
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:scale-105 transition"
            >
              Add
            </button>

          </div>

        </div>


        {/* SEARCH */}

        <input
          className="border p-3 rounded w-full mb-6 bg-transparent"
          placeholder="Search notes..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />


        {/* NOTES */}

        <div className="grid gap-4">

          {filteredNotes.map((n,i)=>(

            <div
              key={i}
              className="border rounded p-4 shadow flex justify-between items-start"
            >

              <div>

                <p className="mb-2">
                  {n.text}
                </p>

                <span className="text-sm border px-2 py-1 rounded">
                  #{n.tag}
                </span>

              </div>

              <button
                onClick={()=>deleteNote(i)}
                className="text-red-500 cursor-pointer"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      </main>

    </div>
  )
}