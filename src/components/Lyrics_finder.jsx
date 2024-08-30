import axios from "axios";
import React, { useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const Lyrics_finder = () => {
  let lyrics = useRef();
  const audioRef = useRef(null); // Ref to control the audio element

  let base_url = "https://api.lyrics.ovh";
  let [songdata, setSongData] = useState();
  console.log("🚀 ~ songdata:", songdata);
  let [songLyrics, setsongLyrics] = useState();
  console.log("🚀 ~ songLyrics:", songLyrics);
  let [isLyricsView, setIsLyricsView] = useState(false);

  let handleSubmit = async () => {
    // Clear previous song lyrics before fetching new data
    setsongLyrics(null);

    let data = {
      song: lyrics.current.value,
    };

    let res = await axios.get(`${base_url}/suggest/${data.song}`);
    setSongData(res.data);
  };

  let handleSongLyrics = async (songDetails) => {
    let data = {
      artist: songDetails.artist.name,
      title: songDetails.title,
    };

    let res = await axios.get(`${base_url}/v1/${data.artist}/${data.title}`);
    let finalData = {
      song: songDetails.preview,
      data: res.data,
      allDetails: songDetails,
    };
     setsongLyrics(finalData);
    setIsLyricsView(true);

    // Reset the audio element before setting a new src
    if (audioRef.current) {
      audioRef.current.pause(); // Pause any playing audio
      audioRef.current.currentTime = 0; // Reset playback time to the start
      audioRef.current.src = ""; // Clear the src
      audioRef.current.load(); // Load the empty src
    }
  };

  let handleBackToSongs = () => {
    setIsLyricsView(false);
  };

  return (
    <>
      <div className="main_body">
        <h1 className="text-white text-center font-bold text-3xl uppercase text-grad pt-3">
          Lyrics Finder
        </h1>

        {!isLyricsView && (
          <div className="form-content flex items-center justify-center mt-4">
            <div className="form-group border-[2px] rounded-lg border-white/20 flex flex-col w-[400px] items-center gap-7 px-10 py-16 pb-7 backdrop-blur-3xl bg-white/5">
              <input
                type="text"
                ref={lyrics}
                className="form-control w-full p-3 backdrop-blur-sm bg-white/5 border border-white/20 rounded text-white placeholder:font-bold"
                id="song_name"
                placeholder="Enter Song Name"
              />

              <button
                className="rounded text-white font-bold text-lg bg-red-700 px-8 py-3 mt-4"
                onClick={handleSubmit}
              >
                Search
              </button>
            </div>
          </div>
        )}

        {!isLyricsView ? (
          <div className="songs-list flex flex-col gap-10 mt-6 justify-center items-center w-full">
            {songdata?.data?.map((val, ind) => {
              return (
                <div
                  className="border rounded-lg p-9 w-[900px] flex flex-col gap-9"
                  key={ind}
                >
                  <div
                    className="songs-content flex items-center gap-10"
                    onClick={() => handleSongLyrics(val)}
                  >
                    <div className="album-img">
                      <img src={val.album.cover} alt="Album Cover" />
                    </div>
                    <div className="album-details">
                      <h2 className="text-white text-lg font-bold">
                        {val.title}
                      </h2>
                      <p className="text-white text-sm">{val.artist.name}</p>
                    </div>
                  </div>
                  <audio controls ref={audioRef}>
                    <source src={val?.preview} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="lyrics-view flex flex-col items-center mt-6 p-10 gap-6">
            <div className="song-audio text-white border rounded border-white/20 px-10 py-5 flex flex-col gap-4 bg-neutral-800">
              <div className="audio-details">
                <h1 className="text-3xl font-bold">
                  {songLyrics.allDetails.title}
                </h1>
                <p>{songLyrics.allDetails.artist.name}</p>
              </div>
              <audio controls ref={audioRef}>
                <source src={songLyrics?.song} />
                Your browser does not support the audio element.
              </audio>
            </div>
            <div className="lyrics-content bg-white/5 p-6 rounded-lg border border-white/20 w-full max-w-[800px] text-white">
              {(songLyrics.data.lyrics || "Lyrics not found.")
                .split("\n")
                .map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
            </div>
            <button
              className="p-3  bg-white/5 border border-white/20 rounded px-14 text-white"
              onClick={handleBackToSongs}
            >
              <FaArrowLeft />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Lyrics_finder;
