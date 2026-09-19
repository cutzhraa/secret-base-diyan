"use client"
import { useEffect, useState, useRef } from "react"

export default function Game() {
  const [pos, setPos] = useState({x: 15, y: 75})
  const [showGift, setShowGift] = useState(false)
  const keys = useRef<Record<string,boolean>>({})

  // SEMUA POSISI GUA TARO DITENGAH BIAR KEJANGKAU, GAK DI POJOK MENTOK
  const hideSpots = [
    {x: 65, y: 55},
    {x: 25, y: 55},
    {x: 70, y: 35},
    {x: 35, y: 35},
    {x: 20, y: 70},
    {x: 75, y: 70},
    {x: 50, y: 50},
  ]
  const [giftSpot] = useState(()=> hideSpots[Math.floor(Math.random()*hideSpots.length)])
  const giftPos = giftSpot

  // LONGGARIN JADI 5 BIAR GAK HARUS PRESISI BANGET
  const isNear = Math.abs(pos.x - giftPos.x) < 5 && Math.abs(pos.y - giftPos.y) < 5
  const dist = Math.sqrt(Math.pow(pos.x-giftPos.x,2)+Math.pow(pos.y-giftPos.y,2))
  const canSee = dist < 12

  let hintText = "🔍 Cari terus..."
  if(dist < 10) hintText = "🔥🔥 DIKIT LAGI! GOYANG DIKIT!"
  else if(dist < 20) hintText = "🔥 Panas! Deket!"
  else if(dist < 40) hintText = "🌤️ Hangat"

  useEffect(()=>{
    const down = (e: KeyboardEvent) => keys.current[e.key.toLowerCase()] = true
    const up = (e: KeyboardEvent) => keys.current[e.key.toLowerCase()] = false
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    const loop = setInterval(()=>{
      setPos(p=>{
        let nx=p.x, ny=p.y
        if(keys.current['w'] || keys.current['arrowup']) ny-=1.2
        if(keys.current['s'] || keys.current['arrowdown']) ny+=1.2
        if(keys.current['a'] || keys.current['arrowleft']) nx-=1.2
        if(keys.current['d'] || keys.current['arrowright']) nx+=1.2
        // BATAS GUA LONGGARIN BIAR BISA SAMPE POJOK
        return {x: Math.max(5,Math.min(90,nx)), y: Math.max(15,Math.min(90,ny))}
      })
    },14)
    const prevent = (e:TouchEvent)=> e.preventDefault()
    document.addEventListener('touchmove', prevent, {passive:false})
    return ()=>{clearInterval(loop); window.removeEventListener('keydown',down); window.removeEventListener('keyup',up); document.removeEventListener('touchmove', prevent)}
  },[])

  const move = (k:string, v:boolean) => keys.current[k]=v

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
          ) : (
            <div className="text-[12px] animate-ping">✨</div>
          )}
        </div>
      )}

      <div style={{left:`${pos.x}%`, top:`${pos.y}%`, transform:'translate3d(-50%,-50%,0)', willChange:'transform'}} className="absolute z-20">
        <div className="text-6xl drop-shadow-xl">🐰</div>
        <div className="bg-white text-[8px] font-bold px-1.5 py-0.5 rounded-full text-center -mt-1 shadow border">Diyan • {Math.round(pos.x)},{Math.round(pos.y)}</div>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-30">
        <div className="grid grid-cols-3 gap-1.5">
          <div></div><button onTouchStart={(e)=>{e.preventDefault(); move('w',true)}} onTouchEnd={(e)=>{e.preventDefault(); move('w',false)}} onMouseDown={()=>move('w',true)} onMouseUp={()=>move('w',false)} className="w-[50px] h-[50px] bg-white rounded-[12px] shadow border-2 border-pink-200 font-bold active:scale-90">▲</button><div></div>
          <button onTouchStart={(e)=>{e.preventDefault(); move('a',true)}} onTouchEnd={(e)=>{e.preventDefault(); move('a',false)}} onMouseDown={()=>move('a',true)} onMouseUp={()=>move('a',false)} className="w-[50px] h-[50px] bg-white rounded-[12px] shadow border-2 border-pink-200 font-bold active:scale-90">◀</button>
          <button onTouchStart={(e)=>{e.preventDefault(); move('s',true)}} onTouchEnd={(e)=>{e.preventDefault(); move('s',false)}} onMouseDown={()=>move('s',true)} onMouseUp={()=>move('s',false)} className="w-[50px] h-[50px] bg-white rounded-[12px] shadow border-2 border-pink-200 font-bold active:scale-90">▼</button>
          <button onTouchStart={(e)=>{e.preventDefault(); move('d',true)}} onTouchEnd={(e)=>{e.preventDefault(); move('d',false)}} onMouseDown={()=>move('d',true)} onMouseUp={()=>move('d',false)} className="w-[50px] h-[50px] bg-white rounded-[12px] shadow border-2 border-pink-200 font-bold active:scale-90">▶</button>
        </div>
        <button disabled={!isNear} onClick={()=>isNear && setShowGift(true)} className={`px-6 py-3 rounded-2xl font-black border-2 border-white text-white shadow-[0_4px_0_#ff8ab8] ${isNear? 'bg-[#ff5a8f] animate-pulse' : 'bg-white/70 text-gray-400'}`}>🖐️<div className="text-[10px]">{isNear?'BUKA':'CARI'}</div></button>
      </div>

      {showGift && (
        <div className="absolute inset-0 bg-pink-200/60 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-[1.8rem] w-full max-w-sm p-5 shadow-2xl text-black border-2 border-pink-200"><p className="text-center text-5xl">🎉💖</p><h2 className="text-center font-black text-[#ff5a8f] text-xl mt-2">KETEMU!</h2><img src="/diyan1.jpg" className="w-full h-44 object-cover rounded-2xl mt-3"/><div className="mt-3 bg-[#fff0f5] p-4 rounded-xl text-[13px] border">GANTI DISINI BEJIR</div><button onClick={()=>setShowGift(false)} className="w-full mt-4 bg-[#ff5a8f] text-white py-3 rounded-full font-bold">Ambil 💖</button></div>
        </div>
      )}
    </div>
  )
}