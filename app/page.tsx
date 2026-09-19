"use client"
import { useEffect, useState, useRef } from "react"

export default function Game() {
  const [pos, setPos] = useState({x: 15, y: 75})
  const [showGift, setShowGift] = useState(false)
  const keys = useRef<Record<string,boolean>>({})
  const joy = useRef({x:0, y:0})

  const hideSpots = [
    {x: 65, y: 55},{x: 25, y: 55},{x: 70, y: 35},
    {x: 35, y: 35},{x: 20, y: 70},{x: 75, y: 70},{x: 50, y: 50},
  ]
  const [giftSpot] = useState(()=> hideSpots[Math.floor(Math.random()*hideSpots.length)])
  const giftPos = giftSpot

  const isNear = Math.abs(pos.x - giftPos.x) < 5 && Math.abs(pos.y - giftPos.y) < 5
  const dist = Math.sqrt(Math.pow(pos.x-giftPos.x,2)+Math.pow(pos.y-giftPos.y,2))
  const canSee = dist < 12

  let hintText = "🔍 Cari terus..."
  if(dist < 10) hintText = "🔥🔥 DIKIT LAGI!"
  else if(dist < 20) hintText = "🔥 Panas! Deket!"
  else if(dist < 40) hintText = "🌤️ Hangat"

  useEffect(()=>{
    const down = (e: KeyboardEvent) => keys.current[e.key.toLowerCase()] = true
    const up = (e: KeyboardEvent) => keys.current[e.key.toLowerCase()] = false
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    const loop = setInterval(()=>{
      setPos(p=>{
        let nx=p.x + (keys.current['d']||keys.current['arrowright']?1.2:0) + (keys.current['a']||keys.current['arrowleft']?-1.2:0) + joy.current.x*1.5
        let ny=p.y + (keys.current['s']||keys.current['arrowdown']?1.2:0) + (keys.current['w']||keys.current['arrowup']?-1.2:0) + joy.current.y*1.5
        return {x: Math.max(5,Math.min(90,nx)), y: Math.max(15,Math.min(90,ny))}
      })
    },14)
    return ()=>{clearInterval(loop); window.removeEventListener('keydown',down); window.removeEventListener('keyup',up)}
  },[])

  return (
    <div className="h-[100dvh] w-screen relative overflow-hidden select-none text-black touch-none bg-[#ffdee9]" style={{touchAction:'none'}}>
      <img src="/base.jpg" className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />
      <div className="absolute inset-0 bg-pink-200/20 pointer-events-none"></div>

      <div className="absolute top-2 left-2 right-2 z-30 flex gap-1.5">
        <div className="bg-white rounded-2xl px-2.5 py-1 flex items-center gap-2 shadow border-2 border-pink-200"><div className="w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center text-xs">💖</div><p className="font-black text-[#ff5a8f] text-xs">Diyan</p></div>
        <div className="flex-1 bg-white text-[#ff5a8f] rounded-full px-3 py-1 text-[10px] font-bold border-2 border-pink-200 shadow flex items-center justify-between"><span>{hintText}</span><span className="bg-pink-100 px-2 rounded-full">{Math.round(dist)}m</span></div>
      </div>

      {canSee && (
        <div style={{left:`${giftPos.x}%`, top:`${giftPos.y}%`, transform:'translate3d(-50%,-50%,0)'}} className="absolute z-20">
          {isNear? (
            <>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full text-[11px] font-black shadow border animate-bounce whitespace-nowrap">🎁 KETEMU! BUKA!</div>
              <div className="absolute inset-0 bg-yellow-200 rounded-full blur-[20px] animate-pulse"></div>
              <div className="text-6xl animate-bounce relative">🎁</div>
            </>
          ) : <div className="text-[12px] animate-ping">✨</div>}
        </div>
      )}

      <div style={{left:`${pos.x}%`, top:`${pos.y}%`, transform:'translate3d(-50%,-50%,0)'}} className="absolute z-20">
        <div className="text-6xl drop-shadow-xl">🐰</div>
        <div className="bg-white text-[8px] font-bold px-1.5 py-0.5 rounded-full text-center -mt-1 shadow border">Diyan</div>
      </div>

      <div className="absolute bottom-4 left-4 z-30 lg:hidden">
        <div
          className="w-[120px] h-[120px] bg-white/40 backdrop-blur-md rounded-full border-2 border-white shadow-xl flex items-center justify-center relative"
          onTouchMove={(e)=>{
            const rect = e.currentTarget.getBoundingClientRect()
            const t = e.touches[0]
            const x = t.clientX - rect.left - rect.width/2
            const y = t.clientY - rect.top - rect.height/2
            const max = 40
            const distJ = Math.min(max, Math.hypot(x,y))
            const ang = Math.atan2(y,x)
            joy.current = {x: Math.cos(ang)*distJ/max, y: Math.sin(ang)*distJ/max}
            const knob = document.getElementById('knob')!
            knob.style.transform = `translate(${Math.cos(ang)*distJ}px, ${Math.sin(ang)*distJ}px)`
          }}
          onTouchEnd={()=>{
            joy.current={x:0,y:0}
            const knob = document.getElementById('knob')!
            knob.style.transform = `translate(0px, 0px)`
          }}
        >
          <div id="knob" className="w-[50px] h-[50px] bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)] border-2 border-pink-200 flex items-center justify-center font-bold text-pink-400 transition-transform duration-75">◍</div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-30">
        <button disabled={!isNear} onClick={()=>isNear && setShowGift(true)} className={`w-[70px] h-[70px] rounded-full font-black border-[3px] border-white text-white shadow-xl flex flex-col items-center justify-center ${isNear? 'bg-[#ff5a8f] animate-pulse' : 'bg-white/60 text-gray-400'}`}>
          <span className="text-xl">🎁</span><span className="text-[9px]">{isNear?'BUKA':'CARI'}</span>
        </button>
      </div>

      {showGift && (
        <div className="absolute inset-0 bg-pink-200/80 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[1.8rem] w-full max-w-sm p-5 shadow-2xl text-black border-2 border-pink-200 my-6">
            <p className="text-center text-3xl">🎉💖</p>
            <h2 className="text-center font-black text-[#ff5a8f] text-xl mt-1">KETEMU!</h2>

            <div className="mt-4 mx-auto bg-white p-2 pb-5 rounded-[4px] shadow-[0_4px_15px_rgba(0,0,0,0.15)] rotate-[-1deg] w-[200px] border border-zinc-200">
              <div className="flex justify-between px-3 mb-2">
                <div className="w-2 h-2 bg-zinc-800 rounded-full"></div><div className="w-2 h-2 bg-zinc-800 rounded-full"></div><div className="w-2 h-2 bg-zinc-800 rounded-full"></div><div className="w-2 h-2 bg-zinc-800 rounded-full"></div>
              </div>
              <div className="flex flex-col gap-2 bg-zinc-900 p-2">
                <img src="/diyan1.jpeg" className="w-full h-32 object-cover" />
                <img src="/diyan2.jpeg" className="w-full h-32 object-cover" />
                <img src="/diyan3.jpeg" className="w-full h-32 object-cover" />
              </div>
              <div className="text-center mt-3 font-mono">
                <p className="text-[9px] tracking-[0.3em] text-zinc-500">05.05.2025 • ROBLOX</p>
                <p className="font-bold text-[11px] text-[#ff5a8f] mt-1">DIYAN'S BOOTH 💖</p>
              </div>
            </div>

            <div className="mt-5 bg-[#fff0f5] p-5 rounded-[20px] border border-pink-200 text-center">
              <p className="font-mono text-[10px] tracking-[0.3em] text-pink-400 mb-3">FROM DIYAN ♡</p>
              <p className="font-black text-[17px] text-[#ff5a8f] leading-tight">CIEEE ULTAH! 🎉</p>
              <p className="text-[13px] text-zinc-700 mt-3 leading-relaxed">
                Akhirnya tua juga lu wkwk. Ini hadiah photobooth, 3 foto lu yang paling cakep menurut gua.
              </p>
              <div className="w-10 h-[2px] bg-pink-200 mx-auto my-4 rounded-full"></div>
              <p className="text-[13px] text-zinc-700 leading-relaxed">
                Makasih ya udah mau kenal sama gua, mau temenan sama gua sampe sekarang. Semoga tahun ini semua yang lu mau kejadian, sehat terus, bahagia terus.
              </p>
              <p className="text-[13px] text-zinc-700 leading-relaxed mt-3">
                Kado kecil ini gua bikin sendiri, semoga lu suka ya. Love you! 🐰
              </p>
              <div className="mt-4 bg-white rounded-xl p-3 border border-dashed border-pink-200">
                <p className="text-[12px] text-zinc-600 italic leading-relaxed">On your special day - you are loved, you are cute, you are everything.</p>
                <p className="font-black text-[13px] text-[#ff5a8f] mt-1">Happy Birthday! 🌸🥺💖</p>
              </div>
            </div>

            <div className="h-8"></div>
            <button onClick={()=>setShowGift(false)} className="w-full bg-[#ff5a8f] text-white py-3.5 rounded-full font-bold shadow-[0_4px_0_#ff8ab8] active:translate-y-[4px] active:shadow-none transition-all">
              Tutup 💖
            </button>
            <p className="text-center text-[10px] text-pink-300 mt-3">dibuat dengan sayang 🥺</p>
          </div>
        </div>
      )}
    </div>
  )
}