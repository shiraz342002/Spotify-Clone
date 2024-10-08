import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios"
import { toast } from 'react-toastify'


export const PlayerContext =createContext();
const PlayerContextProvider=(props)=>{

    const audioRef =useRef()
    const seekBg =useRef()
    const volumeBgRef = useRef(null);
    const seekBar = useRef()
    const url = "http://localhost:3000";


    const [songsData,setSongsData]=useState([]);
    const [albumsData,setAlbumsData]=useState([]);
    


    const [track,setTrack]=useState(songsData[0])
    const [playStatus,setPlayStatus] = useState(false)
    const [isLooping, setIsLooping] = useState(false);

    const [time,setTime]=useState({
        currentTime:{
            second:0,
            minute:0,
        },
        totalTime:{
            second:0,
            minute:0
        }
    }
)
    const play=()=>{
        // console.log(audioRef.current);   
        audioRef.current.play();
        setPlayStatus(true)
    }
    const pause=()=>{
        audioRef.current.pause();
        setPlayStatus(false)
    }
    const playWithId=async (id)=>{
        await songsData.map((item)=>{
            if(id===item._id){
                setTrack(item)
            }
        })
        await audioRef.current.play()
        setPlayStatus(true)   
    }
    const previous= async ()=>{
       songsData.map(async(item,index)=>{
        if(track._id===item._id && index>0){
            await setTrack(songsData[index-1])
            await audioRef.current.play()
            setPlayStatus(true)
        }
       })
    }
    const next= async ()=>{
        songsData.map(async(item,index)=>{
            if(track._id===item._id && index<songsData.length){
                await setTrack(songsData[index+1])
                await audioRef.current.play()
                setPlayStatus(true)
            }
           })
    }
    const loop = () => {
        setIsLooping(prevState => !prevState);
        if (!isLooping) {
          audioRef.current.loop = true;
        } else {
          audioRef.current.loop = false;
        }
      };

    const seekSong=async(e)=>{
        audioRef.current.currentTime=((e.nativeEvent.offsetX/seekBg.current.offsetWidth)*audioRef.current.duration)
    }
    useEffect(()=>{
        setTimeout(() => {
            audioRef.current.ontimeupdate=()=>{
                seekBar.current.style.width=(Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%";
                setTime({
                    currentTime:{
                        second:Math.floor(audioRef.current.currentTime%60),
                        minute:Math.floor(audioRef.current.currentTime/60),
                    },
                    totalTime:{
                         second:Math.floor(audioRef.current.duration%60),
                         minute:Math.floor(audioRef.current.duration/60),
                    }
                })
            }
        }, 1000);
    },[audioRef])
    const fetchSongs = async () => {
        try {
          const response = await axios.get(`${url}/api/song/list`)
          if (response.data.success) {
            setSongsData(response.data.songs)
            setTrack(response.data.songs[0])
          }
        } catch (error) {
          toast.error("Some Error occured")
        }
      }
      const fetchAlbums = async () => {
        try {
          const response = await axios.get(`${url}/api/album/list`)
          if (response.data.success) {
            setAlbumsData(response.data.albums)
          }
        } catch (error) {
          toast.error("Some Error occured")
        }
      }
    useEffect(()=>{
        fetchAlbums()
        fetchSongs()
    },[])
    const contextValue={
        audioRef,
        seekBar,
        seekBg,
        track,setTrack,
        playStatus,setPlayStatus,
        time,setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong,
        songsData,
        albumsData,
        volumeBgRef,
        loop
    }
    return(
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider