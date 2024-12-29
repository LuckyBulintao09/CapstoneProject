"use client";
import React, { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function Howitworks() {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const addToRef = (el: HTMLDivElement) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          entry.target.style.transition = "opacity 1s ease-in-out, transform 1s ease-in-out";
        } else {
          entry.target.style.opacity = "0";
          entry.target.style.transform = "translateY(20px)"; 
        }
      });
    }, options);

    cardsRef.current.forEach((card) => {
      observer.observe(card);
    });

    return () => {
    
      cardsRef.current.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">How It Works</h2>
      <p className="text-center text-gray-600 mb-8">
        SGODOSS is a centralized web platform for resource sharing designed to
        address the challenges of limited access to essential resources in
        schools, in order to improve coordination and efficiency between schools.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Card
          ref={addToRef}
          style={{
            opacity: 0,
            transform: "translateY(20px)", 
          }}
          className="bg-blue-800 text-white shadow-md transition-all"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Resource Sharing</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This platform is designed to provide a centralized hub for resource sharing.</p>
          </CardContent>
        </Card>
        {/* Card 2 */}
        <Card
          ref={addToRef}
          style={{
            opacity: 0,
            transform: "translateY(20px)", 
          }}
          className="bg-blue-800 text-white shadow-md transition-all"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Data Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Use our search tools to find resources regarding different topics.</p>
          </CardContent>
        </Card>
        {/* Card 3 */}
        <Card
          ref={addToRef}
          style={{
            opacity: 0,
            transform: "translateY(20px)", 
          }}
          className="bg-blue-800 text-white shadow-md transition-all"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This platform also allows users to view announcements from SDO Ifugao.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Howitworks;
