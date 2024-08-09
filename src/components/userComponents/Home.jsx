import { useState, useEffect, useRef } from "react"
import logo from '/src/assets/wolfLogo.png'
import Topics from "./Topics"



export default function Home(){
   //  for profile picture
   const profilePictureElement = useRef(null)

   // Each topic that the user selected displayed in the sideNav as individual elements
   const topicBtn = useRef(null)

   // Mobile Nav button that appears at a certain breakpoint
   const mobileNavBtn = useRef(null)

   // The side navigation element
   const sideNav = useRef(null)

   // the an array of the topics that the user selected
   const [userData, setUserData] = useState([])

   // Displaying the username of the user in the nav bar
   const [username, setUsername] = useState(null)

   // The topics and 2 facts for each of them
   // Used for wolf bot
   const [topicFact, setTopicFact] = useState([])

   const [selectedFact, setSelectedFact] = useState(null)

   // Getting user information and displaying on the home page
   useEffect(()=> {
      async function getUserData(){
         const response = await fetch('/users/home', {
            method: 'GET',
            credentials: "include",
            headers: {
               'Content-Type': 'application/json',
            }
         })
   
         if (!response.ok) {
            console.log("Couldn't get user data")
            throw new Error(`HTTP error! status: ${response.status}`);
         }
   
         const homeData = await response.json()

         setUserData(homeData.topicArr)
         setUsername(homeData.userName)
      }

      getUserData()

   }, [])
   
   useEffect(()=> {
      async function fetchTopicData(){
         const response = await fetch('/wolfTopics', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            }
         })

         
         const data = await response.json()
         setTopicFact(data)
      }

      fetchTopicData()
   }, [])
   
   
   // Mobile nav bar functionality
   function mobileNavFunction() {
      sideNav.current.classList.toggle('toggleNav')
   }
   
   
   const handleClick = (topic) => {
      console.log(topic)
      setSelectedFact(topic)
   }
      
   
   function Post(props) {
      return (
         <>
            <div className="userPost">
               <div id="postAnalytics">
                  <h1><img className="profilePicture" src={logo} alt="" />{"Wolf Bot"} posted</h1>
                  <div id="userTraction">
                     <button id="followBtn">Follow <i className="fa-solid fa-user-plus"></i></button>
                     <button id="likeBtn">Like <i className="fa-solid fa-thumbs-up"></i></button>
                  </div>
               </div>
               <br />
               <main className="mainPost">
                  <h2 id="postCaption">{props.topic} {props.icon}</h2>
                  <h2 id="postBody">{`${props.fact}`}</h2>
               </main>
            </div>
         </>
      )
   }
   
   
   
   function displayTopicInfo(){
      // gets the selected topic, based on what the user chose in the beginning
      
      switch (selectedFact) {
         case "Sports":
            return <Post topic={selectedFact} fact={topicFact.Sports[0].fact1} icon={<i className="fa-solid fa-baseball"></i>}/>
         case "Cosmetology":
            return <Post topic={selectedFact} fact={topicFact.Cosmetology[0].fact1} icon={<i className="fa-solid fa-face-smile-beam"></i>}/>
         case "Food":
            return <Post topic={selectedFact} fact={topicFact.Food[0].fact1} icon={<i className="fa-solid fa-utensils"></i>}/>
         case "Self care":
            return <Post topic={selectedFact} fact={topicFact.Self_Care[0].fact1} icon={<i className="fa-solid fa-person-rays"></i>}/>
         case "Goal Settings":
            return <Post topic={selectedFact} fact={topicFact.Goal_Settings[0].fact1} icon={<i className="fa-regular fa-clipboard"></i>}/>
         case "Tech": 
            return <Post topic={selectedFact} fact={topicFact.Tech[0].fact1} icon={<i className="fa-solid fa-microchip"></i>}/>
         case "Movies":
            return <Post topic={selectedFact} fact={topicFact.Movies[0].fact1} icon={<i className="fa-solid fa-film"></i>}/>
         case "TV":
            return <Post topic={selectedFact} fact={topicFact.TV[0].fact1} icon={<i className="fa-solid fa-tv"></i>}/>
         case "Reading":
            return <Post topic={selectedFact} fact={topicFact.Reading[0].fact1} icon={<i className="fa-solid fa-book-open-reader"></i>}/>
         case "Filmmaking":
            return <Post topic={selectedFact} fact={topicFact.Filmmaking[0].fact1} icon={<i className="fa-solid fa-video"></i>}/>
         case "DIY projects":
            return <Post topic={selectedFact} fact={topicFact.DIY_projects[0].fact1} icon={<i className="fa-solid fa-paint-roller"></i>}/>
         case "Dating":
            return <Post topic={selectedFact} fact={topicFact.Dating[0].fact1} icon={<i className="fa-solid fa-heart"></i>}/>
         case "Makeup Tutorials":
            return <Post topic={selectedFact} fact={topicFact.Makeup_Tutorials[0].fact1} icon={<i className="fa-solid fa-paintbrush"></i>}/>
         case "Environmental Issues":
            return <Post topic={selectedFact} fact={topicFact.Environmental_Issues[0].fact1} icon={<i className="fa-solid fa-earth-americas"></i>}/>
         case "Programming":
            return <Post topic={selectedFact} fact={topicFact.Programming[0].fact1} icon={<i className="fa-solid fa-code"></i>}/>
         case "Life Hacks":
            return <Post topic={selectedFact} fact={topicFact.Life_Hacks[0].fact1} icon={<i className="fa-solid fa-life-ring"></i>}/>
         case "Software":
            return <Post topic={selectedFact} fact={topicFact.Software[0].fact1} icon={<i className="fa-brands fa-uncharted"></i>}/>
         case "Computers":
            return <Post topic={selectedFact} fact={topicFact.Computers[0].fact1} icon={<i className="fa-solid fa-computer"></i>}/>
         default:
            console.log("Couldnt find the fact")
      }

   }
   







   
   return (
      <>
      {/* NAVBAR */}
         <nav id="nav">
            <div id="logoContainer">
               <img id="logo" src={logo} alt="" />
               <h1>WOLF</h1>
            </div>
            <div id="profileContainer">
               <i className="fa-solid fa-user"></i>
               <h2>{username}</h2>
            </div>
            <button ref={mobileNavBtn} id="mobileNavBtn" onClick={()=> mobileNavFunction()}><i className="fa-solid fa-bars"></i></button>
         </nav>

      {/* MAIN CONTENT */}

         <main>


            <nav className="sideNav" ref={sideNav}>
               <div id="sideNavBtns">
                  <button id="homeBtn">Home <i className="fa-solid fa-house"></i></button>
                  <button id="popularBtn">Popular <i className="fa-solid fa-fire"></i></button>
                  <button id="newPostBtn">New Post</button>

               </div>

               <section className="topicSelectionElement">
                  <h3 className="subTitle">Your Topics</h3>
                  {/* mapping out the selected topics that the user selected */}
                  <div id="selectedTopicsBtns">
                     {/* <button><i className="fa-solid fa-baseball"></i> Sports</button>
                     <button><i className="fa-solid fa-baseball"></i> Skateboarding</button> */}
                     {userData.map(topic => {
                        // 
                        return (
                           <>
                              <button ref={topicBtn} onClick={()=> handleClick(topic)}>{topic}<i className="fa-solid fa-person-walking-arrow-right"></i></button>
                           </>
                        )
                     })}
                  </div>
               </section>

               <section className="topicSelectionElement">
                  <h3 className="subTitle">Other Resources</h3>
                  {/* mapping out the selected topics that the user selected */}
                  <div id="OtherResourcesBtns">
                     <button>About <i className="fa-solid fa-book"></i></button>
                     <button>More Topics<i className="fa-solid fa-magnifying-glass-plus"></i></button>
                  </div>
               </section>
            </nav>


            <section id="content">
               <div id="whatsNew">
                  <h1>Whats New</h1>
               </div>

               {/* what shows up based on what topics the user selected */}
               <article id="userContent">

                  <div className="userPost">
                     <div id="postAnalytics">
                        <h1><img className="profilePicture" src={logo} alt="" />{"Wolf Bot"} posted</h1>
                        <div id="userTraction">
                           <button id="followBtn">Follow <i className="fa-solid fa-user-plus"></i></button>
                           <button id="likeBtn">Like <i className="fa-solid fa-thumbs-up"></i></button>
                        </div>
                     </div>
                     <br />
                     <main className="mainPost">
                        <h2 id="postCaption">Hello there!</h2>
                        <h2 id="postBody">I almost forgot to say, Hello World!</h2>
                     </main>
                  </div>
                  {displayTopicInfo()}
                  
               </article>
            </section>
         </main>

      </>
   )
}