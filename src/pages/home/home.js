import React from "react";
import "./home.scss";
import ThreeDAnimation from "../threeanimation/ThreeDAnimation";

export default function Home  ()  {
  return (
    <>
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to My Futuristic Portfolio</h1>
        <p>Showcasing the Power of Design, Animation, and 3D Effects</p>
      </div>  
    </section>
    <ThreeDAnimation/>
    </>
  );
};

