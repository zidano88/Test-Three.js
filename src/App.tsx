import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import SpaceScene from "./components/SpaceScene";
import Route1 from "./routes/route1/Route1";
import Route2 from "./routes/route2/Route2";
import Route3 from "./routes/route3/Route3";
import Route4 from "./routes/route4/Route4";
import Route5 from "./routes/route5/Route5";
import Route6 from "./routes/route6/Route6";
import Route7 from "./routes/route7/Route7";
import Route8 from "./routes/route8/Route8";

function Navigation() {
  const location = useLocation();

  const routes = [
    { path: "/", name: "Home", component: SpaceScene },
    { path: "/route1", name: "Route 1", component: Route1 },
    { path: "/route2", name: "Route 2", component: Route2 },
    { path: "/route3", name: "Route 3", component: Route3 },
    { path: "/route4", name: "Route 4", component: Route4 },
    { path: "/route5", name: "Route 5", component: Route5 },
    { path: "/route6", name: "Route 6", component: Route6 },
    { path: "/route7", name: "Route 7", component: Route7 },
    { path: "/route8", name: "Route 8", component: Route8 },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.9)",
        padding: "10px 20px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            style={{
              color: location.pathname === route.path ? "#00ff88" : "white",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "20px",
              background:
                location.pathname === route.path
                  ? "rgba(0, 255, 136, 0.2)"
                  : "rgba(255, 255, 255, 0.1)",
              border:
                location.pathname === route.path
                  ? "1px solid #00ff88"
                  : "1px solid transparent",
              transition: "all 0.3s ease",
              fontSize: "14px",
              fontWeight: location.pathname === route.path ? "bold" : "normal",
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== route.path) {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== route.path) {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }
            }}
          >
            {route.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Navigation />
      <div style={{ paddingTop: "60px", height: "calc(100vh - 60px)" }}>
        <Routes>
          <Route path="/" element={<SpaceScene />} />
          <Route path="/route1" element={<Route1 />} />
          <Route path="/route2" element={<Route2 />} />
          <Route path="/route3" element={<Route3 />} />
          <Route path="/route4" element={<Route4 />} />
          <Route path="/route5" element={<Route5 />} />
          <Route path="/route6" element={<Route6 />} />
          <Route path="/route7" element={<Route7 />} />
          <Route path="/route8" element={<Route8 />} />
        </Routes>
      </div>
    </div>
  );
}
