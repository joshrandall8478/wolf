import { useEffect, useState, useRef } from "react";

export default function UpdateFeed(props) {
  const [allPosts, setAllPosts] = useState([]);
  const currentUser = props.currentActiveUser;

  // Fetches for all posts created to update feed
  async function updateMainFeed() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userSearched = urlParams.get("topicFeed");

    // if there is no query string fetching for a different feed, then the main feed will be returned
    if (!queryString) {
      const response = await fetch("/update", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Couldnt update the feed! ${response.status}`);
      }

      const allPosts = await response.json();
      setAllPosts(allPosts.reversedPosts);
    } else {
      const response = await fetch(`/loadTopicFeed?topicFeed=${userSearched}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Couldnt update the feed! ${response.status}`);
      }

      const allPosts = await response.json();
      setAllPosts(allPosts.reversedPosts);
    }
  }

  // poster is used to find the corresponding profile for the poster
  function navigateToProfile(poster) {
    // window.location.href = `/profile.html?user=${poster}`
    window.location.href = `/profile?user=${poster}`;
  }

  // Checks to see if certain users are admin or special
  function checkAdmin(poster) {
    switch (poster) {
      case "Samuel":
        return (
          <>
            <h2 className="poster" onClick={() => navigateToProfile(poster)}>
              {poster}{" "}
              <span style={{ color: "#00b3ff" }}>
                Developer <i className="fa-solid fa-code"></i>
              </span>
            </h2>
          </>
        );
      case "DemoUser":
        return (
          <>
            <h2 className="poster" onClick={() => navigateToProfile(poster)}>
              {poster}{" "}
              <span style={{ color: "#73ff00" }}>
                Recruiter <i className="fa-solid fa-clipboard"></i>
              </span>
            </h2>
          </>
        );
      case poster:
        return (
          <>
            <h2 className="poster" onClick={() => navigateToProfile(poster)}>
              {poster}{" "}
              <span style={{ color: "grey" }}>
                User <i className="fa-solid fa-user"></i>
              </span>
            </h2>
          </>
        );
    }
  }

  const likeBtn = useRef([]);

  async function addLike(postID, currentPostIndex) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userSearched = urlParams.get("topicFeed");

    if (!queryString) {
      const response = await fetch(`/addLike?feed=mainFeed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postID: postID, loggedInUser: currentUser }),
      });

      // Check if the like was successfully added (optional)
      if (response.ok) {
        // Immediately update the button style
        if (likeBtn.current[currentPostIndex].style.color === "red") {
          likeBtn.current[currentPostIndex].style.color = "white"; // Unlike
        } else {
          likeBtn.current[currentPostIndex].style.color = "red"; // Like
        }

        await updateMainFeed();
      } else {
        console.error("error adding like");
      }
    } else {
      const response = await fetch(`/addLike?feed=${userSearched}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postID: postID, loggedInUser: currentUser }),
      });

      // Check if the like was successfully added (optional)
      if (response.ok) {
        // Immediately update the button style
        if (likeBtn.current[currentPostIndex].style.color === "red") {
          likeBtn.current[currentPostIndex].style.color = "white"; // Unlike
        } else {
          likeBtn.current[currentPostIndex].style.color = "red"; // Like
        }

        await updateMainFeed();
      } else {
        console.error("error adding like");
      }
    }
  }

  // 3332 dads rooom num

  // Checks and shows if a user is already liking a post or not
  // all dependent on when the feed gets updated
  function checkCurrentlyLiked() {
    allPosts.map((post, key) => {
      if (post.likes.includes(currentUser)) {
        likeBtn.current[key].style.color = "red";
      } else {
        likeBtn.current[key].style.color = "white";
      }
    });
  }

  // ran on component mount. Dependent on the the allPosts array
  useEffect(() => {
    checkCurrentlyLiked();
  }, [allPosts, currentUser]);

  // ran on component mount
  useEffect(() => {
    updateMainFeed();
  }, []);

  const currentDate = new Date();

  // Configuration for posts's creation data
  function showPostDate(postCreationDate) {
    // Get the difference in milliseconds
    const startDate = new Date(postCreationDate);
    const timeDifference = currentDate - startDate;
    // console.log(postCreationDate)

    // Covert the difference from milliseconds to day and hours
    const millisecondsInOneDay = 24 * 60 * 60 * 1000;
    const millisecondsInOneHour = 60 * 60 * 1000;
    const millisecondsInOneMinute = 60 * 1000;

    // Calculate days and hours
    const daysPassed = Math.floor(timeDifference / millisecondsInOneDay);
    const hoursPassed = Math.floor(
      (timeDifference % millisecondsInOneDay) / millisecondsInOneHour
    );
    const minutesPassed = Math.floor(
      (timeDifference % millisecondsInOneHour) / millisecondsInOneMinute
    );

    // console.log(`${daysPassed} days passed, ${hoursPassed} hours passed, ${minutesPassed} minutes passed`)

    if (minutesPassed === 0 && hoursPassed === 0 && daysPassed === 0) {
      return <h1 className="postData">Just now</h1>;
    }

    if (minutesPassed > 0 && hoursPassed === 0 && daysPassed === 0) {
      return <h1 className="postData">{`${minutesPassed}m ago`}</h1>;
    }

    if (hoursPassed > 0 || (minutesPassed >= 60 && daysPassed === 0)) {
      return <h1 className="postData">{`${hoursPassed}hr. ago`}</h1>;
    }

    if (daysPassed > 0) {
      return <h1 className="postData">{`${daysPassed}d. ago`}</h1>;
    }
    // return `${minutesPassed} minutes passed ${hoursPassed} hours passed ${daysPassed}`
  }

  return (
    <>
      {/* Mapping each post in reverse (newest first) */}
      {/* post.poster is the author of the post */}
      {/* {showTopic()} */}
      {allPosts?.map((post, key) => {
        return (
          <>
            <div key={key} className="userPost">
              <br />
              <main className="mainPost">
                <div className="postAnalytics">
                  <section className="userAction">
                    {/* checking for whos posting */}
                    {checkAdmin(post.poster)}
                    {showPostDate(post.postCreationDate)}
                    {/* {handleFollowClick(post.poster, currentUser)} */}
                    {/* {handleFollowClick(post.poster, userFollowingList)} */}
                  </section>
                  <p className="postCaption">
                    <i className="fa-solid fa-bolt"></i>
                    {post.subject}
                  </p>
                </div>
                <h2 className="postBody">{post.body}</h2>
                <div className="postLC">
                  <span
                    ref={(el) => (likeBtn.current[key] = el)}
                    className="likeBtn"
                    onClick={() => addLike(post._id, key)}
                  >
                    <i className="fa-solid fa-heart"></i>
                    <span style={{ color: "grey" }}> {post.likes.length}</span>
                  </span>
                  <span className="commentBtn">
                    <i className="fa-solid fa-comments"></i>{" "}
                    <span style={{ color: "grey" }}> Coming soon...</span>
                  </span>
                </div>
              </main>
            </div>
          </>
        );
      })}
    </>
  );
}
