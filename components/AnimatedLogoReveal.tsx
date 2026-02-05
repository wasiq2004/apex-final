import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const AnimatedLogoReveal: React.FC = () => {
    const controls = useAnimation();

    useEffect(() => {
        const sequence = async () => {
            await new Promise((r) => setTimeout(r, 300));

            await controls.start({
                opacity: 1,
                scale: 1,
                transition: {
                    duration: 10,
                    ease: [0.22, 1, 0.36, 1],
                },
            });
        };

        sequence();
    }, [controls]);

    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black">
            {/* ================= VIDEO BACKGROUND ================= */}
            <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/assest/goldenparticle.mp4"
                autoPlay
                loop
                muted
                playsInline
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* ================= SVG MORBIUS MASK ================= */}
            <svg width="0" height="0">
                <defs>
                    <filter id="liquidReveal">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0"
                            numOctaves="0"
                            seed="0"
                        >
                            <animate
                                attributeName="baseFrequency"
                                dur="1.3s"
                                values="0;0"
                                fill="freeze"
                            />
                        </feTurbulence>

                        <feDisplacementMap in="SourceGraphic" scale="120">
                            <animate
                                attributeName="scale"
                                dur="1.2s"
                                values="120;0"
                                fill="freeze"
                            />
                        </feDisplacementMap>
                    </filter>

                    <mask id="inkMask">
                        <rect width="100%" height="100%" fill="black" />
                        <circle cx="50%" cy="50%" r="0" fill="white">
                            <animate
                                attributeName="r"
                                dur="1.2s"
                                values="0;650"
                                fill="freeze"
                            />
                        </circle>
                    </mask>
                </defs>
            </svg>

            {/* ================= CONTENT WRAPPER ================= */}
            <div className="relative z-10 flex flex-col items-center">
                {/* LOGO */}
                <motion.img
                    src="/Logobgblack-removebg-preview(copy).png"
                    alt="Logo"
                    className="w-64 h-64 md:w-[450px] md:h-[450px] object-contain"
                    style={{
                        filter: "url(#liquidReveal)",
                        mask: "url(#inkMask)",
                        WebkitMask: "url(#inkMask)",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={controls}
                />

                {/* ================= BUTTONS ================= */}
                <motion.div
                    className="mt-8 flex gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                >
                    {/* Our Services */}
                    <motion.a
                        href="#Programs"
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="
                            px-8 py-3
                            border border-[#D4AF37]
                            text-[#D4AF37]
                            tracking-widest uppercase text-sm font-semibold
                            relative overflow-hidden
                            hover:text-black
                            hover:bg-[#D4AF37]
                            transition-all duration-300
                        "
                    >
                        Our Courses
                    </motion.a>

                    {/* Contact Us */}
                    <motion.a
                        href="#contact"
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="
                            px-8 py-3
                            border border-[#D4AF37]
                            text-[#D4AF37]
                            tracking-widest uppercase text-sm font-semibold
                            relative overflow-hidden
                            hover:text-black
                            hover:bg-[#D4AF37]
                            transition-all duration-300
                        "
                    >
                        Contact Us
                    </motion.a>
                </motion.div>
            </div>
        </div>
    );
};

export default AnimatedLogoReveal;
