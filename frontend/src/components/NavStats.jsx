import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../assets/css/navstats.css";


function NavStats({ caballero }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1200);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const items = [
    { label: "Nivel", value: caballero.nivel },
    { label: "Armadura", value: "-" },
    { label: "Vida", value: caballero.salud_actual },
    { label: "Cosmo", value: caballero.cosmo },
    { label: "Oro", value: caballero.oro },
    { label: "Habilidad", value: caballero.habilidad },
  ];

  return (
    <>
      {/* Espaciador dinámico */}
      <div
        className={`navstats-spacer ${isMobile ? (open ? "open" : "closed") : ""}`}
      ></div>

      <motion.header
        className={`navstats-panel text-white ${open ? "open" : "closed"}`}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container">
          <div
            className="flex-wrap align-items-center justify-content-between background-mobile"
            style={{ display: "block" }}
          >
            <motion.div
              className="row text-center"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {items.map((item, i) => (
                <motion.div
                  className="col-lg-2 col-md-3 col-sm-4 mb-4 info-base"
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <center>
                    <motion.div
                      className="square bg-danger border border-3 border-warning p-3 position-relative"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 25px rgba(255, 204, 0, 0.5)",
                      }}
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(255, 204, 0, 0.3)",
                          "0 0 20px rgba(255, 204, 0, 0.6)",
                          "0 0 10px rgba(255, 204, 0, 0.3)",
                        ],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        borderRadius: "12px",
                        background:
                          "radial-gradient(circle at center, rgba(255,0,0,0.4) 0%, rgba(20,0,0,0.8) 100%)",
                      }}
                    >
                      <motion.h3
                        className="text-gold"
                        style={{ fontWeight: "normal", letterSpacing: "1px" }}
                      >
                        {item.value}
                      </motion.h3>
                    </motion.div>
                  </center>

                  <motion.div
                    className="label-info mt-2 text-silver"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
                  >
                    {item.label}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Toggle handle separado y con z-index alto */}
        {isMobile && (
          <div
            className="navstats-toggle"
            onClick={() => setOpen((prev) => !prev)}
          >
            <div className="navstats-handle"></div>
          </div>
        )}
      </motion.header>
    </>
  );
}

export default NavStats;
