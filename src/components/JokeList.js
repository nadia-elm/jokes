
import React, { useEffect, useState} from "react";
import axios from 'axios';
import {Joke }from './Joke';
import "./JokeList.css"
import { PacmanLoader } from 'react-spinners'

export const JokeList = ({ numJokesToGet = 10 }) => {
 const [jokes, setJokes] = useState([])
 const [isLoading, setIsLoading] = useState(true)

 const getJokes = async () => {
   let j = [...jokes]
   let seenJokes = new Set()

   try {
     while (j.length < numJokesToGet) {
       let res = await axios.get('https://icanhazdadjoke.com', {
         headers: { Accept: 'application/json' },
       })
       let { status, ...jokeObj } = res.data
       if (!seenJokes.has(jokeObj.id)) {
         seenJokes.add(jokeObj.id)
         j.push({ ...jokeObj, votes: 0 })
       } else {
         console.error('duplicate found')
       }
     }
     setJokes(j)
     setIsLoading(false)
   } catch (e) {
     console.log(e)
   }
 }

 useEffect(() => {
  if(jokes.length === 0){
   setIsLoading(true)
   getJokes()
   .then(() => {
    setIsLoading(false)
   })
   .catch((e) => {
    console.log(e)
    setIsLoading(false)
   })
  }

 },[jokes,numJokesToGet])

 function generateNewJokes(){
  setJokes([]);
 }
// num can be -1 or +1
 function vote(id, num){
  setJokes(currentJokes => {
   currentJokes.map( (j)=>  {
    return (j.id === id ? { ...j,vote: j.votes + num} : j)})
   
  })
 }
 if(jokes && jokes.length) {
    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
  
return (
     
       <div className="JokeList">
         {isLoading ? (
           <PacmanLoader style={{ color : "#36D7B7" }} />
         ) : (
          <div>
             <button className="JokeList-getmore" onClick={generateNewJokes}>
               Get New Jokes
             </button>

             {sortedJokes.map((j) => (
               <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
             ))}
          </div>
         )}
      </div>
    );
             }
 
 return null
}